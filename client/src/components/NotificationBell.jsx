import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications.js";

const MESSAGES = {
  appointment_booked: "New appointment booked",
  appointment_rescheduled: "An appointment was rescheduled",
  appointment_cancelled: "An appointment was cancelled",
};

export default function NotificationBell() {
  const notifications = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-black/5 transition"
        aria-label="Notifications"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-clinic-coral text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-3 z-10">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications yet.</p>
          ) : (
            notifications.map((n, i) => (
              <p key={i} className="text-sm py-1 border-b last:border-0">
                {MESSAGES[n.type] || n.type}
              </p>
            ))
          )}
        </div>
      )}
    </div>
  );
}
