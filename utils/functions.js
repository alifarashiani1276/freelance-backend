const createError = require("http-errors");
const JWT = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { UserModel } = require("../app/models/user");
const moment = require("moment-jalali");
const crypto = require("crypto");

function secretKeyGenerator() {
  return crypto.randomBytes(32).toString("hex").toUpperCase();
}

function generateRandomNumber(length) {
  if (length === 5) {
    return Math.floor(10000 + Math.random() * 90000);
  }
  if (length === 6) {
    return Math.floor(100000 + Math.random() * 900000);
  }
}

function toPersianDigits(n) {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
}

function buildAuthCookieOptions(maxAge) {
  const isProd = process.env.NODE_ENV !== "development";
  const options = {
    maxAge,
    httpOnly: true, // The cookie only accessible by the web server
    signed: true, // Indicates if the cookie should be signed
    // Frontend and backend live on different domains (e.g. karjoo-web.liara.run
    // vs karjoo-api.liara.run), so the cookie must be SameSite=None + Secure
    // to be sent on cross-site requests. "Lax" only works when both are on
    // the same site.
    sameSite: isProd ? "None" : "Lax",
    secure: isProd,
  };
  // Only set an explicit cookie `domain` if one is configured AND it's not
  // the placeholder "localhost" value used in local development. Setting a
  // `domain` that doesn't match the server's actual hostname causes browsers
  // to silently reject the cookie entirely.
  if (process.env.DOMAIN && process.env.DOMAIN !== "localhost") {
    options.domain = process.env.DOMAIN;
  }
  return options;
}

async function setAccessToken(res, user) {
  const cookieOptions = buildAuthCookieOptions(1000 * 60 * 60 * 24 * 1); // 1 day
  res.cookie(
    "accessToken",
    await generateToken(user, "1d", process.env.ACCESS_TOKEN_SECRET_KEY),
    cookieOptions,
  );
}

async function setRefreshToken(res, user) {
  const cookieOptions = buildAuthCookieOptions(1000 * 60 * 60 * 24 * 365); // 1 year
  res.cookie(
    "refreshToken",
    await generateToken(user, "1y", process.env.REFRESH_TOKEN_SECRET_KEY),
    cookieOptions,
  );
}

function generateToken(user, expiresIn, secret) {
  return new Promise((resolve, reject) => {
    const payload = {
      _id: user._id,
    };

    const options = {
      expiresIn,
    };

    JWT.sign(
      payload,
      secret || process.env.TOKEN_SECRET_KEY,
      options,
      (err, token) => {
        if (err) reject(createError.InternalServerError("خطای سروری"));
        resolve(token);
      },
    );
  });
}
function verifyRefreshToken(req) {
  const refreshToken = req.signedCookies["refreshToken"];
  if (!refreshToken) {
    throw createError.Unauthorized("لطفا وارد حساب کاربری خود شوید.");
  }
  const token = cookieParser.signedCookie(
    refreshToken,
    process.env.COOKIE_PARSER_SECRET_KEY,
  );
  return new Promise((resolve, reject) => {
    JWT.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      async (err, payload) => {
        try {
          if (err)
            reject(createError.Unauthorized("لطفا حساب کاربری خود شوید"));
          const { _id } = payload;
          const user = await UserModel.findByPk(_id, {
            attributes: ["id"],
          });
          if (!user) reject(createError.Unauthorized("حساب کاربری یافت نشد"));
          return resolve(_id);
        } catch (error) {
          reject(createError.Unauthorized("حساب کاربری یافت نشد"));
        }
      },
    );
  });
}

function copyObject(object) {
  return JSON.parse(JSON.stringify(object));
}
function deleteInvalidPropertyInObject(data = {}, blackListFields = []) {
  let nullishData = ["", " ", null, undefined];
  Object.keys(data).forEach((key) => {
    if (blackListFields.includes(key)) delete data[key];
    if (typeof data[key] == "string") data[key] = data[key].trim();
    if (Array.isArray(data[key]) && data[key].length > 0)
      data[key] = data[key].map((item) => item.trim());
    if (Array.isArray(data[key]) && data[key].length == 0) delete data[key];
    if (nullishData.includes(data[key])) delete data[key];
  });
}
function invoiceNumberGenerator() {
  return (
    moment().format("jYYYYjMMjDDHHmmssSSS") +
    String(process.hrtime()[1]).padStart(9, 0)
  );
}

module.exports = {
  generateRandomNumber,
  toPersianDigits,
  setAccessToken,
  setRefreshToken,
  verifyRefreshToken,
  buildAuthCookieOptions,
  copyObject,
  deleteInvalidPropertyInObject,
  invoiceNumberGenerator,
  secretKeyGenerator,
};
