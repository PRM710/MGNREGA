import axios from "axios";

const API_BASE = "http://localhost:3000/api/v1";

export const getDistrictData = async (id, start, end) => {
  const res = await axios.get(`${API_BASE}/mgnrega/${id}`, {
    params: { start, end }
  });
  return res.data;
};
