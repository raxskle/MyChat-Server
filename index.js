const express = require("express");
const bodyParser = require("body-parser");
const app = express();
module.exports = { app };

const { runSocket, server } = require("./websocket/index");

const router = require("./routes/index.js");

// 静态资源访问
app.use(express.static("public"));

// POST请求解析body
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// websocket
runSocket();

// api请求
app.use("/api", router);

// 用httpServer启动
server.listen(5000, () => {
  console.log("服务器开启", "http://localhost:5000");
});
