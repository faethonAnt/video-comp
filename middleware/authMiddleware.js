function isAdmin(req, res, next) {
  if (!req.session.admin) res.status(401).json({ message: "unauthorized" });
  else next();
}

function isUser(req, res, next) {
  if (req.user) next();
  else res.status(401).json({ message: "unauthorized" });
}

module.exports = { isAdmin, isUser };
