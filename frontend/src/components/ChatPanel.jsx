import React, { useEffect, useRef, useState } from "react";

export default function ChatPanel({ messages, onSend, isLoading, activeUser }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text && !image) return;
    onSend({ text, image });
    setText("");
    setImage(null);
  };

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="flex items-center p-4 border-b bg-white dark:bg-gray-900">
        <img
          src={
            activeUser?.profilePic ||
            "https://ui-avatars.com/api/?name=" + activeUser?.fullName
          }
          alt={activeUser?.fullName}
          className="w-8 h-8 rounded-full object-cover mr-2"
        />
        <span className="font-bold text-lg">
          {activeUser?.fullName || "Select a user"}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading messages...</div>
        ) : (
          <div>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`mb-4 flex ${
                  msg.isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg shadow ${
                    msg.isMine
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  {msg.text && <div>{msg.text}</div>}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="attachment"
                      className="mt-2 max-h-40 rounded"
                    />
                  )}
                  <div className="text-xs mt-1 text-right opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      {activeUser && (
        <form
          onSubmit={handleSend}
          className="p-4 border-t bg-white dark:bg-gray-900 flex gap-2"
        >
          <input
            type="text"
            className="flex-1 px-3 py-2 rounded border"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="hidden"
            id="chat-image-upload"
          />
          <label htmlFor="chat-image-upload" className="btn btn-sm btn-outline">
            Image
          </label>
          <button type="submit" className="btn btn-sm btn-primary">
            Send
          </button>
        </form>
      )}
    </div>
  );
}
