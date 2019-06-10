const express = require('express')
const multer = require('multer')
const md5 = require('blueimp-md5')
const {
  STATIC_PATH,
  SITE_PATH,
  STATIC_URL,
  POSTER_PATH,
  AVATAR_MAX_SIZE
} = require('./../config/config')
const { Posts } = require('./../lib/models/posts')
const { Tags } = require('./../lib/models/tags')
const { Categories } = require('./../lib/models/categories')
const { findByIds, deleteByIds } = require('./../lib/controllers/crud')
const { formatDate } = require('./../lib/util/util')
const { uploadToQiniu, deleteFromQiniu } = require('./../lib/util/qiniu')
const logger = require('./../lib/util/log')

const router = express.Router()

const storage = multer.diskStorage({
  // 文件存储路径为设置里的STATIC路径
  destination: (req, file, cb) => {
    cb(null, SITE_PATH + STATIC_PATH + POSTER_PATH)
  },
  // 在文件名后加上时间戳
  filename: (req, file, cb) => {
    const fileName = file.originalname.split('.')
    const extention = fileName.pop()
    const newName = md5(fileName.join('.') + Date.now()) + '.' + extention
    cb(null, newName)
  }
})
const limits = {
  fileSize: AVATAR_MAX_SIZE
}
const upload = multer({ storage, limits }).single('poster')
const uploadMid = function(req, res, next) {
  upload(req, res, function(err) {
    if (err) {
      logger.reqErr(err, req)
      res.send({
        code: 500,
        msg: err.errmsg || err.message
      })
      return
    }
    next()
  })
}

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
router.get('/', async function(req, res, next) {
  const { title, _id, category, tag, dateOrder, publishStatus } = req.query
  let { page = '1', size = '10' } = req.query
  let query = {}
  let field = '-__v -content'
  const sort = {
    date: Number.parseInt(dateOrder, 10) || -1
  }
  let total = 0

  page = Number.parseInt(page, 10)
  size = Number.parseInt(size, 10)
  if (title) {
    query.title = new RegExp(title)
  }
  if (category && category !== 'nocategory') {
    query.category = { $in: [category] }
  } else if (category) {
    query.category = []
  }

  if (tag) {
    query.tags = { $in: [tag] }
  }

  if (publishStatus) {
    query.publishStatus = publishStatus
  }

  if (_id) {
    query = { _id }
    field = '-__v'
  }
  console.log(query)
  try {
    total = await Posts.find(query)
      .count()
      .exec()
  } catch (err) {
    logger.reqErr(err, req)
    res.send({
      code: 500,
      msg: err.errmsg || err.message || err,
      sources: null,
      total
    })
    return
  }

  Posts.find(query)
    .lean()
    .sort(sort)
    .skip((page - 1) * size)
    .limit(size)
    .select(field)
    .exec(function(err, rows) {
      if (err) {
        logger.reqErr(err, req)
        res.send({
          code: 500,
          msg: err.errmsg || err.message,
          sources: null,
          total
        })
        return
      }
      const promises = []
      rows.forEach(row => {
        const tagsRaw = Array.isArray(row.tags) ? row.tags : []
        const cateRaw = Array.isArray(row.category) ? row.category : []

        promises.push(
          findByIds(Tags, tagsRaw, '-__v').then(tags => {
            row.tags = tags
          })
        )
        promises.push(
          findByIds(Categories, cateRaw, '-__v').then(category => {
            row.category = category
          })
        )
        row.date = formatDate(row.date, 'YYYY-MM-DD hh:mm:ss')
      })
      Promise.all(promises)
        .then(tagsMap => {
          res.send({
            code: 200,
            msg: 'success',
            sources: rows,

            total
          })
        })
        .catch(err => {
          logger.reqErr(err, req)
          res.send({
            code: 500,
            msg: err.errmsg || err.message || err,
            sources: null,
            total
          })
        })
    })
})

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
router.post('/', uploadMid, async function(req, res, next) {
  const {
    title,
    abstract,
    content,
    renderedContent,
    date = Date.now(),
    publishStatus = '1',
    tags,
    category
  } = req.body
  const tagIds = tags && typeof tags === 'string' ? tags.split(',') : []
  const categoryIds =
    category && typeof category === 'string' ? category.split(',') : []

  const post = {
    title,
    abstract,
    poster: '',
    content,
    renderedContent,
    date,
    publishStatus,
    category: categoryIds,
    tags: tagIds
  }
  if (publishStatus === '1') {
    post.publishDate = date
  }

  try {
    const qiniuRes = await uploadToQiniu(req.file.filename, req.file.path)
    if (!qiniuRes.url) {
      throw new Error('海报上传失败！')
    }
    post.poster = qiniuRes.url

    await Promise.all([
      findByIds(Categories, categoryIds),
      findByIds(Tags, tagIds)
    ])
    const newPost = await Posts.create(post)
    if (!newPost) {
      throw new Error('新建文章失败！')
    }
    const { title, date, publishStatus, _id } = newPost
    res.send({
      code: 200,
      msg: 'success',
      source: { title, date, publishStatus, _id }
    })
  } catch (err) {
    logger.reqErr(err, req)
    res.send({
      code: 500,
      msg: err.errmsg || err.message || err,
      source: null
    })
  }
})

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
router.put('/', uploadMid, async function(req, res, next) {
  const {
    _id,
    title,
    abstract,
    content,
    renderedContent,
    date,
    publishStatus,
    tags,
    category
  } = req.body
  const tagIds = tags && typeof tags === 'string' ? tags.split(',') : []
  const categoryIds =
    category && typeof category === 'string' ? category.split(',') : []
  const plainObj = {
    title,
    abstract,
    content,
    renderedContent,
    date,
    publishStatus
  }
  const updatedPost = {}
  let newPoster = false

  for (const key in plainObj) {
    if (plainObj.hasOwnProperty(key)) {
      const element = plainObj[key]
      if (element) {
        updatedPost[key] = element
      }
    }
  }
  updatedPost.tags = tagIds
  updatedPost.category = categoryIds

  if (req.file && req.file.filename) {
    newPoster = true
  }

  if (!_id) {
    res.sendStatus(400)
  }

  try {
    await Promise.all([
      findByIds(Categories, categoryIds),
      findByIds(Tags, tagIds)
    ])
    const post = await Posts.findById(_id).exec()
    const oriPoster = post.poster
    if (newPoster && oriPoster) {
      const oriPosterKey = oriPoster.substring(oriPoster.lastIndexOf('/') + 1)
      deleteFromQiniu(oriPosterKey)
      const qiniuRes = await uploadToQiniu(req.file.filename, req.file.path)
      if (!qiniuRes.url) {
        throw new Error('海报上传失败！')
      }
      updatedPost.poster = qiniuRes.url
    }
    post.set(updatedPost)
    await post.save()
    res.send({
      code: 200,
      msg: 'success',
      source: null
    })
  } catch (err) {
    logger.reqErr(err, req)
    res.send({
      code: 500,
      msg: err.errmsg || err.message || err,
      source: null
    })
  }
})

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
router.delete('/', function(req, res, next) {
  const { ids } = req.query
  const postIds = ids && typeof ids === 'string' ? ids.split(',') : []
  deleteByIds(Posts, postIds)
    .then(() => {
      res.send({
        code: 200,
        msg: 'success',
        source: null
      })
    })
    .catch(err => {
      logger.reqErr(err, req)
      res.send({
        code: 500,
        msg: err.errmsg || err.message,
        source: null
      })
    })
})

/**
 * @swagger
 * /posts/publishStatus:
 *   patch:
 *     description: 更新文章发布状态
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
 *       - name: publishStatus
 *         description: 文章发布状态
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
router.patch('/publishStatus', async function(req, res, next) {
  const { ids, publishStatus } = req.body
  const postIds = ids && typeof ids === 'string' ? ids.split(',') : []

  try {
    const postDocs = await findByIds(Posts, postIds)
    const promises = []
    postDocs.forEach(doc => {
      doc.$set('publishStatus', publishStatus)
      if (publishStatus === '1') {
        doc.$set('publishDate', Date.now())
      }
      promises.push(doc.save())
    })
    const newPosts = await Promise.all(promises)
    res.send({
      code: 200,
      msg: 'success',
      sources: newPosts
    })
  } catch (err) {
    logger.reqErr(err, req)
    res.send({
      code: 500,
      msg: err.errmsg || err.message,
      source: null
    })
  }
})

module.exports = router
