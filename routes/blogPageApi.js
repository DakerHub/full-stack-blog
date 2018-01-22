const express = require('express');
const { Posts } = require('./../lib/models/posts');
const { Tags } = require('./../lib/models/tags');
const { Comments } = require('./../lib/models/comment');
const { Users } = require('./../lib/models/users');
const { Categories } = require('./../lib/models/categories');
const { findByIds, deleteByIds } = require('./../lib/controllers/crud');
const { formatDate } = require('./../lib/util/util');
const logger = require('./../lib/util/log');

const router = express.Router();

router.get('/posts', async function (req, res, next) {
  const { _id } = req.query;
  let { page = '1', size = '10' } = req.query;
  let query;
  let field = '-__v -content';
  const sort = {
    date: -1
  };

  if (_id) {
    query = {
      _id
    };
    field = '-__v';
  }

  let total = 0;
  
  page = Number.parseInt(page, 10);
  size = Number.parseInt(size, 10);

  try {
    total = await Posts.find(query).count().exec();
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

  Posts.find(query)
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

router.get('/post/:id', async function (req, res, next) {
  const id = req.params.id;
  const promises = [];
  try {
    const post = await Posts.findById(id).lean().select('-__v').exec();
    
    const tagsRaw = Array.isArray(post.tags) ? post.tags : [];
    const cateRaw = Array.isArray(post.category) ? post.category : [];
    promises.push(findByIds(Tags, tagsRaw, '-__v').then(tags => {
      post.tags = tags;
    }));
    promises.push(findByIds(Categories, cateRaw, '-__v').then(category => {
      post.category = category;
    }));
    
    await Promise.all(promises);
    const nextPost = await Posts.find().sort('date').findOne({ date: { $gt: post.date } }).select('_id title').exec();
    const prevPost = await Posts.find().sort('-date').findOne({ date: { $lt: post.date } }).select('_id title').exec();

    post.date = formatDate(post.date, 'YYYY-MM-DD hh:mm:ss');
    post.prevPost = prevPost;
    post.nextPost = nextPost;

    res.send({
      code: 200,
      msg: 'success',
      source: post
    });
  } catch (err) {
    logger.reqErr(err, req);
    res.send({
      code: 500,
      msg: err.errmsg || err.message || err,
      sources: null
    });
  }
});

router.get('/comments', async function (req, res, next) {
  const { pId, postId, dateOrder, content } = req.query;
  let { page = '1', size = '10' } = req.query;
  let query = {};
  let total = 0;
  const sort = {
    createdDate: Number.parseInt(dateOrder, 10) || -1
  };

  page = Number.parseInt(page, 10);
  size = Number.parseInt(size, 10);
  if (postId) {
    query.postId = postId;
  }
  if (content) {
    query.content = new RegExp(content);
  }
  if (pId) {
    // 如果有pId,则不管其他条件
    query = { pId };
  }

  total = await Comments.find(query).count().exec();

  Comments
    .find(query)
    .lean()
    .sort(sort)
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

router.get('/tags', function (req, res, next) {
  Tags.find().lean().select('-__v').exec(function (err, rows) {
    if (err) {
      logger.reqErr(err, req);
      res.send({
        code: 500,
        msg: err.errmsg || err.message,
        sources: null
      });
      return;
    }
    Promise
      .all(rows.map(row => 
        Posts
          .count({ tags: { $in: [row._id] } })
          .exec()
          .then(count => {
            row.postCount = count;
          })))
      .then(() => {
        res.send({
          code: 200,
          msg: 'success',
          sources: rows
        });
      });
  });
});

module.exports = router;
