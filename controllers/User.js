const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { Success, AppError, jwtSigner } = require("../utils");
const Follow = require("../models/Follow");

const authenticate = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json(AppError("invalidRequest", "Missing Params"));

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json(AppError("notFound", "User Not Found"));

  if (!(await bcrypt.compare(password, user.password)))
    return res
      .status(404)
      .json(AppError("invalidCredentials", "Email or password invalid"));
  const jwt = jwtSigner(user._id, user.email);

  return res.status(200).json(Success("Signed in", jwt, {}));
};

const follow = async (req, res) => {
  const { id } = req.params;
  // console.log(req.user);
  if (!id)
    return res.status(400).json(AppError("invalidRequest", "Missing Params"));

  const followeeFound = await User.findById(id);
  // console.log(followeeFound)
  if (!followeeFound)
    return res.status(400).json(AppError("invalidRequest", "Invalid Followee"));

  const alreadyFollowed = await Follow.findOne({
    follower: req.user._id,
    followee: id,
  });

  if (!alreadyFollowed) {
    const newFollower = new Follow({
      follower: req.user._id,
      followee: id,
    });

    const created = await newFollower.save();
    if (!created)
      return res
        .status(500)
        .json(AppError("internalServerError", "Unable to Follow"));
  }

  return res.status(201).json(Success("User Followed"));
};

const unfollow = async (req, res) => {
  const { id } = req.params;

  const unfollowed = await Follow.findOneAndDelete({
    follower: req.user._id,
    followee: id,
  });
  console.log(unfollowed);

  return res.status(200).json(Success("Unfollowed"));
};

const userProfile = async (req, res) => {
//   console.log(req.user);
  const followers = await Follow.count({ followee: req.user._id });
  const follows = await Follow.count({ follower: req.user._id });

  return res.status(200).json(
    Success("User Profile", null, {
      name: req.user.name,
      followers,
      follows,
    })
  );
};
module.exports = { authenticate, follow, unfollow, userProfile };
