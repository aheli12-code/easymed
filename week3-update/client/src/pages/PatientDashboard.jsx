import { Link } from "react-router-dom";
import NotificationBell from "../components/NotificationBell.jsx";

export default function PatientDashboard() {
  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-clinic-tealDark">Patient Dashboard</h1>
        <NotificationBell />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/book-appointment" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
          <h2 className="font-medium mb-2">Book an Appointment</h2>
          <p className="text-sm text-gray-500">Browse doctors and available time slots.</p>
        </Link>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-medium mb-2">Symptom Checker</h2>
          <p className="text-sm text-gray-500">RAG-grounded chatbot lands in Week 5.</p>
        </div>
        <Link to="/records" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
          <h2 className="font-medium mb-2">Records</h2>
          <p className="text-sm text-gray-500">View and upload your medical records.</p>
        </Link>
      </div>
    </div>
  );
}
