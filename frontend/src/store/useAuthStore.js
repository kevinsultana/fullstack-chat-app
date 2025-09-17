import { create } from "zustand";
import { baseURL } from "../api/BaseUrl";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await baseURL.get("/auth/me");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
      await baseURL.post("/auth/logout");
      // Disconnect socket on logout
      if (get().socket) {
        get().socket.disconnect();
        get().disconnectSocket();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Hapus authUser dari state setelah logout (berhasil atau gagal)
      set({ authUser: null });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const res = await baseURL.post("/auth/login", formData);
      set({ authUser: res.data });
      get().connectSocket();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed. Please try again.",
      };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signUp: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await baseURL.post("/auth/register", formData);
      set({ authUser: res.data });
      get().connectSocket();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    } finally {
      set({ isSigningUp: false });
    }
  },

  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await baseURL.put("/auth/update-profile", formData);
      set({ authUser: res.data });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      };
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io("http://localhost:5000", {
      query: { userId: authUser._id },
    });
    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },
}));
