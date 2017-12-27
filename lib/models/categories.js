const { mongoose, connection } = require('./connect');

const { ObjectId } = mongoose.Schema.Types;

/**
 * name: 分类名
 * createdDate: 创建日期
 * status: 可见状态 '1': 可见 '2': 不可见
 * pId: 父分类id
 */
const categories = {
  name: {
    type: String,
    unique: true,
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
  pId: {
    type: String
  }
};

const categoriesSchema = new mongoose.Schema(categories);
const Categories = mongoose.model('categories', categoriesSchema);

module.exports.Categories = Categories;
module.exports.categoriesSchema = categoriesSchema;
