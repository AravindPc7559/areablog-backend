const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const now = new Date()
const oneDayFromNow = Math.floor(now.getTime() / 1000) + 60 * 60 * 24

const createToken = async (email, fullName, mobile, id) => {
  return await jwt.sign(
    {
      email: email,
      fullName: fullName,
      mobile: mobile,
      userId: id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: oneDayFromNow },
  )
}

module.exports = createToken
