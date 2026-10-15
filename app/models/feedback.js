const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const FeedbackModel = sequelize.define(
  "Feedback",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue("id");
      },
    },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, defaultValue: null },
    name: { type: DataTypes.STRING(100), allowNull: true },
    phoneNumber: { type: DataTypes.STRING(20), allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    adminReply: { type: DataTypes.TEXT, allowNull: true, defaultValue: null },
    repliedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    status: {
      type: DataTypes.ENUM("PENDING", "ANSWERED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
  },
  { tableName: "feedbacks" },
);

module.exports = { FeedbackModel };
