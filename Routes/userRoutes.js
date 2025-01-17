const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  logout,
  register,
  login,
  protectedData,
} = require("../Controllers/userController");
const isAuthenticated = require("../Middleware/auth");

// :: Authentication ::

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

// Passport - LOCAL Authentication
router.post("/auth/register", register);
router.post('/auth/login', login);



router.get("/protected-route", isAuthenticated, protectedData);

router.get("/logout", logout);

module.exports = router;
