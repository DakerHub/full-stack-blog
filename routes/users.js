const express = require('express');
const path = require('path');
const multer = require('multer');
const { STATIC_PATH, SITE_PATH, STATIC_URL, AVATAR_PATH } = require('./../config/config');
const { Users } = require('./../lib/models/users');
const { formatDate } = require('./../lib/util/util');
const { deleteByIds } = require('./../lib/controllers/crud.js');
const logger = require('./../lib/util/log');

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
      logger.reqErr(err, req);
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
 *       _id:
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
 *       - name: _id
 *         description: 通过用户id进行查找
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
 *                 $ref: '#/definitions/User'
 */
router.get('/', async function (req, res, next) {
  console.log(req.userId);
  const { username, _id, dateOrder } = req.query;
  let { page = '1', size = '10' } = req.query;
  let query = {};
  let total = 0;
  const sort = {
    regDate: Number.parseInt(dateOrder, 10) || -1
  };

  page = Number.parseInt(page, 10);
  size = Number.parseInt(size, 10);
  if (username) {
    query.username = new RegExp(username);
  }
  if (_id) {
    query = { _id };
  }
  
  total = await Users.find(query).count().exec();

  Users
    .find(query)
    .lean()
    .select('-__v -password')
    .sort(sort)
    .skip((page - 1) * size)
    .limit(size)
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
      rows.forEach(row => {
        if (row.regDate) {
          row.regDate = formatDate(row.regDate, 'YYYY-MM-DD hh:mm:ss');
        }
      });
      res.send({
        code: 200,
        msg: 'success',
        sources: rows,
        total
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
  const { username, password, sex, age, phone, mail, userType = '2' } = req.body;
  const user = {
    username,
    password,
    userPic: '',
    sex,
    age,
    phone,
    mail,
    userType,
    regDate: Date.now()
  };
  for (const key in user) {
    if (user.hasOwnProperty(key)) {
      if (!user[key]) {
        delete user[key];
      }
    }
  }
  Users.create(user, function (err, newUser) {
    if (err) {
      logger.reqErr(err, req);
      res.send({
        code: 500,
        msg: err.errmsg || err.message,
        source: null
      });
      return;
    }
    const { username: name, userPic, regDate, _id } = newUser;
    res.send({
      code: 200,
      msg: 'success',
      source: {
        username: name,
        regDate,
        userPic: '',
        _id
      }
    });
  });
});

/**
 * @swagger
 * /users:
 *   put:
 *     description: 修改用户
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
router.put('/', function (req, res, next) {
  const { _id, sex, age, phone, mail } = req.body;
  const user = {
    sex,
    age,
    phone,
    mail
  };
  for (const key in user) {
    if (user.hasOwnProperty(key)) {
      if (!user[key]) {
        delete user[key];
      }
    }
  }
  Users.init().then(function () {
    Users.findByIdAndUpdate(_id, user, { new: true, fields: '-__v -password' }, function (err, newUser) {
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
        source: newUser
      });
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
 *       - name: _id
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
  const { ids } = req.query;
  const userIds = ids && typeof ids === 'string' ? ids.split(',') : [];
  deleteByIds(Users, userIds).then((result) => {
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
 *       - name: _id
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
  const { _id } = req.body;
  const userPic = STATIC_URL + AVATAR_PATH + req.file.filename;
  Users.findByIdAndUpdate(_id, { userPic }, { new: true, fields: '-__v -password' }, function (err, newUser) {
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
      source: newUser
    });
  });
});

/**
 * @swagger
 * /users/password:
 *   patch:
 *     description: 修改用户密码
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
 *       - name: _id
 *         description: 用户id
 *         in: formData
 *         required: true
 *         type: string
 *       - name: oldPw
 *         description: 用户旧密码
 *         in: formData
 *         required: true
 *         type: file
 *       - name: newPw
 *         description: 用户新密码
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
router.patch('/password', async function (req, res, next) {
  const { _id, oldPw, newPw } = req.body;
  try {
    const user = await Users.findById(_id).exec();
    if (user.password === oldPw) {
      user.$set('password', newPw);
      await user.save();
      res.send({
        code: 200,
        msg: 'success',
        source: null
      });
    } else {
      res.send({
        code: 400,
        msg: '旧密码不正确!',
        source: null
      });
    }
  } catch (err) {
    logger.reqErr(err, req);
    res.send({
      code: 500,
      msg: err.errmsg || err.message,
      source: null
    });
  }
});

module.exports = router;
