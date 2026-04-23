import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { CheckCircle2, Circle, Clock, Package, Truck, Home } from 'lucide-react';

const statuses = [
  { id: 'pending', label: 'Order Placed', icon: Clock },
  { id: 'accepted', label: 'Accepted', icon: CheckCircle2 },
  { id: 'packed', label: 'Packed', icon: Package },
  { id: 'shipped', label: 'On the Way', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Home }
];

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single();
    if (!error && data) {
      setOrder(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();

    // Setup Supabase Realtime Subscription
    const channel = supabase.channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => {
          setOrder(payload.new);
          // Play a sound or show a toast here ideally!
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (loading) return <div className="p-10 text-center">Loading live tracking...</div>;
  if (!order) return <div className="p-10 text-center text-red-500">Order not found.</div>;

  const currentIdx = statuses.findIndex(s => s.id === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in-up">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Live Tracker</h1>
          <p className="text-gray-500 mt-1 font-mono text-sm">Order #{order.id?.split('-')[0]}</p>
        </div>
        <Link to="/" className="text-blue-600 font-bold hover:underline text-sm">Return Home</Link>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
        {/* Simple map mockup area */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-blue-50 opacity-50 flex items-center justify-center">
            <span className="text-blue-200 text-sm tracking-widest uppercase font-bold text-center px-4 w-full h-full flex flex-col items-center justify-center pt-4" style={{backgroundImage: 'radial-gradient(#93c5fd 1px, transparent 1px)', backgroundSize: '10px 10px'}}></span>
        </div>

        <div className="relative pt-24 z-10">
          <h2 className="text-2xl font-black mb-8 text-center bg-white py-2 rounded-full shadow-sm max-w-xs mx-auto border border-gray-100">
            {isCancelled ? <span className="text-red-500">Cancelled</span> : <span className="text-blue-600 capitalize">{order.status}</span>}
          </h2>

          <div className="ml-4 space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:to-gray-200">
            {!isCancelled && statuses.map((status, index) => {
              const Icon = status.icon;
              const isPast = index <= currentIdx;
              const isCurrent = index === currentIdx;

              return (
                <div key={status.id} className="relative flex items-center md:justify-center">
                  <div className={`
                    absolute left-0 md:left-1/2 -ml-5 md:-ml-7 flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full border-4 border-white shadow-lg transition-colors duration-500 z-10
                    ${isCurrent ? 'bg-blue-600 text-white animate-pulse' : isPast ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}
                  `}>
                    <Icon size={isCurrent ? 24 : 20} className={isCurrent ? 'animate-bounce' : ''} />
                  </div>
                  <div className={`ml-10 md:ml-24 ${isPast ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                    <span className="block text-lg">{status.label}</span>
                    {isCurrent && <span className="text-xs text-blue-600 uppercase tracking-wider font-bold">Current Status</span>}
                  </div>
                </div>
              );
            })}
            
            {isCancelled && (
              <div className="text-center text-red-500 font-bold p-6 bg-red-50 rounded-xl border border-red-100 relative z-10">
                This order has been cancelled by the seller or admin.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
