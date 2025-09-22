import React from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function UserList({
  users,
  activeUser,
  onSelectUser,
  isLoading,
}) {
  const { onlineUsers } = useAuthStore();

  return (
    <div className="h-full w-64 border-r overflow-y-auto">
      <h2 className="p-4 font-bold text-lg border-b">Users</h2>
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      ) : (
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              className={`p-4 cursor-pointer  hover:bg-blue-100  transition ${
                activeUser?._id === user._id
                  ? "bg-gray-200 dark:text-black"
                  : ""
              }`}
              onClick={() => onSelectUser(user)}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    src={
                      user.profilePic ||
                      "https://ui-avatars.com/api/?name=" + user.fullName
                    }
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {onlineUsers.includes(user._id) && (
                    <div className="absolute bottom-0 right-0 border-2 border-white w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
                <span>{user.fullName}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
