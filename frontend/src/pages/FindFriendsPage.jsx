import React, { useState, useEffect } from "react";
import { baseURL } from "../api/BaseUrl";
import toast from "react-hot-toast";
import { UserPlus, Search } from "lucide-react";
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
        // Filter out existing friends and requests
        const friendIds = new Set([
          ...authUser.friends,
          ...authUser.friendRequestsSent,
        ]);
        const filteredResults = res.data.filter(
          (user) => !friendIds.has(user._id)
        );
        setResults(filteredResults);
      } catch (error) {
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
      toast.error(error.response?.data?.message || "Failed to send request.");
    }
  };

  return (
    <div className="pt-8 md:pt-16 px-4">
      <div className="max-w-2xl mx-auto card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-4">Find New Friends</h1>
          <div className="form-control relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="input input-bordered w-full pr-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-base-content/50">
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Search />
              )}
            </span>
          </div>

          <div className="mt-6 space-y-3 max-h-[60vh] overflow-y-auto">
            {results.length > 0
              ? results.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-base-200 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div className="w-12 rounded-full">
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
                        <p className="font-bold">{user.fullName}</p>
                        <p className="text-sm text-base-content/60">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSendRequest(user._id)}
                      className="btn btn-sm btn-outline btn-primary"
                    >
                      <UserPlus size={16} /> Add Friend
                    </button>
                  </div>
                ))
              : query &&
                !isLoading && (
                  <p className="text-center text-base-content/60 py-4">
                    No users found.
                  </p>
                )}
          </div>
        </div>
      </div>
    </div>
  );
}
