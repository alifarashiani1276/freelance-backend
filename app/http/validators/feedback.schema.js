const createError = require("http-errors");
const Joi = require("joi");

const addFeedbackSchema = Joi.object({
  name: Joi.string().allow("").optional(),
  phoneNumber: Joi.string().allow("").optional(),
  message: Joi.string()
    .required()
    .min(3)
    .max(1000)
    .error(createError.BadRequest("متن نظر را وارد کنید")),
});

const replyFeedbackSchema = Joi.object({
  adminReply: Joi.string()
    .required()
    .min(2)
    .max(1000)
    .error(createError.BadRequest("متن پاسخ را وارد کنید")),
});

module.exports = {
  addFeedbackSchema,
  replyFeedbackSchema,
};