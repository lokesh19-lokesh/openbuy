import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Truck } from 'lucide-react';

const Checkout = () => {
  const { items, totalCost, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const { data: { session } } = await import('../services/supabaseClient').then(m => m.supabase.auth.getSession());
      
      const payload = {
        total_price: totalCost,
        items: items.map(i => ({ 
          product_id: i.product_id, 
          seller_id: i.seller_id, 
          quantity: i.quantity, 
          price: i.price 
        }))
      };

      const response = await fetch(`${backendUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to place order');
      }

      const orderData = await response.json();
      clearCart();
      navigate(`/tracking/${orderData.id}`);
      
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <div className="p-10 text-center">Cart is empty</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in-up">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight text-center">Checkout</h1>
      
      <div className="bg-white rounded-none border-t-4 border-black p-6 sm:p-10 shadow-sm border-l border-r border-b border-gray-200">
        <div className="mb-8">
          <h2 className="text-xl font-bold flex items-center mb-4 border-b pb-2"><Truck className="mr-2"/> Delivery Information</h2>
          <p className="text-gray-600">Logged in as: <strong className="text-black">{user.profile?.name}</strong> ({user.profile?.email})</p>
          <p className="text-sm text-gray-500 mt-2">Delivery will be routed to your primary address on file.</p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold flex items-center mb-4 border-b border-gray-200 pb-2"><CreditCard className="mr-2"/> Payment Summary</h2>
          <div className="bg-gray-50 rounded-none border border-gray-200 p-6">
            {items.map(i => (
              <div key={i.product_id} className="flex justify-between mb-2 text-sm text-gray-600">
                <span>{i.name} x {i.quantity}</span>
                <span className="font-mono">₹{(i.price * i.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-lg text-gray-900">
              <span>Total to Pay</span>
              <span className="font-mono">₹{totalCost.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="mt-4 flex items-center text-xs font-semibold text-black bg-gray-100 p-3 rounded-none border border-gray-200">
              Payment processing is emulated. Placing an order will immediately sync to the seller's dashboard.
            </div>
          </div>
        </div>

        <button 
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-black text-white font-extrabold text-xl py-4 rounded-none hover:bg-gray-800 transition active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Place Order Now'}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
