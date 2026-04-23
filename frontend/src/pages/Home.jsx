import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { MapPin } from 'lucide-react';

const ProductCard = ({ product }) => (
  <Link to={`/products/${product.id}`} className="block group">
    <div className="bg-white rounded-none sm:rounded-lg overflow-hidden border border-gray-200 hover:border-black transition-colors duration-300 flex flex-col h-full">
      <div className="h-56 bg-gray-100 relative overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        ) : (
          <img src={Math.random() > 0.5 ? "/assets/coffee.png" : "/assets/watch.png"} alt="Product Placeholder" className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out" />
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-bold text-black line-clamp-1 mr-2">{product.name}</h3>
          <div className="bg-gray-100 rounded-full px-2 py-1 shrink-0">
            <span className="text-sm font-bold text-black">${Number(product.price).toFixed(2)}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center text-xs text-gray-500 font-semibold bg-white">
          <MapPin size={12} className="mr-1" />
          {product.location || 'Anywhere'} • 15-30 min
        </div>
      </div>
    </div>
  </Link>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Attempt Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Location access denied', err)
      );
    }
    
    // Fetch products
    const fetchProducts = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      try {
        const response = await fetch(`${backendUrl}/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to fetch products from custom API, trying direct DB hit for dev fallback");
        const { data } = await supabase.from('products').select('*');
        if (data) setProducts(data);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Banner Area */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-black text-white flex items-center justify-center overflow-hidden">
        <img src="/assets/hero.png" alt="OpenBuy Hero" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up mt-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 leading-tight">
            Get anything, <br className="hidden sm:block" /> delivered instantly.
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 font-medium max-w-2xl mx-auto">
            From local goods to global imports. Choose from thousands of verified sellers on OpenBuy.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-black tracking-tight">Trending near you</h2>
        </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="bg-gray-200 rounded-2xl h-80 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.isArray(products) && products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {(!Array.isArray(products) || products.length === 0) && (
            <div className="col-span-full py-20 text-center text-gray-500">
              No products found. Sellers add something cool!
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default Home;
