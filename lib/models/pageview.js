const { mongoose, connection } = require('./connect');

const { ObjectId } = mongoose.Schema.Types;

const pageview = {
  expireAt: {
    type: Date,
    required: true,
    default() {
      const nextDay = new Date(Date.now() + (24 * 60 * 60 * 1000));
      return `${nextDay.getFullYear()}/${nextDay.getMonth() + 1}/${nextDay.getDate()} 00:00:00`;
    }
  },
  pageId: {
    type: ObjectId,
    required: true
  },
  uniqueVisitor: {
    type: String,
    required: true
  }
};

const pageviewSchema = new mongoose.Schema(pageview);

pageviewSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const Pageview = mongoose.model('pagview', pageviewSchema);


module.exports.Pageview = Pageview;
