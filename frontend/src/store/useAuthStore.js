import { create } from "zustand";
import { baseURL } from "../api/BaseUrl";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true, // Set true di awal
  socket: null,
  onlineUsers: [],
  notifications: [],

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await baseURL.get("/auth/me");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Failed to verify session:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
      await baseURL.post("/auth/logout");
      get().disconnectSocket();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      set({ authUser: null, notifications: [], onlineUsers: [] });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const res = await baseURL.post("/auth/login", formData);
      set({ authUser: res.data.data }); // Sesuaikan dengan struktur data dari backend
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
      set({ authUser: res.data.data }); // Sesuaikan dengan struktur data dari backend
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
      set({ authUser: res.data.data }); // Sesuaikan dengan struktur data dari backend
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
    const { authUser, socket } = get();
    if (!authUser || (socket && socket.connected)) return;

    const socketURL =
      import.meta.env.MODE === "production"
        ? "https://fullstack-chat-app-nbmd.onrender.com"
        : "http://localhost:5000";

    const newSocket = io(socketURL, {
      query: { userId: authUser._id },
    });

    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    newSocket.on("new_notification", (newNotification) => {
      set((state) => ({
        notifications: [newNotification, ...state.notifications],
      }));
      // Optional: Tampilkan toast notifikasi
      toast.success("You have a new notification!");
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },

  fetchNotifications: async () => {
    try {
      const res = await baseURL.get("/notifications");
      set({ notifications: res.data });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  },

  markNotificationsAsRead: async () => {
    const unreadNotifications = get().notifications.some((n) => !n.read);
    if (!unreadNotifications) return;

    try {
      await baseURL.post("/notifications/mark-read");
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }));
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  },
}));
