import { Router } from "express";
import { getDb, queryAll, queryGet, runSql } from "../db/init.js";
import { validateTelegramWebAppData, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  await getDb();
  const news = queryAll("SELECT * FROM news ORDER BY created_at DESC");
  res.json(news);
});

router.get("/:id", async (req, res) => {
  await getDb();
  const item = queryGet("SELECT * FROM news WHERE id = ?", [req.params.id]);
  if (!item) return res.status(404).json({ error: "News not found" });
  res.json(item);
});

router.post("/", validateTelegramWebAppData, requireAdmin, async (req, res) => {
  await getDb();
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  const info = runSql("INSERT INTO news (title, content) VALUES (?, ?)", [title, content]);
  const item = queryGet("SELECT * FROM news WHERE id = ?", [info.lastInsertRowid]);
  res.status(201).json(item);
});

router.put("/:id", validateTelegramWebAppData, requireAdmin, async (req, res) => {
  await getDb();
  const existing = queryGet("SELECT * FROM news WHERE id = ?", [req.params.id]);
  if (!existing) return res.status(404).json({ error: "News not found" });

  const { title, content } = req.body;
  runSql("UPDATE news SET title=?, content=? WHERE id=?", [
    title || existing.title,
    content ?? existing.content,
    req.params.id,
  ]);
  const updated = queryGet("SELECT * FROM news WHERE id = ?", [req.params.id]);
  res.json(updated);
});

router.delete("/:id", validateTelegramWebAppData, requireAdmin, async (req, res) => {
  await getDb();
  const existing = queryGet("SELECT * FROM news WHERE id = ?", [req.params.id]);
  if (!existing) return res.status(404).json({ error: "News not found" });
  runSql("DELETE FROM news WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

export default router;
