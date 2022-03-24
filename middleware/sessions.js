const edge = require("edge.js");

module.exports = (req, res, next) => {
  edge.global("auth", req.session.userId);
  next();
};
