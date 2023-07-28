const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { getToken } = require("../utils/helper");

// this post router will help user register to platform
router.post("/register", async (req, res) => {
  //THis code will run when /register api is called as  a POST request
  //req.bosy me -> input - {email,password, username, firstname, lastname, }
  const { email, password, firstName, lastName, username } = req.body;

  //Step 2: Check whether a user exists with same email or not :)
  const user = await User.findOne({ email: email });
  if (user) {
    return res
      .status(403)
      .json({ error: "A user with this email already exists !!" });
  }
  //no user with this email

  //Step 3: Create the new user in the Database
  //step 3.1 : Hashing the password
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUserData = {
    email,
    password: hashedPassword,
    firstName,
    lastName,
    username,
  };
  const newUser = await User.create(newUserData);

  //Step 4: We want to create token to return to the user
  const token = await getToken(email, newUser);

  //Step 5: return result to user
  const usertoReturn = { ...newUser.toJSON(), token };
  delete usertoReturn.password;

  return res.status(200).json(usertoReturn);
});

router.post("/login", async (req, res) => {
  //Step 1. Get email and password sent by user in req.body
  const { email, password } = req.body;
  //Step 2. Check if the user with the given email exist. If not the credentials are invalid
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(403).json({ err: "Invalid credentials!" });
  }
  //Step 3. If the user exists then check if the password is same
  //Some what tricky step
  //use bcrypt.compare
  const isPassword = await bcrypt.compare(password, user.password); //password - from req.body && user.password - our database

  if (!isPassword) {
    return res.status(403).json({ err: "Invalid Credentials!" });
  }
  //Step 4. If everything is correct then return a token to user

  const token = await getToken(user.email, user);
  const usertoReturn = { ...user.toJSON(), token };
  delete usertoReturn.password;

  return res.status(200).json({ usertoReturn });
});

module.exports = router;
