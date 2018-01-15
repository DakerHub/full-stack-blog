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
router.get('/posts', async function (req, res, next) {
  let { page = '1', size = '10' } = req.query;
  let field = '-__v -content';
  const sort = {
    date: -1
  };

  let total = 0;
  
  page = Number.parseInt(page, 10);
  size = Number.parseInt(size, 10);

  try {
    total = await Posts.find().count().exec();
  } catch (err) {
    logger.reqErr(err, req);
    res.send({
      code: 500,
      msg: err.errmsg || err.message || err,
      sources: null,
      total
    });
    return;
  }

  Posts.find()
    .lean()
    .sort(sort)
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
        const tagsRaw = Array.isArray(row.tags) ? row.tags : [];
        const cateRaw = Array.isArray(row.category) ? row.category : [];
        
        promises.push(findByIds(Tags, tagsRaw, '-__v').then(tags => {
          row.tags = tags;
        }));
        promises.push(findByIds(Categories, cateRaw, '-__v').then(category => {
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

module.exports = router;
