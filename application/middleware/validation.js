const database = require("../config/database");
const bcrypt = require("bcrypt");
const validator = require("validator");
module.exports = {
    checkUsername: function(req,res,next) {
        let { username } = req.body;
        if(!username || !username.match(/^[a-zA-Z]/)) {
            req.flash("error", `Username must begin with a letter`);
        } else if(!username.match(/[a-zA-Z0-9]{3,}/)) {
            req.flash("error", `Username requires 3+ alphanumeric characters`);
        } else {
            return next();
        }
        return req.session.save(function(err) {
            if(err) { next(err); }
            return res.redirect("/registration");
        });
    },
    checkEmail: function(req,res,next) {
        const { email } = req.body;
        if(!email || !email.match(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/)) {
            req.flash("error", `Incorrect email format`);
            return req.session.save(function(err) {
                if(err) { next(err); }
                return res.redirect("/registration");
            });
        }
        next();
    },
    checkPassword: function(req,res,next) {
        const { password } = req.body;
        if(!password || !validator.isStrongPassword(password, {minLength: 8, minLowercase: 0, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
            req.flash("error", `Weak Password`);
            return req.session.save(function(err) {
                if(err) { next(err); }
                return res.redirect("/registration");
            });
        } else {
            next();
        }
    },
    doesUsernameExist: async function(req,res,next) {
        const { username } = req.body;
        let [result, _] = await database.execute(`select id from users where username = ?`, [username]);
        if(result && result.length > 0) {
            req.flash("error", `Username '${username}' already exists`);
            return req.session.save(function(err) {
                if(err) { next(err); }
                return res.redirect("/registration");
            });
        } else {
            next();
        }
    },
    doesEmailExist: async function(req,res,next) {
        console.log("executing");
        const { email } = req.body;
        let [result, _] = await database.execute(`select id from users where email = ?`, [email]);
        if(result && result.length > 0) {
            req.flash("error", `Email '${email}' already in use`);
            return req.session.save(function(err) {
                if(err) { next(err); }
                return res.redirect("/registration");
            });
        } else {
            next();
        }
    },
}