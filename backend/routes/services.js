import { Router } from "express";
import { getDb, queryAll, queryGet, runSql } from "../db/init.js";
import { validateTelegramWebAppData, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  await getDb();
  const services = queryAll("SELECT * FROM services ORDER BY created_at DESC");
  res.json(services);
});

router.get("/:id", async (req, res) => {
  await getDb();
  const service = queryGet("SELECT * FROM services WHERE id = ?", [req.params.id]);
  if (!service) return res.status(404).json({ error: "Service not found" });
  res.json(service);
});

router.post("/", validateTelegramWebAppData, requireAdmin, async (req, res) => {
  await getDb();
  const { name, description, price, category, image_url } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: "Name and price are required" });
  }
  const info = runSql(
    "INSERT INTO services (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)",
    [name, description || "", price, category || "", image_url || ""]
  );
  const service = queryGet("SELECT * FROM services WHERE id = ?", [info.lastInsertRowid]);
  res.status(201).json(service);
});

router.put("/:id", validateTelegramWebAppData, requireAdmin, async (req, res) => {
  await getDb();
  const { name, description, price, category, image_url } = req.body;
  const existing = queryGet("SELECT * FROM services WHERE id = ?", [req.params.id]);
  if (!existing) return res.status(404).json({ error: "Service not found" });

  runSql(
    "UPDATE services SET name=?, description=?, price=?, category=?, image_url=? WHERE id=?",
    [
      name || existing.name,
      description ?? existing.description,
      price ?? existing.price,
      category ?? existing.category,
      image_url ?? existing.image_url,
      req.params.id,
    ]
  );
  const updated = queryGet("SELECT * FROM services WHERE id = ?", [req.params.id]);
  res.json(updated);
});

router.delete("/:id", validateTelegramWebAppData, requireAdmin, async (req, res) => {
  await getDb();
  const existing = queryGet("SELECT * FROM services WHERE id = ?", [req.params.id]);
  if (!existing) return res.status(404).json({ error: "Service not found" });
  runSql("DELETE FROM services WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

router.post("/:id/order", validateTelegramWebAppData, async (req, res) => {
  await getDb();
  const service = queryGet("SELECT * FROM services WHERE id = ?", [req.params.id]);
  if (!service) return res.status(404).json({ error: "Service not found" });

  const user = req.user;
  const info = runSql(
    "INSERT INTO orders (user_id, username, service_id, service_name) VALUES (?, ?, ?, ?)",
    [user.id, user.username || "", service.id, service.name]
  );
  const order = queryGet("SELECT * FROM orders WHERE id = ?", [info.lastInsertRowid]);
  res.status(201).json(order);
});

export default router;
