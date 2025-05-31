// user schema for authentication using passport

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

// in our userSchema we only add email field BUT,
//  Username and Password gets automatically added my passport local mongoose,
// thats why we didnt explecitely added username and password field in our Schema
// BUT, it is there and gets automatically added by passport local mongoose .\

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});

// this plugin adds salting and hashing for us.

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User", userSchema);