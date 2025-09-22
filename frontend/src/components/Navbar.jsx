import React, { useEffect, useState } from "react";
import { Sun, Moon, Bell, UserPlus, LogOut, UserRound } from "lucide-react";
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
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "kevinchat"
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (authUser) {
      fetchNotifications();
    }
  }, [authUser, fetchNotifications]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "kevinchat" ? "dark" : "kevinchat"));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="navbar fixed top-0 z-30 border-b border-base-300/60 bg-base-100/80 backdrop-blur">
      <div className="flex-1">
        <button
          onClick={() => navigate("/")}
          className="btn btn-ghost px-2 text-left normal-case"
        >
          <span className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Kevin Chats
            </span>
          </span>
          <span className="block text-xs font-medium text-base-content/60">
            Connect, collaborate, and converse in style
          </span>
        </button>
      </div>
      <div className="flex-none items-center gap-1 sm:gap-2">
        {authUser ? (
          <>
            <button
              title="Find friends"
              onClick={() => navigate("/find-friends")}
              className="btn btn-sm btn-primary hidden lg:inline-flex"
            >
              <UserPlus className="h-4 w-4" />
              <span>Find friends</span>
            </button>
            <button
              title="Find friends"
              onClick={() => navigate("/find-friends")}
              className="btn btn-ghost btn-circle lg:hidden"
            >
              <UserPlus className="h-5 w-5" />
            </button>

            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
                onClick={markNotificationsAsRead}
              >
                <div className="indicator">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="badge badge-secondary badge-sm indicator-item">
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
                <div className="w-11 rounded-full border border-primary/20 bg-base-100 shadow-inner">
                  <img
                    alt="User profile"
                    src={
                      authUser.profilePic ||
                      `https://ui-avatars.com/api/?name=${authUser.fullName}`
                    }
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 w-56 gap-1 rounded-box border border-base-300/60 bg-base-100 p-3 shadow-lg"
              >
                <li className="menu-title text-xs uppercase text-base-content/60">
                  Signed in as
                  <span className="font-semibold text-base-content">
                    {authUser.fullName}
                  </span>
                </li>
                <li>
                  <button onClick={() => navigate("/profile")}>
                    <UserRound className="h-4 w-4" />
                    Profile
                  </button>
                </li>
                <li>
                  <button onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/login")}
          >
            Get started
          </button>
        )}

        <label className="btn btn-ghost btn-circle swap swap-rotate">
          <input
            type="checkbox"
            onChange={toggleTheme}
            checked={theme === "dark"}
            aria-label="Toggle theme"
          />
          <Sun className="swap-on h-5 w-5" />
          <Moon className="swap-off h-5 w-5" />
        </label>
      </div>
    </div>
  );
}
