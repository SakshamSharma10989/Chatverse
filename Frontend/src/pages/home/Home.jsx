import React from 'react';
import Header from '../../components/Layout/Header';
import Body from '../../components/Layout/Body';

const Home = () => {
  return (
    <div className="flex flex-col h-screen w-screen m-0 p-0 bg-gray-900 text-white overflow-hidden">
      <Header />
      <Body />
    </div>
  );
};

export default Home;
