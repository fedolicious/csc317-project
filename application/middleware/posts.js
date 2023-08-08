var pathToFFMPEG = require("ffmpeg-static");
var promisify = require('util').promisify;
var exec = promisify(require("child_process").exec);
const database = require("../config/database");
module.exports = {
    makeThumbnail: async function (req, res, next) {
        if (!req.file) {
            next(new Error("File upload failed"));
        } else {
            try {
                var destinationOfThumbnail = `public/uploads/images/thumbnail-${req.file.filename.split(".")[0]}.png`;
                var thumbnailCommand = `"${pathToFFMPEG}" -ss 00:00:01 -i ${req.file.path} -y -s 200x200 -vframes 1 -f image2 ${destinationOfThumbnail}`;
                var { stdout, stderr } = await exec(thumbnailCommand);
                req.file.thumbnail = destinationOfThumbnail;
                next();
            } catch (error) {
                next(error);
            }
        }
    },
    getPostById: async function(req,res,next) {
        const {id} = req.params;
        try {
            let [result,_] = await database.execute(`select p.id,p.title,p.description,p.video,p.createdAt,u.username
            from posts p join users u on fk_userId=u.id where p.id=?;`,[id]);
            const post = result[0];
            if(!post) {
                req.flash("error","post not found");
                return req.session.save(function(err) {
                    if(err) { next(err) }
                    return res.redirect("/");
                });
            }
            res.locals.post = post;
            next();
        }catch(err) {
            next(err);
        }
    },
    getCommentsForPostById: async function(req, res, next) {
        next();
    },
    getRecentPosts: async function(req, res, next) {
        next();
    }
}