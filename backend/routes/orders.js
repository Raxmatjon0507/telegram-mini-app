import { Router } from "express";
import { getDb, queryAll, queryGet, runSql } from "../db/init.js";
import { validateTelegramWebAppData, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", validateTelegramWebAppData, requireAdmin, async (req, res) => {
  await getDb();
  const orders = queryAll("SELECT * FROM orders ORDER BY created_at DESC");
  res.json(orders);
});

router.get("/my", validateTelegramWebAppData, async (req, res) => {
  await getDb();
  const orders = queryAll("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [
    req.user.id,
  ]);
  res.json(orders);
});

router.patch("/:id/status", validateTelegramWebAppData, requireAdmin, async (req, res) => {
  await getDb();
  const { status } = req.body;
  const existing = queryGet("SELECT * FROM orders WHERE id = ?", [req.params.id]);
  if (!existing) return res.status(404).json({ error: "Order not found" });
  runSql("UPDATE orders SET status = ? WHERE id = ?", [status || "new", req.params.id]);
  const updated = queryGet("SELECT * FROM orders WHERE id = ?", [req.params.id]);
  res.json(updated);
});

router.delete("/:id", validateTelegramWebAppData, requireAdmin, async (req, res) => {
  await getDb();
  const existing = queryGet("SELECT * FROM orders WHERE id = ?", [req.params.id]);
  if (!existing) return res.status(404).json({ error: "Order not found" });
  runSql("DELETE FROM orders WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

export default router;
