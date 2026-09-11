const createHttpError = require("http-errors");
const Controller = require("../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { FeedbackModel } = require("../../../models/feedback");
const {
  replyFeedbackSchema,
} = require("../../validators/feedback.schema");

class FeedbackController extends Controller {
  // ADMIN ROUTES :

  // دریافت لیست همه‌ی نظرات کاربران برای پنل ادمین
  async getAllFeedbacks(req, res) {
    let { page, limit, status } = req.query;
    page = page || 1;
    limit = limit || 20;
    const skip = (page - 1) * limit;

    const databaseQuery = {};
    if (status) databaseQuery.status = status;

    const feedbacks = await FeedbackModel.find(databaseQuery)
      .populate("user", "name email phoneNumber role")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await FeedbackModel.countDocuments(databaseQuery);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        feedbacks,
        total,
      },
    });
  }

  // ثبت / ویرایش پاسخ ادمین روی یک نظر
  async replyToFeedback(req, res) {
    await replyFeedbackSchema.validateAsync(req.body);
    const { feedbackId } = req.params;
    const { adminReply } = req.body;

    const updateResult = await FeedbackModel.updateOne(
      { _id: feedbackId },
      {
        $set: {
          adminReply,
          repliedAt: new Date(),
          status: "ANSWERED",
        },
      },
    );

    if (updateResult.matchedCount === 0)
      throw createHttpError.NotFound("نظر مورد نظر یافت نشد");

    if (updateResult.modifiedCount === 0)
      throw createHttpError.InternalServerError("پاسخ ثبت نشد");

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "پاسخ شما با موفقیت ثبت شد",
      },
    });
  }
}

module.exports = {
  FeedbackController: new FeedbackController(),
};