const jwt = require("jsonwebtoken");

exports.jwtAuth = (req, res, next) => {
  const {auth} = req.headers;
  const token = req.header("auth");
  console.log(token);

  try {
    const id = jwt.verify(auth, process.env.ACCESS_TOKEN_SECRET);
    req.userId = id;
    next();
  } catch (err) {
    
    res.status(403).json({message:err})
    throw new Error(err)
  }
};