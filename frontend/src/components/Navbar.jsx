import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const DistrictSummary = ({ summary }) => {
  const { summary: latest, trend } = summary;

  return (
    <div className="p-6 bg-gray-50 rounded-2xl shadow-inner mt-4">
      <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
        {latest.district_id.replace("Uttar_Pradesh-", "").replaceAll("_", " ")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-xl text-center shadow">
          <p className="text-gray-700 text-sm">Households Worked</p>
          <p className="text-2xl font-bold text-blue-700">
            {latest.households.toLocaleString()}
          </p>
        </div>

        <div className="bg-green-100 p-4 rounded-xl text-center shadow">
          <p className="text-gray-700 text-sm">Avg Workdays</p>
          <p className="text-2xl font-bold text-green-700">{latest.workdays}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded-xl text-center shadow">
          <p className="text-gray-700 text-sm">Total Wages (₹ lakh)</p>
          <p className="text-2xl font-bold text-yellow-700">
            {(latest.wages / 100000).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Monthly Trend (Last 12 months)
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year_month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="households"
              stroke="#3b82f6"
              name="Households"
            />
            <Line type="monotone" dataKey="wages" stroke="#22c55e" name="Wages" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DistrictSummary;
