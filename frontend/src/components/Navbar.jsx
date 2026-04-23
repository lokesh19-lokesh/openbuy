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

  const navItemClass = "hover:text-blue-200 transition-colors duration-200 ease-in-out px-3 py-2 rounded-md text-sm font-medium";

  return (
    <nav className="bg-black text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tight">Open<span className="text-blue-500">Buy</span></Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className={navItemClass}>Explore</Link>
            
            <Link to="/cart" className="relative group p-2 hover:bg-gray-800 rounded-full transition-colors">
              <ShoppingCart size={20} className="text-gray-300 group-hover:text-white" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-blue-600 rounded-full">
                  {items.length}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-3">
                {user.profile?.role === 'seller' && (
                  <Link to="/seller" className={navItemClass}>Dashboard</Link>
                )}
                {user.profile?.role === 'admin' && (
                  <Link to="/admin" className={navItemClass}>Admin</Link>
                )}
                <div className="flex items-center bg-gray-800 rounded-full pl-2 pr-3 py-1 space-x-2">
                  <div className="bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center uppercase text-xs font-bold">
                    {user.profile?.name?.charAt(0) || <User size={14}/>}
                  </div>
                  <span className="text-sm font-medium">{user.profile?.name}</span>
                </div>
                <button onClick={handleLogout} className="text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-full transition">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium hover:bg-gray-800 rounded-full transition">Login</Link>
                <Link to="/signup" className="bg-white text-black px-4 py-2 text-sm font-medium rounded-full hover:bg-gray-100 transition shadow-md">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
