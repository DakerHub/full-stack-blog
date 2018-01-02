const express = require('express');
const jws = require('jws');
const { Users } = require('./../lib/models/users');
const { SECRET } = require('./../config/config');
const logger = require('./../lib/util/log');

const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     description: 用户登录
 *     tags:
 *       - 用户登录
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: 用户名
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
 *               properties:
 *                 username:
 *                   type: string
 *                 userPic:
 *                   type: string
 *                 regDate:
 *                   type: string
 *                 _id:
 *                   type: string
 *                 token:
 *                   type: string
 */
router.post('/', function (req, res, next) {
  const { username, password } = req.body;
  Users.findOne({ username }, { __v: 0 }, function (err, user) {
    console.log(user);
    if (err) {
      logger.reqErr(err, req);
      res.send({
        code: 500,
        msg: err.errmsg || err.message,
        source: null
      });
      return;
    }
    // 返回的user为空
    if (!user) {
      res.send({
        code: 404,
        msg: '用户不存在！',
        source: null
      });
      return;
    }
    // 收到的password和存储的对应不上
    if (password !== user.password) {
      res.send({
        code: 400,
        msg: '密码不正确！',
        source: null
      });
      return;
    }

    // 密码验证正确
    const token = jws.sign({
      header: { typ: 'JW', alg: 'HS256' },
      payload: '{"iss": "fcc\'blog","userid": "' + user._id + '"}',
      secret: SECRET
    });
    res.send({
      code: 200,
      msg: 'success',
      source: Object.assign({
        _id: user.id,
        username: user.username,
        userPic: user.userPic,
        regDate: user.regDate,
        token
      })
    });
  });
});

module.exports = router;
