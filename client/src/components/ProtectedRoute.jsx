import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, accessToken } = useAuthStore();

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
