import { create } from "zustand";
import { baseURL } from "../api/BaseUrl";

export const useChatStore = create((set, get) => ({
  users: [], // State ini sekarang akan berisi daftar teman
  isLoadingUsers: false,
  messages: [],
  isLoadingMessages: false,
  activeUser: null,
  isSendingMessage: false,

  // Ganti nama fungsi ini dari fetchUsers menjadi fetchFriends
  fetchFriends: async () => {
    set({ isLoadingUsers: true });
    try {
      // Endpoint diubah untuk mengambil daftar teman
      const res = await baseURL.get("/users/friends");
      set({ users: res.data });
    } catch (error) {
      console.error("Failed to fetch friends:", error);
      set({ users: [] });
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  fetchMessages: async (userId) => {
    set({ isLoadingMessages: true, messages: [] });
    try {
      const res = await baseURL.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      set({ messages: [] });
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (userId, { text, image }) => {
    set({ isSendingMessage: true });
    try {
      const res = await baseURL.post(`/messages/send/${userId}`, {
        text,
        image,
      });
      set((state) => ({
        messages: [...state.messages, res.data.newMessage],
      }));
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      set({ isSendingMessage: false });
    }
  },

  addMessage: (newMessage) => {
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  setActiveUser: (user) => set({ activeUser: user }),
  clearActiveUser: () => set({ activeUser: null, messages: [] }),
}));
