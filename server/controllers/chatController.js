const { sendErrorResponse,sendSuccessResponse } = require("../interactors/ResponseInteractor.js") ;

 const getMessage=(chatModel,getAllChats)=>async(req,res)=>{
     try {
        const messages=await getAllChats(req.body,chatModel)
        sendSuccessResponse(res,messages)
  } catch (error) {
    next(error);
  } 
}
 const addMessage=(chatModel,addNewMsg)=>async(req,res)=>{
  try {
   const data=await addNewMsg(req.body,chatModel)
    if (data) return sendSuccessResponse(res,{ msg: "Message added successfully." });
    else return sendErrorResponse(res,{ msg: "Failed to add message to the database" },400);
  } catch (error) {
    console.log(error);
  }
}

 const getLastMessage=(chatModel,getLatestMessage)=>async(req,res)=>{
    try{
        const data=await getLatestMessage(req.body,chatModel)
        sendSuccessResponse(res,data)
    }catch(err){
        console.log(err);
        sendErrorResponse(res,{ message: err })
    }
}

 const readmessage=(chatModel,markChatAsRead)=>async(req,res)=>{
  try{
      const data=await markChatAsRead(req.body.id,req.body,chatModel)
      sendSuccessResponse(res,{message:'true'})
  }catch(err){
      console.log(err);
      sendErrorResponse(res,{ message: err})
  }
}

 const matchedUsers =
  (getMatchedUsers, matchModel, userModel,vendorModel) => async (req, res) => {
    try {
      const matches = await getMatchedUsers(req.body._id, matchModel, userModel,vendorModel);
      sendSuccessResponse(res,matches)
    } catch (error) {
      sendErrorResponse(res,error,400)
    }
  };

  const createMatch = 
  (matchModel,addMatch) =>async (req,res) => {
    const {vendorId,userId} = req.body;
    try {
        const match = await addMatch(userId,vendorId,matchModel)
        sendSuccessResponse(res,match)
    } catch (error) {
        sendErrorResponse(res,error,401)
    }

  }

module.exports ={
    addMessage,
    getLastMessage,
    getMessage,
    readmessage,
    matchedUsers,
    createMatch
}