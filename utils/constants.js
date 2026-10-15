module.exports = {
  // شناسه‌ها در MySQL عدد صحیح مثبت هستند (قبلاً ObjectId مونگو بود)
  IdPattern: /^[1-9]\d*$/,
  ROLES: Object.freeze({
    USER: "USER",
    ADMIN: "ADMIN",
    FREELANCER: "FREELANCER",
    OWNER: "OWNER",
  }),
};
