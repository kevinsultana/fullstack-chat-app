import React, { useEffect, useRef, useState } from "react";
import { X, Paperclip, Send } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function ChatPanel({ messages, onSend, isLoading, activeUser }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { authUser, onlineUsers } = useAuthStore();
  const isRecipientOnline = activeUser
    ? onlineUsers.includes(activeUser._id)
    : false;
  const activeUserAvatar = activeUser
    ? activeUser.profilePic ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        activeUser.fullName
      )}`
    : "https://ui-avatars.com/api/?name=Friend";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setText("");
    setImage(null);
    setImagePreview(null);
  }, [activeUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text && !image) return;
    onSend({ text, image });
    setText("");
    removeImage();
  };

  const renderTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-3xl border border-base-300/60 bg-base-100/70 backdrop-blur">
      <header className="flex items-center gap-3 border-b border-base-300/60 bg-gradient-to-r from-base-100/60 via-base-100 to-base-100/60 px-4 py-3">
        <div className="avatar">
          <div className="w-12 rounded-full border border-primary/20">
            <img
              src={activeUserAvatar}
              alt={activeUser?.fullName || "No user selected"}
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-semibold text-base-content">
            {activeUser?.fullName || "Select a user"}
          </span>
          {activeUser && (
            <span className="flex items-center gap-2 text-xs text-base-content/60">
              <span className={`badge badge-xs ${
                isRecipientOnline ? "badge-success" : "badge-ghost"
              }`}></span>
              {isRecipientOnline ? "Online now" : "Offline"}
            </span>
          )}
        </div>
      </header>

      <div className="relative flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,_hsl(var(--p))/6,_transparent_55%)] p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <span className="loading loading-dots loading-lg text-primary"></span>
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isMine = msg.isMine;
              return (
                <div
                  key={msg._id || `msg-${index}`}
                  className={`chat ${isMine ? "chat-end" : "chat-start"}`}
                >
                  {!isMine && (
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full border border-base-300/70">
                        <img
                          src={
                            activeUserAvatar
                          }
                          alt={activeUser?.fullName || "Friend"}
                        />
                      </div>
                    </div>
                  )}
                  {isMine && authUser && (
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full border border-primary/30">
                        <img
                          src={
                            authUser.profilePic ||
                            `https://ui-avatars.com/api/?name=${authUser.fullName}`
                          }
                          alt={authUser.fullName}
                        />
                      </div>
                    </div>
                  )}
                  <div className="chat-header text-xs text-base-content/60">
                    {isMine ? "You" : activeUser?.fullName}
                    <time className="ml-1 text-[0.65rem]">
                      {renderTimestamp(msg.createdAt)}
                    </time>
                  </div>
                  <div
                    className={`chat-bubble max-w-xs whitespace-pre-wrap break-words text-sm shadow-lg sm:max-w-md ${
                      isMine
                        ? "bg-gradient-to-r from-primary to-secondary text-primary-content"
                        : "bg-base-200/90 text-base-content"
                    }`}
                  >
                    {msg.image && (
                      <div className={`overflow-hidden rounded-xl border border-base-300/60 ${msg.text ? "mb-2" : ""}`}>
                        <img
                          src={msg.image}
                          alt="attachment"
                          className="max-h-64 w-full object-cover"
                        />
                      </div>
                    )}
                    {msg.text && <p>{msg.text}</p>}
                  </div>
                  <div className="chat-footer text-[0.65rem] text-base-content/50">
                    {isMine ? "Sent" : ""}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-base-content/60">
            <div className="rounded-full bg-primary/10 p-4 text-primary">
              💬
            </div>
            <h2 className="text-xl font-semibold text-base-content">
              Start the conversation
            </h2>
            <p className="max-w-xs text-sm">
              Share your thoughts, send photos, and keep the connection alive with your friends.
            </p>
          </div>
        )}
      </div>

      {activeUser && (
        <div className="space-y-3 border-t border-base-300/60 bg-base-100/70 p-4">
          {imagePreview && (
            <div className="flex items-center gap-3 rounded-2xl border border-base-300/60 bg-base-200/60 p-3">
              <div className="h-20 w-20 overflow-hidden rounded-xl">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                onClick={removeImage}
                className="btn btn-circle btn-ghost"
                type="button"
                title="Remove attachment"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-base-300/80 bg-base-200/60 px-3 py-2 focus-within:border-primary/60">
              <textarea
                rows={1}
                className="textarea textarea-ghost min-h-0 w-full resize-none border-0 bg-transparent p-0 text-sm focus:outline-none"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="chat-image-upload"
                ref={fileInputRef}
              />
              <label
                htmlFor="chat-image-upload"
                className="btn btn-circle btn-ghost shrink-0"
                title="Attach image"
              >
                <Paperclip size={18} />
              </label>
            </div>
            <button type="submit" className="btn btn-primary shrink-0">
              <Send size={18} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
