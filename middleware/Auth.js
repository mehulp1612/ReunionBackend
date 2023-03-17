const jwt = require("jsonwebtoken");
const User = require("../models/User");

const validUserToken = async(req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.send({
      status: 200,
      message: "Your session has expired. Please login again.",
      success: false,
    });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.SALT, async (err, payload) => {
    if (err) {
      return res.send({
        status: 200,
        success: false,
        message: "Your session has expired. Please login again.",
      });
    }
    // console.log(payload);
    const { id } = payload;
    const userInfo = await User.findById(id).select('email name');
    // console.log(userInfo);
    if (!userInfo)
      return res.send({
        status: 404,
        success: false,
        message: "Invalid User",
      });
      
    req.user = userInfo;
    next();
  });
};

module.exports = {
  validUserToken,
};
