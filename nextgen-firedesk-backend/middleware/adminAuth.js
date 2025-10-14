const adminAuth = (req, res, next) => {
  if (!req.user || req.user.userType !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = adminAuth;
