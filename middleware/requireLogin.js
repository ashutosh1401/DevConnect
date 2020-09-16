const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const User = require("../models/user");

const checkAuth = (req, res, next) => {
  const { authorization } = req.headers;
  //console.log(req.headers.authorization, authorization, req.headers);
  //authorization === Bearer ewefwegwrherhe
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be logged in" });
    }

    const { _id } = payload;
    User.findById(_id).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
};

module.exports = checkAuth;
