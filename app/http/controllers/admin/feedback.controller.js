const createHttpError = require("http-errors");
const Controller = require("../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { FeedbackModel, UserModel } = require("../../../models");
const {
  replyFeedbackSchema,
} = require("../../validators/feedback.schema");

class FeedbackController extends Controller {
  // ADMIN ROUTES :

  // دریافت لیست همه‌ی نظرات کاربران برای پنل ادمین
  async getAllFeedbacks(req, res) {
    let { page, limit, status } = req.query;
    page = Math.max(Number(page) || 1, 1);
    limit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;

    const { rows: feedbacks, count: total } = await FeedbackModel.findAndCountAll({
      where,
      include: [
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "_id", "name", "email", "phoneNumber", "role"],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

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

    const feedback = /^[1-9]\d*$/.test(String(feedbackId))
      ? await FeedbackModel.findByPk(feedbackId)
      : null;
    if (!feedback) throw createHttpError.NotFound("نظر مورد نظر یافت نشد");

    await feedback.update({
      adminReply,
      repliedAt: new Date(),
      status: "ANSWERED",
    });

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