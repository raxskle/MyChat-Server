const express = require("express");
const { test, login, addFriend } = require("../controller/index");

const router = express.Router();

router.get("/test", test);

router.get("/login", login);

router.get("/add_friend", addFriend);

module.exports = router;
