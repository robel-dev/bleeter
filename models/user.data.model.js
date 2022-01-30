const mongoose = require("mongoose");
const PostSchema = require("./post.model").Schema;
const UserDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "users",
  },

  followers: [
    {
      followerUserId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users",
      },
      followerProfileId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "profiles",
      },
    },
  ],
  following: [
    {
      followingUserId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users",
      },

      followingProfileId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "profiles",
      },
    },
  ],
  savedPosts: [PostSchema],
});

module.exports = UserData = mongoose.model("userData", UserDataSchema);
