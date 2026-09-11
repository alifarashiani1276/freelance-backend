const expressAsyncHandler = require("express-async-handler");
const {
  FeedbackController,
} = require("../http/controllers/feedback.controller");
const {
  verifyAccessToken,
  decideAuthMiddleware,
} = require("../http/middlewares/user.middleware");

const router = require("express").Router();

// ثبت نظر: هم برای مهمان و هم برای کاربر لاگین‌شده باز است.
// decideAuthMiddleware اگر کوکی لاگین موجود باشد کاربر را شناسایی می‌کند
// تا نظر به حساب او متصل شود، در غیر این صورت به‌صورت مهمان ثبت می‌شود.
router.post(
  "/add",
  decideAuthMiddleware,
  expressAsyncHandler(FeedbackController.addNewFeedback),
);

// لیست نظرات خود کاربر لاگین‌شده + پاسخ ادمین (برای بخش «نظرات من» در داشبورد)
router.get(
  "/my",
  verifyAccessToken,
  expressAsyncHandler(FeedbackController.getMyFeedbacks),
);

module.exports = {
  feedbackRoutes: router,
};
