import React from 'react';
import Sidebar from '../sidebar/Sidebar.jsx';
import MessageContainer from '../messages/MessageContainer.jsx';

const Body = () => {
  return (
    <div className="flex w-full h-[calc(100vh-56px)]">
      <Sidebar />
      <MessageContainer />
    </div>
  );
};


export default Body;
