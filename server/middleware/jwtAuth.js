const jwt = require("jsonwebtoken");

exports.jwtAuth = (req, res, next) => {
  const {Auth_token} = req.headers;
  const token = req.header("auth_token");
  console.log(req.headers)
  try {
    const id = jwt.verify(auth_token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = id;
    next();
  } catch (err) {
    
    res.status(403).json({message:err})
    throw new Error(err)
  }
};