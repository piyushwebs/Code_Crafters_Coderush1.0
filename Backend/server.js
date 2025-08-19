const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./index");
const {mongo_url, PORT} = process.env;



async function start()
{
  mongoose.connect(mongo_url).then(()=>{
    console.log("Succesfully connected to DB");
  }).catch((err)=>{
    console.log(err);
  })
  
  app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
  });
}

start();