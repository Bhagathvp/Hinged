const mongoose =require("mongoose") 

const matchesSchema = new mongoose.Schema(
  {
    user1: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
    user2: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendor",
      },
    },
    read: {
      type: Boolean,
      default: false,
    },
    isMatched: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Matches", matchesSchema);

