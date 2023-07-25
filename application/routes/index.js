var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', name:"Alfred Thompson", js:["index.js"] });
});
router.get("/login", function(req, res, next) {
  res.render("login", {title: 'Log In'});
});
router.get("/postvideo", function(req, res, next) {
  res.render("postvideo", {title: "Post Video"});
});
router.get("/registration", function(req, res, next) {
  res.render("registration", {title: "Register", js:["registration.js"]});
});
router.get("/viewpost/:id(\\d+)", function(req, res, next) {
  res.render("viewpost", {title: "View Post"});
});

module.exports = router;
