const express = require("express");
const { register, signup, login, logout, myProfile} = require("../controllers/users.js");
const { isAuthenticated } = require("../middlewares/auth");


const router = express.Router();

router.route("/register").post(register);

router.route("/signup").post(signup);

router.route("/login").post(login);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticated, myProfile);

module.exports = router;