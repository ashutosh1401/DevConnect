const express = require("express");
const router = express.Router();
const User = require("../models/user");
const crypto = require('crypto')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, SENDGRID_API_KEY, EMAIL } = require("../config/keys");
const checkAuth = require("../middleware/requireLogin");
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
              from: "ashutoshthakur1409@gmail.com",
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

router.post('/reset-password', (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    console.log(buffer);
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(422).json({ error: "User don't exist" })
        }
        user.resetToken = token,
          user.expireToken = Date.now() + 3600000
        user.save().then(result => {
          transporter.sendMail({
            to: user.email,
            from: "ashutoshthakur1409@gmail.com",
            subject: "Password Reset",
            html: `
            <p>You requested for Password Reset</p>
            <h5>Click in this <a href="${EMAIL}/reset/${token}"></a> to Reset Password</h5>
          `
          })
          res.json({ message: "Check your email" })
        })
      })
  })
})

router.post('/new-password', (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        return res.status(422).json({ error: "Try Again !, Session Expired" })
      }
      bcrypt.hash(newPassword, 12).then(hashedPassword => {
        user.password = hashedPassword
        user.resetToken = undefined
        user.expireToken = undefined
        user.save().then(savedUser => {
          res.json({ message: "Uploaded sucessfully" })
        })

      })
    }).catch(err => console.log(err))
})
module.exports = router;
