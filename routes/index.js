const express = require("express");
const {
  test,
  login,
  addFriend,
  getFriendInfo,
  uploadAvator,
  updateName,
} = require("../controller/index");
const { Users } = require("../mongodb");
const { Response } = require("../config");
const { getAll, deleteUser, insertChat } = require("../controller/manage");

const router = express.Router();

router.get("/test", test);

router.get("/login", login);

router.get("/add_friend", addFriend);

router.get("/get_friend_info", getFriendInfo);

router.post("/upload_avator", uploadAvator);

router.get("/update_name", updateName);

// 管理数据库接口

// 返回user所有信息
router.get("/all", getAll);

// 删除某个user文档
router.get("/delete", deleteUser);

// 插入聊天记录
router.post("/insert_chat", insertChat);

module.exports = router;
