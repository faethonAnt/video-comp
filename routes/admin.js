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
    if (err) console.log("didnt destroy");
    else res.status(200).json({ message: "Success!" });
  });
});

module.exports = router;
