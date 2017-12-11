const express = require('express');
const { Users } = require('./../model/users');

const router = express.Router();
// const { STATIC_PATH } = require('./../config/config');
// const path = require('path');
// const multer = require('multer');
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, STATIC_PATH);
//   },
//   filename: (req, file, cb) => {
//     const fileName = file.originalname.split('.');
//     const extention = fileName.pop();
//     const newName = fileName.join('.') + Date.now() + extention;
//     cb(null, newName);
//   }
// });

// const upload = multer({ storage });

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
 *       regDate:
 *         type: string
 *       id:
 *         type: string
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
 *             sources:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 */
router.get('/', function (req, res, next) {
  console.log(req.query);
  Users.find(req.query).exec(function (err, rows) {
    if (err) {
      console.error(err);
      res.send({
        code: 500,
        msg: err,
        sources: null
      });
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
 * /users:
 *   post:
 *     description: 添加用户
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: 用户密码
 *         in: query
 *         required: true
 *         type: string
 *       - name: password
 *         description: 用户密码
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
 *               type: object
 *               $ref: '#/definitions/User'
 */
router.post('/', function (req, res, next) {
  const { username, password } = req.query;
  const user = {
    username,
    password,
    regDate: Date.now(),
    userPic: ''
  };
  Users.create(user, function (err, newUser) {
    if (err) {
      res.send({
        code: 500,
        msg: err.errmsg,
        source: null
      });
    }
    const { username: name, userPic, regDate, _id: id } = newUser;
    res.send({
      code: 200,
      msg: 'success',
      source: {
        username: name,
        regDate,
        id
      }
    });
  });
});

module.exports = router;
