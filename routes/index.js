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
const {
  getAll,
  deleteUser,
  insertChat,
  getAllGroup,
  deleteGroup,
} = require("../controller/manage");
const { createGroup, getGroupInfo } = require("../controller/group");

const router = express.Router();

router.get("/test", test);

router.get("/login", login);

router.get("/add_friend", addFriend);

router.get("/get_friend_info", getFriendInfo);

router.post("/upload_avator", uploadAvator);

router.get("/update_name", updateName);

// 群组接口

// 创建群组
router.post("/create_group", createGroup);

// 返回单个群组
router.get("/get_group_info", getGroupInfo);

// 管理数据库接口

// 返回user所有信息
router.get("/all", getAll);

// 删除某个user文档
router.get("/delete", deleteUser);

// 插入聊天记录
router.post("/insert_chat", insertChat);

// 返回所有群组
router.get("/all_group", getAllGroup);

// 删除单个群组
router.get("/delete_group", deleteGroup);

module.exports = router;
