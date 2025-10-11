import mongoose from 'mongoose';

const DistrictSchema = new mongoose.Schema({
  district_id: { type: String, unique: true, required: true },
  district_name: String,
  state_name: String,
  centroid: { // optional, used for locate fallback
    type: { type: String },
    coordinates: []
  },
  polygon: Object // optional GeoJSON polygon
});

DistrictSchema.index({ centroid: '2dsphere' });

export default mongoose.model('District', DistrictSchema);
