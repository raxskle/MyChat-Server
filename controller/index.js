const { ObjectId } = require("mongoose").Types;
const { Response } = require("../config/index.js");
const { Users } = require("../mongodb/index.js");
const { notifyAddFriend } = require("../websocket/index.js");

const test = (req, res) => {
  res.send(Response("Hello World!"));
};

// params: userId, password
// 如果存在账户，则判断密码，如果密码正确则返回信息
// 如果不存在账户，则创建账户，返回信息
const login = (req, res) => {
  const { id, password } = req.query;

  Users.findOne({ id: id }).then((data) => {
    if (data) {
      // 有账号，判断密码，返回
      if (data.password == password) {
        // 密码正确
        res.send(Response("密码正确，登录成功", data));
      } else {
        // 密码错误
        res.send(Response("用户名或密码错误"));
      }
    } else {
      // 无账号，创建账号并返回信息
      const newUser = new Users({
        _id: new ObjectId(),
        id: id,
        name: id,
        password: password,
        avator: "https://demo.raxskle.fun/avator.png",
        friends: [],
        chats: {},
        groups: [],
        groupChats: {},
      });
      newUser.save().then((msg) => {
        console.log("新增用户成功", msg);
        res.send(Response("注册用户成功", newUser));
      });
    }
  });
};

// params: userId, friendId
const addFriend = async (req, res) => {
  const { user_id, friend_id } = req.query;

  const user1 = await Users.findOne({ id: user_id });
  const user2 = await Users.findOne({ id: friend_id });

  if (user1 && user2) {
    if (user1.friends.includes(user2.id)) {
      // 已经是好友
      res.send(Response("对方和你已经是好友"));
      return;
    }

    await Users.updateOne(
      { id: user_id },
      {
        friends: [...user1.friends, friend_id],
        chats: { ...user1.chats, [friend_id]: [] },
      }
    );
    await Users.updateOne(
      { id: friend_id },
      {
        friends: [...user2.friends, user_id],
        chats: { ...user2.chats, [user_id]: [] },
      }
    );
    // 确认的用户信息
    const ack = await Users.findOne({ id: user_id });

    console.log("addfriend 返回ack:", ack);
    // 若在线则通知friend
    notifyAddFriend(friend_id, {
      id: ack.id,
      name: ack.id,
      avator: ack.avator,
    });
    // 响应返回给自己
    res.send(Response("添加好友成功", ack));
  } else {
    // 没找到用户
    res.send(Response("不存在该用户"));
  }
};

// users数组 =》friends信息数组
const filterFriendInfo = (data) => {
  return data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      avator: item.avator,
    };
  });
};

// 用户需要知道朋友的某些信息，但是在user的friend字段里加就太臃肿
// 根据id搜索用户也是调用该接口
// params: friends[]
// response: {id, name, avator}[]
const getFriendInfo = (req, res) => {
  const { friends } = req.query;
  const friendIds = JSON.parse(friends);

  Users.find({ id: friendIds }).then((data) => {
    res.send(Response("得到 friends 信息", filterFriendInfo(data)));
  });
};

const uploadAvator = async (req, res) => {
  const { base64, id } = req.body;
  console.log(base64, id);
  const updateResult = await Users.updateOne(
    { id: id },
    {
      avator: base64,
    }
  );
  console.log(updateResult);

  res.send(Response("upload image", req.body.base64));
};

const updateName = async (req, res) => {
  const { name, id } = req.query;
  const updateResult = await Users.updateOne(
    { id: id },
    {
      name: name,
    }
  );
  console.log(updateResult, name, id);

  res.send(Response("update name", name));
};

module.exports = {
  test,
  login,
  addFriend,
  getFriendInfo,
  uploadAvator,
  updateName,
};
