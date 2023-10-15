 
 const userModel = require('../models/userModel')

 
 const getAllChats = async ({ from, to }, chatModel) => {
    try {
      const messages = await chatModel
        .find({
          users: {
            $all: [from, to],
          },
        })
        .sort({ updatedAt: 1 });
  
      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.message,
          messageType: msg.messageType,
        };
      });
      return projectedMessages;
    } catch (error) {
      throw new Error("failed to get chats");
    }
  };
  
 const addNewMsg = async (
    { from, to, message, messageType, conversationId },
    chatModel
  ) => {
    try {
        let data;
        const user = await userModel.findOne({_id:from})
        if(user){
            data = await chatModel.create({
            message,
            users: [from, to],
            sender: from,
            senderType: 'user',
            messageType,
            conversationId,
            });
        }else{
            data = await chatModel.create({
                message,
                users: [from, to],
                sender: from,
                senderType: 'vendor',
                messageType,
                conversationId,
                });
        }
      
      return data;
    } catch (error) {
      throw new Error("failed to add new chat");
    }
  };
  
 const getLatestMessage = async ({ conversationIds }, chatModel) => {
    try {
      let latestChats = await chatModel.find({ conversationId: { $in: conversationIds } });
      // Sort the documents in descending order by updatedAt field
      latestChats.sort((a, b) => b.updatedAt - a.updatedAt);

      // Group the documents by conversationId and select the first document as latestChat
      const groupedChats = latestChats.reduce((groups, chat) => {
        if (!groups[chat.conversationId]) {
          groups[chat.conversationId] = chat;
        }
        return groups;
      }, {});

      const result = Object.values(groupedChats);
      return result
    } catch (err) {
      console.error("Error:", err);
      throw new Error("Failed to retrieve latest messages.");
    }
  };
  
 const markChatAsRead = async (userId,{ msgId },chatModel) => {
    try {
     const marked= await chatModel.updateOne(
        { _id:msgId, sender: { $ne:userId } },
        { $set: { read: true } }
      );
  
     return marked
    } catch (error) {
      console.log(error);
      throw new Error("Failed to mark user");
    }
  };

  
  module.exports ={
    addNewMsg,
    getAllChats,
    getLatestMessage,
    markChatAsRead,

  }