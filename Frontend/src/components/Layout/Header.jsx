import React from 'react';
import { useAuthContext } from '../../context/AuthContext';

const Header = () => {
  const { authUser } = useAuthContext();

  return (
    <div className="w-full h-14 bg-gray-800 flex items-center justify-between px-4">
      <h1 className="text-xl font-bold text-white">ChatVerse</h1>
       <div className="flex items-center gap-2">
        <img
          src={authUser.profilePic}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover border border-gray-500"
        />
        <span className="text-sm font-medium">{authUser.fullname}</span>
      </div>
    </div>
  );
};

export default Header;
  