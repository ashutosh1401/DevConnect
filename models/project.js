const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    photo: {
        type: String
    },
    url: {
        type: String,
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [{
        text: String,
        postedBy: { type: ObjectId, ref: "User" }
    }],
    postedBy: {
        type: ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Project = mongoose.model("Project", projectSchema)

module.exports = Project