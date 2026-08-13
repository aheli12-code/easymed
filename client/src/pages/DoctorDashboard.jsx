export default function DoctorDashboard() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold text-clinic-tealDark mb-4">Doctor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-medium mb-2">Today's Schedule</h2>
          <p className="text-sm text-gray-500">Availability + booking APIs land in Week 2–3.</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-medium mb-2">Patient Risk Insights</h2>
          <p className="text-sm text-gray-500">Disease-risk model surfaces here (Week 4 ML service).</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-medium mb-2">Telemedicine</h2>
          <p className="text-sm text-gray-500">WebRTC video consults land in Week 5.</p>
        </div>
      </div>
    </div>
  );
}
