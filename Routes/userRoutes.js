const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  logout,
  myProfile,
  register,
} = require("../Controllers/userController");
const isAuthenticated = require("../Middleware/auth");

// :: login ::

// Google Login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: `${process.env.FRONTEND_URL}`,
    failureRedirect: `${process.env.FRONTEND_URL}/sign-in`,
  })
);

// LOCAL LOGIN
router.post("/auth/register", register);
router.post(
  "/auth/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

router.get("/me", isAuthenticated, myProfile);

router.get("/logout", logout);

module.exports = router;
