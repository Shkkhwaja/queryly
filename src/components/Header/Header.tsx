import React from 'react';
import Image from 'next/image';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Image
            src="" // Replace with your logo path
            alt="Logo"
            width={40}
            height={40}
            className="cursor-pointer"
          />
          <h1 className="text-xl font-bold text-gray-800">QueryHub</h1>
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-1 space-x-2 w-1/3">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search questions..."
            className="bg-transparent outline-none w-full text-gray-700"
          />
        </div>

        {/* Navigation and Profile */}
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-gray-700 hover:text-blue-500 font-medium">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-500 font-medium">
              Answer
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-500 font-medium">
              Notifications
            </a>
          </nav>

          {/* Notifications */}
          <div className="relative cursor-pointer">
            <FaBell className="text-gray-600 hover:text-blue-500 text-[1.5em]" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-sm rounded-full w-4 h-4 flex items-center justify-center">
              5
            </span>
          </div>

          {/* User Profile */}
          <div className="relative cursor-pointer">
            <FaUserCircle className="text-gray-600 hover:text-blue-500 text-2xl" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
