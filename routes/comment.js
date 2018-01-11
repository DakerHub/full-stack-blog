const express = require('express');
const { Comments } = require('./../lib/models/comment');
const { Users } = require('./../lib/models/users');
const { Posts } = require('./../lib/models/posts');
const { deleteByIdsRecursive, findByIds } = require('./../lib/controllers/crud');
const { hasMissing, formatDate } = require('./../lib/util/util');
const logger = require('./../lib/util/log');

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
 *       - name: postId
 *         description: 通过文章id进行查找
 *         in: query
 *         required: false
 *         type: string
 *       - name: page
 *         description: 分页页数
 *         in: query
 *         required: false
 *         type: string
 *       - name: size
 *         description: 每页的数据量
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
 *             total:
 *               type: number
 *               description: 查询结果的总量.
 *             sources:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Comment'
 */
router.get('/', async function (req, res, next) {
  const { pId, postId } = req.query;
  let { page = '1', size = '10' } = req.query;
  let query = {};
  let total = 0;
  
  page = Number.parseInt(page, 10);
  size = Number.parseInt(size, 10);
  if (postId) {
    query.postId = postId;
  }
  if (pId) {
    // 如果有pId,则不管其他条件
    query = { pId };
  }

  total = await Comments.find(query).count().exec();

  Comments
    .find(query)
    .lean()
    .skip((page - 1) * size)
    .limit(size)
    .select('-__v')
    .exec(function (err, rows) {
      if (err) {
        logger.reqErr(err, req);
        res.send({
          code: 500,
          msg: err.errmsg || err.message,
          sources: null,
          total
        });
        return;
      }
      const promises = [];
      rows.forEach(row => {
        row.createdDate = formatDate(row.createdDate, 'YYYY-MM-DD hh:mm:ss');
        promises.push(Posts
          .findById(row.postId)
          .lean()
          .select('_id title')
          .exec()
          .then(post => {
            row.post = post;
          }));
        promises.push(Users
          .findById(row.authorId)
          .lean()
          .select('-__v -password')
          .exec()
          .then(user => {
            row.author = user;
          }));
        if (row.replyTo) {
          promises.push(Users
            .findById(row.replyTo)
            .lean()
            .select('-__v -password')
            .exec()
            .then(user => {
              row.replyTo = user || {
                _id: row.replyTo,
                username: '未知用户'
              };
            }));
        }
      });
      Promise.all(promises).then(() => {
        res.send({
          code: 200,
          msg: 'success',
          sources: rows,
          total
        });
      }).catch(err => {
        logger.reqErr(err, req);
        res.send({
          code: 500,
          msg: err.errmsg || err.message,
          sources: null,
          total
        });
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
  const { content, postId, authorId, pId = '0', status = '1' } = req.query;
  const missing = hasMissing({ content, postId, authorId });
  if (missing) {
    logger.reqErr(missing, req);
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
    status,
    createdDate: Date.now()
  };
  const saveCate = function (comment, res) {
    Comments.create(comment, function (err, newComment) {
      const { _id } = newComment;
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
  if (pId && pId !== '0') {
    promises.push(Comments.findById(pId).exec().then(comment => {
      if (!comment) {
        throw Error('there is no such comment whose id is ' + pId);
      }
    }));
  }
  Promise.all(promises).then(result => {
    saveCate(comment, res);
  }).catch(err => {
    logger.reqErr(err, req);
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
  const { userId, query } = req;
  const { ids } = query;
  console.log(userId);
  if (!ids) {
    return res.sendStatus(400);
  }
  if (userId !== 'admin') {
    const comment = await Comments.findById({ _id: ids }).exec();
    if (comment.authorId !== userId) {
      /* 请求接口的用户不是评论者或者管理员 */
      logger.reqErr('no access!', req);
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
    logger.reqErr(err, req);
    res.send({
      code: 500,
      msg: err.errmsg || err.message || err,
      source: null
    });
  });
});

module.exports = router;
