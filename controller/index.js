const { ObjectId } = require("mongoose").Types;
const { Response } = require("../config/index.js");
const { Users } = require("../mongodb/index.js");

const test = (req, res) => {
  res.send("Hello World!");
};

// params: userId, password
// 如果存在账户，则判断密码，如果密码正确则返回信息
// 如果不存在账户，则创建账户，返回信息
const login = (req, res) => {
  const { id, password } = req.query;

  Users.find({ id: id }).then((data) => {
    if (data.length > 0 && data[0]) {
      // 有账号，判断密码，返回
      if (data[0].password == password) {
        // 密码正确
        res.send(Response("密码正确，返回用户信息", data[0]));
      } else {
        // 密码错误
        res.send(Response("密码错误"));
      }
    } else {
      // 无账号，创建账号并返回信息
      const newUser = new Users({
        _id: new ObjectId(),
        id: id,
        name: id,
        password: password,
        avator: "dafault",
        friends: [],
        chats: {},
      });
      newUser.save().then((msg) => {
        console.log("新增用户成功", msg);
        res.send(Response("注册用户成功", newUser));
      });
    }
  });
};

// params: userId, friendId
const addFriend = (req, res) => {
  const { user_id, friend_id } = req.query;

  Users.find({ id: user_id }).then((data) => {
    if (data.length > 0 && darta[0]) {
    } else {
      // 没找到用户
      res.send(Response("不存在该用户"));
    }
  });
};

module.exports = { test, login, addFriend };
