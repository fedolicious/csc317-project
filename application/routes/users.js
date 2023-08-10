var express = require('express');
var router = express.Router();
const database = require("../config/database");
const bcrypt = require("bcrypt");
const validator = require("validator");
const {doesUsernameExist, doesEmailExist, checkUsername, checkPassword, checkEmail} = require("../middleware/validation");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.post("/registration",
    checkUsername,
    checkEmail,
    checkPassword,
    doesUsernameExist,
    doesEmailExist,
async function(req, res, next) {
    const {username,email,password} = req.body;
    try {
        //hash password
        const hashedPassword = await bcrypt.hash(password,5);
        //add account
        let [result, _] = await database.execute(`insert into users (username, email, password) value (?,?,?)`, [username,email,hashedPassword]);
        //sanity check
        if(result && result.affectedRows === 1) {
            return res.redirect("/login");
        } else {
            return res.redirect("/registration");
        }
    } catch(err) {
        next(err);
        return res.send("ERROR!!!!");
    }
});
router.post("/login", async function(req, res, next) {
    let {username,password} = req.body;
    console.log(req.body);
    try {
        let [result, _] = await database.execute(`
        select id, email, username, password from users where username = ?`, [username]);
        const user = result[0];
        console.log(user);
        if(!user || !(await bcrypt.compare(password, user.password))) {
            req.flash("error", `Login failed`);
            return req.session.save(function(err) {
                if(err) { next(err); }
                return res.redirect("/login");
            });
        }
        // return res.redirect("/login");
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };
        // res.render('index', {title: 'Home', name: "Alfred Thompson", js: ["index.js"]});
        return res.redirect("/");
    } catch(err) {
        next(err);
        return res.send("q");
    }
});
router.post("/logout", async function(req, res, next) {
    req.session.destroy(function(err) {
        if(err) { next(err); }
        return res.redirect("/")
    });
    // console.log("logged out successfully");
    // // res.render('index', {title: 'Home', name: "Alfred Thompson", js: ["index.js"]});
    // return res.redirect("/");
});

module.exports = router;
