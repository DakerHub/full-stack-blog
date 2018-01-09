const express = require('express');
const { Posts } = require('./../lib/models/posts');
const { Tags } = require('./../lib/models/tags');
const { Categories } = require('./../lib/models/categories');
const { findByIds, deleteByIds } = require('./../lib/controllers/crud');
const { formatDate } = require('./../lib/util/util');
const logger = require('./../lib/util/log');

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
 *       - name: categoryId
 *         description: 通过分类id进行查找
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
 *             source:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Post'
 */
router.get('/', async function (req, res, next) {
  const { title, _id, categoryId } = req.query;
  let { page = '1', size = '10' } = req.query;
  let query = {};
  let field = '-__v -content';
  const sort = {
    date: -1
  }; 
  let total = 0;
  
  page = Number.parseInt(page, 10);
  size = Number.parseInt(size, 10);
  if (title) {
    query.title = title;
  }
  if (categoryId) {
    query.category = categoryId;
  }
  if (_id) {
    query = { _id };
    field = '-__v';
  }

  total = await Posts.find(query).count().exec();

  Posts.find(query)
    .sort(sort)
    .lean()
    .skip((page - 1) * size)
    .limit(size)
    .select(field)
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
        promises.push(findByIds(Tags, row.tags, '-__v').then(tags => {
          row.tags = tags;
        }));
        promises.push(findByIds(Categories, row.category, '-__v').then(category => {
          row.category = category;
        }));
        row.date = formatDate(row.date, 'YYYY-MM-DD hh:mm:ss');
      });
      Promise.all(promises).then((tagsMap) => {
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
          msg: err.errmsg || err.message || err,
          sources: null,
          total
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
 *         required: true
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
 *       - name: category
 *         description: 文章分类
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
  const { title, abstract, content, date = Date.now(), publishStatus = '1', tags, category } = req.body;
  const tagIds = tags && typeof tags === 'string' ? tags.split(',') : [];
  const categoryIds = category && typeof category === 'string' ? category.split(',') : [];
  const post = {
    title,
    abstract,
    content,
    date,
    publishStatus,
    category: categoryIds,
    tags: tagIds
  };
  const savePost = function (res, post) {
    Posts.create(post, function (err, newPost) {
      if (err) {
        logger.reqErr(err, req);
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
  };
  Promise.all([findByIds(Categories, categoryIds), findByIds(Tags, tagIds)])
    .then(() => {
      savePost(res, post);
    }).catch((err) => {
      logger.reqErr(err, req);
      res.send({
        code: 400,
        msg: err.errmsg || err.message || err,
        sources: null
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
 *       - name: category
 *         description: 文章分类
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
 *             source:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Post'
 */
router.put('/', function (req, res, next) {
  const { _id, title, abstract, content, date, publishStatus, tags, category } = req.body;
  const tagIds = tags && typeof tags === 'string' ? tags.split(',') : [];
  const categoryIds = category && typeof category === 'string' ? category.split(',') : [];
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
  updatedPost.tags = tagIds;
  updatedPost.category = categoryIds;

  if (!_id) {
    res.sendStatus(400);
  }
  const updatePost = function () {
    Posts.findByIdAndUpdate(_id, updatedPost, { new: true }, function (err, newPost) {
      const { title, date, publishStatus, _id } = newPost;
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
        sources: { title, date, publishStatus, _id }
      });
    });
  };

  Promise.all([findByIds(Categories, categoryIds), findByIds(Tags, tagIds)]).then(() => {
    updatePost(res, updatedPost);
  }).catch((err) => {
    logger.reqErr(err, req);
    res.send({
      code: 400,
      msg: err.errmsg || err.message || err,
      sources: null
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
 *       - name: ids
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
 *             source:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Post'
 */
router.delete('/', function (req, res, next) {
  const { ids } = req.query;
  const postIds = ids && typeof ids === 'string' ? ids.split(',') : [];
  deleteByIds(Posts, postIds).then(() => {
    res.send({
      code: 200,
      msg: 'success',
      source: null
    });
  }).catch(err => {
    logger.reqErr(err, req);
    res.send({
      code: 500,
      msg: err.errmsg || err.message,
      source: null
    });
  });
});

module.exports = router;
