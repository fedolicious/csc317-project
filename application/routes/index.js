var express = require('express');
var router = express.Router();
const mysql = require("mysql2");
const {isLoggedIn} = require("../middleware/auth");


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Home', name: "Alfred Thompson", js: ["index.js"]});
});
router.get("/login", function(req, res, next) {
    res.render("login", {title: 'Log In'});
});

router.get("/postvideo", isLoggedIn, function(req, res, next) {
    res.render("postvideo", {title: "Post Video"});
});
router.get("/registration", function(req, res, next) {
    res.render("registration", {title: "Register", js: ["registration.js"]});
});

module.exports = router;

//database stuff
let sqlPool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "rootPassword",
    database: "csc317db"
}).promise();
async function runSQL() {
    try {
        let [result, _] = await sqlPool.query(`select 1+1`);
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}
runSQL();