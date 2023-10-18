const sendSuccessResponse=(res, data)=>{
    res.header('Access-Control-Allow-Origin', 'https://hinged.vercel.app');
    return res.status(200).json(data);
  }

const sendErrorResponse=(res, error, statusCode = 500)=>{
    return res.status(statusCode).json(error);
  }

module.exports ={
    sendErrorResponse,
    sendSuccessResponse
  }