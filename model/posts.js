const { mongoose, connection } = require('./connect');
const { tagsSchema, Tags } = require('./tags');

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
    enum: ['1', '2', '3'],
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
  tags: [{
    oriId: {
      type: String
    },
    name: {
      type: String
    }
  }],
  comments: []
};

const postsSchema = new mongoose.Schema(posts);
postsSchema.methods.$_linkTags = function (tags, callback) {
  const self = this;
  const _tags = this.tags;
  const _tagsLen = _tags.length;
  const existTagIds = [];
  const uniqueTags = [...new Set(tags)];
  const tagLen = uniqueTags.length;
  const failIds = [];
  let successCount = 0;
  if (_tagsLen > 0) {
    for (let i = 0; i < _tags.length; i++) {
      existTagIds.push(_tags[i]._id);
    }
    existTagIds.forEach(id => {
      _tags.id(id).remove();
    });
  }
  console.log(_tags);
  if (tagLen === 0) {
    if (_tagsLen > 0) {
      this.save(function (savePostErr) {
        if (savePostErr) {
          console.log(savePostErr, 'savePostErr');
          callback(savePostErr);
        }
        return callback(null);
      });
    } else {
      callback(null);
    }
    return;
  }
  uniqueTags.forEach(tagId => {
    Tags.findById(tagId)
      .exec(function (findErr, tag) {
        if (findErr) {
          console.log(findErr, 'findErr');
          failIds.push(tagId);
        } else {
          self.tags.addToSet({
            oriId: tagId,
            name: tag.name
          });
          successCount += 1;
        }
        if (tagLen === failIds.length + successCount) {
          self.save(function (savePostErr) {
            if (savePostErr) {
              console.log(savePostErr, 'savePostErr');
              return callback(savePostErr);
            }
            callback(failIds.length > 0 ? failIds : null);
          });
        }
      });
  });
};

const Posts = mongoose.model('post', postsSchema);

module.exports.Posts = Posts;

module.exports.postsSchema = postsSchema;
