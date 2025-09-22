import React, { useState, useEffect } from "react";
import { baseURL } from "../api/BaseUrl";
import toast from "react-hot-toast";
import { UserPlus, Search, Sparkles } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function FindFriendsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { authUser } = useAuthStore();

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const searchUsers = async () => {
      if (debouncedQuery.trim() === "") {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await baseURL.get(`/users/find?query=${debouncedQuery}`);
        const friendIds = new Set([
          ...authUser.friends,
          ...authUser.friendRequestsSent,
        ]);
        const filteredResults = res.data.filter(
          (user) => !friendIds.has(user._id)
        );
        setResults(filteredResults);
      } catch (error) {
        console.error("Failed to search users:", error);
        toast.error("Failed to search users.");
      } finally {
        setIsLoading(false);
      }
    };

    searchUsers();
  }, [debouncedQuery, authUser]);

  const handleSendRequest = async (recipientId) => {
    try {
      await baseURL.post(`/users/send-request/${recipientId}`);
      toast.success("Friend request sent!");
      setResults(results.filter((user) => user._id !== recipientId));
    } catch (error) {
      console.error("Failed to send friend request:", error);
      toast.error(error.response?.data?.message || "Failed to send request.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-start justify-center px-4 pb-12">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-[2rem] border border-base-300/60 bg-base-100/80 p-6 shadow-xl backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-base-content/60">
                Grow your circle
              </p>
              <h1 className="mt-2 text-3xl font-bold text-base-content">
                Discover new friends
              </h1>
              <p className="mt-3 max-w-xl text-sm text-base-content/70">
                Search by name or email to connect with people in the community.
                Send a request and start a conversation instantly.
              </p>
            </div>
            <div className="hidden rounded-2xl bg-primary/10 p-4 text-primary lg:block">
              <Sparkles size={32} />
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <label className="flex items-center gap-3 rounded-2xl border border-base-300/60 bg-base-200/60 px-4 py-3 focus-within:border-primary/60">
              <Search className="h-5 w-5 text-base-content/60" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full bg-transparent text-base outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {isLoading && (
                <span className="loading loading-dots loading-sm text-primary"></span>
              )}
            </label>

            <div className="max-h-[55vh] space-y-3 overflow-y-auto pr-2">
              {results.length > 0 ? (
                results.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-base-300/60 bg-base-100/80 px-4 py-3 shadow-sm transition hover:border-primary/40 hover:bg-base-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div className="w-14 rounded-full border border-base-300/60">
                          <img
                            src={
                              user.profilePic ||
                              `https://ui-avatars.com/api/?name=${user.fullName}`
                            }
                            alt={user.fullName}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-base-content">
                          {user.fullName}
                        </p>
                        <p className="text-sm text-base-content/60">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSendRequest(user._id)}
                      className="btn btn-primary btn-sm"
                    >
                      <UserPlus size={16} />
                      Add friend
                    </button>
                  </div>
                ))
              ) : query && !isLoading ? (
                <div className="rounded-2xl border border-dashed border-base-300/60 bg-base-200/60 p-8 text-center text-sm text-base-content/60">
                  No users found. Try searching with a different keyword.
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-base-300/60 bg-base-200/60 p-8 text-center text-sm text-base-content/60">
                  Start typing to explore new connections.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[2rem] border border-base-300/60 bg-base-100/80 p-6 shadow-lg backdrop-blur">
            <h2 className="text-lg font-semibold text-base-content">
              Your progress
            </h2>
            <p className="mt-1 text-sm text-base-content/70">
              Keep an eye on how your network is growing.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                <p className="text-xs uppercase tracking-[0.3em]">Friends</p>
                <p className="mt-2 text-2xl font-bold">{authUser.friends.length}</p>
                <p className="text-xs text-primary/70">Connected</p>
              </div>
              <div className="rounded-2xl bg-secondary/10 p-4 text-secondary">
                <p className="text-xs uppercase tracking-[0.3em]">Requests</p>
                <p className="mt-2 text-2xl font-bold">
                  {authUser.friendRequestsSent.length}
                </p>
                <p className="text-xs text-secondary/70">Sent</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-dashed border-base-300/60 bg-base-100/60 p-6 text-sm text-base-content/70">
            <h3 className="text-base font-semibold text-base-content">
              Tips to stand out
            </h3>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li>Update your profile with a friendly photo.</li>
              <li>Write a short bio to let others know about you.</li>
              <li>Keep conversations active and engaging.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
