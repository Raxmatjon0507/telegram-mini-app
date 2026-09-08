import crypto from "crypto";

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = Number(process.env.ADMIN_ID);

export function validateTelegramWebAppData(req, res, next) {
  const authData = req.headers["authorization"];
  if (!authData) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const initDataStr = authData.replace("Bearer ", "");
  const urlParams = new URLSearchParams(initDataStr);
  const hash = urlParams.get("hash");
  urlParams.delete("hash");

  const dataCheckArr = [];
  for (const [key, value] of urlParams.entries()) {
    dataCheckArr.push(`${key}=${value}`);
  }
  dataCheckArr.sort();

  const dataCheckString = dataCheckArr.join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(BOT_TOKEN)
    .digest();

  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (computedHash !== hash) {
    return res.status(403).json({ error: "Invalid Telegram data" });
  }

  const userStr = urlParams.get("user");
  if (userStr) {
    try {
      req.user = JSON.parse(userStr);
    } catch {
      req.user = null;
    }
  }

  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.id !== ADMIN_ID) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

export function optionalAuth(req, res, next) {
  const authData = req.headers["authorization"];
  if (!authData) {
    return next();
  }

  const initDataStr = authData.replace("Bearer ", "");
  const urlParams = new URLSearchParams(initDataStr);
  const hash = urlParams.get("hash");
  urlParams.delete("hash");

  if (!hash) return next();

  const dataCheckArr = [];
  for (const [key, value] of urlParams.entries()) {
    dataCheckArr.push(`${key}=${value}`);
  }
  dataCheckArr.sort();

  const dataCheckString = dataCheckArr.join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(BOT_TOKEN)
    .digest();

  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (computedHash === hash) {
    const userStr = urlParams.get("user");
    if (userStr) {
      try {
        req.user = JSON.parse(userStr);
      } catch {
        req.user = null;
      }
    }
  }

  next();
}
