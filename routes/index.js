const express = require("express");
const { test, login, addFriend } = require("../controller/index");
const { Users } = require("../mongodb");
const { Response } = require("../config");

const router = express.Router();

router.get("/test", test);

router.get("/login", login);

router.get("/add_friend", addFriend);

// 管理数据库接口
router.get("/all", (req, res) => {
  Users.find().then((data) => {
    res.send(data);
  });
});

router.get("/delete", (req, res) => {
  console.log(req.query);
  Users.deleteOne({ id: req.query.id }).then((data) => {
    res.send(Response("删除成功", data));
  });
});
module.exports = router;
