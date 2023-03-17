const mongoose = require("mongoose");
const { Schema } = mongoose;

const FollowSchema = mongoose.Schema(
  {
    follower: { type: Schema.Types.ObjectId, ref: "User" },
    followee: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const FollowModel = mongoose.model("Follow",FollowSchema);

module.exports = FollowModel;