const express = require("express");
const {
  test,
  login,
  addFriend,
  getFriendInfo,
} = require("../controller/index");
const { Users } = require("../mongodb");
const { Response } = require("../config");

const router = express.Router();

router.get("/test", test);

router.get("/login", login);

router.get("/add_friend", addFriend);

router.get("/get_friend_info", getFriendInfo);

// 管理数据库接口

// 返回user所有信息
router.get("/all", (req, res) => {
  Users.find().then((data) => {
    res.send(data);
  });
});
// 删除某个user文档
router.get("/delete", (req, res) => {
  console.log(req.query);
  Users.deleteOne({ id: req.query.id }).then((data) => {
    res.send(Response("删除成功", data));
  });
});
// 插入聊天记录
router.post("/insert_chat", async (req, res) => {
  const { user_id1: userId1, user_id2: userId2, chat } = req.body;
  // 为user1和user2增加一个chat记录
  console.log("req.body", req.body);
  const data = {
    time: Date.now(),
    userid: userId1,
    content: chat,
  };
  console.log(data);
  const user1 = await Users.findOne({ id: userId1 });
  const user2 = await Users.findOne({ id: userId2 });

  const updateResult1 = await Users.updateOne(
    { id: userId1 },
    {
      chats: {
        ...user1.chats,
        [userId2]: [...user1.chats[userId2], data],
      },
    }
  );

  console.log(updateResult1);
  const updateResult2 = await Users.updateOne(
    { id: userId2 },
    {
      chats: {
        ...user2.chats,
        [userId1]: [...user2.chats[userId1], data],
      },
    }
  );
  console.log(updateResult2);
  res.send(Response("insert msg success", req.query, data));
});

module.exports = router;
