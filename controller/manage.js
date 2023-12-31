const express = require("express");
const { Users, Groups } = require("../mongodb");
const { Response } = require("../config");

// 返回user所有信息
const getAll = (req, res) => {
  Users.find().then((data) => {
    res.send(data);
  });
};

// 删除某个user文档
const deleteUser = (req, res) => {
  console.log(req.query);
  Users.deleteOne({ id: req.query.id }).then((data) => {
    res.send(Response("删除成功", data));
  });
};

// 插入聊天记录
const insertChat = async (req, res) => {
  const { user_id1: userId1, user_id2: userId2, chat } = req.body;
  // 为user1和user2增加一个chat记录
  console.log("req.body", req.body);
  const data = {
    time: Date.now(),
    userid: userId1,
    content: chat,
    type: "text",
    checked: false,
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
};

const getAllGroup = async (req, res) => {
  Groups.find().then((data) => {
    res.send(data);
  });
};

// 删除群组，仅删除Groups中数据，没有改User中数据
const deleteGroup = async (req, res) => {
  console.log(req.query);
  Groups.deleteOne({ id: req.query.id }).then((data) => {
    res.send(Response("删除群组成功", data));
  });
};

module.exports = { getAll, deleteUser, insertChat, getAllGroup, deleteGroup };
