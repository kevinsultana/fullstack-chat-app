// frontend/src/components/ChatPanel.jsx

import React, { useEffect, useRef, useState } from "react";
import { X, Paperclip } from "lucide-react"; // Impor ikon

export default function ChatPanel({ messages, onSend, isLoading, activeUser }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  // State baru untuk menyimpan URL preview gambar
  const [imagePreview, setImagePreview] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null); // Ref untuk input file

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset state saat activeUser berubah
  useEffect(() => {
    setText("");
    setImage(null);
    setImagePreview(null);
  }, [activeUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Buat URL sementara untuk preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    // Reset nilai input file agar bisa memilih file yang sama lagi
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text && !image) return;
    onSend({ text, image });
    setText("");
    removeImage(); // Ganti dengan fungsi removeImage untuk membersihkan semua
  };

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="flex items-center p-4 border-b ">
        <img
          src={
            activeUser?.profilePic ||
            `https://ui-avatars.com/api/?name=${activeUser?.fullName}`
          }
          alt={activeUser?.fullName || "No user selected"}
          className="w-8 h-8 rounded-full object-cover mr-2"
        />
        <span className="font-bold text-lg">
          {activeUser?.fullName || "Select a user"}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 ">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading messages...</div>
        ) : (
          <div>
            {messages.map((msg, index) => (
              <div
                key={msg._id || `msg-${index}`} // Fallback key
                className={`mb-4 flex ${
                  msg.isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg shadow ${
                    msg.isMine
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="attachment"
                      className="mt-2 rounded"
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                  )}
                  {msg.text && <div>{msg.text}</div>}
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
        <div className="p-4 border-t">
          {/* Container untuk preview gambar */}
          {imagePreview && (
            <div className="relative w-28 mb-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto rounded-lg object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-gray-700 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              className="input input-bordered flex-1"
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
            <label htmlFor="chat-image-upload" className="btn btn-outline">
              <Paperclip size={20} />
            </label>
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
