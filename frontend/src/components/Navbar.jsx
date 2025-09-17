import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";

export default function Navbar() {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Initialize theme from localStorage or default to light
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="w-full h-16 bg-blue-600 text-white flex items-center justify-between px-4">
      <h1
        className="text-lg font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Kevin Chats
      </h1>
      <div className="space-x-4">
        {authUser && (
          <>
            <button
              onClick={() => navigate("/settings")}
              className="cursor-pointer"
            >
              Settings
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="cursor-pointer"
            >
              Profile
            </button>
            <button onClick={handleLogout} className="cursor-pointer">
              Logout
            </button>
          </>
        )}

        {/* DaisyUI theme toggle */}
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
}
