const express = require('express');
const router = express.Router()
const passport = require('passport');
const { logout, myProfile } = require('../Controllers/userController');
const isAuthenticated = require('../Middleware/auth');


// :: login ::
// initial google auth login
router.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}))
router.get("/auth/google/callback",passport.authenticate("google",{
  successRedirect:`${process.env.FRONTEND_URL}`,
  failureRedirect:`${process.env.FRONTEND_URL}/sign-in`,
}))



router.get('/me',isAuthenticated,myProfile)

router.get('/logout',logout)


module.exports = router