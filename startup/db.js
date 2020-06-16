const mongoose = require('mongoose');
module.exports = function () {
  mongoose.connect(process.env.mongodbUrl, {useCreateIndex: true,
  useNewUrlParser: true})
    .then(() => console.log("Connetion To MongoDB ......."))
    .catch((err) => console.error('error When Connecting to MongoDB...',err))
}