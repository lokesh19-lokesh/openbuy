import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

      {/* Present Location Map Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black tracking-tight flex items-center">
            <MapPin className="mr-2" /> Your Location
          </h2>
        </div>
        <div className="w-full h-64 md:h-80 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
          {userLocation ? (
            <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>
                  You are here!
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <MapPin size={48} className="mb-4 text-gray-300" />
              <p>Locating you...</p>
              <p className="text-sm mt-2">Please ensure location permissions are granted.</p>
            </div>
          )}
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

      {/* Footer Area */}
      <footer className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8 mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 tracking-tighter">OpenBuy.</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get anything delivered instantly. From local goods to global imports. Choose from thousands of verified sellers on OpenBuy.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gray-100">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gray-100">Support</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Safety</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-gray-100">Connect</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-white transition-colors">Twitter</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Instagram</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Facebook</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()} OpenBuy Powered by <a href="https://thepatternscompany.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Patterns Infotech Pvt Ltd</a>
          </p>
          <div className="mt-4 md:mt-0 space-x-6">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Use</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
