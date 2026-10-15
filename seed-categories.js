// ساخت دسته‌بندی‌های پیش‌فرض پروژه (تکراری‌ها ساخته نمی‌شوند)
// اجرا:  npm run seed:categories
// لیست زیر را قبل از اجرا هر طور خواستید ویرایش کنید.
require("dotenv").config();
const { sequelize, CategoryModel } = require("./app/models");

const CATEGORIES = [
  { title: "برنامه‌نویسی وب", englishTitle: "web-development", description: "طراحی و توسعه وب‌سایت و وب‌اپلیکیشن" },
  { title: "برنامه‌نویسی موبایل", englishTitle: "mobile-development", description: "توسعه اپلیکیشن اندروید و iOS" },
  { title: "طراحی گرافیک", englishTitle: "graphic-design", description: "لوگو، پوستر و هویت بصری" },
  { title: "طراحی UI/UX", englishTitle: "ui-ux-design", description: "طراحی رابط و تجربه کاربری" },
  { title: "تولید محتوا", englishTitle: "content-writing", description: "نویسندگی و تولید محتوای متنی" },
  { title: "ترجمه", englishTitle: "translation", description: "ترجمه متن و مقاله" },
  { title: "دیجیتال مارکتینگ", englishTitle: "digital-marketing", description: "سئو، تبلیغات و شبکه‌های اجتماعی" },
  { title: "ویدیو و انیمیشن", englishTitle: "video-animation", description: "تدوین ویدیو و موشن گرافیک" },
];

async function seedCategories() {
  await sequelize.authenticate();
  await sequelize.sync();

  let created = 0;
  for (const item of CATEGORIES) {
    const [, isNew] = await CategoryModel.findOrCreate({
      where: { englishTitle: item.englishTitle },
      defaults: { ...item, type: "project" },
    });
    if (isNew) created++;
  }

  console.log(`✅ ${created} دسته‌بندی جدید ساخته شد (از ${CATEGORIES.length})`);
  await sequelize.close();
}

seedCategories().catch((err) => {
  console.error(err);
  process.exit(1);
});
