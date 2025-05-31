const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

// using router.route to combine same path funcs
router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signUp));

// this handles all the "/login" route req and authenticate user using passport (username and password)
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// ruote to log out user
router.get("/logout", userController.logout);

module.exports = router;
