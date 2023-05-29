const express = require("express");
const passport = require("passport");
const router = express.Router();
const Song = require("../models/Song");
const User = require("../models/User");

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
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const currentUser = req.user;
    //we need to get all the songs with artist id as currentUser._id
    const songs = await Song.find({ artist: req.user._id });

    return res.status(200).json({ data: songs });
  }
);

//get all songs any artist has publishes, will pass artist id in a get request
router.get(
  "/get/artist/:artistId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { artistId } = req.params;
    //we check if artist exists
    const user = await User.find({ _id: artistId }); //!Kuch toh gadbad hai daya !! (in testing if the id is of size less than or greater than 24 server crashes :(  )
    if (!user) {
      res.status(301).json({ err: "Artist doesn't exist" });
    }

    const songs = await Song.find({ artist: artistId });
    return res.status(200).json({ data: songs });
  }
);

//Get a song by it's song name
router.get(
  "/get/songname/:songName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { songName } = req.params;
    //*This does exact song name matching so there is a future scope for this API
    //TODO: Create a pattern matching to search song ie. Pink Venom && piNk vNome
    const songs = await Song.find({ name: songName });
    return res.status(200).json({ data: songs });
  }
);

module.exports = router;
