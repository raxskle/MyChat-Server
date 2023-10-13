const mongoose = require("mongoose");

const { ObjectId } = require("mongoose").Types;

// 不能用localhost，这里的localhost指向了 ::1:27017
mongoose.connect("mongodb://127.0.0.1:27017/MyChat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    id: String,
    name: String,
    password: String,
    avator: String,
    friends: [],
    chats: Object,
  },
  { collection: "Users" }
);

const Users = mongoose.model("Users", UserSchema);

// 增加
// const newUser = new Users({
//   _id: new ObjectId(),
//   id: "ccc",
//   name: "user2",
//   avator: "dafault",
// });
// newUser.save();

// 查找
// Users.find({ name: "raxskle" }).then((data) => {
//   console.log("1: ", data[0]);
//   const targetId = data[0]._id;
//   Users.find({ _id: targetId }).then((data2) => {
//     console.log("2: ", data2[0]);
//   });
// });

// 删除
// Users.deleteOne({ id: "ccc" }).then((res) => {
//   console.log(res);
// });

// 更新
// Users.updateOne({ id: "ccc" }, { friends: ["aaa"] }).then((data) => {
//   console.log(data);
// });

module.exports = { Users };
