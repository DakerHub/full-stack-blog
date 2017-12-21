const { mongoose, connection } = require('./connect');

const tags = { 
  name: {
    type: String,
    required: true
  },
  relatedCount: {
    type: Number,
    default: 0
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
