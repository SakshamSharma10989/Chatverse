import React, { useEffect, useRef } from 'react';
import Messago from './Messago.jsx';
import useGetMessages from '../../hooks/useGetMessages.js';
import MessageSkeleton from '../skeletons/MessageSkeleton.jsx';
import useListenMessage from '../../hooks/useListenMessage.js';
import { useAuthContext } from '../../context/AuthContext.js';

const Messages = () => {
  const { messages, loading } = useGetMessages();
  const { authUser } = useAuthContext();
  useListenMessage();
  const lastMessageRef = useRef();

  useEffect(() => {
    console.log("Messages useEffect:", {
      loading,
      messageCount: messages.length,
      userId: authUser?._id,
      readReceiptsEnabled: authUser?.readReceiptsEnabled
    });
    if (!loading && messages.length > 0) {
      const unreadMessages = messages.filter(
        (msg) => msg.receiverId === authUser?._id && msg.status !== 'read'
      );
      console.log("Unread messages:", unreadMessages.map(m => ({
        id: m._id,
        status: m.status,
        receiverId: m.receiverId
      })));
      if (unreadMessages.length > 0) {
        fetch('/api/message/read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageIds: unreadMessages.map(m => m._id) }),
        })
          .then(res => res.json())
          .then(data => console.log("Read response:", data))
          .catch(error => console.error("Read error:", error));
      }
    }
  }, [messages, loading, authUser]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages]);

  return (
    <div className='px-4 flex-1 overflow-auto'>
      {!loading &&
        messages.length > 0 &&
        messages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Messago message={message} />
          </div>
        ))}
      {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
      {!loading && messages.length === 0 && (
        <p className='text-center'>Send a message to start the conversation</p>
      )}
    </div>
  );
};

export default Messages;