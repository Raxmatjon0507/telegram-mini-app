import "dotenv/config";
import express from "express";
import cors from "cors";
import { getDb } from "./db/init.js";
import servicesRouter from "./routes/services.js";
import newsRouter from "./routes/news.js";
import complaintsRouter from "./routes/complaints.js";
import ordersRouter from "./routes/orders.js";
import settingsRouter from "./routes/settings.js";

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_ID = Number(process.env.ADMIN_ID);

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  await getDb();
  res.json({ status: "ok", admin_id: ADMIN_ID });
});

app.use("/api/services", servicesRouter);
app.use("/api/news", newsRouter);
app.use("/api/complaints", complaintsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/settings", settingsRouter);

await getDb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
