import { useStore } from "@nanostores/react";
import { Navigate } from "react-router-dom";
import { authState, logout } from "@/stores/authStore";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const $auth = useStore(authState);

  useEffect(() => {
    if (!$auth.serverUrl || !$auth.username || !$auth.password) {
      logout();
    }
  }, [$auth.serverUrl, $auth.username, $auth.password]);

  if (!$auth.serverUrl || !$auth.username || !$auth.password) {
    return <Navigate to="/login" replace />;
  }

  return children;
} 