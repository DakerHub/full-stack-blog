const express = require('express');
const { Categories } = require('./../lib/models/categories');
const { Posts } = require('./../lib/models/posts');
const { deleteByIdsRecursive } = require('./../lib/controllers/crud');
const logger = require('./../lib/util/log');

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Category:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       _id:
 *         type: string
 *       pId:
 *         type: string
 *       status:
 *         type: string
 */

/**
 * @swagger
 * /Categories:
 *   get:
 *     description: 获取分类列表
 *     tags:
 *       - 分类
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: name
 *         description: 通过分类名进行查找
 *         in: query
 *         required: false
 *         type: string
 *       - name: _id
 *         description: 通过分类id进行查找
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           type: object
 *           properties:
 *             code:
 *               type: integer
 *               description: 返回结果状态.
 *             msg:
 *               type: string
 *               description: 返回结果文本.
 *             sources:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Category'
 */
router.get('/', function (req, res, next) {
  const { name, _id } = req.query;
  let query = {};
  if (name) {
    query.name = name;
  }
  if (_id) {
    query = { _id };
  }
  Categories
    .find(query)
    .lean()
    .select('-__v -createdDate')
    .exec(function (err, rows) {
      if (err) {
        logger.reqErr(err, req);
        res.send({
          code: 500,
          msg: err.errmsg || err.message,
          sources: null
        });
        return;
      }
      const promises = [];
      rows.forEach(row => {
        promises.push(Posts.count({ category: row._id }).exec().then(count => {
          row.relatedPosts = count;
          console.log(row);
        }));
      });
      Promise.all(promises).then(() => {
        res.send({
          code: 200,
          msg: 'success',
          sources: rows
        });
      }).catch(err => {
        logger.reqErr(err, req);
        res.send({
          code: 500,
          msg: err.errmsg || err.message,
          sources: null
        });
      });
    });
});

/**
 * @swagger
 * /Categories:
 *   post:
 *     description: 新建分类
 *     tags:
 *       - 分类
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: name
 *         description: 分类名
 *         in: query
 *         required: true
 *         type: string
 *       - name: pId
 *         description: 父分类id
 *         in: query
 *         required: false
 *         type: string
 *       - name: status
 *         description: 父分类可见性
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           type: object
 *           properties:
 *             code:
 *               type: integer
 *               description: 返回结果状态.
 *             msg:
 *               type: string
 *               description: 返回结果文本.
 *             sources:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Category'
 */
router.post('/', function (req, res, next) {
  const { name, pId = '0', status = '1' } = req.body;
  const category = {
    name,
    pId,
    status
  };
  const saveCate = function (category, res) {
    Categories.init().then(function () {
      Categories.create(category, function (err, newCategory) {
        const { _id, name, pId } = newCategory;
        if (err) {
          logger.reqErr(err, req);
          res.send({
            code: 500,
            msg: err.errmsg || err.message,
            sources: null
          });
          return;
        }
        res.send({
          code: 200,
          msg: 'success',
          sources: { _id, name, pId }
        });
      });
    });
  };

  if (pId !== '0') {
    Categories.findById(pId, function (err, cate) {
      if (err) {
        logger.reqErr(err, req);
        res.send({
          code: 500,
          msg: err.errmsg || err.message,
          sources: null
        });
        return;
      }
      if (cate) {
        saveCate(category, res);
      } else {
        res.send({
          code: 404,
          msg: 'can\'t find category whose id is ' + pId,
          sources: null
        });
      }
    });
  } else {
    saveCate(category, res);
  }
});

/**
 * @swagger
 * /Categories:
 *   put:
 *     description: 更新分类
 *     tags:
 *       - 分类
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: _id
 *         description: 分类id
 *         in: query
 *         required: true
 *         type: string
 *       - name: name
 *         description: 分类名
 *         in: query
 *         required: false
 *         type: string
 *       - name: status
 *         description: 分类可见性
 *         in: query
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           type: object
 *           properties:
 *             code:
 *               type: integer
 *               description: 返回结果状态.
 *             msg:
 *               type: string
 *               description: 返回结果文本.
 *             sources:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Category'
 */
router.put('/', function (req, res, next) {
  const { _id, name, status } = req.body;
  const updatedCate = { name, status };
  
  if (!_id) {
    return res.sendStatus(400);
  }
  Categories.findByIdAndUpdate(_id, updatedCate, { new: true }, function (err, newCategory) {
    const { _id, name, pId } = newCategory;
    if (err) {
      logger.reqErr(err, req);
      res.send({
        code: 500,
        msg: err.errmsg || err.message,
        sources: null
      });
      return;
    }
    res.send({
      code: 200,
      msg: 'success',
      sources: { _id, name, pId }
    });
  });
});

/**
 * @swagger
 * /Categories:
 *   delete:
 *     description: 删除分类
 *     tags:
 *       - 分类
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: ids
 *         description: 分类id
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           type: object
 *           properties:
 *             code:
 *               type: integer
 *               description: 返回结果状态.
 *             msg:
 *               type: string
 *               description: 返回结果文本.
 *             sources:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Category'
 */
router.delete('/', function (req, res, next) {
  if (!req.query.ids) {
    return res.sendStatus(400);
  }
  const { ids } = req.query;
  const idsArr = ids && typeof ids === 'string' ? ids.split(',') : [];
  deleteByIdsRecursive(Categories, idsArr, 'pId').then(({ result, ids }) => {
    console.log(ids);
    Posts.find({ category: { $in: ids } }, function (err, docs) {
      if (err) {
        throw err;
      }
      const promises = [];
      docs.forEach(doc => {
        doc.$set('category', []);
        promises.push(doc.save());
      });
      Promise.all(promises).then(() => {
        res.send({
          code: 200,
          msg: 'success',
          source: null
        });
      });
    });
  }).catch(err => {
    logger.reqErr(err, req);
    res.send({
      code: 500,
      msg: err.errmsg || err.message || err,
      source: null
    });
  });
});

module.exports = router;
