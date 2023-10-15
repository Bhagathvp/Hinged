const mongoose =require("mongoose") 

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderType", // Reference based on the senderType field
    },
    senderType: {
      type: String,
      enum: ["user", "vendor"], // Define the possible sender types
    },
    users: Array,
    messageType: {
      type: String,
      enum: ["text", "video", "audio", "image"],
    },
    message: {
      type: String,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Matches",
    },
    read: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);

