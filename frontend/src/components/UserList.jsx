import React from "react";

export default function UserList({
  users,
  activeUser,
  onSelectUser,
  isLoading,
}) {
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
              className={`p-4 cursor-pointer flex items-center gap-2 hover:bg-blue-100  transition ${
                activeUser?._id === user._id
                  ? "bg-gray-200 dark:text-black"
                  : ""
              }`}
              onClick={() => onSelectUser(user)}
            >
              <img
                src={
                  user.profilePic ||
                  "https://ui-avatars.com/api/?name=" + user.fullName
                }
                alt={user.fullName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{user.fullName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
