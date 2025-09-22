import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { baseURL } from "../api/BaseUrl";
import toast from "react-hot-toast";

export default function NotificationDropdown() {
  const { notifications, fetchNotifications } = useAuthStore();

  const handleRespond = async (senderId, status, event) => {
    event.stopPropagation();
    try {
      await baseURL.post("/users/respond-request", { senderId, status });
      toast.success(`Request ${status}!`);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to respond to request:", error);
      toast.error("Failed to respond to request.");
    }
  };

  const friendRequests = notifications.filter(
    (n) => n.type === "friend_request"
  );

  return (
    <div
      tabIndex={0}
      className="dropdown-content z-[1] w-80 rounded-2xl border border-base-300/60 bg-base-100/95 p-4 shadow-xl backdrop-blur md:w-96"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-base-content/60">
          Notifications
        </h3>
        <span className="badge badge-ghost badge-sm">
          {friendRequests.length} new
        </span>
      </div>
      <div className="mt-3 max-h-80 space-y-3 overflow-y-auto pr-1">
        {friendRequests.length > 0 ? (
          friendRequests.map((notif) => (
            <div
              key={notif._id}
              className="flex items-start gap-3 rounded-2xl border border-base-300/60 bg-base-200/40 p-3 transition hover:border-primary/40 hover:bg-base-200/70"
            >
              <div className="avatar">
                <div className="w-12 rounded-full border border-primary/20">
                  <img
                    src={
                      notif.sender.profilePic ||
                      `https://ui-avatars.com/api/?name=${notif.sender.fullName}`
                    }
                    className="object-cover"
                    alt={notif.sender.fullName}
                  />
                </div>
              </div>
              <div className="flex-1 text-sm">
                <p className="font-semibold text-base-content">
                  {notif.sender.fullName}
                </p>
                <p className="text-xs text-base-content/70">{notif.message}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={(e) => handleRespond(notif.sender._id, "accepted", e)}
                    className="btn btn-sm btn-primary"
                  >
                    Accept
                  </button>
                  <button
                    onClick={(e) => handleRespond(notif.sender._id, "declined", e)}
                    className="btn btn-sm btn-outline"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-base-300/60 bg-base-200/40 p-6 text-center text-sm text-base-content/60">
            <span className="text-3xl">🎉</span>
            <p>No new notifications right now. You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
