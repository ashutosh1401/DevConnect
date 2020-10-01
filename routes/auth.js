const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, SENDGRID_API_KEY } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')


const transport = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: SENDGRID_API_KEY
  }
}))

router.post("/signup", (req, res) => {
  const { name, email, password, github, linkedin, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(422).send({ error: "pls add all fields correctly" });
  }
  User.findOne({ email }).then((savedUser) => {
    if (savedUser) {
      return res.status(404).send({ error: "User already Exists" });
    }
    bcrypt
      .hash(password, 8)
      .then((hashPassword) => {
        const user = new User({
          name,
          email,
          password: hashPassword,
          github,
          linkedin,
          pic
        });
        user
          .save()
          .then(() => {
            transporter.sendMail({
              to: user.email,
              from: "<Your Email>",
              subject: "Signup succesfully",
              html: `<h1>Welcome to DevConnect</h1>
                        <p>Welcome <b>${user.name}</b> to DevConnect Family. Please start your journey by creating a post.</p>
                         <span>Till Then Post , Scroll and Enjoy !!</span>`
            })
            res.json({ message: "saved successfully" });
          })
          .catch((err) => res.status(404).send(err));
        //res.send({ name, email, password });
      })
      .catch((err) => res.status(404).send(err));
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).send({ error: "please add email or password" });
  }
  User.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "invalid Email or Password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((isMatch) => {
        if (isMatch) {
          //res.send("User successfully signed");
          const token = jwt.sign({ _id: savedUser._id.toString() }, JWT_SECRET);
          const { _id, name, email, followers, following, pic, github, linkedin } = savedUser;
          res.send({ token, user: { _id, name, email, followers, following, pic, github, linkedin } });
        } else {
          return res.status(422).send("Error wromg Email or Password");
        }
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  });
});

module.exports = router;
