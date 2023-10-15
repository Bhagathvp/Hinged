const express =require ("express")
const chatRouter= express.Router();

const userModel = require('../models/userModel')
const vendorModel = require('../models/vendorModel')
const chatModel =require( '../models/chatModel.js')
const matchModel =require('../models/matchesModel.js')

const { jwtAuth } = require('../middleware/jwtAuth.js')

const {
  addMessage,
  getMessage,
  getLastMessage,
  readmessage,
  matchedUsers,
  createMatch
}
 = require ("../controllers/chatController.js")

const {
  addNewMsg,
  getAllChats,
  getLatestMessage,
  markChatAsRead
} = require("../interactors/ChatInteractor.js") 

const{
    getMatchedUsers,
    addMatch
} =require('../interactors/MatchesInteractor')

chatRouter.use(jwtAuth)

chatRouter.post("/addmsg", addMessage(chatModel, addNewMsg));

chatRouter.post("/getmsg", getMessage(chatModel, getAllChats));

chatRouter.post("/lastmsg", getLastMessage(chatModel, getLatestMessage));

chatRouter.post("/markRead", readmessage(chatModel, markChatAsRead));

chatRouter.post("/matches",  matchedUsers(getMatchedUsers, matchModel, userModel,vendorModel));

chatRouter.put("/createMatch", createMatch(matchModel,addMatch))


module.exports = chatRouter;