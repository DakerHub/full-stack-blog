const { mongoose, connection } = require('./connect');
const { tagsSchema } = require('./tags');

const { ObjectId } = mongoose.Schema.Types;

/**
 * title: 文章名
 * abstract: 文章简介
 * authorId: 作者id
 * authorName: 作者名
 * content: 文章内容
 * date: 文章日期
 * publishStatus: 发布状态 1: 公开 2: 私有 3: 回收
 * category: 文章分类id
 * tags: 标签
 * comments: 一级评论
 */
const posts = {
  title: {
    type: String,
    required: true
  },
  abstract: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  publishStatus: {
    type: String,
    required: true
  },
  authorId: {
    type: ObjectId
  },
  authorName: {
    type: String
  },
  category: {
    type: ObjectId
  },
  tags: [tagsSchema],
  comments: []
};

const postsSchema = new mongoose.Schema(posts);
const Posts = mongoose.model('post', postsSchema);

module.exports.Posts = Posts;
module.exports.postsSchema = postsSchema;
