import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { Package, MapPin, Clock, MessageSquare, RotateCcw, HelpCircle, ChevronRight } from 'lucide-react';

const BuyerOrders = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(`${backendUrl}/orders/buyer/${user.id}`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data || []);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
      setLoading(false);
    };
    if (user?.id) fetchOrders();
  }, [user]);

  // Demo orders for visual display
  const demoActiveOrders = [
    {
      id: '#8821',
      seller: 'Sri Venkata Agencies',
      items: '3 Items',
      price: '₹4,200',
      eta: '8-12',
      status: 'out_for_delivery',
      steps: ['Confirmed', 'Preparing', 'Out for Delivery', 'Arrived'],
      currentStep: 2,
      avatar: '🏪'
    },
    {
      id: '#9014',
      seller: 'Lakshmi Rice World',
      items: '1 Item',
      price: '₹1,450',
      eta: '15-20',
      status: 'preparing',
      steps: ['Confirmed', 'Preparing', 'Out for Delivery', 'Arrived'],
      currentStep: 1,
      statusText: 'Courier is at merchant',
      avatar: '🌾'
    }
  ];

  const demoPastOrders = [
    { id: '#7201', seller: 'Fresh Grocers Hub', items: 'Rice, Moong Dal, +2', price: '₹3,850', date: 'Yesterday', avatar: '🥬' },
    { id: '#6899', seller: 'Global Agro Mart', items: '12 Items', price: '₹8,420', date: 'Oct 24', avatar: '🌍' },
    { id: '#6540', seller: 'Rajesh Traders', items: '5 Items', price: '₹2,100', date: 'Oct 20', avatar: '📦' }
  ];

  const displayOrders = orders.length > 0 ? orders : (activeTab === 'active' ? demoActiveOrders : demoPastOrders);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 pt-6">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6"> My Orders</h1>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-8 max-w-md">
          <button 
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'active' ? 'bg-white text-[#E8530E] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active
          </button>
          <button 
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'past' ? 'bg-white text-[#E8530E] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Past Orders
          </button>
        </div>

        {activeTab === 'active' ? (
          <div>
            {/* In Progress Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-gray-900">In Progress</h2>
              <span className="bg-[#E8530E] text-white text-xs font-bold px-3 py-1 rounded-full">
                {demoActiveOrders.length} ACTIVE
              </span>
            </div>

            {/* Active Order Cards */}
            <div className="space-y-4">
              {demoActiveOrders.map((order, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">
                        {order.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{order.seller}</h3>
                        <p className="text-sm text-gray-500">Order {order.id} • {order.price}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-[#E8530E]">{order.eta}</p>
                      <p className="text-xs text-gray-400 font-bold uppercase">MINS</p>
                    </div>
                  </div>

                  {/* Progress Tracker */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between relative">
                      {order.steps.map((step, i) => (
                        <div key={i} className="flex flex-col items-center relative z-10 flex-1">
                          <div className={`w-3 h-3 rounded-full mb-2 ${
                            i <= order.currentStep ? 'bg-[#E8530E]' : 'bg-gray-200'
                          }`}></div>
                          <span className={`text-[10px] font-bold text-center ${
                            i <= order.currentStep ? 'text-[#E8530E]' : 'text-gray-400'
                          }`}>{step}</span>
                        </div>
                      ))}
                      {/* Progress Lines */}
                      <div className="absolute top-1.5 left-0 right-0 flex px-8">
                        {[0, 1, 2].map(i => (
                          <div key={i} className={`h-[3px] flex-1 mx-1 rounded ${
                            i < order.currentStep ? 'bg-[#E8530E]' : 'bg-gray-200'
                          }`}></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {order.statusText && (
                    <p className="text-sm text-gray-500 mb-4 flex items-center">
                      <Package size={14} className="mr-2 text-gray-400" /> {order.statusText}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-grow bg-[#E8530E] text-white py-3.5 rounded-xl font-bold flex items-center justify-center hover:bg-orange-700 transition-colors shadow-sm">
                      <MapPin size={18} className="mr-2" /> Track Live
                    </button>
                    <button className="p-3.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                      <MessageSquare size={18} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Past Orders */}
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">Recently Delivered</h2>
            <div className="space-y-4">
              {demoPastOrders.map((order, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">
                      {order.avatar}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">{order.seller}</h3>
                        <span className="text-sm text-gray-400 font-medium">{order.date}</span>
                      </div>
                      <p className="text-sm text-gray-500">{order.items} • {order.price}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition flex items-center">
                          <RotateCcw size={14} className="mr-1.5" /> Reorder
                        </button>
                        <button className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition flex items-center">
                          <HelpCircle size={14} className="mr-1.5" /> Help
                        </button>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerOrders;
