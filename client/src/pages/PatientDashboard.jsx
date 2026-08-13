export default function PatientDashboard() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold text-clinic-tealDark mb-4">Patient Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-medium mb-2">Upcoming Appointments</h2>
          <p className="text-sm text-gray-500">Booking engine lands in Week 3 (FullCalendar UI).</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-medium mb-2">Symptom Checker</h2>
          <p className="text-sm text-gray-500">RAG-grounded chatbot lands in Week 5.</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-medium mb-2">Records</h2>
          <p className="text-sm text-gray-500">EHR module lands in Week 3.</p>
        </div>
      </div>
    </div>
  );
}
