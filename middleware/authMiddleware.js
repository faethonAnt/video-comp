function isAdmin(req, res, next) {
  if (!req.session.admin) res.status(401).json({ message: "unauthorized" });
  else next();
}

module.exports = isAdmin;
