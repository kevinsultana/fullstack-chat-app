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
      toast.error("Failed to respond to request.");
    }
  };

  const friendRequests = notifications.filter(
    (n) => n.type === "friend_request"
  );

  return (
    <div
      tabIndex={0}
      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-72 md:w-96 text-base-content"
    >
      <h3 className="font-bold p-2">Notifications</h3>
      <ul className="max-h-80 overflow-y-auto">
        {friendRequests.length > 0 ? (
          friendRequests.map((notif) => (
            <li key={notif._id} className="p-2 rounded-lg hover:bg-base-200">
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      notif.sender.profilePic ||
                      `https://ui-avatars.com/api/?name=${notif.sender.fullName}`
                    }
                    className="w-8 h-8 rounded-full"
                    alt={notif.sender.fullName}
                  />
                  <span>{notif.message}</span>
                </div>
                <div className="flex gap-2 self-end">
                  <button
                    onClick={(e) =>
                      handleRespond(notif.sender._id, "accepted", e)
                    }
                    className="btn btn-xs btn-success"
                  >
                    Accept
                  </button>
                  <button
                    onClick={(e) =>
                      handleRespond(notif.sender._id, "declined", e)
                    }
                    className="btn btn-xs btn-error"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="p-4 text-center">No new notifications.</li>
        )}
      </ul>
    </div>
  );
}
