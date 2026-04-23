import { NavLink } from 'react-router-dom';

const SellerSubNav = () => {
  return (
    <div className="bg-black text-white px-4 py-4 mb-8">
      <div className="max-w-7xl mx-auto flex justify-end space-x-12 px-4 sm:px-6 lg:px-8">
        <NavLink 
          to="/seller"
          end
          className={({ isActive }) => `text-lg font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/seller/inventory"
          className={({ isActive }) => `text-lg font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Inventory
        </NavLink>
        <NavLink 
          to="/seller/orders"
          className={({ isActive }) => `text-lg font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Orders
        </NavLink>
        <NavLink 
          to="/seller/settings"
          className={({ isActive }) => `text-lg font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Settings
        </NavLink>
      </div>
    </div>
  );
};

export default SellerSubNav;
