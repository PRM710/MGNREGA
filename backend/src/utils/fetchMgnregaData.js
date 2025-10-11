import axios from "axios";
import dotenv from "dotenv";
import MgnregaMonthly from "../models/MgnregaMonthly.js";

dotenv.config();

export async function fetchMgnregaFromAPI(state, year = "2024-2025", limit = 500) {
  try {
    const url = `${process.env.DATA_GOV_API_URL}?api-key=${process.env.DATA_GOV_API_KEY}&format=json&filters[state_name]=${encodeURIComponent(
      state
    )}&filters[fin_year]=${encodeURIComponent(year)}&limit=${limit}`;

    console.log("🔗 Fetching:", url);

    const { data } = await axios.get(url);
    if (!data.records) return [];

    const records = data.records.map((row) => {
      const d = row["district_name"]?.trim();
      const s = row["state_name"]?.trim();
      const fin = row["fin_year"]?.trim();
      const month = row["month"]?.trim();

      const district_id = `${s.replace(/\s+/g, "_")}-${d
        .replace(/\s+/g, "_")
        .toUpperCase()}`;
      const year_month = `${fin?.split("-")[1]}-${month}`;

      return {
        district_id,
        year_month,
        state_name: s,
        district_name: d,
        fin_year: fin,
        ...Object.fromEntries(
          Object.entries(row).map(([k, v]) => [
            k,
            isNaN(Number(v)) ? v : Number(v)
          ])
        ),
        fetched_at: new Date()
      };
    });

    // 🧠 Bulk upsert
    for (const rec of records) {
      await MgnregaMonthly.updateOne(
        { district_id: rec.district_id, year_month: rec.year_month },
        { $set: rec },
        { upsert: true }
      );
    }

    return records;
  } catch (err) {
    console.error("❌ fetch error:", err.message);
    return [];
  }
}
