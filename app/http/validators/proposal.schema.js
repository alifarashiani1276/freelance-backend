const createError = require("http-errors");
const Joi = require("joi");
const { IdPattern } = require("../../../utils/constants");

const addProposalSchema = Joi.object({
  description: Joi.string()
    .required()
    .error(createError.BadRequest("توضیحات ارسال شده صحیح نمیباشد")),
  price: Joi.number().error(
    createError.BadRequest("قیمت وارد شده صحیح نمیباشد")
  ),
  duration: Joi.number()
    .required()
    .error(createError.BadRequest(" زمان انجام پروژه را وارد کنید")),
  projectId: Joi.alternatives()
    .try(Joi.number().integer().positive(), Joi.string().regex(IdPattern))
    .required()
    .error(createError.BadRequest("شناسه پروژه وارد شده صحیح نمیباشد")),
});

module.exports = {
  addProposalSchema,
};
