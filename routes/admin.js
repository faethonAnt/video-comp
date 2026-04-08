// routes/admin.js
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/authMiddleware");

const db = require("../db/database"); // connnection to db
const { route } = require("./votes");

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
router.get("/video", isAdmin, (req, res) => {
  db.all("SELECT * FROM video", (err, videos) => {
    if (err) return res.status(500).json({ message: "Server response" });
    res.status(200).json({ videos }); //sending the array back as JSON the front end will handle it later
  });
});

router.put("/video/:id/approve", isAdmin, (req, res) => {
  //:id extracts the video id from the URL
  const videoId = req.params.id;

  db.run(
    "UPDATE video SET status = ? WHERE id = ?", //change status to APPROVED
    ["approved", videoId],
    (err) => {
      if (err) return res.status(500).json({ message: "Something went wrong" });
      else {
        db.get("SELECT * FROM video where id = ? ", [videoId], (err, video) => {
          //FIND VIDEO
          if (err) return res.status(500).json({ message: "Server Error" });
          else {
            const userId = video.userId; //get the user id back from the video upload

            db.get(
              //CHECK IF USER HAS ENTRY
              "SELECT * FROM lottery WHERE userId = ? AND type = ?",
              [userId, "upload"],
              (err, userLottery) => {
                if (err)
                  return res.status(500).json({ message: "Server Error" });
                if (userLottery)
                  res
                    .status(200)
                    .json({ message: "Success upload but user has entry" });
                else {
                  db.run(
                    "INSERT INTO lottery (userId, type) VALUES (?,?)",
                    [userId, "upload"],
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
        });
      }
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

router.post("/lottery/draw", isAdmin, (req, res) => {
  // ? VOTING WINNER
  db.get(
    "SELECT * FROM lottery WHERE type = ? ORDER BY RANDOM () LIMIT 1",
    ["vote"],
    (err, voteWinner) => {
      if (err) return res.status(500).json({ message: "Seerver Error" });
      if (!voteWinner) res.status(200).json({ message: "No winner yet" });
      else {
        const winnerVoteId = voteWinner.userId;
        db.get(
          "SELECT * FROM user WHERE id = ? ",
          [winnerVoteId],
          (err, user) => {
            if (err) return res.status(500).json({ message: "Server Error" });

            const userNameVote = user.name;

            db.get(
              "SELECT * FROM lottery WHERE type = ? ORDER BY RANDOM () LIMIT 1",
              ["upload"],
              (err, uploadWinner) => {
                if (err)
                  return res.status(500).json({ message: "Seerver Error" });
                if (!uploadWinner)
                  res.status(200).json({ message: "No winner yet" });
                else {
                  const winnerUploadId = uploadWinner.userId;
                  db.get(
                    "SELECT * FROM user WHERE id = ? ",
                    [winnerUploadId],
                    (err, user) => {
                      if (err)
                        return res
                          .status(500)
                          .json({ message: "Server Error" });

                      const userNameUpload = user.name;

                      res.status(200).json({
                        message:
                          userNameVote +
                          " won the voting lottery & " +
                          userNameUpload +
                          " won the upload lottery",
                      });
                    },
                  );
                }
              },
            );
          },
        );
      }
    },
  );
});

module.exports = router;
