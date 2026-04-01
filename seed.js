// THIS FILE WILL BE USED TO CREATE AN ADMIN ACCOUNT
const db = require("./db/database");
var bcrypt = require("bcrypt");

const adminPassword = "faethon123";
bcrypt.hash(adminPassword, 10, (err, hash) => {
  if (err) {
    console.log("Something went wrong with hash!");
    return;
  }
  console.log("Hashed password:", hash);

  db.run(
    "INSERT INTO admin(username,password,email) VALUES (?, ?, ?)",
    ["fanto", hash, "antonopfaeth@gmail.com"],
    (err) => {
      if (err) console.error(err.message);
      else console.log("Admin Created");
    },
  );
});
