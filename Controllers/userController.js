const User = require("../Model/userModel");
const bcrypt = require("bcrypt");
const passport = require("passport");

// email password registration
const register = async (req, res) => {
  const { email, username, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.status(403).json({ message: "User already exists", success: false });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user = new User({ email, username, password: hashedPassword });

  await user.save();
  res.status(201).json({ success: true, message: "User successfully registered" });
};

// login using passport local
const login = (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(200).json({ success: true });
    });
  })(req, res);
};



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
  register,
  login,
  myProfile,
  logout,
};
