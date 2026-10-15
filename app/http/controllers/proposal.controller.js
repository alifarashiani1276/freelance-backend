const Controller = require("./controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const createHttpError = require("http-errors");
const { addProposalSchema } = require("../validators/proposal.schema");
const { ProposalModel, ProjectModel } = require("../../models");
const { ROLES, IdPattern } = require("../../../utils/constants");

class ProposalController extends Controller {
  async addNewProposal(req, res) {
    const userId = req.user._id;
    await addProposalSchema.validateAsync(req.body);
    const { description, price, duration, projectId } = req.body;

    const project = await ProjectModel.findByPk(projectId);
    if (!project) throw createHttpError.NotFound("پروژه یافت نشد.");

    const proposal = await ProposalModel.create({
      description,
      price,
      duration,
      userId,
      projectId: project.id,
    });
    if (!proposal?._id)
      throw createHttpError.InternalServerError("پیشنهاد ثبت نشد");

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "پیشنهاد با موفقیت ایجاد شد",
      },
    });
  }
  async getListOfProposals(req, res) {
    const where = {};
    const { sort } = req.query;

    const user = req.user;
    if (user.role !== ROLES.ADMIN) {
      where.userId = user._id;
    }

    const proposals = await ProposalModel.findAll({
      where,
      order: [["createdAt", sort === "latest" ? "DESC" : "ASC"]],
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        proposals,
      },
    });
  }
  async getProposalById(req, res) {
    const { id } = req.params;
    const proposal = await this.findProposalById(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        proposal,
      },
    });
  }
  async findProposalById(id) {
    if (!IdPattern.test(String(id)))
      throw createHttpError.BadRequest("شناسه پروژه ارسال شده صحیح نمیباشد");
    const proposal = await ProposalModel.findByPk(id);
    if (!proposal) throw createHttpError.NotFound("پروژه یافت نشد.");
    return proposal;
  }
  async changeProposalStatus(req, res) {
    const { id } = req.params;
    let { status } = req.body;
    status = Number(status);

    if (![0, 1, 2].includes(status))
      throw createHttpError.BadRequest("وضعیت ارسال شده صحیح نمیباشد");

    const proposal = await this.findProposalById(id);
    await proposal.update({ status });

    // اگر پیشنهاد تایید شد (۲)، فریلنسر پروژه همین کاربر می‌شود؛ در غیر این صورت خالی
    const freelancerId = status === 2 ? proposal.userId : null;
    await ProjectModel.update(
      { freelancerId },
      { where: { id: proposal.projectId } },
    );

    let message = "وضعیت پروپوزال تایید شد";
    if (status === 0) message = "وضعیت پروپوزال به حالت رد شده تغییر یافت";
    if (status === 1)
      message = "وضعیت پروپوزال به حالت در انتظار تایید تغییر یافت";

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    });
  }
}

module.exports = {
  ProposalController: new ProposalController(),
};
