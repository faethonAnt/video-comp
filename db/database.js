const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DB_PATH = path.join(__dirname, "competition.db");

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.serialize(() => {
  // USER table
  db.run(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      facebookId TEXT UNIQUE NOT NULL
    )
  `);

  // ADMIN table
  db.run(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    )
  `);

  // VIDEO table
  db.run(`
    CREATE TABLE IF NOT EXISTS video (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      userId INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      filePath TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES user(id)
    )
  `);

  // VOTE table
  db.run(`
    CREATE TABLE IF NOT EXISTS vote (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      videoId INTEGER NOT NULL,
      UNIQUE(userId, videoId),
      FOREIGN KEY (userId) REFERENCES user(id),
      FOREIGN KEY (videoId) REFERENCES video(id)
    )
  `);

  // LOTTERY table
  db.run(`
    CREATE TABLE IF NOT EXISTS lottery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      type TEXT NOT NULL,
      UNIQUE(userId, type),
      FOREIGN KEY (userId) REFERENCES user(id)
    )
  `);
});

module.exports = db; // used so every other file in node.js can use the db info

//other files use it with "const db = require('./db/database');"

// can also see table through sqlite3 db/competition.db
/* commands:
        .tables
        .schema user
        .quit
*/

/*
    commands:
        db.run() - write (insert, update, delete)
        db.get() - read one row
        db.all() - read multiple rows
*/
