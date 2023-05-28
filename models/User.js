const mongoose = require("mongoose");
//How to create a model
//Step 1: Require Mongoose
//Step 2:Create a mongoose schema (strucutre of a user)
//Step 3: createa the model

const User = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  likedSongs: {
    //Will change in future, note it Shashank (array)
    type: String,
    default: "",
  },
  likedPlaylist: {
    //Will change in future, note it Shashank (array)
    type: String,
    default: "",
  },
  subscribedArtist: {
    //Will change in future, note it Shashank (array)
    type: String,
    default: "",
  },
});

const UserModel = mongoose.model("User", User);

model.exports = UserModel;
