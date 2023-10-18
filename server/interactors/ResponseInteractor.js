const sendSuccessResponse=(res, data)=>{
  res.header("Access-Control-Allow-Origin", "*");
  return res.status(200).json(data);
  }

const sendErrorResponse=(res, error, statusCode = 500)=>{
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(statusCode).json(error);
  }

module.exports ={
    sendErrorResponse,
    sendSuccessResponse
  }