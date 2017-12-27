const express = require('express');
const { Tags } = require('./../lib/models/tags');
const logger = require('./../lib/util/log');

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Tag:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       _id:
 *         type: string
 */

/**
 * @swagger
 * /Tags:
 *   get:
 *     description: 获取标签列表
 *     tags:
 *       - 标签
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: title
 *         description: 通过标签名进行查找
 *         in: query
 *         required: false
 *         type: string
 *       - name: _id
 *         description: 通过标签id进行查找
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
 *                 $ref: '#/definitions/Tag'
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
  Tags.find(query).select('-__v').exec(function (err, rows) {
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
      sources: rows
    });
  });
});

/**
 * @swagger
 * /Tags:
 *   post:
 *     description: 新建标签
 *     tags:
 *       - 标签
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: name
 *         description: 标签名
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
 *                 $ref: '#/definitions/Tag'
 */
router.post('/', function (req, res, next) {
  const { name } = req.query;
  const tag = {
    name
  };
  Tags.init().then(function () {
    Tags.create(tag, function (err, newTag) {
      const { _id, name, createDate } = newTag;
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
        sources: { _id, name, createDate }
      });
    });
  });
});

/**
 * @swagger
 * /Tags:
 *   put:
 *     description: 更新标签
 *     tags:
 *       - 标签
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: _id
 *         description: 标签id
 *         in: query
 *         required: true
 *         type: string
 *       - name: name
 *         description: 标签名
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
 *                 $ref: '#/definitions/Tag'
 */
router.put('/', function (req, res, next) {
  const { _id, name } = req.query;
  const updatedTag = { name };
  
  if (!_id) {
    return res.sendStatus(400);
  }
  Tags.findByIdAndUpdate(_id, updatedTag, { new: true }, function (err, newTag) {
    const { _id, name, createDate } = newTag;
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
      sources: { _id, name, createDate }
    });
  });
});

/**
 * @swagger
 * /Tags:
 *   delete:
 *     description: 删除标签
 *     tags:
 *       - 标签
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: _id
 *         description: 标签id
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
 *                 $ref: '#/definitions/Tag'
 */
router.delete('/', function (req, res, next) {
  Tags.deleteOne({ _id: req.query._id }, function (err) {
    if (err) {
      logger.reqErr(err, req);
      res.send({
        code: 500,
        msg: err.errmsg || err.message,
        source: null
      });
      return;
    }
    res.send({
      code: 200,
      msg: 'success',
      source: null
    });
  });
});

module.exports = router;
