import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();

  const handleLogout = async () => {
    await logout();
  };

  const navItemClass = "hover:text-black transition-colors duration-200 ease-in-out px-2 py-2 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-semibold text-gray-600";

  return (
    <nav className="bg-white text-black border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-extrabold tracking-tighter">OpenBuy<span className="text-gray-400">.</span></Link>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-4">
            <Link to="/" className={`${navItemClass} hidden sm:block`}>Explore</Link>
            
            <Link to="/cart" className="relative group p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors mr-1 sm:mr-0">
              <ShoppingCart className="text-black group-hover:text-black w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              {items?.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] sm:text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-black rounded-full">
                  {items.length}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-1 sm:space-x-3">
                {user.profile?.role === 'seller' && (
                  <Link to="/seller" className="p-2 hover:bg-gray-100 rounded-full transition-colors group flex items-center" title="Dashboard">
                    <LayoutDashboard size={20} className="text-gray-600 group-hover:text-black" strokeWidth={2.5} />
                    <span className="hidden sm:inline ml-2 text-xs font-bold text-gray-600 group-hover:text-black">Dashboard</span>
                  </Link>
                )}
                {user.profile?.role === 'admin' && (
                  <Link to="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors group flex items-center" title="Admin">
                    <Shield size={20} className="text-gray-600 group-hover:text-black" strokeWidth={2.5} />
                    <span className="hidden sm:inline ml-2 text-xs font-bold text-gray-600 group-hover:text-black">Admin</span>
                  </Link>
                )}
                <div className="flex items-center bg-gray-100 rounded-full pl-1 pr-1 py-1 sm:pl-2 sm:pr-3 space-x-1 sm:space-x-2">
                  <div className="bg-black text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center uppercase text-xs font-bold shrink-0">
                    {user.profile?.name?.charAt(0) || <User size={14}/>}
                  </div>
                  <span className="hidden sm:inline text-sm font-semibold whitespace-nowrap text-black">{user.profile?.name}</span>
                </div>
                <button onClick={handleLogout} className="text-gray-500 hover:text-black hover:bg-gray-100 p-1.5 sm:p-2 rounded-full transition">
                  <LogOut size={18} strokeWidth={2.5}/>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link to="/login" className="px-2 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm font-semibold hover:bg-gray-100 text-black rounded-full transition whitespace-nowrap">Log in</Link>
                <Link to="/signup" className="bg-black text-white px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm font-semibold rounded-full hover:bg-gray-800 transition shadow-none whitespace-nowrap">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
