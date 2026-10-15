const Controller = require("./controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { Op } = require("sequelize");
const createHttpError = require("http-errors");
const { addProjectSchema } = require("../validators/project.schema");
const {
  CategoryModel,
  ProjectModel,
  ProposalModel,
  UserModel,
} = require("../../models");
const { IdPattern } = require("../../../utils/constants");

const CATEGORY_INCLUDE = {
  model: CategoryModel,
  as: "category",
  attributes: ["id", "_id", "title", "englishTitle"],
};

function buildOrder(sort) {
  if (sort === "latest") return [["createdAt", "DESC"]];
  return [["createdAt", "ASC"]];
}

function searchCondition(search) {
  const term = `%${String(search).trim()}%`;
  return {
    [Op.or]: [
      { title: { [Op.like]: term } },
      { description: { [Op.like]: term } },
    ],
  };
}

async function categoryIdsFromQuery(category) {
  const titles = String(category).split(",");
  const categories = await CategoryModel.findAll({
    where: { englishTitle: { [Op.in]: titles } },
    attributes: ["id"],
  });
  return categories.map((c) => c.id);
}

class ProjectController extends Controller {
  async addNewProject(req, res) {
    const userId = req.user._id;
    await addProjectSchema.validateAsync(req.body);
    const { title, description, tags, category, budget, deadline } = req.body;

    const project = await ProjectModel.create({
      title,
      description,
      tags: tags || [],
      categoryId: category,
      budget,
      deadline,
      ownerId: userId,
    });

    if (!project?._id)
      throw createHttpError.InternalServerError("پروژه ثبت نشد");

    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "پروژه با موفقیت ایجاد شد",
        project,
      },
    });
  }
  async getListOfProjects(req, res) {
    const where = {};
    const { search, category, sort, status } = req.query;

    // SEARCH
    if (search) Object.assign(where, searchCondition(search));

    // STATUS
    if (["OPEN", "CLOSED"].includes(status)) where.status = status;

    // CATEGORY
    if (category && !category.includes("ALL")) {
      where.categoryId = { [Op.in]: await categoryIdsFromQuery(category) };
    }

    const projects = await ProjectModel.findAll({
      where,
      attributes: { exclude: ["ownerId", "freelancerId"] },
      include: [CATEGORY_INCLUDE],
      order: buildOrder(sort),
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        projects,
      },
    });
  }
  async getListOfOwnerProjects(req, res) {
    const user = req.user;
    const where = { ownerId: user._id };
    const { search, category, sort } = req.query;

    if (search) Object.assign(where, searchCondition(search));
    if (category) {
      where.categoryId = { [Op.in]: await categoryIdsFromQuery(category) };
    }

    const projects = await ProjectModel.findAll({
      where,
      include: [
        CATEGORY_INCLUDE,
        { model: UserModel, as: "owner", attributes: ["id", "_id", "name"] },
        { model: UserModel, as: "freelancer", attributes: ["id", "_id", "name"] },
        { model: ProposalModel, as: "proposals", attributes: ["id", "_id"] },
      ],
      order: buildOrder(sort),
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        projects,
      },
    });
  }
  async getProjectById(req, res) {
    const { id } = req.params;
    await this.findProjectById(id);
    const project = await ProjectModel.findByPk(id, {
      include: [
        CATEGORY_INCLUDE,
        {
          model: ProposalModel,
          as: "proposals",
          include: [{ model: UserModel, as: "user", attributes: ["id", "_id", "name"] }],
        },
        { model: UserModel, as: "owner", attributes: ["id", "_id", "name"] },
        { model: UserModel, as: "freelancer", attributes: ["id", "_id", "name"] },
      ],
      order: [[{ model: ProposalModel, as: "proposals" }, "createdAt", "ASC"]],
    });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        project,
      },
    });
  }
  async findProjectById(id) {
    if (!IdPattern.test(String(id)))
      throw createHttpError.BadRequest("شناسه پروژ ارسال شده صحیح نمیباشد");
    const project = await ProjectModel.findByPk(id);
    if (!project) throw createHttpError.NotFound("پروژه یافت نشد.");
    return project;
  }
  async changeProjectStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const project = await this.findProjectById(id);

    if (!["OPEN", "CLOSED"].includes(status))
      throw createHttpError.BadRequest("وضعیت ارسال شده صحیح نمیباشد");

    await project.update({ status });

    let message = "پروژه بسته شد";
    if (status === "OPEN") message = "وضعیت پروژه به حالت باز تغییر یافت";

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message,
      },
    });
  }
  async deleteProject(req, res) {
    const { id } = req.params;
    const project = await this.findProjectById(id);

    if (project.freelancerId)
      throw createHttpError.BadRequest("پروژه قابل حذف نیست");

    await project.destroy();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "پروژه با موفقیت حذف شد",
      },
    });
  }
  async updateProject(req, res) {
    const { id } = req.params;
    const project = await this.findProjectById(id);
    const { title, description, tags, deadline, category, budget } = req.body;
    await addProjectSchema.validateAsync(req.body);
    await project.update({
      title,
      description,
      tags: tags || [],
      deadline,
      categoryId: category,
      budget,
    });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روز رسانی با موفقیت انجام شد",
      },
    });
  }
}

module.exports = {
  ProjectController: new ProjectController(),
};
