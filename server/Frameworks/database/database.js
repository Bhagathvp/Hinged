const mongoose = require('mongoose')
require('dotenv').config();

const connectDB = async () =>{
const mongoUrl= process.env.MONGOURL_PROD?process.env.MONGOURL_PROD:process.env.MONGOURL;

mongoose.set("strictQuery", true);
mongoose.connect(mongoUrl);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log(`Database Connected `);
  })
}

module.exports = connectDB