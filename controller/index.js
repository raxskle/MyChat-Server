const { ObjectId } = require("mongoose").Types;
const { Response } = require("../config/index.js");
const { Users } = require("../mongodb/index.js");

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
        avator:
          "data:image/webp;base64,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",
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
    const ack = await Users.find({ id: user_id });
    res.send(Response("添加好友成功", ack[0]));
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
