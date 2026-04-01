const express = require("express");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);

// connect to database
const db = require("./db/database");

const adminRoutes = require("./routes/admin");

const app = express();
const PORT = 3000;

// 1. Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new SQLiteStore({ db: "session.db", dir: "./db" }),
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
  }),
);

//routes
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Video Competition App is running!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
