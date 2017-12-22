const { Posts } = require('./../model/posts');
const express = require('express');

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Post:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *       date:
 *         type: string
 *       publishStatus:
 *         type: string
 *       _id:
 *         type: string
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     description: 获取文章列表
 *     tags:
 *       - 文章
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: title
 *         description: 通过文章名进行查找
 *         in: query
 *         required: false
 *         type: string
 *       - name: _id
 *         description: 通过文章id进行查找
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
 *                 $ref: '#/definitions/Post'
 */
router.get('/', function (req, res, next) {
  const { title, _id } = req.query;
  let query = {};
  if (title) {
    query.title = title;
  }
  if (_id) {
    query = { _id };
  }
  Posts.find(query).select('-__v -comments -content').exec(function (err, rows) {
    if (err) {
      console.error(err);
      res.send({
        code: 500,
        msg: err.errmsg || err.message,
        sources: null
      });
      return;
    }
    const promises = [];
    rows.forEach(row => {
      promises.push(row.$_getReleatedTags().then(tags => {
        row.tags = tags;
      }));
    });
    Promise.all(promises).then((tagsMap) => {
      console.log(tagsMap);
      res.send({
        code: 200,
        msg: 'success',
        sources: rows
      });
    }).catch(err => {
      console.error(err);
      res.send({
        code: 500,
        msg: err.errmsg || err.message || err,
        sources: null
      });
    });
  });
});

/**
 * @swagger
 * /posts:
 *   post:
 *     description: 新建文章
 *     tags:
 *       - 文章
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: title
 *         description: 文章名
 *         in: query
 *         required: true
 *         type: string
 *       - name: abstract
 *         description: 文章摘要
 *         in: query
 *         required: true
 *         type: string
 *       - name: content
 *         description: 文章内容
 *         in: query
 *         required: false
 *         type: string
 *       - name: date
 *         description: 文章日期
 *         in: query
 *         required: false
 *         type: string
 *       - name: publishStatus
 *         description: 文章发布状态
 *         in: query
 *         required: false
 *         type: string
 *       - name: tags
 *         description: 文章标签
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
 *                 $ref: '#/definitions/Post'
 */
router.post('/', function (req, res, next) {
  const { title, abstract, content, date = Date.now(), publishStatus = '1', tags } = req.query;
  const tagIds = tags && typeof tags === 'string' ? tags.split(',') : [];
  const post = {
    title,
    abstract,
    content,
    date,
    publishStatus,
    tags: tagIds
  };
  Posts.create(post, function (err, newPost) {
    if (err) {
      console.error(err, 'createPost');
      res.send({
        code: 500,
        msg: err.errmsg || err.message,
        sources: null
      });
      return;
    }
    const { title, date, publishStatus, _id } = newPost;
    res.send({
      code: 200,
      msg: 'success',
      sources: { title, date, publishStatus, _id }
    });
  });
});

/**
 * @swagger
 * /posts:
 *   put:
 *     description: 更新文章
 *     tags:
 *       - 文章
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: _id
 *         description: 文章id
 *         in: query
 *         required: true
 *         type: string
 *       - name: title
 *         description: 文章名
 *         in: query
 *         required: false
 *         type: string
 *       - name: abstract
 *         description: 文章摘要
 *         in: query
 *         required: false
 *         type: string
 *       - name: content
 *         description: 文章内容
 *         in: query
 *         required: false
 *         type: string
 *       - name: date
 *         description: 文章日期
 *         in: query
 *         required: false
 *         type: string
 *       - name: publishStatus
 *         description: 文章发布状态
 *         in: query
 *         required: false
 *         type: string
 *       - name: tags
 *         description: 文章标签
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
 *                 $ref: '#/definitions/Post'
 */
router.put('/', function (req, res, next) {
  const { _id, title, abstract, content, date, publishStatus, tags } = req.query;
  const tagIds = tags && typeof tags === 'string' ? tags.split(',') : [];
  const plainObj = { title, abstract, content, date, publishStatus };
  const updatedPost = {};
  for (const key in plainObj) {
    if (plainObj.hasOwnProperty(key)) {
      const element = plainObj[key];
      if (element) {
        updatedPost[key] = element;
      }
    }
  }
  if (tagIds.length > 0) {
    updatedPost.tags = tagIds;
  }
  if (!_id) {
    res.sendStatus(400);
  }
  Posts.findByIdAndUpdate(_id, updatedPost, { new: true }, function (err, newPost) {
    const { title, date, publishStatus, _id } = newPost;
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
      sources: { title, date, publishStatus, _id }
    });
  });
});

/**
 * @swagger
 * /posts:
 *   delete:
 *     description: 更新文章
 *     tags:
 *       - 文章
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: _id
 *         description: 文章id
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
 *                 $ref: '#/definitions/Post'
 */
router.delete('/', function (req, res, next) {
  Posts.deleteOne({ _id: req.query._id }, function (err) {
    if (err) {
      console.log(err);
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
