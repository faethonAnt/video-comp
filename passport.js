const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const db = require("./db/database");
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.get("SELECT * FROM user WHERE id = ?", [id], (err, user) => {
    done(err, user);
  });
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
    },
    (accessToken, refreshToken, profile, done) => {
      const facebookId = profile.id;
      const name = profile.displayName;
      const email = profile.emails[0].value;

      db.get(
        "SELECT * FROM user WHERE facebookId = ?",
        [facebookId],
        (err, user) => {
          if (err) return done(err);
          if (user) return done(null, user);
          else {
            db.run(
              "INSERT INTO user(name, email, facebookId) VALUES (?,?,?)",
              [name, email, facebookId],
              function (err) {
                if (err) return done(err);
                done(null, { id: this.lastID, name, email, facebookId });
              },
            );
          }
        },
      );
    },
  ),
);

module.exports = passport;
