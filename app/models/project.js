const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ProjectModel = sequelize.define(
  "Project",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue("id");
      },
    },
    title: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM("OPEN", "CLOSED"),
      allowNull: false,
      defaultValue: "OPEN",
    },
    categoryId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    budget: {
      type: DataTypes.BIGINT,
      allowNull: false,
      get() {
        const v = this.getDataValue("budget");
        return v === null || v === undefined ? v : Number(v);
      },
    },
    // به‌صورت متن JSON ذخیره می‌شود تا روی MySQL و MariaDB هر دو یکسان کار کند
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const raw = this.getDataValue("tags");
        if (!raw) return [];
        try {
          return JSON.parse(raw);
        } catch (e) {
          return [];
        }
      },
      set(value) {
        this.setDataValue("tags", JSON.stringify(Array.isArray(value) ? value : []));
      },
    },
    deadline: { type: DataTypes.DATE, allowNull: false },
    ownerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    freelancerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, defaultValue: null },
  },
  { tableName: "projects" },
);

module.exports = { ProjectModel };
