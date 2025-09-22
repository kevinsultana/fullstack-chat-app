import { create } from "zustand";
import { baseURL } from "../api/BaseUrl";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  users: [],
  isLoadingUsers: false,
  messages: [],
  isLoadingMessages: false,
  activeUser: null,
  isSendingMessage: false,

  fetchUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const res = await baseURL.get("/messages/users");
      set({ users: res.data.users });
    } catch (error) {
      console.error("Failed to fetch users:", error);
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
    if (newMessage.sender === useAuthStore.getState().authUser._id) return;
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },

  setActiveUser: (user) => set({ activeUser: user }),
  clearActiveUser: () => set({ activeUser: null }),
}));
