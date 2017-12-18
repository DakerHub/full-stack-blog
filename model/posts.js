const mongoose = require('mongoose');
const { connection } = require('./connect');

const { ObjectId } = mongoose.Schema.Types;
const posts = {
  title: {
    type: String,
    require: true
  },
  abstract: {
    type: String,
    require: true
  },
  authorId: {
    type: ObjectId,
    require: true
  },
  authorName: {
    type: String,
    require: true
  },
  content: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    require: true
  },
  publishStatus: {
    type: String,
    require: true
  },
  category: {
    type: ObjectId
  },
  tags: [],
  comments: []
};

const Posts = connection.model('post', posts);
module.exports.Posts = Posts;
