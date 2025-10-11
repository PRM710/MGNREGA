import express from 'express';
import MgnregaMonthly from '../models/MgnregaMonthly.js';
const router = express.Router();

router.get('/:districtId/summary', async (req, res) => {
  const { districtId } = req.params;

  try {
    const latest = await MgnregaMonthly.findOne({ district_id: districtId }).sort({ year_month: -1 }).lean();
    if (!latest) return res.status(404).json({ error: 'No data found for this district' });

    const trend = await MgnregaMonthly.find({ district_id: districtId })
      .sort({ year_month: -1 })
      .limit(12)
      .lean();

    res.json({ summary: latest, trend: trend.reverse(), fetched_at: new Date() });
  } catch (err) {
    console.error('❌ Error in /summary:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
