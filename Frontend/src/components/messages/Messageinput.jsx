import React, { useState, useRef, useEffect } from 'react';
import { BsSend, BsEmojiSmile, BsUpload } from 'react-icons/bs';
import Picker from 'emoji-picker-react';
import useSendMessage from '../../hooks/useSendMessage';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const pickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const { loading, sendMessage } = useSendMessage();

  const onEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    await sendMessage(file);
    setSelectedFile(null);
    fileInputRef.current.value = null; // reset file input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      await sendMessage(selectedFile);
      setSelectedFile(null);
    } else if (message.trim()) {
      await sendMessage(message);
      setMessage('');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <form className='px-4 my-3' onSubmit={handleSubmit}>
      <div className='w-full relative'>
        <input
          type='text'
          className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
          placeholder='Send a message or upload media'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type='file'
          ref={fileInputRef}
          className='hidden'
          onChange={handleFileChange}
          accept='*' // ✅ allows all file types
        />
        <button
          type='button'
          onClick={triggerFileInput}
          className='absolute inset-y-0 end-24 flex items-center pe-3'
        >
          <BsUpload className='text-white' />
        </button>
        <button
          type='button'
          onClick={toggleEmojiPicker}
          className='absolute inset-y-0 end-16 flex items-center pe-3'
        >
          <BsEmojiSmile className='text-white' />
        </button>
        <button
          type='submit'
          className='absolute inset-y-0 end-8 flex items-center pe-3'
        >
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

export default MessageInput;
