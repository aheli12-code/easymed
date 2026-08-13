import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const placeholderTrend = [
  { day: "Mon", appointments: 12 },
  { day: "Tue", appointments: 18 },
  { day: "Wed", appointments: 15 },
  { day: "Thu", appointments: 22 },
  { day: "Fri", appointments: 20 },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold text-clinic-tealDark mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-medium mb-4">Appointment Trend (sample data)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={placeholderTrend}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="appointments" stroke="#0F6E6E" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-2">
            Wired to real data + Prophet forecasting in Week 4/6.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-medium mb-2">User Management</h2>
          <p className="text-sm text-gray-500">Admin user-management APIs land in Week 2.</p>
        </div>
      </div>
    </div>
  );
}
