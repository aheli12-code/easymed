import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { api } from "../api/client.js";

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [slots, setSlots] = useState([]);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api.get("/api/doctors").then((res) => setDoctors(res.data.doctors)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedDoctor) {
      setSlots([]);
      return;
    }
    api
      .get(`/api/appointments/doctors/${selectedDoctor}/slots`)
      .then((res) => setSlots(res.data.slots))
      .catch(console.error);
  }, [selectedDoctor]);

  const events = slots.map((s) => ({
    start: s.startsAt,
    end: s.endsAt,
    title: "Available",
    color: "#0F6E6E",
  }));

  const handleSelect = async (info) => {
    if (!selectedDoctor) return;
    setStatus(null);
    try {
      await api.post("/api/appointments", {
        doctorId: selectedDoctor,
        startsAt: info.start.toISOString(),
        endsAt: info.end.toISOString(),
        reason: reason || undefined,
      });
      setStatus({ type: "success", message: "Appointment booked!" });
      // Refresh slots so the booked one disappears
      const res = await api.get(`/api/appointments/doctors/${selectedDoctor}/slots`);
      setSlots(res.data.slots);
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Booking failed" });
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold text-clinic-tealDark mb-4">Book an Appointment</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm mb-1">Doctor</label>
          <select
            className="border rounded px-3 py-2 min-w-[220px]"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">Select a doctor</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} {d.specialization ? `— ${d.specialization}` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[220px]">
          <label className="block text-sm mb-1">Reason (optional)</label>
          <input
            className="border rounded px-3 py-2 w-full"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. follow-up checkup"
          />
        </div>
      </div>

      {status && (
        <p className={`mb-4 text-sm ${status.type === "success" ? "text-clinic-teal" : "text-clinic-coral"}`}>
          {status.message}
        </p>
      )}

      <div className="bg-white rounded-lg shadow-sm p-4">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          selectable={!!selectedDoctor}
          events={events}
          select={handleSelect}
          height="auto"
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
        />
      </div>
    </div>
  );
}
