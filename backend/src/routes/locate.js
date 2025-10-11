import express from 'express';
import District from '../models/District.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const { lat, lon } = req.query;
  res.status(501).json({ message: "Location-based district detection not implemented yet." });
});

export default router;
