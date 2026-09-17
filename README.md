# فریلنسری | Freelancery — Backend API

> REST API for a Persian (RTL) freelancing marketplace platform, built with Node.js, Express and MongoDB.

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-18-339933?logo=node.js&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" />
  <img alt="JWT" src="https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green" />
</p>

---

## 🇬🇧 English

### Overview

This is the backend REST API for **Freelancery**, a freelancing marketplace connecting **Clients (Owners)** with **Freelancers**. It handles authentication, project & proposal management, categories, and role-based administration.

### ✨ Key Features

- 🔐 **Phone-number + OTP authentication** (via Kavenegar SMS) with JWT **access & refresh tokens**
- 👤 Role-based authorization: `OWNER`, `FREELANCER`, `ADMIN`, `USER`
- 📁 CRUD APIs for **Projects**, **Proposals** and **Categories** (with nested categories)
- 🛡 Request validation with **Joi**
- 🍪 Secure, signed cookies for session/token handling (`cookie-parser`)
- 📅 Persian (Jalali) date support via `moment-jalali`
- 🧩 Centralized error handling with consistent JSON error responses

### 🛠 Tech Stack

| Category       | Technology                                                       |
| -------------- | ---------------------------------------------------------------- |
| Runtime        | Node.js                                                          |
| Framework      | Express 4                                                        |
| Database / ODM | MongoDB + Mongoose                                               |
| Authentication | JWT (access + refresh tokens), OTP via Kavenegar                 |
| Validation     | Joi                                                              |
| Utilities      | http-errors, http-status-codes, express-async-handler, auto-bind |

### 📦 Prerequisites

- [Node.js](https://nodejs.org/) v18 or newer
- A running **MongoDB** instance (local or Atlas)
- A [Kavenegar](https://kavenegar.com/) account & API key (for sending OTP SMS)

### 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/freelancery-backend.git
cd freelancery-backend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env      # if you don't have one yet, create it manually (see table below)

# 4. Run the development server (auto-restarts with nodemon)
npm run dev

# or run it in production mode
npm start
```

By default the server listens on the port defined in `PORT` (see below).

### ⚙️ Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable                   | Description                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `PORT`                     | Port the server listens on                                                            |
| `APP_DB`                   | MongoDB connection string                                                             |
| `NODE_ENV`                 | `development` \| `production`                                                         |
| `ACCESS_TOKEN_SECRET_KEY`  | Secret used to sign JWT access tokens                                                 |
| `REFRESH_TOKEN_SECRET_KEY` | Secret used to sign JWT refresh tokens                                                |
| `TOKEN_SECRET_KEY`         | Secret used for other short-lived tokens (e.g. OTP payload)                           |
| `COOKIE_PARSER_SECRET_KEY` | Secret used to sign cookies                                                           |
| `KAVENEGAR_API_KEY`        | API key for the Kavenegar SMS/OTP provider                                            |
| `IS_TESTING_MODE_OTP`      | When truthy, bypasses real SMS sending for local testing                              |
| `ALLOW_CORS_ORIGIN`        | Allowed origin for CORS (your frontend URL)                                           |
| `CLIENT_URL`               | Public URL of the frontend app                                                        |
| `SERVER_URL`               | Public URL of this API (used e.g. to build avatar URLs)                               |
| `DOMAIN`                   | Cookie domain                                                                         |
| `ZARINPAL_CALLBACK_URL`    | Callback URL for the Zarinpal payment gateway (reserved for upcoming payment feature) |

> ⚠️ Never commit your real `.env` file. Keep secrets out of version control (see `.gitignore`).

### 📜 Available Scripts

| Command       | Description                                  |
| ------------- | -------------------------------------------- |
| `npm run dev` | Start the API with **nodemon** (auto-reload) |
| `npm start`   | Start the API in production mode             |

### 🗺 API Overview

All routes are mounted under `/api`:

| Base route      | Access                            | Description                      |
| --------------- | --------------------------------- | -------------------------------- |
| `/api/user`     | Public / Authenticated            | Registration, OTP login, profile |
| `/api/category` | Public                            | List/browse categories           |
| `/api/project`  | Authenticated                     | Create/browse/manage projects    |
| `/api/proposal` | Authenticated                     | Submit/manage proposals          |
| `/api/admin`    | Authenticated + `ADMIN` role only | Platform administration          |

### 📁 Project Structure

```
app/
├── http/
│   ├── controllers/     # Route handlers (user, project, proposal, category, admin ...)
│   ├── middlewares/     # Auth (JWT) & role-based permission guards
│   └── validators/      # Joi validation schemas
├── models/               # Mongoose schemas (User, Project, Proposal, Category)
├── router/               # Express routers, grouped by resource
└── server.js             # Application bootstrap (Express app class)
utils/                    # Shared constants & helper functions
index.js                  # Entry point
```

### ☁️ Deployment

This project includes a `liara.json` config for deployment on [Liara](https://liara.ir/) (an Iranian cloud/PaaS provider). Adjust it or remove it if you deploy elsewhere (Render, Railway, VPS, etc.).

### 🤝 Contributing

Issues and pull requests are welcome. Please open an issue first to discuss what you would like to change.

### 📄 License

This project is licensed under the MIT License.

---

## 🇮🇷 فارسی

### معرفی پروژه

این ریپازیتوری، بک‌اند (REST API) پلتفرم **فریلنسری** است؛ یک بازار کار فریلنسری که **کارفرمایان** را به **فریلنسرها** متصل می‌کند. این سرویس مسئول احراز هویت، مدیریت پروژه‌ها و پیشنهادها، دسته‌بندی‌ها و پنل مدیریت (ادمین) است.

### ✨ ویژگی‌های کلیدی

- 🔐 احراز هویت با **شماره موبایل و کد یکبارمصرف (OTP)** از طریق **کاوه‌نگار**، همراه با JWT **access token** و **refresh token**
- 👤 مدیریت دسترسی بر اساس نقش: `OWNER`، `FREELANCER`، `ADMIN`، `USER`
- 📁 API کامل برای **پروژه‌ها**، **پیشنهادها (Proposal)** و **دسته‌بندی‌ها** (با پشتیبانی از دسته‌بندی‌های تودرتو)
- 🛡 اعتبارسنجی درخواست‌ها با **Joi**
- 🍪 مدیریت امن نشست/توکن با کوکی امضا‌شده
- 📅 پشتیبانی از تاریخ شمسی با `moment-jalali`
- 🧩 مدیریت متمرکز خطاها با پاسخ‌های JSON یکدست

### 🛠 تکنولوژی‌های استفاده‌شده

Node.js، Express 4، MongoDB + Mongoose، JWT (access/refresh token)، Kavenegar (پیامک OTP)، Joi.

### 📦 پیش‌نیازها

- Node.js نسخه ۱۸ یا بالاتر
- یک دیتابیس **MongoDB** در حال اجرا (لوکال یا Atlas)
- حساب کاربری و API Key سرویس [کاوه‌نگار](https://kavenegar.com/) برای ارسال پیامک OTP

### 🚀 راه‌اندازی پروژه

```bash
# ۱. کلون کردن ریپازیتوری
git clone https://github.com/<your-username>/freelancery-backend.git
cd freelancery-backend

# ۲. نصب وابستگی‌ها
npm install

# ۳. ساخت فایل .env (طبق جدول متغیرهای محیطی در بخش انگلیسی)

# ۴. اجرای سرور توسعه (با نودمون، ری‌استارت خودکار)
npm run dev

# یا اجرا در حالت Production
npm start
```

### ⚙️ متغیرهای محیطی

لیست کامل و توضیح هر متغیر (`PORT`, `APP_DB`, `ACCESS_TOKEN_SECRET_KEY`, `REFRESH_TOKEN_SECRET_KEY`, `TOKEN_SECRET_KEY`, `COOKIE_PARSER_SECRET_KEY`, `KAVENEGAR_API_KEY`, `IS_TESTING_MODE_OTP`, `ALLOW_CORS_ORIGIN`, `CLIENT_URL`, `SERVER_URL`, `DOMAIN`, `ZARINPAL_CALLBACK_URL`) در جدول بخش انگلیسی بالا آمده است.

> ⚠️ هرگز فایل `.env` واقعی حاوی مقادیر محرمانه را کامیت نکنید.

### 🗺 نمای کلی مسیرهای API

تمام مسیرها زیر پیشوند `/api` قرار دارند: `/api/user`، `/api/category`، `/api/project`، `/api/proposal`، `/api/admin` (فقط برای نقش ادمین).

### 📁 ساختار پروژه

پوشه‌های اصلی: `app/http/controllers`، `app/http/middlewares`، `app/http/validators`، `app/models`، `app/router`، `utils` — جزئیات کامل در بخش انگلیسی بالا آمده است.

### ☁️ دیپلوی

فایل `liara.json` برای دیپلوی روی سرویس ابری [لیارا](https://liara.ir/) آماده است؛ در صورت استفاده از سرویس دیگر می‌توانید آن را تغییر دهید یا حذف کنید.

### 📄 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.
