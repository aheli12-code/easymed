import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/authStore.js";

let socket;

export function useNotifications() {
  const user = useAuthStore((s) => s.user);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    if (!socket) {
      socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });
    }
    socket.emit("join", user.id);

    const handler = (payload) => setNotifications((prev) => [payload, ...prev].slice(0, 20));
    socket.on("notification", handler);

    return () => socket.off("notification", handler);
  }, [user]);

  return notifications;
}
