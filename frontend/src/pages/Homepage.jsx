import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import UserList from "../components/UserList";
import ChatPanel from "../components/ChatPanel";

export default function Homepage() {
  const { authUser } = useAuthStore();
  const {
    users,
    isLoadingUsers,
    fetchUsers,
    activeUser,
    setActiveUser,
    clearActiveUser,
    messages,
    isLoadingMessages,
    fetchMessages,
    sendMessage,
  } = useChatStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (activeUser) {
      fetchMessages(activeUser._id);
    }
  }, [activeUser, fetchMessages]);

  // Mark messages as mine if senderId === authUser._id
  const displayMessages = messages.map((msg) => ({
    ...msg,
    isMine: msg.senderId === authUser?._id,
  }));

  const handleSend = async ({ text, image }) => {
    let imageData = null;
    if (image) {
      // Convert image file to base64
      imageData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });
    }
    sendMessage(activeUser._id, { text, image: imageData });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-gray-900">
      <UserList
        users={users}
        activeUser={activeUser}
        onSelectUser={setActiveUser}
        isLoading={isLoadingUsers}
      />
      <div className="flex-1 h-full">
        <ChatPanel
          messages={displayMessages}
          onSend={handleSend}
          isLoading={isLoadingMessages}
          activeUser={activeUser}
        />
      </div>
    </div>
  );
}
