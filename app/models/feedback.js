const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: { type: String },
    phoneNumber: { type: String },
    message: { type: String, required: true },
    adminReply: { type: String, default: null },
    repliedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["PENDING", "ANSWERED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = {
  FeedbackModel: mongoose.model("Feedback", FeedbackSchema),
};