const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    commenterID: {
      type: String,
      required: true,
    },
    blogID: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const commentModel = mongoose.model('Comments', commentSchema);

module.exports = commentModel;