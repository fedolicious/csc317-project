let express = require("express");
let router = express.Router();
let multer = require("multer");

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

router.post("/create", upload.single("uploadVideo"), function(req, res, next) {
    console.log(req.file);
    console.log(req.body);
    res.end();
});
module.exports = router;