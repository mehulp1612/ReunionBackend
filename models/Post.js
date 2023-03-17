const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = mongoose.Schema(
  {
    description: String,
    title: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        text: String,
        commentBy: { type: Schema.Types.ObjectId, ref: "User", },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("Post",PostSchema);

module.exports = PostModel;