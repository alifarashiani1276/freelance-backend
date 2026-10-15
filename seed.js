// اسکریپت تست: دو پروپوزال فیک به پروژه‌ی [FAKE] اضافه می‌کند
require("dotenv").config();
const { Op } = require("sequelize");
const {
  sequelize,
  ProjectModel,
  UserModel,
  ProposalModel,
} = require("./app/models");

async function seed() {
  await sequelize.authenticate();

  const project = await ProjectModel.findOne({
    where: { title: { [Op.like]: "%[FAKE]%" } },
  });
  const freelancer = await UserModel.findOne({ where: { role: "FREELANCER" } });

  console.log("پروژه پیدا شد؟", project ? project.title : "❌ پیدا نشد");
  console.log("فریلنسر پیدا شد؟", freelancer ? freelancer.phoneNumber : "❌ پیدا نشد");

  if (!project || !freelancer) {
    throw new Error("پروژه یا فریلنسر تست پیدا نشد");
  }

  await ProposalModel.bulkCreate([
    {
      description: "پیشنهاد اول برای این پروژه، با تجربه‌ی کافی در این زمینه.",
      price: 4500000,
      duration: 10,
      userId: freelancer.id,
      projectId: project.id,
    },
    {
      description: "پیشنهاد دوم با قیمت رقابتی‌تر و زمان تحویل کوتاه‌تر.",
      price: 4000000,
      duration: 7,
      userId: freelancer.id,
      projectId: project.id,
    },
  ]);

  console.log("✅ پروپوزال‌های فیک ساخته و به پروژه وصل شدن");
  await sequelize.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
