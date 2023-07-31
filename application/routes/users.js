var express = require('express');
var router = express.Router();

const database = require("../config/database");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//     res.send('respond with a resource');
// });
router.post("/registration", async function(req, res, next) {
    let {username,email,password} = req.body;
    try {
        let results;
        [results, _] = await database.execute(`select id from users where username=?`,[username]);
        if(results && results.length > 0) {
            console.log(`username ${username} is taken`);
            return res.redirect("/registration");
        }
        [results, _] = await database.execute(`select id from users where email=?`,[email]);
        if(results && results.length > 0) {
            console.log(`email ${email} is taken`);
            return res.redirect("/registration");
        }
        return res.send(`username ${username} and email ${email} are available`);
    } catch(err) {
        next(err);
    }
});

module.exports = router;
