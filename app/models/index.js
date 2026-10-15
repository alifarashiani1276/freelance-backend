// روابط بین مدل‌ها در یک جا تعریف می‌شود (جایگزین ref/populate مونگو)
const { sequelize } = require("../config/database");
const { UserModel } = require("./user");
const { CategoryModel } = require("./category");
const { ProjectModel } = require("./project");
const { ProposalModel } = require("./proposal");
const { FeedbackModel } = require("./feedback");

CategoryModel.belongsTo(CategoryModel, { as: "parent", foreignKey: "parentId", onDelete: "CASCADE" });

ProjectModel.belongsTo(CategoryModel, { as: "category", foreignKey: "categoryId" });
ProjectModel.belongsTo(UserModel, { as: "owner", foreignKey: "ownerId" });
ProjectModel.belongsTo(UserModel, { as: "freelancer", foreignKey: "freelancerId", constraints: false });
ProjectModel.hasMany(ProposalModel, { as: "proposals", foreignKey: "projectId", onDelete: "CASCADE" });

ProposalModel.belongsTo(ProjectModel, { as: "project", foreignKey: "projectId", onDelete: "CASCADE" });
ProposalModel.belongsTo(UserModel, { as: "user", foreignKey: "userId" });

FeedbackModel.belongsTo(UserModel, { as: "user", foreignKey: "userId", constraints: false });

module.exports = {
  sequelize,
  UserModel,
  CategoryModel,
  ProjectModel,
  ProposalModel,
  FeedbackModel,
};
