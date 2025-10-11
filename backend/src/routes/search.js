import express from "express";
import District from "../models/District.js";

const router = express.Router();

// 🔍 Search districts by partial name or state
router.get("/", async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q || q.length < 2) {
      return res.json([]); // no short queries
    }

    const regex = new RegExp(q, "i"); // case-insensitive partial match

    const results = await District.find({
      $or: [
        { district_name: regex },
        { state_name: regex }
      ]
    })
      .limit(20)
      .select("district_name state_name district_id -_id");

    return res.json(results);
  } catch (err) {
    console.error("❌ Search route error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
