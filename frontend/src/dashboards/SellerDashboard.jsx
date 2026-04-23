import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { Link } from 'react-router-dom';
import SellerSubNav from './SellerSubNav';
import { 
  Package, ShoppingBag, Plus, Store, Fingerprint, 
  Mail, Phone, MessageSquare, TrendingUp, Filter 
} from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { data: { session } } = await supabase.auth.getSession();
    
    try {
      // Products
      const { data: prods } = await supabase.from('products').select('*').eq('seller_id', user.id);
      setProducts(prods || []);
      
      // Orders
      const res = await fetch(`${backendUrl}/orders/seller/${user.id}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (res.ok) {
        const ords = await res.json();
        setOrders(ords || []);
      }
    } catch(err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) fetchData();
  }, [user.id]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <SellerSubNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        {/* Proprietor Information Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 relative group overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            <div className="space-y-6 flex-grow">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Proprietor</p>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{user.profile?.name || 'Rajesh Kumar Sharma'}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                    <Store className="text-green-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Business Name</p>
                    <p className="font-bold text-gray-800 text-sm">{user.profile?.business_name || 'Sharma Global Enterprises'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                    <Fingerprint className="text-green-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">GST Number</p>
                    <p className="font-bold text-gray-800 text-sm">27AAACH0000A1Z5</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                    <Mail className="text-green-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Email ID</p>
                    <p className="font-bold text-gray-800 text-sm">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 group md:col-start-2">
                  <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                    <Phone className="text-green-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                    <p className="font-bold text-gray-800 text-sm">+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="bg-green-500 text-white p-3 rounded-xl shadow-lg shadow-green-200 hover:bg-green-600 hover:scale-105 transition-all self-end md:self-start">
              <MessageSquare size={24} fill="white" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Total Sales */}
          <div className="bg-[#2E7D32] rounded-2xl p-8 text-white relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp size={160} />
            </div>
            <p className="text-sm font-semibold opacity-80 uppercase tracking-wider mb-2">Total Sales</p>
            <div className="flex items-baseline space-x-3">
              <h3 className="text-5xl font-extrabold tracking-tighter">₹4.2L</h3>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center text-xs font-bold border border-white/10">
                <TrendingUp size={14} className="mr-1" /> 12%
              </div>
            </div>
          </div>

          {/* Active Orders */}
          <div className="bg-[#E3F2FD] rounded-2xl p-8 border border-blue-100 group">
            <p className="text-sm font-semibold text-blue-900/60 uppercase tracking-wider mb-2">Active Orders</p>
            <h3 className="text-5xl font-extrabold text-blue-900 tracking-tighter mb-4">{orders.length || 24}</h3>
            <Link to="/seller/orders" className="flex items-center text-blue-700 font-bold hover:translate-x-1 transition-transform w-fit">
              <ShoppingBag size={18} className="mr-2" /> View all
            </Link>
          </div>
        </div>

        {/* Fresh Stock Inventory Preview */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-extrabold text-[#1A202C] tracking-tight">Fresh Stock Inventory</h2>
            <div className="flex items-center space-x-4">
              <button className="text-green-600 font-bold text-sm flex items-center hover:opacity-80">
                <Filter size={16} className="mr-2" /> Filters
              </button>
            </div>
          </div>

          {loading ? <p className="text-center py-10 text-gray-400 font-medium">Loading inventory...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((p, index) => {
                let stockClass = "bg-green-100 text-green-800";
                let stockText = "In Stock";
                if (index % 5 === 4) { stockClass = "bg-red-100 text-red-800"; stockText = "Out of Stock"; }
                else if (index % 3 === 2) { stockClass = "bg-yellow-100 text-yellow-800"; stockText = `Low Stock: ${Math.floor(Math.random()*20)}`; }

                return (
                  <div key={p.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        {p.image_url ? (
                          <img src={p.image_url} className="w-full h-full object-cover" alt={p.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-800">
                            <Package size={20} className="text-white opacity-50" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-[14px] leading-tight">{p.name}</h4>
                        <p className="font-bold text-[#1A3673] mt-1">₹{Number(p.price).toLocaleString()} <span className="text-[10px] font-normal text-gray-500 uppercase">/ unit</span></p>
                      </div>
                    </div>
                    <div>
                      <span className={`${stockClass} text-[10px] font-bold px-2 py-1 rounded-md`}>
                        {stockText}
                      </span>
                    </div>
                  </div>
                )
              })}
              {products.length === 0 && (
                <div className="col-span-full py-24 bg-white rounded-2xl border border-dashed border-gray-200 text-center shadow-sm">
                  <Package className="mx-auto text-gray-200 mb-4" size={48} />
                  <p className="text-gray-500 font-medium">No products in your inventory yet.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SellerDashboard;

