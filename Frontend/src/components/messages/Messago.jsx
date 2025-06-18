import React from 'react';
import { useAuthContext } from '../../context/Authcontext';
import useConversation from '../../zustand/useConversation';
import { extractTime } from '../../utils/extractTime';

const Messago = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? 'chat-end' : 'chat-start';
  const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
  const bubbleBgColor = fromMe ? 'bg-blue-500' : '';
  const shakeClass = message.shouldShake ? 'shake' : '';

  // Blue tick logic
  const showTicks = fromMe && message.status;
  const tickColor = message.status === 'read' ? 'text-blue-500' : 'text-gray-500';
  const ticks = message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓';

  console.log("Message:", message._id, message.status, "fromMe:", fromMe);

  return (
    <div className={`chat ${chatClassName}`}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img alt='Tailwind CSS chat bubble component' src={profilePic} />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
        {message.message}
      </div>
      <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
        {formattedTime}
        {showTicks && <span className={`ml-1 ${tickColor}`}>{ticks}</span>}
      </div>
    </div>
  );
};

export default Messago;