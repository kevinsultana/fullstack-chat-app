import React, { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate, useNavigate } from "react-router";

export default function Navbar() {
  const { isDarkMode, toggleDarkMode, initializeTheme } = useThemeStore();
  const { authUser, logout } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full h-16 bg-blue-600 text-white flex items-center justify-between px-4">
      <h1 className="text-lg font-bold">Kevin Chats</h1>
      <div className="space-x-4">
        {authUser && (
          <>
            <button
              onClick={() => navigate("/settings")}
              className="cursor-pointer"
            >
              Settings
            </button>
            <button onClick={handleLogout} className="cursor-pointer">
              Logout
            </button>
          </>
        )}

        {/* dark light mode toggle */}
        <button onClick={toggleDarkMode}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
}
