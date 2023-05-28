const mongoose = require("mongoose");
//How to create a model
//Step 1: Require Mongoose
//Step 2:Create a mongoose schema (strucutre of a user)
//Step 3: createa the model

const Song = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  track: {
    type: String,
    required: true,
  },
  artist: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const SongModel = mongoose.model("Song", Song);

model.exports = SongModel;
