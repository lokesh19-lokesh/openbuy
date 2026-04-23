import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();

  const handleLogout = async () => {
    await logout();
  };

  const navItemClass = "hover:text-blue-200 transition-colors duration-200 ease-in-out px-2 py-2 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium";

  return (
    <nav className="bg-black text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tight">Open<span className="text-blue-500">Buy</span></Link>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-4">
            <Link to="/" className={`${navItemClass} hidden sm:block`}>Explore</Link>
            
            <Link to="/cart" className="relative group p-1 sm:p-2 hover:bg-gray-800 rounded-full transition-colors mr-1 sm:mr-0">
              <ShoppingCart className="text-gray-300 group-hover:text-white w-5 h-5 sm:w-6 sm:h-6" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] sm:text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-blue-600 rounded-full">
                  {items.length}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-1 sm:space-x-3">
                {user.profile?.role === 'seller' && (
                  <Link to="/seller" className={`${navItemClass} hidden sm:block`}>Dashboard</Link>
                )}
                {user.profile?.role === 'admin' && (
                  <Link to="/admin" className={`${navItemClass} hidden sm:block`}>Admin</Link>
                )}
                <div className="flex items-center bg-gray-800 rounded-full pl-1 pr-1 py-1 sm:pl-2 sm:pr-3 space-x-1 sm:space-x-2">
                  <div className="bg-blue-600 rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center uppercase text-xs font-bold shrink-0">
                    {user.profile?.name?.charAt(0) || <User size={14}/>}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium whitespace-nowrap">{user.profile?.name}</span>
                </div>
                <button onClick={handleLogout} className="text-gray-300 hover:text-white hover:bg-gray-800 p-1.5 sm:p-2 rounded-full transition">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link to="/login" className="px-2 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm font-medium hover:bg-gray-800 rounded-full transition whitespace-nowrap">Login</Link>
                <Link to="/signup" className="bg-white text-black px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm font-medium rounded-full hover:bg-gray-100 transition shadow-md whitespace-nowrap">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
