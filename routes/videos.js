const multer = require("multer");
const db = require("../db/database");

// ? imporrt destructuring because auth middleware exports two functions
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

// ! router.post("/upload", upload.single("video"), (req, res) => { this is used for testing purposes only

router.post("/upload", isUser, upload.single("video"), (req, res) => {
  const title = req.body.title;
  // ! const userId = 1; this is used for testing purposes only
  const userId = req.user.id;
  const filePath = req.file.path;

  // USER SEARCH
  db.get("SELECT * FROM video WHERE userId = ?", [userId], (err, user) => {
    // Database fail
    if (err) res.status(500).json({ message: "Something went wrong" });
    //user already in the system
    if (user) res.status(401).json({ message: "unauthorized" });
    //new user
    else {
      db.run(
        "INSERT INTO video (title, userId, status, filePath) VALUES (?, ?, ?, ?)",
        [title, userId, "pending", filePath],
        (err) => {
          if (err)
            return res.status(500).json({ message: "Something went wrong" });
          res.status(200).json({ message: "Success" });
        },
      );
    }
  });
});

module.exports = router;
