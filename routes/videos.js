const multer = require("multer");
const db = require("../db/database");

// * this is used to see video metadata so we can check video duration
const ffmpeg = require("fluent-ffmpeg");

// ? import destructuring because auth middleware exports two functions
const { isUser } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

const storage = multer.diskStorage({
  //destination which folder to save the file & cb is callback
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

//router.post("/upload", upload.single("video"), (req, res) => {
//!this is used for testing purposes only

router.post("/upload", isUser, upload.single("video"), (req, res) => {
  const title = req.body.title;
  //const userId = 1; //!this is used for testing purposes only
  const userId = req.user.id;
  const filePath = req.file.path;

  ffmpeg.ffprobe(filePath, (err, metadata) => {
    const duration = metadata.format.duration;
    if (err) res.status(500).json({ message: "Something went wrong" });
    if (duration > 20) {
      res.status(400).json({ message: "Video must not excede 20 seconds" });
    } else {
      // USER SEARCH
      db.get("SELECT * FROM video WHERE userId = ?", [userId], (err, user) => {
        // Database fail
        if (err) res.status(500).json({ message: "Something went wrong" });
        //user already in the system
        if (user)
          res
            .status(401)
            .json({ message: "You have already uploaded a video" });
        //new user
        else {
          db.run(
            "INSERT INTO video (title, userId, status, filePath) VALUES (?, ?, ?, ?)",
            [title, userId, "pending", filePath],
            (err) => {
              if (err)
                return res
                  .status(500)
                  .json({ message: "Something went wrong" });
              res.status(200).json({ message: "Success" });
            },
          );
        }
      });
    }
  });
});

//used to retrieve all of the videos for a user to see without being logged in
router.get("/list", (req, res) => {
  db.all(
    "SELECT * FROM video WHERE status = ?",
    ["approved"],
    (err, videos) => {
      if (err) return res.status(500).json({ message: "Server response" });
      res.status(200).json({ videos }); //sending the array back as JSON the front end will handle it later
    },
  );
});

module.exports = router;
