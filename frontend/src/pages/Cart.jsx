import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalCost, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/" className="text-blue-600 font-bold hover:underline">Continue shopping</Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in-up">
          <div className="space-y-6">
            {items.map(item => (
              <div key={item.product_id} className="flex items-center justify-between border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="flex flex-row items-center">
                   <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden mr-4 shadow-inner">
                     {item.image_url ? (
                       <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                     )}
                   </div>
                     <div>
                       <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                       <p className="text-sm text-gray-500">Qty: {item.quantity} x ₹{Number(item.price).toLocaleString('en-IN')}</p>
                     </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <span className="font-mono font-bold text-lg hidden sm:block">₹{(item.quantity * item.price).toLocaleString('en-IN')}</span>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.product_id, -1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-200 hover:text-black transition font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 text-gray-900 font-bold text-sm w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product_id, 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-200 hover:text-black transition font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button onClick={() => removeFromCart(item.product_id)} className="text-red-400 hover:text-red-600 transition p-2 bg-red-50 hover:bg-red-100 rounded-full">
                      <Trash2 size={18} />
                    </button>
                  </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center text-2xl font-extrabold font-mono mb-8">
              <span>Total</span>
              <span>₹{totalCost.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={clearCart} className="w-full sm:w-auto px-6 py-3 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition">
                Clear Cart
              </button>
              <button 
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                  } else {
                    navigate('/checkout');
                  }
                }}
                className="w-full flex-1 bg-blue-600 text-white font-bold text-lg py-3 rounded-xl hover:bg-blue-700 transition shadow-lg active:scale-[0.98] transform"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
