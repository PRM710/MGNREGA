import mongoose from 'mongoose';
import fs from 'fs';
import * as turf from '@turf/turf'; // ✅ Correct import
import dotenv from 'dotenv';
import District from '../models/District.js';

dotenv.config();

const filePath = './data/india_districts.geojson';

async function seedDistricts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Read and parse the GeoJSON file
    const raw = fs.readFileSync(filePath);
    const data = JSON.parse(raw);

    if (!data.features || data.features.length === 0) {
      console.error('❌ No features found in GeoJSON file');
      process.exit(1);
    }

    let count = 0;
    for (const feature of data.features) {
      const stateName =
        feature.properties?.ST_NM ||
        feature.properties?.STATE ||
        feature.properties?.state_name ||
        'Unknown State';

      const districtName =
        feature.properties?.DISTRICT ||
        feature.properties?.DIST_NAME ||
        feature.properties?.district ||
        'Unknown District';

      const districtId = `${stateName.replace(/\s+/g, '_')}-${districtName.replace(/\s+/g, '_')}`;
      const centroid = turf.centroid(feature);

      await District.updateOne(
        { district_id: districtId },
        {
          $set: {
            district_id: districtId,
            state_name: stateName,
            district_name: districtName,
            polygon: feature.geometry,
            centroid: centroid.geometry,
          },
        },
        { upsert: true }
      );

      count++;
      if (count % 50 === 0) console.log(`Inserted ${count} districts...`);
    }

    console.log(`🎉 Successfully seeded ${count} districts!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedDistricts();
