var express = require('express');
var router = express.Router();

const database = require("../config/database");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.post("/registration", async function(req, res, next) {
    let {username,email,password} = req.body;
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
        [result, _] = await database.execute(`insert into users (username, email, password) value (?,?,?)`, [username,email,password]);
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
    [result, _] = await database.execute(`select password from users where username=?`, [username]);
    if(result && result.length !== 1) {
        console.log(`username ${username} does not exist`);
        return res.redirect("/login");
    }
    if(result[0].password !== password) {
        console.log(`incorrect password`);
        return res.redirect("/login");
    }
    console.log("logged in successfully");
    // res.render('index', {title: 'Home', name: "Alfred Thompson", js: ["index.js"]});
    return res.redirect("/");
});
router.get("/logout", async function(req, res, next) {
    console.log("logged out successfully");
    // res.render('index', {title: 'Home', name: "Alfred Thompson", js: ["index.js"]});
    return res.redirect("/");
});

module.exports = router;
