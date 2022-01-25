const mongoose = require("mongoose");
const PostSchema = require("./post.model").Schema;
const UserDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "users",
  },

  savedPosts: [PostSchema],
});

module.exports = UserData = mongoose.model("userData", UserDataSchema);
