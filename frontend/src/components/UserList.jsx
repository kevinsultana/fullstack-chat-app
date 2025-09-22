import React, { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function UserList({
  users,
  activeUser,
  onSelectUser,
  isLoading,
}) {
  const { onlineUsers } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    return users.filter((user) =>
      user.fullName.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <aside className="flex h-full w-full flex-col bg-base-100/80 backdrop-blur">
      <div className="border-b border-base-300/60 p-4">
        <div className="flex items-center gap-2 text-base-content/60">
          <Users className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.3em]">
            Friends list
          </span>
        </div>
        <h2 className="mt-2 text-lg font-semibold text-base-content">
          Conversations
        </h2>
        <label className="mt-4 flex items-center gap-2 rounded-full border border-base-300/60 bg-base-200/60 px-3 py-2 focus-within:border-primary/60">
          <Search className="h-4 w-4 text-base-content/60" />
          <input
            type="text"
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

      {isLoading ? (
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-2xl bg-base-200/60 p-3"
            >
              <div className="h-10 w-10 animate-pulse rounded-full bg-base-300/70" />
              <div className="h-3 w-24 animate-pulse rounded-full bg-base-300/70" />
            </div>
          ))}
        </div>
      ) : (
        <ul className="flex-1 space-y-2 overflow-y-auto p-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const isActive = activeUser?._id === user._id;
              const isOnline = onlineUsers.includes(user._id);
              return (
                <li key={user._id}>
                  <button
                    className={`group flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-left transition ${
                      isActive
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "hover:border-base-300/80 hover:bg-base-200/80"
                    }`}
                    onClick={() => onSelectUser(user)}
                  >
                    <div className="relative">
                      <div className="avatar">
                        <div className="w-12 rounded-full border border-base-300/60">
                          <img
                            src={
                              user.profilePic ||
                              "https://ui-avatars.com/api/?name=" + user.fullName
                            }
                            alt={user.fullName}
                            className="object-cover"
                          />
                        </div>
                      </div>
                      {isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-base-100 bg-success"></span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{user.fullName}</p>
                      <p className="text-xs text-base-content/60">
                        {isOnline ? "Online now" : "Offline"}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })
          ) : (
            <li>
              <div className="rounded-2xl border border-dashed border-base-300/70 bg-base-200/40 p-6 text-center text-sm text-base-content/60">
                {searchTerm ? (
                  <>
                    <p className="font-semibold text-base-content">
                      No friends matched "{searchTerm}".
                    </p>
                    <p className="mt-1 text-xs">
                      Try a different name or clear your search.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-base-content">
                      Your friend list is waiting.
                    </p>
                    <p className="mt-1 text-xs">
                      Use the find friends button to start new conversations.
                    </p>
                  </>
                )}
              </div>
            </li>
          )}
        </ul>
      )}
    </aside>
  );
}
