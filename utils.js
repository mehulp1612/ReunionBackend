const jwt  = require("jsonwebtoken");

const Success = (message, token, data) => {
  return {
    success: true,
    message,
    token,
    data: { ...data },
  };
};

const AppError = (type,message) => {
  return ({
    success: false,
    error:{
        type,
        message
    },
  });
};


const jwtSigner = (id,email)=>{
    const token =  jwt.sign({id,email},process.env.SALT);
    return token;
}
module.exports = { Success, AppError, jwtSigner };
