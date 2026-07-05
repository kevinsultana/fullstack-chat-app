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
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      {/* ── Drawer: sidebar kiri, chat kanan ── */}
      <div className="drawer min-h-0 flex-1 lg:drawer-open">
        <input id="friends-drawer" type="checkbox" className="drawer-toggle" />

        {/* ═══ Kanan: ChatPanel ═══ */}
        <div className="drawer-content flex flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="flex shrink-0 items-center justify-between border-b border-base-300/60 bg-base-100/70 px-4 py-3 backdrop-blur lg:hidden">
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

          {/* Chat or empty state */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {activeUser ? (
              <ChatPanel
                messages={displayMessages}
                onSend={handleSend}
                isLoading={isLoadingMessages}
                activeUser={activeUser}
              />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 bg-base-100/60 p-10 text-center">
                <div className="rounded-full bg-primary/10 p-6 text-primary">
                  <MessageSquarePlus size={44} />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-2xl font-semibold text-base-content">
                    Welcome, {authUser?.fullName?.split(" ")[0] || "Friend"}
                  </h2>
                  <p className="max-w-sm text-sm leading-relaxed text-base-content/60">
                    Select a friend from the sidebar to start chatting, or
                    discover new people to connect with.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ Kiri: Sidebar ═══ */}
        <div className="drawer-side z-40">
          <label
            htmlFor="friends-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          />
          <div className="flex min-h-0 w-80 max-w-full flex-col overflow-hidden border-r border-base-300/60 bg-base-100/80">
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
