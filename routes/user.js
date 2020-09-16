const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const User = require('../models/user')
const checkAuth = require("../middleware/requireLogin");

router.get('/user/:id', checkAuth, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    }
                    res.json({ user, posts })
                })
        }).catch(err => {
            return res.status(404).json({ error: "User not found" })
        })
})
module.exports = router;