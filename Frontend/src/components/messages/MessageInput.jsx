import React, { useState, useRef, useEffect } from 'react';
import { BsSend, BsEmojiSmile } from 'react-icons/bs';
import Picker from 'emoji-picker-react';
import useSendMessage from '../../hooks/useSendMessage';

const Messageinput = () => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);
  const { loading, sendMessage } = useSendMessage();

  // Handle emoji selection
  const onEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false); // Close picker after selection
  };

  // Toggle emoji picker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage('');
  };

  return (
    <form className='px-4 my-3' onSubmit={handleSubmit}>
      <div className='w-full relative'>
        <input
          type='text'
          className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
          placeholder='Send a message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type='button'
          onClick={toggleEmojiPicker}
          className='absolute inset-y-0 end-8 flex items-center pe-3'
        >
          <BsEmojiSmile className='text-white' />
        </button>
        <button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
          {loading ? <div className='loading loading-spinner'></div> : <BsSend />}
        </button>
        {showEmojiPicker && (
          <div ref={pickerRef} className='absolute bottom-12 right-0 z-10'>
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
    </form>
  );
};

export default Messageinput;