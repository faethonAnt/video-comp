const db = require("../db/database");
const express = require("express");
const { isUser } = require("../middleware/authMiddleware");
const router = express.Router();

//!router.post("/:id", (req, res) => { TESTING
router.post("/:id", isUser, (req, res) => {
  const videoId = req.params.id;
  const userId = req.user.id;
  console.log("User:", req.user);
  console.log("Video ID:", req.params.id);
  //!const userId = 1; TESTING

  db.get(
    "SELECT * FROM vote WHERE userId = ? AND videoId = ?",
    [userId, videoId],
    (err, userVoted) => {
      // 1. Check for error or duplicate immediately and STOP
      if (err) return res.status(500).json({ message: "Server Error" });
      if (userVoted) return res.status(400).json({ message: "Already voted" });

      // 2. If we got here, it's safe to insert
      db.run(
        "INSERT INTO vote (userId, videoId) VALUES (?,?)",
        [userId, videoId],
        (err) => {
          if (err) return res.status(500).json({ message: "Insert Error" });

          // 3. Now check the lottery
          db.get(
            "SELECT * FROM lottery WHERE userId = ? AND type = ?",
            [userId, "vote"],
            (err, userLottery) => {
              if (err)
                return res.status(500).json({ message: "Lottery Check Error" });

              // If they are already in the lottery, finish here
              if (userLottery)
                return res.status(200).json({ message: "Voted successfully" });

              // 4. Otherwise, enter them into the lottery
              db.run(
                "INSERT INTO lottery (userId, type) VALUES (?,?)",
                [userId, "vote"],
                (err) => {
                  if (err)
                    return res
                      .status(500)
                      .json({ message: "Lottery Entry Error" });

                  res.status(200).json({ message: "Entered lottery" });
                },
              );
            },
          );
        },
      );
    },
  );
});

module.exports = router;
