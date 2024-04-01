const myProfile = (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "User login Successfull", user: req.user });
  } else {
    res.status(401).json({ message: "Not Authorized" });
  }
};

const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);

    res.clearCookie("connect.sid");

    res.status(200).json({
      message: "Logged out successfully",
    });
  });
};

module.exports = {
  myProfile,
  logout,
};
