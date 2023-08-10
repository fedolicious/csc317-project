var express = require('express');
const {isLoggedInJSON} = require("../middleware/auth");
const database = require("../config/database");
var router = express.Router();

router.post("/create", isLoggedInJSON, async function(req, res, next) {
    const {postId, commentText, parentId = null} = req.body;
    const {id, username} = req.session.user;

    try {
        console.log({id,commentText,postId,parentId});
        // return;
        let [result,_] = await database.execute(`insert into comments (fk_userId, text, fk_postId, fk_parentComment)
        VALUES (?,?,?,?);`,[id,commentText,postId,parentId]);
        if(result && result.affectedRows) {
            return res.status(201).json({status:"success",statusCode:1,
                commentText,
                username,
                parentId,
                commentId: result.insertId
            });
        } else {
            return res.status(500).json({ status:"failed", statusCode: -1,
                message: "could not create comment, try again later"
            });
        }
    } catch(err) {
        next(err);
    }

    res.end();
});

module.exports = router;
