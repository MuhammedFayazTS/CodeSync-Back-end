const User = require("../Model/userModel");
const bcrypt = require("bcrypt");

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


// login with email and password
// const login = async (req, res, next) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Wrong email or password" });
//   }

//   res
//     .status(200)
//     .json({ success: true, message: "User successfully logged in" });
// };



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
  myProfile,
  logout,
};
