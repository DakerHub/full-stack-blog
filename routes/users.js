const express = require('express');
const { Users } = require('./../model/users');
const { STATIC_PATH, SITE_PATH, STATIC_URL, AVATAR_PATH } = require('./../config/config');
const path = require('path');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
  // 文件存储路径为设置里的STATIC路径
  destination: (req, file, cb) => {
    cb(null, SITE_PATH + STATIC_PATH + AVATAR_PATH);
  },
  // 在文件名后加上时间戳
  filename: (req, file, cb) => {
    const fileName = file.originalname.split('.');
    const extention = fileName.pop();
    const newName = fileName.join('.') + Date.now() + '.' + extention;
    cb(null, newName);
  }
});
const upload = multer({ storage }).single('avatar');
const uploadMid = function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      res.send({
        code: 500,
        msg: err.errmsg || err.message
      });
      return;
    }
    next();
  });
};

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
 *     tags:
 *       - 用户
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
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
  console.log(req.userId);
  const { username, id } = req.query;
  let query = {};
  if (username) {
    query.username = username;
  }
  if (id) {
    query = { _id: id };
  }
  Users.find(query).exec(function (err, rows) {
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
 * /users:
 *   post:
 *     description: 添加用户
 *     tags:
 *       - 用户
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
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
        msg: err.errmsg || err.message,
        source: null
      });
      return;
    }
    const { username: name, userPic, regDate, _id: id } = newUser;
    res.send({
      code: 200,
      msg: 'success',
      source: {
        username: name,
        regDate,
        userPic: '',
        id
      }
    });
  });
});

/**
 * @swagger
 * /users:
 *   delete:
 *     description: 删除用户
 *     tags:
 *       - 用户
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: id
 *         description: 用户ID
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
router.delete('/', function (req, res, next) {
  Users.deleteMany({ _id: req.query.id }, function (err) {
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

/**
 * @swagger
 * /users/avatar:
 *   patch:
 *     description: 修改用户头像
 *     tags:
 *       - 用户
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: query
 *         required: true
 *         type: string
 *       - name: id
 *         description: 用户id
 *         in: formData
 *         required: true
 *         type: string
 *       - name: avatar
 *         description: 用户头像文件
 *         in: formData
 *         required: true
 *         type: file
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
router.patch('/avatar', uploadMid, function (req, res, next) {
  const _id = req.body.id;
  console.log(req.file);
  const userPic = STATIC_URL + AVATAR_PATH + req.file.filename;
  Users.findByIdAndUpdate(_id, { userPic }, { new: true }, function (err, newUser) {
    console.log(err);
    console.log(newUser);
    if (err) {
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
      source: newUser
    });
  });
});

module.exports = router;
