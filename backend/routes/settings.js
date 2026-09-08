import { Router } from "express";
import { getDb, queryAll, runSql } from "../db/init.js";
import { validateTelegramWebAppData, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  await getDb();
  const rows = queryAll("SELECT * FROM settings");
  const settings = {};
  rows.forEach((row) => {
    settings[row.key] = row.value;
  });
  res.json(settings);
});

router.put("/", validateTelegramWebAppData, requireAdmin, async (req, res) => {
  await getDb();
  const updates = req.body;
  for (const [key, value] of Object.entries(updates)) {
    runSql(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?",
      [key, String(value), String(value)]
    );
  }

  const rows = queryAll("SELECT * FROM settings");
  const settings = {};
  rows.forEach((row) => {
    settings[row.key] = row.value;
  });
  res.json(settings);
});

export default router;
