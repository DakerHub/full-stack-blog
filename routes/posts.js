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
 *       abstact:
 *         type: string
 *       date:
 *         type: string
 *       id:
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
 *       - name: id
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
  const { title, id } = req.query;
  let query = {};
  if (title) {
    query.title = title;
  }
  if (id) {
    query = { _id: id };
  }
  Posts.find(query).exec(function (err, rows) {
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

module.exports = router;
