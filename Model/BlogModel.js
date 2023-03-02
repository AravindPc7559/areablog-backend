const mongoose = require('mongoose')

const BlogModel = new mongoose.Schema({
  blogName : {type: String, required: true},
  category : {type: String, required: true},
  blogContent : {type: String, required: true},
  userId: {type: String, required: true},
  Liked:[],
  image: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
})

const BlogSchema = mongoose.model('BlogModel', BlogModel)

module.exports = BlogSchema
