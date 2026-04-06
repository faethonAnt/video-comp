// routes/admin.js
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/authMiddleware");

const db = require("../db/database"); // connnection to db

//Define routes
//  /admin/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM admin WHERE username = ? ",
    [username],
    (err, admin) => {
      if (err) console.log("Something went wrong");
      if (!admin)
        return res.status(401).json({ message: "Invalid credentials" });
      else {
        bcrypt.compare(password, admin.password, (err, result) => {
          if (err) console.log("Something went wrong");
          if (result) {
            req.session.admin = { id: admin.id, username: admin.username };
            res.status(200).json({ message: "Login successful" });
            // admin is signed up
          } else res.status(401).json({ message: "Invalid credentials" });
        });
      }
    },
  );
});

// logout
router.get("/logout", isAdmin, (req, res) => {
  req.session.destroy((err) => {
    if (err) return console.log("didnt destroy");
    else res.status(200).json({ message: "Success!" });
  });
});

//list of videos
router.get("/videos", isAdmin, (req, res) => {
  db.all("SELECT * FROM video", (err, videos) => {
    if (err) return res.status(500).json({ message: "Server response" });
    res.status(200).json({ videos }); //sending the array back as JSON the front end will handle it later
  });
});

router.put("/videos/:id/approve", isAdmin, (req, res) => {
  //:id extracts the video id from the URL
  const id = req.params.id;

  db.run(
    "UPDATE video SET status = ? WHERE id = ?",
    ["approved", id],
    (err) => {
      if (err) return res.status(500).json({ message: "Something went wrong" });
      res.status(200).json({ message: "Video approved" });
    },
  );
});

router.put("/videos/:id/reject", isAdmin, (req, res) => {
  const id = req.params.id;
  db.run(
    "UPDATE video SET status = ? WHERE id = ?",
    ["rejected", id],
    (err) => {
      if (err) return res.status(500).json({ message: "Something went wrong" });
      res.status(200).json({ message: "Video rejected" });
    },
  );
});

module.exports = router;
