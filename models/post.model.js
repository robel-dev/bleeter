const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },

  text: {
    type: String,
    required: true,
  },
  //image is added here

  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = {
  Post: mongoose.model("posts", PostSchema),
  Schema: PostSchema,
};
