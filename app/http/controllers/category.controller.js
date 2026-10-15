const Controller = require("./controller");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const createHttpError = require("http-errors");
const { Op } = require("sequelize");
const {
  addCategorySchema,
  updateCategorySchema,
} = require("../validators/category.shcema");
const { CategoryModel } = require("../../models");
const { IdPattern } = require("../../../utils/constants");

// فقط این فیلدها اجازه فیلتر شدن از طریق query string را دارند
const FILTERABLE_FIELDS = ["type", "englishTitle", "title", "parentId"];

class CategoryController extends Controller {
  async getListOfCategories(req, res) {
    const where = {};
    for (const key of FILTERABLE_FIELDS) {
      if (req.query[key] !== undefined) where[key] = req.query[key];
    }
    const categories = await CategoryModel.findAll({ where });

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        categories,
      },
    });
  }
  async addNewCategory(req, res) {
    const { title, englishTitle, description, type, parent } =
      await addCategorySchema.validateAsync(req.body);
    await this.findCategoryWithTitle(englishTitle);
    const category = await CategoryModel.create({
      title,
      englishTitle,
      description,
      type,
      parentId: parent ? Number(parent) : null,
    });

    if (!category) throw createHttpError.InternalServerError("خطای داخلی");
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      data: {
        message: "دسته بندی با موفقیت افزوده شد",
      },
    });
  }
  async findCategoryWithTitle(englishTitle) {
    const category = await CategoryModel.findOne({ where: { englishTitle } });
    if (category)
      throw createHttpError.BadRequest("دسته بندی با این عنوان وجود دارد.");
  }
  async checkExistCategory(id) {
    if (!IdPattern.test(String(id)))
      throw createHttpError.BadRequest("شناسه ارسال شده صحیح نمیباشد");
    const category = await CategoryModel.findByPk(id);
    if (!category)
      throw createHttpError.BadRequest("دسته بندی با این عنوان وجود ندارد.");
    return category;
  }
  async updateCategory(req, res) {
    const { id } = req.params;
    const { title, englishTitle, type, description } = req.body;
    const category = await this.checkExistCategory(id);
    await updateCategorySchema.validateAsync(req.body);
    await category.update({ title, englishTitle, type, description });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "به روز رسانی با موفقیت انجام شد",
      },
    });
  }
  async removeCategory(req, res) {
    const { id } = req.params;
    const category = await this.checkExistCategory(id);
    await CategoryModel.destroy({
      where: { [Op.or]: [{ id: category.id }, { parentId: category.id }] },
    });
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        message: "حذف دسته بندی با موفقیت انجام شد",
      },
    });
  }
  async getCategoryById(req, res) {
    const { id } = req.params;
    const category = await this.checkExistCategory(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        category,
      },
    });
  }
}

module.exports = {
  CategoryController: new CategoryController(),
};
