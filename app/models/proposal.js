const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ProposalModel = sequelize.define(
  "Proposal",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue("id");
      },
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
      get() {
        const v = this.getDataValue("price");
        return v === null || v === undefined ? v : Number(v);
      },
    },
    duration: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    projectId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    status: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 }, // 0, 1, 2
  },
  { tableName: "proposals" },
);

module.exports = { ProposalModel };
