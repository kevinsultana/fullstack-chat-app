import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, Paperclip, Send, ImageIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

export default function ChatPanel({ messages, onSend, isLoading, activeUser }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

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

  // Auto-resize textarea
  const adjustTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }
  }, []);

  useEffect(() => {
    adjustTextarea();
  }, [text, adjustTextarea]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB.");
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
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

  const shouldShowDateSeparator = (msg, index) => {
    if (index === 0) return true;
    const prev = messages[index - 1];
    const currDate = new Date(msg.createdAt).toDateString();
    const prevDate = new Date(prev.createdAt).toDateString();
    return currDate !== prevDate;
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-base-100/70 backdrop-blur">
      {/* ── Header (tetap di atas) ── */}
      <header className="flex shrink-0 items-center gap-3 border-b border-base-300/60 bg-base-100/80 px-5 py-3.5">
        <div className="avatar">
          <div className="w-11 rounded-full ring ring-primary/20 ring-offset-2 ring-offset-base-100">
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
            <span className="flex items-center gap-1.5 text-xs text-base-content/60">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  isRecipientOnline
                    ? "bg-success shadow-xs shadow-success"
                    : "bg-base-300"
                }`}
              />
              {isRecipientOnline ? "Online now" : "Offline"}
            </span>
          )}
        </div>
      </header>

      {/* ── Messages (scroll — ini aja yang bergerak) ── */}
      <div className="chat-scroll min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_hsl(var(--p))/7,_transparent_60%)] px-5 py-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <span className="loading loading-dots loading-lg text-primary" />
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-1">
            {messages.map((msg, index) => {
              const isMine = msg.isMine;

              return (
                <React.Fragment key={msg._id || `msg-${index}`}>
                  {/* Date separator */}
                  {shouldShowDateSeparator(msg, index) && (
                    <div className="flex items-center gap-3 py-3">
                      <div className="flex-1 border-t border-base-300/40" />
                      <span className="shrink-0 text-[0.65rem] font-medium uppercase tracking-widest text-base-content/40">
                        {formatDate(msg.createdAt)}
                      </span>
                      <div className="flex-1 border-t border-base-300/40" />
                    </div>
                  )}

                  {/* Received message */}
                  {!isMine && (
                    <div className="chat chat-start mb-2 animate-fade-in">
                      <div className="chat-image avatar">
                        <div className="w-8 rounded-full border border-base-300/60">
                          <img
                            src={activeUserAvatar}
                            alt={activeUser?.fullName || "Friend"}
                          />
                        </div>
                      </div>
                      <div className="chat-header mb-0.5 text-[0.65rem] text-base-content/40">
                        {activeUser?.fullName}
                        <time className="ml-1.5">
                          {renderTimestamp(msg.createdAt)}
                        </time>
                      </div>
                      <div className="chat-bubble max-w-xs rounded-2xl bg-base-200/90 px-4 py-2.5 text-sm text-base-content shadow-xs sm:max-w-md">
                        {msg.image && (
                          <div
                            className={`overflow-hidden rounded-xl border border-base-300/40 ${
                              msg.text ? "mb-2" : ""
                            }`}
                          >
                            <img
                              src={msg.image}
                              alt="attachment"
                              className="max-h-64 w-full object-cover"
                            />
                          </div>
                        )}
                        {msg.text && (
                          <p className="leading-relaxed">{msg.text}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sent message */}
                  {isMine && (
                    <div className="chat chat-end mb-2 animate-fade-in">
                      <div className="chat-image avatar">
                        <div className="w-8 rounded-full border border-primary/20">
                          {authUser && (
                            <img
                              src={
                                authUser.profilePic ||
                                `https://ui-avatars.com/api/?name=${authUser.fullName}`
                              }
                              alt={authUser.fullName}
                            />
                          )}
                        </div>
                      </div>
                      <div className="chat-header mb-0.5 text-[0.65rem] text-base-content/40">
                        <time>{renderTimestamp(msg.createdAt)}</time>
                      </div>
                      <div className="chat-bubble max-w-xs rounded-2xl bg-gradient-to-br from-primary to-secondary px-4 py-2.5 text-sm text-primary-content shadow-md sm:max-w-md">
                        {msg.image && (
                          <div
                            className={`overflow-hidden rounded-xl border border-white/10 ${
                              msg.text ? "mb-2" : ""
                            }`}
                          >
                            <img
                              src={msg.image}
                              alt="attachment"
                              className="max-h-64 w-full object-cover"
                            />
                          </div>
                        )}
                        {msg.text && (
                          <p className="leading-relaxed">{msg.text}</p>
                        )}
                      </div>
                      <div className="chat-footer text-[0.6rem] text-base-content/40">
                        <span className="flex items-center gap-0.5">
                          Sent ✓
                        </span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-primary/10 p-5 text-primary">
              <ImageIcon size={36} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold text-base-content">
                Start the conversation
              </h2>
              <p className="max-w-xs text-sm leading-relaxed text-base-content/60">
                Share your thoughts, send photos, and keep the connection alive
                with your friends.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Input (tetap di bawah) ── */}
      {activeUser && (
        <div className="shrink-0 space-y-3 border-t border-base-300/60 bg-base-100/80 px-5 py-4">
          {/* Image preview */}
          {imagePreview && (
            <div className="flex items-center gap-3 rounded-2xl border border-base-300/60 bg-base-200/70 p-2.5 pr-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={removeImage}
                  className="btn btn-xs btn-circle btn-ghost absolute -top-1.5 -right-1.5 h-5 w-5 bg-base-100/80 shadow-xs backdrop-blur"
                  type="button"
                  title="Remove attachment"
                >
                  <X size={12} />
                </button>
              </div>
              <span className="truncate text-xs text-base-content/60">
                {image?.name || "Image"}
              </span>
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-end gap-2.5">
            <div className="relative flex flex-1 items-end gap-2 rounded-2xl border border-base-300/70 bg-base-200/60 px-4 py-2.5 transition-colors focus-within:border-primary/50 focus-within:bg-base-200/80">
              <textarea
                ref={textareaRef}
                rows={1}
                className="textarea textarea-ghost min-h-[1.5rem] w-full resize-none border-0 bg-transparent p-0 pr-2 text-sm leading-relaxed outline-none placeholder:text-base-content/40"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
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
                className="btn btn-circle btn-ghost btn-sm mb-0.5 shrink-0 text-base-content/50 hover:text-primary"
                title="Attach image"
              >
                <Paperclip size={17} />
              </label>
            </div>
            <button
              type="submit"
              disabled={!text && !image}
              className="btn btn-primary btn-circle mb-0.5 shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-xl hover:shadow-primary/40 disabled:shadow-none"
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
