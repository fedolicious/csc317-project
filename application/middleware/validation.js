const database = require("../config/database");
const bcrypt = require("bcrypt");
const validator = require("validator");
module.exports = {
    checkUsername: function(req,res,next) {
        const { username } = req.body;
        if(!username.match(/^[a-zA-Z]/)) {
            req.flash("error", `username doesnt begin with a letter`);
        } else if(!username.match(/[a-zA-Z0-9]{3,}/)) {
            req.flash("error", `username Needs 3+ alphanumerics`);
        } else {
            return next();
        }
        return req.session.save(function(err) {
            if(err) { next(err); }
            return res.redirect("/registration");
        });
    },
    checkEmail: function(req,res,next) {
        // const { email } = req.body;
        // if(!validator.isEmail(email)) {
        //     req.flash("error", `sus email`);
        //     return req.session.save(function(err) {
        //         if(err) { next(err); }
        //         return res.redirect("/registration");
        //     });
        // } else {
            next();
        // }

    },
    checkPassword: function(req,res,next) {
        const { password } = req.body;
        if(!validator.isStrongPassword(password, {minLength: 8, minLowercase: 0, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
            req.flash("error", `weak password`);
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
            req.flash("error", `Username exists`);
            return req.session.save(function(err) {
                if(err) { next(err); }
                return res.redirect("/registration");
            });
        } else {
            next();
        }
    },
    doesEmailExist: async function(req,res,next) {
        const { email } = req.body;
        let [result, _] = await database.execute(`select id from users where email = ?`, [email]);
        if(result && result.length > 0) {
            req.flash("error", `Email exists`);
            return req.session.save(function(err) {
                if(err) { next(err); }
                return res.redirect("/registration");
            });
        } else {
            next();
        }
    },
}