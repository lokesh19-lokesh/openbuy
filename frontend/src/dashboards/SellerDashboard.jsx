import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, ShoppingBag, Plus, MoreVertical, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New product form state
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image_url: '', location: '' });

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
    fetchData();
  }, [user.id]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { data: { session } } = await supabase.auth.getSession();
    
    const res = await fetch(`${backendUrl}/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({...newProduct, price: parseFloat(newProduct.price)})
    });
    
    if (res.ok) {
      setShowAdd(false);
      setNewProduct({ name: '', description: '', price: '', image_url: '', location: '' });
      fetchData();
    } else {
      alert("Error adding product");
    }
  };

  const handleOrderStatus = async (orderId, newStatus) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { data: { session } } = await supabase.auth.getSession();
    
    const res = await fetch(`${backendUrl}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (res.ok) {
      fetchData();
    }
  };

  const statuses = ['pending', 'accepted', 'packed', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in-up">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Seller Dashboard</h1>
          <p className="text-gray-500">Welcome, {user.profile?.name}</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)} 
          className="bg-black text-white px-6 py-3 rounded-full font-bold flex items-center hover:bg-gray-800 transition"
        >
          <Plus size={20} className="mr-2" /> Add Product
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-10">
          <h2 className="text-xl font-bold mb-6">List a New Product</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input required placeholder="Product Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            <input required type="number" step="0.01" placeholder="Price" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
            <input placeholder="Image URL (Supabase storage link / external)" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} />
            <input placeholder="Location" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500" value={newProduct.location} onChange={e => setNewProduct({...newProduct, location: e.target.value})} />
            <textarea required placeholder="Description" rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 md:col-span-2" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
            
            <div className="md:col-span-2 flex justify-end">
              <button type="button" onClick={() => setShowAdd(false)} className="px-6 py-3 mr-4 text-gray-500 font-bold hover:text-black">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold border-2 border-transparent hover:bg-blue-700 transition">Save Product</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Products List */}
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center border-b pb-3"><Package className="mr-2 text-blue-600"/> My Inventory ({products.length})</h2>
          {loading ? <p>Loading...</p> : (
            <div className="space-y-4">
              {products.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
                   <div className="flex items-center">
                     <div className="w-16 h-16 bg-gray-100 rounded-xl mr-4 overflow-hidden">
                       {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover"/> : <div className="p-2 text-xs flex items-center justify-center h-full text-center text-gray-400">No Img</div>}
                     </div>
                     <div>
                       <h3 className="font-bold text-gray-900">{p.name}</h3>
                       <p className="text-sm text-gray-500 font-mono">${p.price}</p>
                     </div>
                   </div>
                </div>
              ))}
              {products.length === 0 && <p className="text-gray-500 italic">No products yet.</p>}
            </div>
          )}
        </div>

        {/* Orders List */}
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center border-b pb-3"><ShoppingBag className="mr-2 text-green-600"/> Received Orders ({orders.length})</h2>
          {loading ? <p>Loading...</p> : (
            <div className="space-y-4">
              {orders.map(o => (
                <div key={o.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-lg">#{o.orders?.id?.split('-')[0]}</span>
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider font-bold text-gray-600">{o.orders?.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{o.products?.name} (x{o.quantity})</p>
                  
                  <div className="flex items-center mt-2">
                    <span className="text-sm font-semibold mr-3">Update Status:</span>
                    <select 
                      className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none"
                      value={o.orders?.status}
                      onChange={(e) => handleOrderStatus(o.orders?.id, e.target.value)}
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-gray-500 italic">No orders yet.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard;
