const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
require("dotenv").config();
const User = require("./models/User");
const app = express();
const port = 8000;

// //?==============creating a get api and prinitng hello world as response

// app.get("/", (req, res) => {
//   //req - request, res- response
//   res.send("Hello Voldermort here !!");
// });

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
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ id: jwt_payload.sub }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);

//?==================Telling express that we will run a server on port 8000==========================

app.listen(port, () => {
  console.log("App is up and running on port -> " + port);
});
