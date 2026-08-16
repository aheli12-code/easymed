import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { useAuthStore } from "../store/authStore.js";

const TYPE_LABELS = {
  history: "Medical History",
  prescription: "Prescription",
  diagnostic_report: "Diagnostic Report",
};

export default function Records() {
  const user = useAuthStore((s) => s.user);
  const [records, setRecords] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("history");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);

  const patientId = user?.id; // patients view their own; doctors would pass a selected patient's id

  const loadRecords = () => {
    if (!patientId) return;
    api
      .get(`/api/records/patient/${patientId}`)
      .then((res) => setRecords(res.data.records))
      .catch(console.error);
  };

  useEffect(loadRecords, [patientId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append("patientId", patientId);
      formData.append("type", type);
      formData.append("title", title);
      if (file) formData.append("file", file);

      await api.post("/api/records", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus({ type: "success", message: "Record uploaded." });
      setTitle("");
      setFile(null);
      loadRecords();
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Upload failed" });
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold text-clinic-tealDark mb-4">Medical Records</h1>

      <form onSubmit={handleUpload} className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-3 max-w-lg">
        <h2 className="font-medium">Add a record</h2>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Title (e.g. Blood test — Jan 2026)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select className="w-full border rounded px-3 py-2" value={type} onChange={(e) => setType(e.target.value)}>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full text-sm"
        />
        <button
          type="submit"
          className="bg-clinic-teal text-white rounded px-4 py-2 font-medium hover:bg-clinic-tealDark transition"
        >
          Upload
        </button>
        {status && (
          <p className={`text-sm ${status.type === "success" ? "text-clinic-teal" : "text-clinic-coral"}`}>
            {status.message}
          </p>
        )}
      </form>

      <div className="space-y-3">
        {records.map((r) => (
          <div key={r._id} className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{r.title}</p>
              <p className="text-xs text-gray-500">{TYPE_LABELS[r.type]} · {new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
            {r.fileUrl && (
              <a
                href={`${import.meta.env.VITE_API_URL}${r.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="text-clinic-teal text-sm font-medium hover:underline"
              >
                View file
              </a>
            )}
          </div>
        ))}
        {records.length === 0 && <p className="text-sm text-gray-500">No records yet.</p>}
      </div>
    </div>
  );
}
