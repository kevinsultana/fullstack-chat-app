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
    <div className="flex h-full flex-1 flex-col gap-6 px-4 pb-8">
      <div className="drawer min-h-[calc(100vh-8rem)] rounded-[2.5rem] border border-base-300/60 bg-base-100/60 backdrop-blur lg:drawer-open">
        <input id="friends-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-base-300/60 px-4 py-3 lg:hidden">
            <div>
              <h1 className="text-lg font-semibold text-base-content">
                Welcome back, {authUser?.fullName?.split(" ")[0] || "Friend"}
              </h1>
              <p className="text-xs text-base-content/60">
                Choose a friend to begin chatting.
              </p>
            </div>
            <label
              htmlFor="friends-drawer"
              className="btn btn-primary btn-sm btn-circle drawer-button"
            >
              <Menu size={18} />
            </label>
          </div>

          <div className="flex flex-1 flex-col gap-4 p-4">
            {activeUser ? (
              <ChatPanel
                messages={displayMessages}
                onSend={handleSend}
                isLoading={isLoadingMessages}
                activeUser={activeUser}
              />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 rounded-[2rem] border border-dashed border-base-300/60 bg-base-100/60 p-10 text-center text-base-content/70">
                <div className="rounded-full bg-primary/10 p-6 text-primary">
                  <MessageSquarePlus size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-base-content">
                    Welcome, {authUser?.fullName}
                  </h2>
                  <p className="max-w-md text-sm">
                    Select a friend from the list to start a conversation or head to "Find friends" to expand your circle.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="friends-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="w-80 max-w-full border-l border-base-300/60 bg-base-100/80 p-0">
            <UserList
              users={users}
              activeUser={activeUser}
              onSelectUser={setActiveUser}
              isLoading={isLoadingUsers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
