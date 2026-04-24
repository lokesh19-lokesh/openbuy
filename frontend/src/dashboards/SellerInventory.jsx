import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import SellerSubNav from './SellerSubNav';
import { Plus, Search, Filter, Package, Edit, Trash2 } from 'lucide-react';

const SellerInventory = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image_url: '', location: '' });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('products').select('*').eq('seller_id', user.id).order('created_at', { ascending: false });
      setProducts(data || []);
    } catch(err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) fetchProducts();
  }, [user]);

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { data: { session } } = await supabase.auth.getSession();
    
    if (editingId) {
      // API doesn't support PUT, so use Supabase client directly
      const { error } = await supabase
        .from('products')
        .update({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          image_url: newProduct.image_url,
          location: newProduct.location
        })
        .eq('id', editingId)
        .eq('seller_id', user.id);
        
      if (!error) {
        setShowAdd(false);
        setEditingId(null);
        setNewProduct({ name: '', description: '', price: '', image_url: '', location: '' });
        fetchProducts();
      } else {
        alert("Error updating product");
        console.error(error);
      }
    } else {
      // POST via API is supported
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
        setEditingId(null);
        setNewProduct({ name: '', description: '', price: '', image_url: '', location: '' });
        fetchProducts();
      } else {
        alert("Error adding product");
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    // API doesn't support DELETE, so use Supabase client directly
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('seller_id', user.id);

    if (!error) {
      fetchProducts();
    } else {
      alert("Error deleting product");
      console.error(error);
    }
  };

  const handleEditClick = (p) => {
    setEditingId(p.id);
    setNewProduct({
      name: p.name || '',
      description: p.description || '',
      price: p.price || '',
      image_url: p.image_url || '',
      location: p.location || ''
    });
    setShowAdd(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <SellerSubNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Inventory Management</h1>
          <button 
            onClick={() => {
              setEditingId(null);
              setNewProduct({ name: '', description: '', price: '', image_url: '', location: '' });
              setShowAdd(!showAdd);
            }} 
            className="bg-[#1A3673] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center hover:bg-blue-900 transition shadow-sm"
          >
            <Plus size={18} className="mr-2" /> Add Product
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-4 mb-8">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search by product name or SKU..." 
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#1A3673] transition-all font-medium text-gray-700"
            />
          </div>
          <button className="bg-white border border-gray-200 px-6 py-3 rounded-xl flex items-center text-gray-600 font-bold hover:bg-gray-50 transition">
            <Filter size={18} className="mr-2" /> FILTER
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">TOTAL INVENTORY VALUE</p>
            <h3 className="text-4xl font-extrabold text-gray-900 tracking-tighter mb-2">₹42,850.20</h3>
            <p className="text-sm font-bold text-green-600 flex items-center">
              <span className="mr-1">↗</span> +5.2% from last month
            </p>
          </div>
          <div className="w-full md:w-1/3 mt-6 md:mt-0">
            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              <span>INVENTORY HEALTH</span>
              <span className="text-gray-800">84% Optimal</span>
            </div>
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex mb-2">
              <div className="h-full bg-blue-600" style={{ width: '84%' }}></div>
              <div className="h-full bg-yellow-400" style={{ width: '10%' }}></div>
              <div className="h-full bg-red-500" style={{ width: '6%' }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
              <span>Out of Stock: 2</span>
              <span>Reorder: 14</span>
            </div>
          </div>
        </div>

        {/* Add/Edit Product Form Toggle */}
        {showAdd && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8 animate-in slide-in-from-top duration-300">
             <h3 className="text-xl font-bold mb-6">{editingId ? 'Edit Product' : 'List a New Product'}</h3>
             <form onSubmit={handleAddOrUpdateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required placeholder="Product Name" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:border-blue-500 focus:bg-white" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                <input required type="number" step="0.01" placeholder="Price" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:border-blue-500 focus:bg-white" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                <input placeholder="Image URL" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:border-blue-500 focus:bg-white" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} />
                <input placeholder="Location" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:border-blue-500 focus:bg-white" value={newProduct.location} onChange={e => setNewProduct({...newProduct, location: e.target.value})} />
                <textarea required placeholder="Description" rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:border-blue-500 focus:bg-white md:col-span-2" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                <div className="md:col-span-2 flex justify-end mt-4">
                  <button type="button" onClick={() => {setShowAdd(false); setEditingId(null);}} className="px-6 py-3 mr-4 text-gray-500 font-bold hover:text-black transition-colors">Cancel</button>
                  <button type="submit" className="bg-[#1A3673] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-900 transition shadow-md shadow-blue-100">
                    {editingId ? 'Update Product' : 'Save Product'}
                  </button>
                </div>
             </form>
          </div>
        )}

        {/* Product Grid */}
        {loading ? <p className="text-center py-20 text-gray-400 font-medium">Loading inventory...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((p, index) => {
              // Simulated stock status for visual fidelity based on index
              let stockClass = "bg-green-100 text-green-800";
              let stockText = "In Stock";
              if (index % 5 === 4) { stockClass = "bg-red-100 text-red-800"; stockText = "Out of Stock"; }
              else if (index % 3 === 2) { stockClass = "bg-yellow-100 text-yellow-800"; stockText = `Low Stock: ${Math.floor(Math.random()*20)}`; }

              return (
                <div key={p.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 relative">
                      {p.image_url ? (
                        <img src={p.image_url} className="w-full h-full object-cover" alt={p.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-800">
                          <Package size={24} className="text-white opacity-50" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-[15px]">{p.name}</h4>
                      <p className="text-xs text-gray-500 mb-1">SKU: GROC-{p.id.split('-')[0].toUpperCase()}</p>
                      <p className="font-bold text-[#1A3673]">₹{Number(p.price).toLocaleString()} <span className="text-xs font-normal text-gray-500">/ unit</span></p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`${stockClass} text-xs font-bold px-3 py-1.5 rounded-md`}>
                      {index % 3 === 0 ? '1,240 ' : ''}{stockText}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditClick(p)} 
                        className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(p.id)} 
                        className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
            {products.length === 0 && (
              <div className="col-span-full py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
                <Package className="mx-auto text-gray-200 mb-4" size={48} />
                <p className="text-gray-500 font-medium">No products in your inventory yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerInventory;
