import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import useConversation from '../../zustand/useConversation';
import { extractTime } from '../../utils/extractTime';

const Messago = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();

  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? 'chat-end' : 'chat-start';
  const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
  const bubbleBgColor = fromMe ? 'bg-blue-500' : 'bg-gray-600';
  const shakeClass = message.shouldShake ? 'shake' : '';

  const showTicks = fromMe && message.status;
  const tickColor = message.status === 'read' ? 'text-blue-500' : 'text-gray-500';
  const ticks = message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓';

  const [previewUrl, setPreviewUrl] = useState(null);
  const closeModal = () => setPreviewUrl(null);

  // ✅ FIXED: use full URL if already hosted (Cloudinary), otherwise prepend API base
  const fullUrl = message.mediaUrl
    ? message.mediaUrl.startsWith('http')
      ? message.mediaUrl
      : `${import.meta.env.VITE_API_URL}${message.mediaUrl}`
    : null;

  const renderMedia = () => {
    if (!fullUrl) return null;
    const extension = fullUrl.split('.').pop()?.toLowerCase();

    if (["png", "jpg", "jpeg", "gif", "webp"].includes(extension)) {
      return (
        <>
          <img
            src={fullUrl}
            alt="media"
            className="rounded-lg max-w-[240px] max-h-60 object-cover cursor-pointer mb-2"
            onClick={() => setPreviewUrl(fullUrl)}
            onError={(e) => {
              console.error("Image failed to load:", fullUrl);
              e.target.style.display = "none";
            }}
          />
          {previewUrl && (
            <div
              className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
              onClick={closeModal}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-6 text-white text-4xl font-bold z-50"
              >
                &times;
              </button>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </>
      );
    }

    if (["mp4", "webm"].includes(extension)) {
      return (
        <video controls className="rounded-lg max-w-[240px] max-h-60 object-cover cursor-pointer mb-2">
          <source src={fullUrl} type={`video/${extension}`} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (["mp3", "wav", "ogg", "mpeg"].includes(extension)) {
      return (
        <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg max-w-xs mb-2">
          <span className="text-white text-sm">🎧 Audio</span>
          <audio controls className="w-full">
            <source src={fullUrl} type={`audio/${extension}`} />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }

    if (extension === "pdf") {
      return (
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline block mb-2"
        >
          📄 View PDF
        </a>
      );
    }

    return (
      <a
        href={fullUrl}
        download
        className="text-blue-400 underline block mb-2"
      >
        📎 Download File
      </a>
    );
  };

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="Profile" src={profilePic} />
        </div>
      </div>

      <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
        {renderMedia()}
        {message.message && <span>{message.message}</span>}
      </div>

      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formattedTime}
        {showTicks && <span className={`ml-1 ${tickColor}`}>{ticks}</span>}
      </div>
    </div>
  );
};

export default Messago;
