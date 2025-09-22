import React, { useEffect, useState } from "react";
import { Sun, Moon, Bell, UserPlus } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar() {
  const {
    authUser,
    logout,
    notifications,
    fetchNotifications,
    markNotificationsAsRead,
  } = useAuthStore();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (authUser) {
      fetchNotifications();
    }
  }, [authUser]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-30">
      <div className="flex-1">
        <a onClick={() => navigate("/")} className="btn btn-ghost text-xl">
          Kevin Chats
        </a>
      </div>
      <div className="flex-none gap-2">
        {authUser ? (
          <>
            <button
              title="Find Friends"
              onClick={() => navigate("/find-friends")}
              className="btn btn-ghost btn-circle"
            >
              <UserPlus />
            </button>

            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
                onClick={markNotificationsAsRead}
              >
                <div className="indicator">
                  <Bell />
                  {unreadCount > 0 && (
                    <span className="badge badge-sm badge-secondary indicator-item">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </button>
              <NotificationDropdown />
            </div>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    alt="User Profile"
                    src={
                      authUser.profilePic ||
                      `https://ui-avatars.com/api/?name=${authUser.fullName}`
                    }
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a onClick={() => navigate("/profile")}>Profile</a>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <button className="btn btn-ghost" onClick={() => navigate("/login")}>
            Login
          </button>
        )}

        <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </div>
  );
}
