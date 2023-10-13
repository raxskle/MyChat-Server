const { app } = require("../index");
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { Users } = require("../mongodb");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const clients = {}; // userId -> socket

const runSocket = () => {
  io.on("connection", (socket) => {
    console.log("连接成功");

    // 登陆上线准备通信
    socket.on("online", (userId) => {
      socket.user = userId;
      // 保存socket id
      clients[userId] = socket.id;
      console.log("client now:", clients);
    });

    // 通知所有user
    socket.on("all", (msg) => {
      io.emit("all", `广播 ${msg}`);
    });

    // 离线不再接收信息
    socket.on("offline", (userId) => {
      console.log("离开");
      delete clients[userId];
      console.log("client now:", clients);
    });

    // client 发送 私聊信息给用户，前提条件：双方已经添加好友
    // 当接收者在线时，会用socket发送信息
    // 会将聊天记录保存在双方的chats数据字段中
    socket.on("sendMsg", async (data) => {
      // 查找对应在线socket，直接发送给对方
      console.log("send hello", data);
      const targetClient = clients[data.to];
      if (targetClient) {
        // 如果用户在线则发送
        socket.to(targetClient).emit("receiveMsg", data);
      }
      // 将聊天记录存入数据库
      const chat = {
        time: Date.now(),
        userid: data.from,
        content: data.content,
      };

      console.log(chat);
      const sender = await Users.findOne({ id: data.from });
      const receiver = await Users.findOne({ id: data.to });
      // sender 这数据结构定义得有点太复杂，把自己都绕一圈了。。。
      const updateResult1 = await Users.updateOne(
        { id: data.from },
        {
          chats: {
            ...sender.chats,
            [data.to]: [...sender.chats[data.to], chat],
          },
        }
      );
      console.log(updateResult1);
      const updateResult2 = await Users.updateOne(
        { id: data.to },
        {
          chats: {
            ...receiver.chats,
            [data.from]: [...receiver.chats[data.from], chat],
          },
        }
      );
      console.log(updateResult2);
    });

    // 断开socket，并无作用
    socket.on("disconnect", () => {
      console.log("离开");
    });
  });
};

module.exports = { runSocket, server };
