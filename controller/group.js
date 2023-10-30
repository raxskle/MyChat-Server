const { v4: uuidv4 } = require("uuid");
const { Groups, Users } = require("../mongodb");
const { ObjectId } = require("mongoose").Types;
const { Response } = require("../config/index.js");
const { joinRoom, notifyAddGroup } = require("../websocket");

// 新增群组
const createGroup = async (req, res) => {
  const { name, member } = req.body;
  const id = uuidv4();

  // 创建group
  const newGroup = new Groups({
    _id: new ObjectId(),
    id: id,
    name: name,
    member: member,
    groupChats: [], // 暂时无用
  });
  const msg = await newGroup.save();
  console.log("新增群组成功", msg);

  // 对每个member更新
  const list = member.map(async (userId) => {
    const user = await Users.findOne({ id: userId }).catch((err) => {
      console.log(err);
    });
    console.log("user", userId);

    return Users.updateOne(
      { id: userId },
      {
        groups: [...user.groups, { id, name }],
        groupChats: {
          ...user.groupChats,
          [id]: [],
        },
      }
    )
      .then(() => {
        console.log("member:" + userId + " joined " + id + " " + name);
      })
      .catch((err) => {
        console.log("userId:", userId, "failed:", err);
      });
  });

  await Promise.all(list);

  // 通知member加入了group
  member.forEach((memberId) => {
    console.log("notifyCreateGroup", memberId, id);
    notifyAddGroup(memberId, newGroup);
  });

  console.log("新增群组成功");
  res.send(Response("新增群组成功", newGroup));
};

// 返回群组信息列表
const getGroupInfo = async (req, res) => {
  const { groups } = req.query;
  const groupIds = JSON.parse(groups);
  console.log("getGroupInfo", groupIds);

  Groups.find({ id: groupIds }).then((data) => {
    res.send(Response("得到 groups 信息", data));
  });
};

module.exports = { createGroup, getGroupInfo };
