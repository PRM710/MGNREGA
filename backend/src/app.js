import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import mgnregaRouter from "./routes/mgnrega.js";
import searchRouter from "./routes/search.js"; // ✅ Added search route

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((e) => console.error("❌ DB connection error:", e));

// ✅ API Routes
app.use("/api/v1/mgnrega", mgnregaRouter);
app.use("/api/v1/search", searchRouter); // ✅ Added

// ✅ Health Check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// ✅ Export app
export default app;
