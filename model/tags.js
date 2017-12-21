const { mongoose, connection } = require('./connect');

const tags = { 
  name: {
    type: String,
    required: true
  },
  createDate: {
    type: Date,
    default: Date.now
  }
};

const tagsSchema = new mongoose.Schema(tags);
const Tags = mongoose.model('tags', tagsSchema);

module.exports.Tags = Tags;
module.exports.tagsSchema = tagsSchema;
