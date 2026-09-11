const Controller = require("./controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const createHttpError = require("http-errors");
const { FeedbackModel } = require("../../models/feedback");
const { addFeedbackSchema } = require("../validators/feedback.schema");

class FeedbackController extends Controller {
  // ثبت نظر جدید؛ اگر کاربر لاگین باشد، نظر به حسابش متصل می‌شود
  async addNewFeedback(req, res) {
    await addFeedbackSchema.validateAsync(req.body);
    const { name, phoneNumber, message } = req.body;

    const feedback = await FeedbackModel.create({
      name,
      phoneNumber,
      message,
      user: req.user?._id || null,
    });

    if (!feedback?._id)
      throw createHttpError.InternalServerError("نظر ثبت نشد");

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "نظر شما با موفقیت ثبت شد، ممنون که وقت گذاشتی 🙏",
      },
    });
  }

  // لیست نظراتی که کاربر لاگین‌شده خودش ثبت کرده، به همراه پاسخ ادمین (در صورت وجود)
  async getMyFeedbacks(req, res) {
    const userId = req.user._id;

    const feedbacks = await FeedbackModel.find({ user: userId }).sort({
      createdAt: -1,
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        feedbacks,
      },
    });
  }
}

module.exports = {
  FeedbackController: new FeedbackController(),
};
