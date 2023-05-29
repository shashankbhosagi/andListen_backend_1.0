const express = require("express");
const router = express.Router();
const passport = require("passport");
const Playlist = require("../models/Playlist");
const User = require("../models/User");
const Songs = require("../models/Song");

//Route 1: Create a route for create playlist
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const currentUser = req.user;
    const { name, thumbnail, songs } = req.body;
    if (!name || !thumbnail || !songs) {
      return res.status(301).json({ err: "Insufficient Data" });
    }
    const playlistData = {
      name,
      thumbnail,
      songs,
      collaborators: [],
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
  "/get/playlist/:playlistId",
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

//Get all playlist of the artist
router.get(
  "/get/artist/:artistId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const artistId = req.params.artistId;
    //here we will check if the artist with such artist ID really exist or not
    const artist = await User.find({ _id: artistId });
    if (!artist) {
      return res.status(304).json({ err: "Invalid artist id" });
    }
    const playlists = await Playlist.find({ owner: artistId });

    return res.status(200).json({ data: playlists });
  }
);

//Add a song to a playlist
router.post(
  "/add/song",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const currentUser = req.user;
    const { playlistId, songId } = req.body;
    //Step0. Get the playlist and check if its Valid
    const playlist = await Playlist.findOne({ _id: playlistId });
    if (!playlist) {
      return res.status(304).json({ err: "PLaylist does not exist" });
    }

    //Step1. Check if the current user owns the playlist or is a collaborator
    if (
      playlist._id != currentUser._id ||
      !playlist.collaborators.includes(currentUser._id)
    ) {
      return res.status(400).json({ err: "Not allowed" });
    }
    //Step2. Check if the song is valid
    const song = await Songs.findOne({ _id: songId });
    if (!song) {
      return res.status(304).json({ err: "song does not exist" });
    }

    //Step3. Simply add the song to the playlist
    playlist.songs.push(songId);
    await playlist.save();
  }
);

module.exports = router;
