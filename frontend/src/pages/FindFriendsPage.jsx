import React, { useState, useEffect, useRef } from "react";
import { baseURL } from "../api/BaseUrl";
import toast from "react-hot-toast";
import { UserPlus, Search, Users, SendHorizontal, UserCheck } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function FindFriendsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sentIds, setSentIds] = useState(new Set());
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const debouncedQuery = useDebounce(query, 400);

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
        setResults(res.data.filter((user) => !friendIds.has(user._id)));
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
    if (sentIds.has(recipientId)) return;
    try {
      await baseURL.post(`/users/send-request/${recipientId}`);
      toast.success("Friend request sent!");
      setSentIds((prev) => new Set(prev).add(recipientId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request.");
    }
  };

  const friendsCount = authUser?.friends?.length ?? 0;
  const requestsCount = authUser?.friendRequestsSent?.length ?? 0;

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-[2.5rem] border border-base-300/60 bg-base-100/80 shadow-2xl shadow-base-300/20 backdrop-blur lg:flex-row">
        {/* ── Brand panel ── */}
        <div className="flex flex-col justify-between gap-8 bg-gradient-to-br from-primary/10 via-accent/10 to-base-100/60 p-8 lg:w-[38%] lg:border-r lg:border-base-300/60">
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
              <Users size={16} /> Grow your circle
            </span>
            <h1 className="text-3xl font-bold text-base-content">
              Discover{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                new friends
              </span>
            </h1>
            <p className="text-sm leading-relaxed text-base-content/70">
              Search by name or email to find people in the community. Send a
              request and start a conversation instantly.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-primary/10 p-4 text-center">
                <p className="text-2xl font-bold text-primary">{friendsCount}</p>
                <p className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-widest text-primary/70">
                  Friends
                </p>
              </div>
              <div className="rounded-2xl bg-accent/10 p-4 text-center">
                <p className="text-2xl font-bold text-accent">{requestsCount}</p>
                <p className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-widest text-accent/70">
                  Sent
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-base-300/50 bg-base-100/50 p-4 text-sm text-base-content/70">
              <h3 className="mb-2 font-semibold text-base-content">
                Tips to stand out
              </h3>
              <ul className="space-y-1.5">
                {[
                  "Update your profile with a friendly photo.",
                  "Write a short bio to let others know about you.",
                  "Keep conversations active and engaging.",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span className="text-xs leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Search panel ── */}
        <div className="flex flex-1 flex-col p-8 lg:p-10">
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-base-content">
              Find people
            </h2>
            <p className="mt-1.5 text-sm text-base-content/60">
              Type a name or email to search the community.
            </p>
          </div>

          {/* Search input */}
          <label className="mb-6 flex items-center gap-3 rounded-2xl border border-base-300/60 bg-base-200/60 px-4 py-3.5 transition-colors focus-within:border-primary/50 focus-within:bg-base-200/80">
            <Search className="h-5 w-5 shrink-0 text-base-content/40" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by name or email..."
              className="w-full bg-transparent text-base outline-none placeholder:text-base-content/40"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {isLoading && (
              <span className="loading loading-spinner loading-sm text-primary" />
            )}
          </label>

          {/* Results */}
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {results.length > 0 ? (
              results.map((user) => {
                const alreadySent = sentIds.has(user._id);
                return (
                  <div
                    key={user._id}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-base-300/50 bg-base-100/60 px-4 py-3.5 shadow-xs transition-all hover:border-primary/40 hover:bg-base-100/80 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="avatar">
                        <div className="w-12 rounded-full ring ring-primary/10 ring-offset-2 ring-offset-base-100">
                          <img
                            src={
                              user.profilePic ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`
                            }
                            alt={user.fullName}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-base-content">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-base-content/50">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSendRequest(user._id)}
                      disabled={alreadySent}
                      className={`btn btn-sm shrink-0 transition-all ${
                        alreadySent
                          ? "btn-ghost text-base-content/40 pointer-events-none"
                          : "btn-primary"
                      }`}
                    >
                      {alreadySent ? (
                        <>
                          <SendHorizontal size={15} className="text-primary/60" />
                          Sent
                        </>
                      ) : (
                        <>
                          <UserPlus size={15} />
                          Add friend
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            ) : query && !isLoading ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="rounded-full bg-base-200/80 p-5 text-base-content/40">
                  <Search size={28} />
                </div>
                <div>
                  <p className="font-semibold text-base-content">
                    No users found
                  </p>
                  <p className="mt-1 text-sm text-base-content/50">
                    Try searching with a different name or email.
                  </p>
                </div>
              </div>
            ) : !query ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="rounded-full bg-primary/5 p-5 text-primary/40">
                  <UserCheck size={28} />
                </div>
                <div>
                  <p className="font-semibold text-base-content">
                    Looking for someone?
                  </p>
                  <p className="mt-1 text-sm text-base-content/50">
                    Start typing above to discover people in the community.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
