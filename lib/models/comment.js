const { mongoose, connection } = require('./connect');

const { ObjectId } = mongoose.Schema.Types;

/**
 * content: 评论的内容
 * createdDate: 创建日期
 * status: 审核状态 '1': 待审核 '2': 审核通过
 * postId: 评论的文章id
 * authorId: 评论者的id
 * replayTo: 回复的用户id
 * pId: 回复的评论id
 */
const comments = {
  content: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['1', '2'],
    required: true
  },
  postId: {
    type: ObjectId,
    required: true
  },
  authorId: {
    type: String,
    required: true
  },
  authorIp: {
    type: String
  },
  replayTo: {
    type: ObjectId
  },
  pId: {
    type: String
  }
};

const commentsSchema = new mongoose.Schema(comments);
const Comments = mongoose.model('comments', commentsSchema);

module.exports.Comments = Comments;
module.exports.commentsSchema = commentsSchema;
