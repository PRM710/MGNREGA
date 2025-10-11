import mongoose from "mongoose";
import fs from "fs";
import csv from "fast-csv";
import dotenv from "dotenv";
import MgnregaMonthly from "../models/MgnregaMonthly.js";

dotenv.config();

// Pass file path dynamically, e.g. node src/seed/seedMgnregaCsv.js maha
const stateArg = process.argv[2] || "up";
const filePath = `./data/${stateArg}_mgnrega_data.csv`;

async function seedMgnrega() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`✅ Connected to MongoDB (${stateArg.toUpperCase()} dataset)`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  const records = [];
  const stream = fs.createReadStream(filePath).pipe(csv.parse({ headers: true }));

  for await (const row of stream) {
    const district = row["district_name"]?.trim();
    const month = row["month"]?.trim();
    const fin_year = row["fin_year"]?.trim();
    const state = row["state_name"]?.trim();

    if (!district || !month || !state) continue;

    const district_id = `${state.replace(/\s+/g, "_")}-${district
      .replace(/\s+/g, "_")
      .toUpperCase()}`;

    const year_month = `${fin_year?.split("-")[1] || "2025"}-${month}`;

    records.push({
      district_id,
      year_month,
      workdays: Number(row["Average_days_of_employment_provided_per_Household"]) || 0,
      households: Number(row["Total_Households_Worked"]) || 0,
      wages: Number(row["Wages"]) || 0,
      raw: row,
      fetched_at: new Date(),
    });
  }

  console.log(`Parsed ${records.length} total rows.`);

  // 🧠 Only clear records for this state, not all
  await MgnregaMonthly.deleteMany({
    district_id: { $regex: new RegExp(`^${stateArg.replace(/_/g, " ")}`, "i") },
  });
  console.log(`🧹 Cleared old records for ${stateArg.toUpperCase()}`);

  const uniqueRecords = [
    ...new Map(records.map((r) => [`${r.district_id}-${r.year_month}`, r])).values(),
  ];

  await MgnregaMonthly.insertMany(uniqueRecords, { ordered: false }).catch(() => {});
  console.log(`🎉 Inserted ${uniqueRecords.length} unique records!`);

  await mongoose.disconnect();
  console.log("✅ Done!");
}

seedMgnrega().catch((err) => console.error("❌ Error seeding:", err));
