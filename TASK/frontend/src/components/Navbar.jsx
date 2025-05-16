import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Settings, Zap } from 'lucide-react';

const Navbar = () => {
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  const handleLogout = () => {
    // Add your logout logic here
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto">
        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg group-hover:shadow-purple-300/50 group-hover:scale-105 transition-all duration-300">
            <Zap className="w-6 h-6 text-white" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full shadow-md animate-ping" />
          </div>
          {/* BRAND NAME */}
          <span className="text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
            TaskBoard Pro
          </span>
        </div>
    {/* RIGHT SIDE */}
    <div className='flex items-center gap-4'>
        <button className='p-2 text-gray-600 hover:text-purple-500 transition-colors duration-300 hover:bg-purple-50 rounded-full' onClick={()=>navigate('/profile')}>
            <Settings className='w-5 h-5'/>
        </button>


      
    </div>
        {/* MENU TOGGLE */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={handleMenuToggle}
            className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Menu <ChevronDown className="w-4 h-4" />
          </button>

          {menuOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-md border border-gray-200 overflow-hidden z-50">
              <li className="p-2">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                >
                  <Settings className="w-4 h-4" />
                  Profile Setting
                </button>
              </li>
              <li className="p-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;