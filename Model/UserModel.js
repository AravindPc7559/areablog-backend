const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true, min: 10, max: 10 },
  gender: { type: String, required: true },
  dob: { type: String, required: true },
  password: { type: String, required: true, min: 6, max: 20 },
  image: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  bio: {
    type: String,
    default: '(default)This is the place with you can add your bio.....',
  },
  followers: [],
  following: [],
  category: {
    type: String,
    default: '(default)Here you can add your category',
  },
})

const UserModel = mongoose.model('UserModel', UserSchema)

module.exports = UserModel
