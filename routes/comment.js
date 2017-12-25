const { Comments } = require('./../model/comment');
const { Users } = require('./../model/users');
const { Posts } = require('./../model/posts');
const express = require('express');
const { deleteByIdsRecursive, findByIds } = require('./../model/model');
const { hasMissing } = require('./../lib/util');

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Comment:
 *     type: object
 *     properties:
 *       content:
 *         type: string
 *       _id:
 *         type: string
 *       pId:
 *         type: string
 *       status:
 *         type: string
 *       postId:
 *         type: string
 *       author:
 *         type: object
 *         $ref: '#/definitions/User'
 */

/**
 * @swagger
 * /Comments:
 *   get:
 *     description: 获取评论列表
 *     tags:
 *       - 评论
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: pId
 *         description: 通过回复的评论id进行查找
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
 *                 $ref: '#/definitions/Comment'
 */
router.get('/', function (req, res, next) {
  const { pId } = req.query;
  let query = null;
  if (pId) {
    query = { pId };
  }
  Comments.find(query).select('-__v').exec(function (err, rows) {
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
 * /Comments:
 *   post:
 *     description: 新建评论
 *     tags:
 *       - 评论
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: content
 *         description: 评论内容
 *         in: query
 *         required: true
 *         type: string
 *       - name: postId
 *         description: 评论的文章id
 *         in: query
 *         required: true
 *         type: string
 *       - name: pId
 *         description: 父评论id
 *         in: query
 *         required: false
 *         type: string
 *       - name: authorId
 *         description: 评论者id
 *         in: query
 *         required: true
 *         type: string
 *       - name: status
 *         description: 父评论审核状态
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
 *                 $ref: '#/definitions/Comment'
 */
router.post('/', function (req, res, next) {
  const { content, postId, authorId, pId = '', status = '1' } = req.query;
  const missing = hasMissing({ content, postId, authorId });
  if (missing) {
    res.send({
      code: 500,
      msg: missing,
      sources: null
    });
  }
  const comment = {
    content,
    postId,
    authorId,
    pId,
    status
  };
  const saveCate = function (comment, res) {
    Comments.create(comment, function (err, newComment) {
      const { _id } = newComment;
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
        sources: { _id }
      });
    });
  };

  const promises = [
    Posts.findById(postId).exec().then(post => {
      if (!post) {
        throw Error('there is no such post whose id is ' + postId);
      }
    }),
    Users.findById(authorId).exec().then(user => {
      if (!user) {
        throw Error('there is no such user whose id is ' + authorId);
      }
    })
  ];
  if (pId !== '') {
    promises.push(Comments.findById(pId).exec().then(comment => {
      if (!comment) {
        throw Error('there is no such comment whose id is ' + pId);
      }
    }));
  }
  Promise.all(promises).then(result => {
    saveCate(comment, res);
  }).catch(err => {
    res.send({
      code: 404,
      msg: err.errmsg || err.message || err,
      sources: null
    });
  });
});

/* 评论不支持修改 */

/**
 * @swagger
 * /Comments:
 *   delete:
 *     description: 删除评论
 *     tags:
 *       - 评论
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: ids
 *         description: 评论id
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
 *                 $ref: '#/definitions/Comment'
 */
router.delete('/', async function (req, res, next) {
  console.log(req.userId);
  const { userId, query } = req;
  const { ids } = query;
  if (!ids) {
    return res.sendStatus(400);
  }
  if (userId !== 'admin') {
    /* 请求接口的用户不是评论者或者管理员 */
    const comment = await Comments.findById({ _id: ids }).exec();
    if (comment !== userId) {
      res.send({
        code: 401,
        msg: 'no access!',
        source: null
      });
      return;
    }
  }
  const idsArr = ids && typeof ids === 'string' ? ids.split(',') : [];
  deleteByIdsRecursive(Comments, idsArr, 'pId').then(result => {
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
