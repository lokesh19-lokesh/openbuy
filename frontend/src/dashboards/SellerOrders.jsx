import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { Filter, Download, MoreVertical } from 'lucide-react';

const SellerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('order_items')
        .select(`
          id, quantity, price_at_time,
          orders ( id, status, created_at, user_id ),
          products ( id, name, seller_id )
        `)
        .eq('products.seller_id', user.id);
        
      const validOrders = (data || []).filter(item => item.products !== null);
      setOrders(validOrders);
    } catch(err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) fetchOrders();
  }, [user]);

  const tabs = ['All', 'Packing', 'Out for Delivery'];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#1A202C] tracking-tight mb-2">Orders Management</h1>
          <p className="text-gray-600 font-medium">Manage daily grocery deliveries and pick-up requests.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">DAILY REVENUE</p>
            <h3 className="text-2xl font-bold text-[#1A3673] mb-2">₹24,560.00</h3>
            <p className="text-xs font-bold text-green-500 flex items-center"><span className="mr-1">↗</span> +8.2%</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">PICKUP READY</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">18</h3>
            <p className="text-xs font-medium text-gray-500">5 scheduled for AM</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">AVG. BASKET SIZE</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">₹1,245.00</h3>
            <p className="text-xs font-medium text-gray-500">14 items per order</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">OUT OF STOCK</p>
            <h3 className="text-2xl font-bold text-red-600 mb-2">0.8%</h3>
            <p className="text-xs font-bold text-green-500 flex items-center"><span className="mr-1">↘</span> -0.2%</p>
          </div>
        </div>

        {/* Filters & Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="flex bg-[#EEF2F6] p-1 rounded-xl w-full sm:w-auto mb-4 sm:mb-0">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${
                  activeTab === tab 
                    ? 'bg-white text-blue-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-gray-200 p-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition">
              <Filter size={18} />
            </button>
            <button className="bg-white border border-gray-200 p-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition">
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-[#F8FAFC] border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="col-span-2 pl-2">Order ID</div>
            <div className="col-span-4">Customer & Basket</div>
            <div className="col-span-2">Time</div>
            <div className="col-span-2">Total</div>
            <div className="col-span-2">Status</div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-400 font-medium">Loading orders...</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map((o, i) => {
                // Mocking visual data for fidelity to screenshot
                const statuses = [
                  { label: 'PACKING', class: 'bg-blue-50 text-blue-600 border border-blue-100' },
                  { label: 'OUT FOR DELIVERY', class: 'bg-blue-100 text-[#1A3673] border border-blue-200' },
                  { label: 'READY FOR PICKUP', class: 'bg-green-50 text-green-600 border border-green-100' }
                ];
                const statusObj = statuses[i % statuses.length];
                const customers = ['Sunita Sharma', 'Rajesh Gupta', 'Anjali Verma'];
                const custName = customers[i % customers.length];
                const initials = custName.split(' ').map(n=>n[0]).join('');

                return (
                  <div key={o.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition group">
                    <div className="col-span-2 pl-2">
                      <span className="font-bold text-[#1A3673]">#{o.orders?.id?.split('-')[0].toUpperCase() || `GRO-882${1-i}`}</span>
                    </div>
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{custName}</p>
                        <p className="text-xs text-gray-500 truncate">{o.products?.name} (x{o.quantity})</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm font-medium text-gray-800">10:45 AM</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-bold text-gray-900">₹{(o.quantity * o.price_at_time).toLocaleString()}</span>
                    </div>
                    <div className="col-span-2 flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${statusObj.class}`}>
                        {statusObj.label}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {orders.length === 0 && (
                <div className="p-10 text-center text-gray-500 font-medium">
                  No orders found.
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SellerOrders;
