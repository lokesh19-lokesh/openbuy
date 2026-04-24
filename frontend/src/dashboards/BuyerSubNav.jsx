import { NavLink } from 'react-router-dom';
import { Home, Search, FileText, User } from 'lucide-react';

const BuyerSubNav = () => {
  return (
    <>
      {/* Top Navigation - Desktop Only */}
      <div className="hidden md:block bg-black text-white px-4 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex justify-end space-x-12 px-4 sm:px-6 lg:px-8">
          <NavLink 
            to="/buyer"
            end
            className={({ isActive }) => `text-lg font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Home
          </NavLink>
          <NavLink 
            to="/buyer/search"
            className={({ isActive }) => `text-lg font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Search
          </NavLink>
          <NavLink 
            to="/buyer/orders"
            className={({ isActive }) => `text-lg font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Orders
          </NavLink>
          <NavLink 
            to="/buyer/profile"
            className={({ isActive }) => `text-lg font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Profile
          </NavLink>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <NavLink 
          to="/buyer"
          end
          className={({ isActive }) => `flex flex-col items-center justify-center w-full py-2 rounded-xl transition-colors ${isActive ? 'text-[#E8530E] bg-orange-50' : 'text-gray-400'}`}
        >
          {({ isActive }) => (
            <>
              <Home size={22} className="mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wide">Home</span>
            </>
          )}
        </NavLink>
        
        <NavLink 
          to="/buyer/search"
          className={({ isActive }) => `flex flex-col items-center justify-center w-full py-2 rounded-xl transition-colors ${isActive ? 'text-[#E8530E] bg-orange-50' : 'text-gray-400'}`}
        >
          {({ isActive }) => (
            <>
              <Search size={22} className="mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wide">Search</span>
            </>
          )}
        </NavLink>
        
        <NavLink 
          to="/buyer/orders"
          className={({ isActive }) => `flex flex-col items-center justify-center w-full py-2 rounded-xl transition-colors ${isActive ? 'text-[#E8530E] bg-orange-50' : 'text-gray-400'}`}
        >
          {({ isActive }) => (
            <>
              <FileText size={22} className="mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wide">Orders</span>
            </>
          )}
        </NavLink>
        
        <NavLink 
          to="/buyer/profile"
          className={({ isActive }) => `flex flex-col items-center justify-center w-full py-2 rounded-xl transition-colors ${isActive ? 'text-[#E8530E] bg-orange-50' : 'text-gray-400'}`}
        >
          {({ isActive }) => (
            <>
              <User size={22} className="mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wide">Profile</span>
            </>
          )}
        </NavLink>
      </div>
    </>
  );
};

export default BuyerSubNav;
