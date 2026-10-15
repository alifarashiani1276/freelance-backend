const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const CategoryModel = sequelize.define(
  "Category",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue("id");
      },
    },
    title: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    englishTitle: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      set(v) {
        this.setDataValue("description", String(v).trim().toLowerCase());
      },
    },
    type: {
      type: DataTypes.ENUM("project", "comment", "post", "ticket"),
      allowNull: false,
      defaultValue: "project",
    },
    parentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, defaultValue: null },
    iconSm: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null },
    iconLg: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null },
    icon: {
      type: DataTypes.VIRTUAL,
      get() {
        return { sm: this.getDataValue("iconSm"), lg: this.getDataValue("iconLg") };
      },
    },
  },
  { tableName: "categories" },
);

module.exports = { CategoryModel };
