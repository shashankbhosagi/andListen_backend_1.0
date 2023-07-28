const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
require("dotenv").config();
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/songs");
const playlistRoutes = require("./routes/playlist");
const cors = require("cors");
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json()); // meri koi bhi body vagera aari hai toh usse json me convert kardo

// //?==============APIS

// app.get("/", (req, res) => {
//   //req - request, res- response
//   res.send("Hello Voldermort here !!");
// });
app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);

//?=============================Connecting NodeJS to MongoDB========================================
// console.log(process.env);
mongoose
  .connect(
    "mongodb+srv://srbhosagi:" +
      process.env.MONGO_PASSWORD +
      "@cluster0.wxxav7x.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((x) => {
    console.log("COnnected to mongoDB");
  })
  .catch((err) => {
    console.log("Error while connecting to database");
    console.log(err);
  }); // two arguments namely 1.kidhar connect hona 2. Connection options

//?================setting up passport-jwt==========================

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    const user = await User.findOne({ id: jwt_payload.sub });
    if (!user) {
      return done(err, false);
    } else {
      return done(null, user);
    }
    return done(null, false);
  })
);
//!Want to know about below code goto:./learnings.txt learning 1
// User.findOne({ id: jwt_payload.sub }, function (err, user) {
//   if (err) {
//     return done(err, false);
//   }
//   if (user) {
//     return done(null, user);
//   } else {
//     return done(null, false);
//     // or you could create a new account
//   }
//   });
// })
// );

//?==================Telling express that we will run a server on port 8000==========================

app.listen(port, () => {
  console.log("App is up and running on port -> " + port);
});
