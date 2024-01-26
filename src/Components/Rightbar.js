import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';

const Rightbar = () => {
  return (
    <div className="sidebar">
      <Sidebar collapsed={true} breakPoint="md">
        <div className="flex flex-col h-screen justify-between text-center text-3xl text-white bg-gradient-to-b from-pink-500 to-purple-500">
          <Menu>
            <MenuItem className="py-4 hover:text-black">9</MenuItem>
            <MenuItem className="py-4 hover:text-black">9</MenuItem>
            <MenuItem className="py-4 hover:text-black">Y</MenuItem>
            <MenuItem className="py-4 hover:text-black">E</MenuItem>
            <MenuItem className="py-4 hover:text-black">L</MenuItem>
            <MenuItem className="py-4 hover:text-black">L</MenuItem>
            <MenuItem className="py-4 hover:text-black">O</MenuItem>
            <MenuItem className="py-4 hover:text-black">W</MenuItem>
          </Menu>
        </div>
      </Sidebar>
    </div>
  );
};

export default Rightbar;
