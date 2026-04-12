//Facebook redirect handled by passport only need to call the handler
const express = require("express");
const router = express.Router();
const passport = require("../passport");

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] }),
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    //A route handler ALWAYS receives req and res
    res.redirect("/index.html"); // to return back to the home page
  },
);

module.exports = router;
