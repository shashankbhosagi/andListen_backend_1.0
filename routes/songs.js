const express = require("express");
const passport = require("passport");
const router = express.Router();
const Song = require("../models/Song");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    //req.user gets the user from authnticate
    const { name, thumbnail, track } = req.body;
    if (!name || !thumbnail || !track) {
      return res.status(301).json({ err: "Insufficient details" });
    }
    const artist = req.user._id;
    const songDetail = { name, thumbnail, track, artist };
    const createdSong = await Song.create(songDetail);
    return res.status(200).json(createdSong);
  }
);

//Get all the songs that you have uploaded
router.get(
  "/get/mysongs",
  passport.authenticate("user", { sesssion: false }),
  async (req, res) => {
    const currentUser = req.user;
    //we need to get all the songs with artist id as currentUser._id
    const songs = await Song.find({ artist: currentUser._id });

    return res.status(200).json({ data: songs });
  }
);

module.exports = router;
