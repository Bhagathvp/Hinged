const { Server } = require ("socket.io")
const chatModel =require ("../models/chatModel.js")
const matchModel =require ("../models/matchesModel.js")
const { addNewMsg, getLatestMessage } =require ("../interactors/ChatInteractor.js")
const { isUserMatched } =require ("../interactors/MatchesInteractor.js")



const io = new Server({
  cors: {
    origin: ["https://hinged.vercel.app", "http://localhost:3000","https://hinged.live" ]
  },
  pingTimeout: 60000,
});

global.onlineUsers = new Map();


io.on("connection", (Socket) => {
  console.log("inside socketingggggg")

  global.chatSocket = Socket;
  
  Socket.on("add-user", (userId) => {
    onlineUsers.set(userId, Socket.id);
  });


  Socket.on("remove-user", (userId) => {
    if (userId) {
      onlineUsers.delete(userId);
     }
  });

  Socket.on("disconnect", () => {
    const userId = [...onlineUsers.entries()].find(([key, value]) => value === Socket.id)?.[0];
    if (userId) {
     onlineUsers.delete(userId);
    }
  });

  Socket.on("getOnlineUsers", async (user) => {
    let users = [];
    for (const [key, value] of onlineUsers.entries()) {
      if (key != user) {
        const matchedUser = await isUserMatched(user, key, matchModel);
        if (matchedUser) users.push(key);
      }
    }
      Socket.emit("onlineUsersList", users);
  });

  Socket.on("send-msg", async (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    const result = await addNewMsg(data, chatModel);

    if (sendUserSocket) {
      Socket.to(sendUserSocket).emit("msg-recieve", result);
      const body = {
        conversationIds: result.conversationId,
      };
      const newData = await getLatestMessage(body, chatModel);
      Socket.to(sendUserSocket).emit("new-msg", newData);
    }
  });

  Socket.on("typing", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      Socket.to(sendUserSocket).emit("show-typing", data.from);
    }
  });

  Socket.on("stop-typing", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      Socket.to(sendUserSocket).emit("hide-typing", data.from);
    }
  });

});

io.on("connect_error", (error) => {
  console.log("Socket connect_error:", error);
});

io.on("error", (error) => {
  console.log("Socket error:", error);
});

module.exports= io;
