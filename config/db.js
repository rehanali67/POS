const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    mongoose.connect(
      "mongodb+srv://RehanAli:Reshan522@cluster0.1kjcbox.mongodb.net/",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Connected to the DB successfully");
  } catch (e) {
    console.log(e);
  }
};
module.exports = connectDb;
