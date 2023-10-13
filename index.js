const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const router = require("./routes/index.js");

app.use(express.static("public"));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const Users = require("./mongodb/index.js");

let clientList = {};
let member = 0;

io.on("connection", (socket) => {
  console.log("连接成功");
  socket.on("join", (msg) => {
    socket.name = msg;
    console.log(socket.name);
    // 记录socket和总客户端数
    clientList[msg] = socket.id;
    member++;
    io.emit("new guy", `${socket.id} ${msg} 加入`);
    console.log(clientList);
  });

  socket.on("all", (msg) => {
    io.emit("all", `${socket.id} 广播 ${msg}`);
  });

  socket.on("disconnect", (msg) => {
    console.log("离开");
    member--;
    io.emit("leave", `${socket.id} 退出，现有${member}人`);
  });
});

// api请求
app.use("/api", router);

// 用httpServer启动
server.listen(5000, () => {
  console.log("服务器开启", "http://localhost:5000");
});
