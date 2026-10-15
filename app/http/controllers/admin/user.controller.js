const createHttpError = require("http-errors");
const Controller = require("../controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { Op } = require("sequelize");
const {
  UserModel,
  ProjectModel,
  ProposalModel,
} = require("../../../models");
const { IdPattern } = require("../../../../utils/constants");

class UserController extends Controller {
  // ADMIN ROUTES :
  async getAllUsers(req, res) {
    let { page, limit, search } = req.query;
    page = Math.max(Number(page) || 1, 1);
    limit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      const term = `%${String(search).trim()}%`;
      where[Op.or] = [
        { name: { [Op.like]: term } },
        { email: { [Op.like]: term } },
        { phoneNumber: { [Op.like]: term } },
      ];
    }

    const users = await UserModel.findAll({
      where,
      attributes: { exclude: ["password", "otpCode", "otpExpiresIn"] },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        users,
      },
    });
  }
  async userProfile(req, res) {
    const { userId } = req.params;
    if (!IdPattern.test(String(userId)))
      throw createHttpError.BadRequest("شناسه کاربر صحیح نمیباشد");

    const user = await UserModel.findByPk(userId);
    if (!user) throw createHttpError.NotFound("کاربر یافت نشد");

    const createdProjects = await ProjectModel.findAll({
      where: { ownerId: userId },
    });
    const completedProjects = await ProjectModel.findAll({
      where: { freelancerId: userId },
    });
    const proposals = await ProposalModel.findAll({ where: { userId } });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        user,
        createdProjects,
        completedProjects,
        proposals,
      },
    });
  }
  async verifyUser(req, res) {
    const { userId } = req.params;
    let { status } = req.body;
    status = Number(status);

    if (![0, 1, 2].includes(status))
      throw createHttpError.BadRequest("وضعیت ارسال شده صحیح نمیباشد");
    if (!IdPattern.test(String(userId)))
      throw createHttpError.BadRequest("شناسه کاربر صحیح نمیباشد");

    const user = await UserModel.findByPk(userId);
    if (!user) throw createHttpError.NotFound("کاربر یافت نشد");
    await user.update({ status });

    let message = "وضعیت کاربر تایید شد";
    if (status === 0) message = "وضعیت کاربر به حالت رد شده تغییر یافت";
    if (status === 1)
      message = "وضعیت کاربر به حالت در انتظار تایید تغییر یافت";

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    });
  }
}

module.exports = {
  UserController: new UserController(),
};
