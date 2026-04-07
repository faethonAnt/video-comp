const db = require("../db/database");
const express = require("express");
const { isUser } = require("../middleware/authMiddleware");
const router = express.Router();

//!router.post("/:id", (req, res) => { TESTING
router.post("/:id", isUser, (req, res) => {
  const videoId = req.params.id;

  const userId = req.user.id;
  //!const userId = 1; TESTING

  db.get(
    "SELECT * FROM vote WHERE userId = ? AND videoId = ? ",
    [userId, videoId],
    (err, userVoted) => {
      if (err) return res.status(500).json({ message: "Server Error" });
      if (userVoted)
        res.status(401).json({ message: "User has already voted" });
      else {
        db.run(
          "INSERT INTO vote (userId, videoId) VALUES (?,?)",
          [userId, videoId],
          (err) => {
            if (err) return res.status(500).json({ message: "Server Error" });
            else {
              db.get(
                "SELECT * FROM lottery WHERE userId = ? AND type = ?",
                [userId, "vote"],
                (err, userLottery) => {
                  if (err)
                    return res.status(500).json({ message: "Server Error" });
                  if (userLottery)
                    res
                      .status(200)
                      .json({ message: "Success vote but user has voted" });
                  else {
                    db.run(
                      "INSERT INTO lottery (userId, type) VALUES (?,?)",
                      [userId, "vote"],
                      (err) => {
                        if (err)
                          return res
                            .status(500)
                            .json({ message: "Server Error" });
                        else {
                          res.status(200).json({ message: "Entered lottery" });
                        }
                      },
                    );
                  }
                },
              );
            }
          },
        );
      }
    },
  );
});

module.exports = router;
