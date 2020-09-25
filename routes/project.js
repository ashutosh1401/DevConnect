const express = require("express");
const router = express.Router();
const Project = require('../models/project')
const checkAuth = require("../middleware/requireLogin");

router.post("/createproject", checkAuth, (req, res) => {
    const { title, body, photo, video } = req.body;

    if (!title || !body) {
        return res.status(422).json({ error: "Please add all fields" })
    }
    req.user.password = undefined
    const project = new Project({
        title,
        body,
        photo,
        video,
        postedBy: req.user
    })
    project.save().then(result => {
        res.json({ project: result })
    }).catch(err => {
        console.log(err);
    })
})

router.get("/getprojects", checkAuth, (req, res) => {
    Project.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt")
        .then(project => {
            res.json({ project })
        }).catch(err => {
            console.log(err);
        })
})

router.put("/likeproj", checkAuth, (req, res) => {
    Project.findByIdAndUpdate(req.body.projId, {
        $push: { likeproj: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        res.json(result);
    })
})

router.put("/unlikeproj", checkAuth, (req, res) => {
    Project.findByIdAndUpdate(req.body.projId, {
        $push: { likeproj: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        res.json(result);
    })
})

router.put('/commentproj', checkAuth, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Project.findByIdAndUpdate(req.body.projId, {
        $push: { comments: comment }
    }, {
        new: true,
    }).populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            else {
                res.json(result);
            }
        })
})

router.delete("/deleteproj/:projId", checkAuth, (req, res) => {
    Project.findOne({ _id: req.params.projId })
        .populate("postedBy", "_id")
        .exec((err, project) => {
            if (err || !project) {
                return res.status(422).json({ error: err })
            }
            if (project.postedBy._id.toString() === req.user._id.toString()) {
                project.remove()
                    .then(result => {
                        res.json({ result })
                    }).catch(err => {
                        console.log(err);
                    })
            }
        })
})

module.exports = router;