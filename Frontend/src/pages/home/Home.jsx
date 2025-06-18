import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import MessageContainer from '../../components/messages/MessageContainer.jsx';

const Home = () => {
  return (
    <div className="flex sm:h-[450px] md:h-[550px] max-w-4xl mx-auto my-6 rounded-xl overflow-hidden bg-gray-800 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-600/30 shadow-xl transition-all duration-300 hover:shadow-2xl">
      <Sidebar />
      <MessageContainer />
    </div>
  );
};

export default Home;