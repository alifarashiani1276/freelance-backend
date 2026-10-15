// ساخت اولین کاربر ادمین (فقط یک‌بار بعد از راه‌اندازی دیتابیس جدید)
// اجرا:  ADMIN_PHONE=09123456789 node seed-admin.js
require("dotenv").config();
const { sequelize, UserModel } = require("./app/models");

async function seedAdmin() {
  const phoneNumber = process.env.ADMIN_PHONE;
  if (!/^09[0-9]{9}$/.test(phoneNumber || "")) {
    throw new Error("ADMIN_PHONE را به‌صورت 09xxxxxxxxx تنظیم کنید");
  }

  await sequelize.authenticate();
  await sequelize.sync();

  const [user, created] = await UserModel.findOrCreate({
    where: { phoneNumber },
    defaults: {
      name: process.env.ADMIN_NAME || "مدیر سیستم",
      email: process.env.ADMIN_EMAIL || null,
    },
  });

  await user.update({
    role: "ADMIN",
    status: 2,
    isActive: true,
    isVerifiedPhoneNumber: true,
  });

  console.log(created ? "✅ ادمین ساخته شد:" : "✅ کاربر موجود ادمین شد:", phoneNumber);
  await sequelize.close();
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
