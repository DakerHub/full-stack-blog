const { Categories } = require('./../model/categories');
const express = require('express');
const { deleteByIdsRecursive } = require('./../model/model');

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
  Categories.find(query).select('-__v -createdDate').exec(function (err, rows) {
    if (err) {
      console.error(err);
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
      sources: rows
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
  const { name, pId = '', status = '1' } = req.query;
  const tag = {
    name,
    pId,
    status
  };
  const saveCate = function (tag, res) {
    Categories.init().then(function () {
      Categories.create(tag, function (err, newCategory) {
        const { _id, name, pId } = newCategory;
        if (err) {
          console.error(err);
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

  if (pId !== '') {
    Categories.findById(pId, function (err, cate) {
      if (cate) {
        saveCate(tag, res);
      } else {
        res.send({
          code: 404,
          msg: 'can\'t find category whose id is ' + pId,
          sources: null
        });
      }
    });
  } else {
    saveCate(tag, res);
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
  const { _id, name, status } = req.query;
  const updatedCate = { name, status };
  
  if (!_id) {
    return res.sendStatus(400);
  }
  Categories.findByIdAndUpdate(_id, updatedCate, { new: true }, function (err, newCategory) {
    const { _id, name, pId } = newCategory;
    if (err) {
      console.error(err);
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
  deleteByIdsRecursive(Categories, idsArr, 'pId').then(result => {
    res.send({
      code: 200,
      msg: 'success',
      source: null
    });
  }).catch(err => {
    res.send({
      code: 500,
      msg: err.errmsg || err.message || err,
      source: null
    });
  });
});

module.exports = router;
