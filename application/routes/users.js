var express = require('express');
var router = express.Router();
const database = require("../config/database");
const bcrypt = require("bcrypt");
const validator = require("validator");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.post("/registration", async function(req, res, next) {
    const {username,email,password} = req.body;

    if(validator.isStrongPassword(password)) {
        //good
    }

    try {
        let result;
        [result, _] = await database.execute(`select id from users where username=?`, [username]);
        if(result && result.length > 0) {
            console.log(`username ${username} is taken`);
            return res.redirect("/registration");
        }
        [result, _] = await database.execute(`select id from users where email=?`, [email]);
        if(result && result.length > 0) {
            console.log(`email ${email} is taken`);
            return res.redirect("/registration");
        }

        const hashedPassword = await bcrypt.hash(password,5);
        [result, _] = await database.execute(`insert into users (username, email, password) value (?,?,?)`, [username,email,hashedPassword]);
        if(result && result.affectedRows === 1) {
            return res.redirect("/login")
        } else {
            return res.redirect("/registration");
        }
        // return res.send(`username ${username} and email ${email} are available`);
    } catch(err) {
        next(err);
        return res.send("q");
    }
});
router.post("/login", async function(req, res, next) {
    let {username,password} = req.body;
    let result
    [result, _] = await database.execute(`select id, email, username, password from users where username=?`, [username]);
    const user = result[0];
    if(!user || !(await bcrypt.compare(password,user.password))) {
        req.flash("error",`Login failed`);
        req.session.save(function(err){
            if(err) { next(err) };
            return res.redirect("/login");
        });
    }

    // if(!user) {
    //     req.flash("error",`Login failed`);
    //     return res.redirect("/login");
    // }
    // if(!(await bcrypt.compare(password,user.password))) {
    //     req.flash("error","Login failed");
    //     return res.redirect("/login");
    // }

    // if(result && result.length !== 1) {
    //     req.flash("error","Login failed: username ${username} does not exist");
    //     return res.redirect("/login");
    // }
    // if(!(await bcrypt.compare(password,user.password))) {
    //     req.flash("error","Login failed: incorrect password");
    //     return res.redirect("/login");
    // }
    console.log("logged in successfully");
    req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email
    };
    // res.render('index', {title: 'Home', name: "Alfred Thompson", js: ["index.js"]});
    return res.redirect("/");
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
