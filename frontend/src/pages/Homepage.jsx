import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import UserList from "../components/UserList";
import ChatPanel from "../components/ChatPanel";
import { Menu, MessageSquarePlus } from "lucide-react";
import toast from "react-hot-toast";

export default function Homepage() {
  const { authUser, socket } = useAuthStore();
  const {
    users,
    isLoadingUsers,
    fetchFriends,
    activeUser,
    setActiveUser,
    messages,
    isLoadingMessages,
    fetchMessages,
    sendMessage,
    addMessage,
  } = useChatStore();

  useEffect(() => {
    if (authUser) {
      fetchFriends();
    }
  }, [authUser, fetchFriends]);

  useEffect(() => {
    if (activeUser) {
      fetchMessages(activeUser._id);
    }
  }, [activeUser, fetchMessages]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      if (activeUser && msg.senderId === activeUser._id) {
        addMessage(msg);
      } else {
        toast(`New message from a friend!`, {
          icon: "📬",
        });
      }
    };

    socket.on("newMessage", handleReceiveMessage);

    return () => {
      socket.off("newMessage", handleReceiveMessage);
    };
  }, [socket, activeUser, addMessage]);

  const displayMessages = messages.map((msg) => ({
    ...msg,
    isMine: msg.senderId === authUser?._id,
  }));

  const handleSend = async ({ text, image }) => {
    if (!activeUser) return;
    let imageData = null;
    if (image) {
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
    <div className="drawer max-h-[calc(100vh - 64px)] overflow-hidden md:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col h-full max-h-screen overflow-hidden">
        {/* Tombol menu untuk mobile */}
        <div className="flex items-center p-2 md:hidden bg-base-100 border-b">
          <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
            <Menu /> Friends
          </label>
        </div>

        {/* Panel Chat Utama */}
        {activeUser ? (
          <ChatPanel
            messages={displayMessages}
            onSend={handleSend}
            isLoading={isLoadingMessages}
            activeUser={activeUser}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full max-h-screen text-center p-4">
            <MessageSquarePlus size={48} className="text-base-content/30" />
            <h2 className="text-2xl font-bold mt-4">
              Welcome, {authUser?.fullName}
            </h2>
            <p className="text-base-content/60">
              Select a friend to start chatting.
            </p>
          </div>
        )}
      </div>

      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="bg-base-200 w-80 min-h-screen max-h-screen overflow-y-auto">
          <UserList
            users={users}
            activeUser={activeUser}
            onSelectUser={setActiveUser}
            isLoading={isLoadingUsers}
          />
        </div>
      </div>
    </div>
  );
}
