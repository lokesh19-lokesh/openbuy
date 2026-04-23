import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { MapPin } from 'lucide-react';

const ProductCard = ({ product }) => (
  <Link to={`/products/${product.id}`} className="block group">
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">No Image</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold font-mono">${Number(product.price).toFixed(2)}</span>
          <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            <MapPin size={12} className="mr-1" />
            {product.location || 'Anywhere'}
          </div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Discover <span className="text-blue-600">Anything</span>, Anywhere
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          From local goods to global imports, find what you need delivered right to you.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="bg-gray-200 rounded-2xl h-80 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500">
              No products found. Sellers add something cool!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
