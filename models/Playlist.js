const mongoose = require("mongoose");
//How to create a model
//Step 1: Require Mongoose
//Step 2:Create a mongoose schema (strucutre of a user)
//Step 3: createa the model

const Playlist = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },

  owner: {
    type: mongoose.Types.ObjectId,
    ref: "playlist",
    required: true,
  },
  //1. Playlist me songs konse hai
  //2. PLaylist me collaborators kon kon haiS

  songs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "song",
    },
  ],
  collaborators: [
    {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  ],
});

const PlaylistModel = mongoose.model("Playlist", Playlist);

module.exports = PlaylistModel;
