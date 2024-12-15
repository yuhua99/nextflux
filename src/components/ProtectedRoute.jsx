import { useStore } from "@nanostores/react";
import { Navigate } from "react-router-dom";
import { authState, logout } from "@/stores/authStore";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const $auth = useStore(authState);

  useEffect(() => {
    if (!$auth.serverUrl || !$auth.apiKey) {
      logout();
    }
  }, [$auth.serverUrl, $auth.apiKey]);

  if (!$auth.serverUrl || !$auth.apiKey) {
    return <Navigate to="/login" replace />;
  }

  return children;
} 