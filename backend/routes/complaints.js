import { Router } from "express";
import { getDb, queryAll, queryGet, runSql } from "../db/init.js";
import { validateTelegramWebAppData, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", validateTelegramWebAppData, requireAdmin, async (req, res) => {
  await getDb();
  const complaints = queryAll("SELECT * FROM complaints ORDER BY created_at DESC");
  res.json(complaints);
});

router.post("/", validateTelegramWebAppData, async (req, res) => {
  await getDb();
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Complaint text is required" });
  }
  const user = req.user;
  const info = runSql(
    "INSERT INTO complaints (user_id, username, text) VALUES (?, ?, ?)",
    [user.id, user.username || "", text]
  );
  const complaint = queryGet("SELECT * FROM complaints WHERE id = ?", [info.lastInsertRowid]);
  res.status(201).json(complaint);
});

router.delete("/:id", validateTelegramWebAppData, requireAdmin, async (req, res) => {
  await getDb();
  const existing = queryGet("SELECT * FROM complaints WHERE id = ?", [req.params.id]);
  if (!existing) return res.status(404).json({ error: "Complaint not found" });
  runSql("DELETE FROM complaints WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

router.patch("/:id/resolve", validateTelegramWebAppData, requireAdmin, async (req, res) => {
  await getDb();
  const existing = queryGet("SELECT * FROM complaints WHERE id = ?", [req.params.id]);
  if (!existing) return res.status(404).json({ error: "Complaint not found" });
  runSql("UPDATE complaints SET status = 'resolved' WHERE id = ?", [req.params.id]);
  const updated = queryGet("SELECT * FROM complaints WHERE id = ?", [req.params.id]);
  res.json(updated);
});

export default router;
