import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, User, Shield, Home, Search, FileText } from 'lucide-react';

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { items } = useCart();

  const handleLogout = async () => {
    await logout();
  };

  const navItemClass = "hover:text-black transition-colors duration-200 ease-in-out px-2 py-2 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-semibold text-gray-600";

  return (
    <>
    <nav className="bg-white text-black border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-extrabold tracking-tighter">OpenBuy<span className="text-gray-400">.</span></Link>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-4">


            
            {user ? (
              <div className="flex items-center space-x-1 sm:space-x-3">
                {/* Buyer links - only for non-seller/non-admin */}
                {user.profile?.role !== 'seller' && user.profile?.role !== 'admin' && (
                  <>
                    {/* Desktop Buyer links */}
                    <div className="hidden sm:flex items-center space-x-1 sm:space-x-3">
                      <Link to="/" className="px-3 py-2 hover:bg-gray-100 rounded-full transition-colors group flex items-center" title="Home">
                        <span className="text-sm font-bold text-gray-600 group-hover:text-black">Home</span>
                      </Link>
                      <Link to="/buyer/search" className="px-3 py-2 hover:bg-gray-100 rounded-full transition-colors group flex items-center" title="Search">
                        <span className="text-sm font-bold text-gray-600 group-hover:text-black">Search</span>
                      </Link>
                      <Link to="/buyer/orders" className="px-3 py-2 hover:bg-gray-100 rounded-full transition-colors group flex items-center" title="My Orders">
                        <span className="text-sm font-bold text-gray-600 group-hover:text-black">My Orders</span>
                      </Link>
                      <Link to="/cart" className="px-3 py-2 hover:bg-gray-100 rounded-full transition-colors group flex items-center" title="Cart">
                        <span className="text-sm font-bold text-gray-600 group-hover:text-black">
                          Cart {items?.length > 0 && <span className="ml-1 bg-black text-white px-1.5 py-0.5 rounded-full text-[10px]">{items.length}</span>}
                        </span>
                      </Link>
                    </div>

                    {/* Mobile Buyer Top Profile Dropdown */}
                    <div className="sm:hidden relative">
                      <button onClick={() => setProfileOpen(!profileOpen)} className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-700">
                        <User size={20} strokeWidth={2.5} />
                      </button>
                      {profileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-50 mb-1">
                            <p className="text-sm font-bold truncate text-gray-900">{user.profile?.name}</p>
                          </div>
                          <Link to="/buyer/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-semibold">My Profile</Link>
                          <button onClick={() => { setProfileOpen(false); handleLogout(); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold">Log out</button>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {/* Seller: Dashboard link - only for sellers */}
                {user.profile?.role === 'seller' && (
                  <>
                    <Link to="/" className="px-3 py-2 hover:bg-gray-100 rounded-full transition-colors group flex items-center" title="Home">
                      <span className="text-sm font-bold text-gray-600 group-hover:text-black">Home</span>
                    </Link>
                    <Link to="/seller" className="px-3 py-2 hover:bg-gray-100 rounded-full transition-colors group flex items-center" title="Dashboard">
                      <span className="text-sm font-bold text-gray-600 group-hover:text-black">Dashboard</span>
                    </Link>
                  </>
                )}
                {/* Admin link */}
                {user.profile?.role === 'admin' && (
                  <Link to="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors group flex items-center" title="Admin">
                    <Shield size={20} className="text-gray-600 group-hover:text-black" strokeWidth={2.5} />
                    <span className="hidden sm:inline ml-2 text-xs font-bold text-gray-600 group-hover:text-black">Admin</span>
                  </Link>
                )}
                {user.profile?.role === 'seller' && (
                  <Link to="/seller/settings" className="px-3 py-2 hover:bg-gray-100 rounded-full transition-colors group flex items-center" title="Profile">
                    <span className="text-sm font-bold text-gray-600 group-hover:text-black">Profile</span>
                  </Link>
                )}
                {user.profile?.role !== 'seller' && user.profile?.role !== 'admin' && (
                  <Link to="/buyer/profile" className="hidden sm:flex px-3 py-2 hover:bg-gray-100 rounded-full transition-colors group items-center" title="Profile">
                    <span className="text-sm font-bold text-gray-600 group-hover:text-black">Profile</span>
                  </Link>
                )}
                {user.profile?.role === 'admin' && (
                  <div className="flex items-center bg-gray-100 rounded-full pl-1 pr-1 py-1 sm:pl-2 sm:pr-3 space-x-1 sm:space-x-2">
                    <div className="bg-black text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center uppercase text-xs font-bold shrink-0">
                      {user.profile?.name?.charAt(0) || <User size={14}/>}
                    </div>
                    <span className="hidden sm:inline text-sm font-semibold whitespace-nowrap text-black">{user.profile?.name}</span>
                  </div>
                )}
                {user.profile?.role === 'admin' && (
                  <button onClick={handleLogout} className="text-gray-500 hover:text-black hover:bg-gray-100 p-1.5 sm:p-2 rounded-full transition">
                    <LogOut size={18} strokeWidth={2.5}/>
                  </button>
                )}
                {user.profile?.role === 'seller' && (
                  <button onClick={handleLogout} className="text-gray-500 hover:text-black hover:bg-gray-100 p-1.5 sm:p-2 rounded-full transition">
                    <LogOut size={18} strokeWidth={2.5}/>
                  </button>
                )}
                {/* Desktop Logout for Buyers is already at the bottom of the code block. Wait! Actually I'll render the buyer logout here for desktop. */}
                {user.profile?.role !== 'seller' && user.profile?.role !== 'admin' && (
                  <button onClick={handleLogout} className="hidden sm:block text-gray-500 hover:text-black hover:bg-gray-100 p-1.5 sm:p-2 rounded-full transition">
                    <LogOut size={18} strokeWidth={2.5}/>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link to="/" className="px-2 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm font-semibold text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition whitespace-nowrap hidden sm:block">Home</Link>
                <Link to="/login" className="px-2 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm font-semibold hover:bg-gray-100 text-black rounded-full transition whitespace-nowrap">Log in</Link>
                <Link to="/signup" className="bg-black text-white px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm font-semibold rounded-full hover:bg-gray-800 transition shadow-none whitespace-nowrap">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Bottom Navigation for Buyers */}
    {user && user.profile?.role !== 'seller' && user.profile?.role !== 'admin' && (
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center justify-center w-full py-2 rounded-xl transition-colors ${isActive ? 'text-[#E8530E] bg-orange-50' : 'text-gray-400'}`}>
          {({ isActive }) => (
            <>
              <Home size={22} className="mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wide">Home</span>
            </>
          )}
        </NavLink>
        
        <NavLink to="/buyer/search" className={({ isActive }) => `flex flex-col items-center justify-center w-full py-2 rounded-xl transition-colors ${isActive ? 'text-[#E8530E] bg-orange-50' : 'text-gray-400'}`}>
          {({ isActive }) => (
            <>
              <Search size={22} className="mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wide">Search</span>
            </>
          )}
        </NavLink>
        
        <NavLink to="/buyer/orders" className={({ isActive }) => `flex flex-col items-center justify-center w-full py-2 rounded-xl transition-colors ${isActive ? 'text-[#E8530E] bg-orange-50' : 'text-gray-400'}`}>
          {({ isActive }) => (
            <>
              <FileText size={22} className="mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wide">Orders</span>
            </>
          )}
        </NavLink>
        
        <NavLink to="/cart" className={({ isActive }) => `flex flex-col items-center justify-center w-full py-2 rounded-xl transition-colors relative ${isActive ? 'text-[#E8530E] bg-orange-50' : 'text-gray-400'}`}>
          {({ isActive }) => (
            <>
              <div className="relative mb-1">
                <ShoppingCart size={22} strokeWidth={isActive ? 2.5 : 2} />
                {items?.length > 0 && <span className="absolute -top-1 -right-2 bg-black text-white w-4 h-4 rounded-full text-[8px] flex items-center justify-center font-bold">{items.length}</span>}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide">Cart</span>
            </>
          )}
        </NavLink>
      </div>
    )}
    </>
  );
};

export default Navbar;
