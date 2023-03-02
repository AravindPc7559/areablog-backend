const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const MongoDBConnection = () => {
  mongoose.connect(process.env.MONGODB_CLUSTER_URL).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.log('Error connecting to MongoDB:-'+ err)
  })
}



module.exports  = MongoDBConnection