const jwt = require("jsonwebtoken");

exports.jwtUser = (req, res, next) => {

  const token = req.headers.authorization.split(' ')[1];
  
  try {
    const id = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = id;
    next();
  } catch (err) {
    res.status(403).json({message:err})
    throw new Error(err)
  }
};