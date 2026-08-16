import { Link } from "react-router-dom";
import NotificationBell from "../components/NotificationBell.jsx";

export default function DoctorDashboard() {
  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-clinic-tealDark">Doctor Dashboard</h1>
        <NotificationBell />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-medium mb-2">Today's Schedule</h2>
          <p className="text-sm text-gray-500">Set your availability via the doctor profile API; booked appointments notify you live here.</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-medium mb-2">Patient Risk Insights</h2>
          <p className="text-sm text-gray-500">Disease-risk model surfaces here (Week 4 ML service).</p>
        </div>
        <Link to="/records" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
          <h2 className="font-medium mb-2">Patient Records</h2>
          <p className="text-sm text-gray-500">View uploaded records for your patients.</p>
        </Link>
      </div>
    </div>
  );
}
