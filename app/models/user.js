const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const UserModel = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    // سازگاری با فرانت: همان فیلد _id قبلی مونگو
    _id: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue("id");
      },
    },
    name: { type: DataTypes.STRING(100), allowNull: true },
    avatar: { type: DataTypes.STRING(255), allowNull: true },
    biography: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      unique: true,
      set(v) {
        this.setDataValue("email", v ? String(v).trim().toLowerCase() : null);
      },
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      set(v) {
        this.setDataValue("phoneNumber", v ? String(v).trim() : null);
      },
    },
    password: { type: DataTypes.STRING(255), allowNull: true },
    otpCode: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    otpExpiresIn: { type: DataTypes.DATE, allowNull: true },
    resetLink: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null },
    isVerifiedPhoneNumber: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    status: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 }, // 0, 1, 2
    role: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "OWNER" },
    avatarUrl: {
      type: DataTypes.VIRTUAL,
      get() {
        const avatar = this.getDataValue("avatar");
        if (avatar) return `${process.env.SERVER_URL}/${avatar}`;
        return null;
      },
    },
  },
  { tableName: "users" },
);

// هیچ‌وقت password / otp / avatar خام در پاسخ API نمی‌رود
UserModel.prototype.toJSON = function () {
  const obj = { ...this.get({ plain: true }) };
  delete obj.password;
  delete obj.avatar;
  delete obj.otpCode;
  delete obj.otpExpiresIn;
  delete obj.resetLink;
  return obj;
};

module.exports = { UserModel };
