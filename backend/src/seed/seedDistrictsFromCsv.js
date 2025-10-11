import mongoose from "mongoose";
import fs from "fs";
import csv from "fast-csv";
import dotenv from "dotenv";
import District from "../models/District.js";

dotenv.config();

const stateArg = process.argv[2] || "up";
const filePath = `./data/${stateArg}_mgnrega_data.csv`;

async function seedDistricts() {
  console.log(`🌍 Seeding districts for ${stateArg.toUpperCase()}...`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const set = new Set();
  const stream = fs.createReadStream(filePath).pipe(csv.parse({ headers: true }));

  for await (const row of stream) {
    const district = row["district_name"]?.trim();
    const state = row["state_name"]?.trim();
    if (district && state) set.add(`${state}-${district}`);
  }

  const docs = Array.from(set).map((str) => {
    const [state_name, district_name] = str.split("-");
    return {
      state_name,
      district_name,
      district_id: `${state_name.replace(/\s+/g, "_")}-${district_name
        .replace(/\s+/g, "_")
        .toUpperCase()}`,
    };
  });

  console.log(`📊 Found ${docs.length} districts in ${stateArg.toUpperCase()} dataset.`);

  for (const doc of docs) {
    await District.updateOne(
      { district_id: doc.district_id },
      { $setOnInsert: doc },
      { upsert: true }
    );
  }

  console.log(`🎉 Upserted ${docs.length} district records (no duplicates).`);
  await mongoose.disconnect();
  console.log("✅ Done!");
}

seedDistricts().catch((err) => console.error("❌ Error seeding districts:", err));
