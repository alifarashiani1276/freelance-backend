const expressAsyncHandler = require("express-async-handler");
const {
  FeedbackController,
} = require("../../http/controllers/admin/feedback.controller");

const router = require("express").Router();

router.get("/list", expressAsyncHandler(FeedbackController.getAllFeedbacks));
router.patch(
  "/reply/:feedbackId",
  expressAsyncHandler(FeedbackController.replyToFeedback),
);

module.exports = {
  feedbackAdminRoutes: router,
};
