const express = require("express");
const router = express.Router();
const passport = require("passport");
const Playlist = require("../models/Playlist");

//Route 1: Create a route for create playlist
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const currentUser = req.user;
    const { name, thumbnail, songs } = req.body;
    if (!name || !thumbnail || !songs) {
      res.status(301).json({ err: "Insufficient Data" });
    }
    const playlistData = {
      name,
      thumbnail,
      songs,
      collaborators,
      owner: currentUser._id,
    };
    const playlist = await Playlist.create(playlistData);

    return res.status(200).json(playlist);
  }
);

//Route 2:Get a playlist by ID
//Here we will get playlistId as a Route parameter and we will use it to find the playlist
//default -> /hello/hellp != /hello/hello
//so here we use playlistId as a varible ie. there can be anything after /playlist/get/{anything==kuchbhi} it will be assigned and this api will be called :)
router.get(
  "/get/:playlistId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const playlistId = req.params.playlistId;

    const playlist = await Playlist.findOne({ _id: playlistId });
    if (!playlist) {
      return res.status(301).json({ err: "Invalid Id" });
    }
    return res.status(200).json(playlist);
  }
);

module.exports = router;
