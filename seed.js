const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const { ProjectModel } = require("./app/models/project");
const { UserModel } = require("./app/models/user");
const { ProposalModel } = require("./app/models/proposal");

async function seed() {
  await mongoose.connect(process.env.APP_DB);

  const project = await ProjectModel.findOne({ title: /\[FAKE\]/ });
  const freelancer = await UserModel.findOne({ role: "FREELANCER" });

  console.log("پروژه پیدا شد؟", project ? project.title : "❌ پیدا نشد");
  console.log("فریلنسر پیدا شد؟", freelancer ? freelancer.phoneNumber : "❌ پیدا نشد");

  if (!project || !freelancer) {
    throw new Error("پروژه یا فریلنسر تست پیدا نشد");
  }

  // ساخت دو تا پروپوزال (بدون هیچ اشاره‌ی مستقیمی به پروژه)
  const proposal1 = await ProposalModel.create({
    description: "پیشنهاد اول برای این پروژه، با تجربه‌ی کافی در این زمینه.",
    price: 4500000,
    duration: 10,
    user: freelancer._id,
  });

  const proposal2 = await ProposalModel.create({
    description: "پیشنهاد دوم با قیمت رقابتی‌تر و زمان تحویل کوتاه‌تر.",
    price: 4000000,
    duration: 7,
    user: freelancer._id,
  });

  // وصل کردن آیدی پروپوزال‌ها به آرایه‌ی proposals خود پروژه
  await ProjectModel.updateOne(
    { _id: project._id },
    { $push: { proposals: { $each: [proposal1._id, proposal2._id] } } }
  );

  console.log("✅ پروپوزال‌های فیک ساخته و به پروژه وصل شدن");
  await mongoose.disconnect();
}

seed().catch(console.error);