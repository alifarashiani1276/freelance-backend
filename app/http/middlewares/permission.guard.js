const createError = require("http-errors");
const { UserModel } = require("../../models/user");

function authorize(...allowedRoles) {
  return async function (req, res, next) {
    try {
      const userId = req.user._id;
      const user = await UserModel.findByPk(userId);
      if (!user) throw createError.Unauthorized("حساب کاربری یافت نشد");
      if (allowedRoles.length === 0 || allowedRoles.includes(user.role))
        return next();
      throw createError.Forbidden("شما به این قسمت دسترسی ندارید");
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  authorize,
};
