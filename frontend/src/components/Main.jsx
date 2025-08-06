import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Main = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100 p-4 ml-[250px]">
        <Header/>
        {/* Page Content (rendered by Outlet) */}
        <div className="content mt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;