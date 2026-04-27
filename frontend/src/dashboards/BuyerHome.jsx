import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { Search, SlidersHorizontal, MapPin, Clock, Plus, Home, Leaf, ShoppingBag, Truck } from 'lucide-react';

// Smart grocery image picker based on product name
const getGroceryPlaceholder = (productName) => {
  const name = (productName || '').toLowerCase();
  if (name.includes('rice') || name.includes('basmati') || name.includes('chawal')) return '/assets/rice.png';
  if (name.includes('dal') || name.includes('lentil') || name.includes('moong') || name.includes('toor') || name.includes('chana')) return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop';
  if (name.includes('wheat') || name.includes('atta') || name.includes('flour')) return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop';
  if (name.includes('oil') || name.includes('ghee')) return 'https://images.unsplash.com/photo-1474979266404-7f28db3f3248?w=400&h=400&fit=crop';
  if (name.includes('sugar') || name.includes('salt') || name.includes('spice') || name.includes('masala')) return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop';
  if (name.includes('milk') || name.includes('dairy') || name.includes('curd') || name.includes('paneer')) return 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop';
  if (name.includes('fruit') || name.includes('apple') || name.includes('banana') || name.includes('mango')) return 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=400&fit=crop';
  if (name.includes('vegeta') || name.includes('tomato') || name.includes('potato') || name.includes('onion')) return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop';
  if (name.includes('tea') || name.includes('chai') || name.includes('coffee')) return 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop';
  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop';
};

const BuyerHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buyer/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/buyer/search');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        const { data } = await supabase.from('products').select('*');
        if (data) setProducts(data);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: 'Home Bakers', desc: 'Artisan cakes & pastries', icon: '🎂', color: 'bg-orange-50 border-orange-100' },
    { name: 'Fresh Produce', desc: 'Farm to table goods', icon: '🥬', color: 'bg-green-50 border-green-100' },
    { name: 'Antique Markets', desc: 'Rare finds, instant deals', icon: '🏺', color: 'bg-amber-50 border-amber-100' },
    { name: 'Express Delivery', desc: 'Under 60 minutes', icon: '⚡', color: 'bg-blue-50 border-blue-100' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-2">
            No middlemen.<br />
            <span className="text-[#E8530E]">Just trade.</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-lg leading-relaxed">
            Get same-day delivery for artisan cakes, fresh produce, and rare antiques delivered straight from source to your door.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input 
              type="text" 
              placeholder={'Try "Rice", "Moong dal", "Wheat"...'} 
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#E8530E] transition-all font-medium text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-[#E8530E] text-white p-3.5 rounded-xl flex items-center hover:bg-orange-700 transition shadow-sm">
            <Search size={20} />
          </button>
        </form>

        {/* Explore Local Verticals */}
        <div className="mb-10">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mb-5">Explore Local Verticals</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <Link to="/buyer/search" key={idx} className={`${cat.color} border rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer group`}>
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#E8530E] transition-colors">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Same-Day Delivery Near You */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Same-Day Delivery Near You</h2>
            <Link to="/buyer/search" className="text-sm font-bold text-[#E8530E] hover:underline">VIEW ALL</Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(n => <div key={n} className="bg-gray-200 rounded-2xl h-72 animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => {
                const deliveryTimes = ['24 mins', '15 mins', '35 mins', '20 mins', '45 mins', '30 mins'];
                const distances = ['1.2 km', '0.8 km', '2.4 km', '1.5 km', '3.1 km', '0.5 km'];

                return (
                  <Link to={`/products/${product.id}`} key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                    {/* Product Image */}
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                      <img 
                        src={product.image_url || getGroceryPlaceholder(product.name)} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = getGroceryPlaceholder(product.name); }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{product.name}</h3>
                        <span className="bg-gray-100 text-gray-900 font-bold text-sm px-2.5 py-1 rounded-lg shrink-0 ml-2">
                          ₹{Number(product.price).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1 mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500 font-semibold">
                          <span className="flex items-center">
                            <Clock size={12} className="mr-1" /> {deliveryTimes[index % deliveryTimes.length]}
                          </span>
                          <span className="flex items-center">
                            <MapPin size={12} className="mr-1" /> {distances[index % distances.length]}
                          </span>
                        </div>
                        <button className="w-8 h-8 bg-[#E8530E] text-white rounded-full flex items-center justify-center hover:bg-orange-700 transition shadow-sm">
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {products.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-500">
                  No products available yet. Check back soon!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerHome;
