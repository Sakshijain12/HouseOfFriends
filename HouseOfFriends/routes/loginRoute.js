const express = require('express')
const { getLoginCredentials } = require("../controllers/loginController")

const router = express.Router();

router.route("/login").get(getLoginCredentials)

module.exports = router