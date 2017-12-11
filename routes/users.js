const express = require('express');
const { Users } = require('./../model/users');

const router = express.Router();
/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *       userPic:
 *         type: string
 *       id:
 *         type: integer
 *         format: int64
 */

/**
 * @swagger
 * /users:
 *   get:
 *     description: 获取用户列表
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: 通过用户名进行查找
 *         in: query
 *         required: false
 *         type: string
 *       - name: id
 *         description: 通过用户id进行查找
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
 *             rows:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 */
router.get('/', function (req, res, next) {
  console.log(req.query);
  Users.find().exec(function (err, rows) {
    if (err) {
      return res.sendStatus(500);
    }
    res.send(rows);
  });
});

module.exports = router;
