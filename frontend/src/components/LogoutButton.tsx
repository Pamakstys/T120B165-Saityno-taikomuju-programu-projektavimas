import React from "react";
import { useAuth } from "../context/AuthContext";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <button onClick={handleLogout} className="mt-8 px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white w-full text-left">
      Logout
    </button>
  );
};

export default LogoutButton;