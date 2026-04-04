//MAIN APP START WITH npm run dev

const express = require("express");

//keep users logged in
const session = require("express-session");

//database instead of memory so it gets wiped on every server restart
const SQLiteStore = require("connect-sqlite3")(session);

//passport config for Fb login
const passport = require("./passport");

// connect to database
const db = require("./db/database");

//Routers
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const videoRoutes = require("./routes/videos");

//create Express app
const app = express();
const PORT = 3000;

// * MIDDLEWARE
// runs on every req before it reaches the router order matters

// * allow the reading of JSON form data in req bodies
app.use(express.json());

// same process but for HTML forrms
app.use(express.urlencoded({ extended: true }));

// * Session setup - keep users logged in
app.use(
  session({
    store: new SQLiteStore({ db: "session.db", dir: "./db" }),
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
  }),
);

app.use(passport.initialize());
app.use(passport.session()); //

//routes will be prefixed with the appropriate path
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/video", videoRoutes);

// ?TESTING
app.get("/", (req, res) => {
  res.send("Video Competition App is running!");
});

// * START SRV LISTENING FOR REQ ON PORT 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
