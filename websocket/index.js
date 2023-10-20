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

// 用户加入clients才可进行websocket消息发送
// sendMsg：  客户端sender和客户端receiver
// 1.存入数据库user双方chats字段，服务端数据同步记录
// 2.通知sender 和 receiver，仅更新chats字段中sender的chat[].push一个chat
// 3.在此之前这个sendMsg处于pending状态
// 4.在pending状态时，（todo：先不存，因为需要等待服务端的time字段

const runSocket = () => {
  io.on("connection", (socket) => {
    console.log("连接成功");

    // 登陆上线准备通信
    // params: id
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
    // params: id
    socket.on("offline", (userId) => {
      console.log("离开");
      delete clients[userId];
      console.log("client now:", clients);
    });

    // client 发送 私聊信息给用户，前提条件：双方已经添加好友
    // 当接收者在线时，会用socket发送信息
    // 会将聊天记录保存在双方的chats数据字段中
    // params: data:{to, from, content}
    socket.on("sendMsg", async (data) => {
      console.log("send:", data);

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

      // 如果用户在线则通知更新
      const targetClient = clients[data.to];
      const sourceClient = clients[data.from];
      if (targetClient) {
        console.log("receiver在线");
        socket.broadcast
          .to(targetClient)
          .emit("receiveMsg", { friendId: data.from, chat });
      }
      if (sourceClient) {
        console.log("sender在线");
        socket.emit("receiveMsg", { friendId: data.to, chat });
      }
      console.log("sendMsg Finish");
    });

    // 断开socket，并无作用
    socket.on("disconnect", () => {
      console.log("离开");
    });
  });
};

module.exports = { runSocket, server };
