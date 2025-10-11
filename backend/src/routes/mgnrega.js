import express from "express";
import MgnregaMonthly from "../models/MgnregaMonthly.js";
import { fetchMgnregaFromAPI } from "../utils/fetchMgnregaData.js";

const router = express.Router();

router.get("/:districtId", async (req, res) => {
  try {
    const { districtId } = req.params;
    const { start, end } = req.query;

    // allow flexible search (partial, case-insensitive)
    let records = await MgnregaMonthly.find({
      district_id: { $regex: new RegExp(districtId, "i") }
    })
      .lean();

    // If no data found, fetch via API
    if (!records.length) {
      const stateName = districtId.split("-")[0].replace(/_/g, " ");
      console.log(`⚙️ Fetching fresh data for: ${stateName}`);
      await fetchMgnregaFromAPI(stateName);

      records = await MgnregaMonthly.find({
        district_id: { $regex: new RegExp(districtId, "i") }
      }).lean();
    }

    if (!records.length)
      return res.status(404).json({ error: "No data found for this district" });

    // Optional: filter by start & end months
    if (start && end)
      records = records.filter((r) => r.year_month >= start && r.year_month <= end);

    // sort chronologically
    records.sort((a, b) => a.year_month.localeCompare(b.year_month));

    const latest = records[records.length - 1];
    res.json({ summary: latest, trend: records });
  } catch (err) {
    console.error("❌ mgnrega error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
