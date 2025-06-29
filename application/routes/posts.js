let express = require("express");
let router = express.Router();
let multer = require("multer");
const {makeThumbnail, getPostById, getCommentsForPostById, isVideoFile, getRecentPosts} = require("../middleware/posts");
const {isLoggedIn} = require("../middleware/auth");
const database = require("../config/database");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/videos');
    },
    filename: function (req, file, cb) {
        const fileExt = file.mimetype.split("/")[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
    }
});

const upload = multer({ storage: storage });

router.post("/create", isLoggedIn, upload.single("uploadVideo"), isVideoFile, makeThumbnail, async function(req, res, next) {
    let {title, description} = req.body;
    if(title === "") { title = "Untitled"; }
    const {path, thumbnail} = req.file;
    const {id} = req.session.user;
    try {
        // let result;
        let [result, _] = await database.execute(`insert into posts (title, description, video, thumbnail, fk_userId)
        value (?,?,?,?,?);`, [title,description,path,thumbnail,id]);
        if(result && result.affectedRows) {
            req.flash("error","post created");
            return req.session.save(function(err) {
                if(err) { next(err) }
                return res.redirect("/");
            });
        } else {
            req.flash("error","post failed, try again later");
            return req.session.save(function(err) {
                if(err) { next(err) }
                return res.redirect("/postvideo");
            });
        }
    } catch (err) {
        next(err);
    }
    res.end();
});
router.get("/:id(\\d+)", getPostById, getCommentsForPostById, function(req, res, next) {
    res.render("viewpost", {title: "View Post", js: ["viewpost.js"]});
});
router.get("/search", async function(req, res, next) {
    let {key} = req.query
    const keyTrim = key.trim();
    if(key!==keyTrim) {
        return res.redirect(`/posts/search?key=${keyTrim}`);
    }

    const searchValue = `%${key}%`;
    try {
        let [result, _] = await database.execute(`select id, title, description, thumbnail,
        concat_ws(" ", title, description) as haystack from posts having haystack like ?;`, [searchValue]);
        // return res.status(200).json(result.length);
        if(result) {
            res.locals.count = result.length;
            res.locals.results = result;
            res.locals.searchValue = key;
            res.locals.noResults = res.locals.count === 0;
            if(res.locals.noResults) {
                let [result,_] = await database.execute(`select id, title, description, thumbnail
                from posts order by createdAt desc limit 3;`);
                res.locals.results = result;
            }
            // console.log(res.locals.results);
            // res.status(200).json({
            //     count: result.length,
            //     result
            // });
        } else {
            res.status(200).json({
                message:"error",
                // count: 0,
                // results: []
            });
        }
        return res.render('index');

        // return res.status.);
    } catch(err) {
        next(err);
    }
});
module.exports = router;