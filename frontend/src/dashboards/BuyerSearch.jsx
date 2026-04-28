import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../services/supabaseClient';
import { Search, SlidersHorizontal, MapPin, Star, Truck, Package, MessageSquare, Clock, Zap, Award, ShieldCheck, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
};

const BuyerSearch = () => {
  const { user } = useAuth();
  const { items, addToCart, updateQuantity } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeFilter, setActiveFilter] = useState('All');

  const [userLocation, setUserLocation] = useState([17.3850, 78.4867]);
  const [locationName, setLocationName] = useState('Fetching location...');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserLocation([lat, lon]);
          
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            const name = data.address?.suburb || data.address?.neighborhood || data.address?.city || 'Your Location';
            const city = data.address?.city || data.address?.state || '';
            setLocationName(`${name}${city && name !== city ? `, ${city}` : ''}`);
          } catch (e) {
            setLocationName('Your Location');
          }
        },
        (error) => {
          console.log("Geolocation error", error);
          setLocationName('Hyderabad (Center)');
        }
      );
    } else {
      setLocationName('Hyderabad (Center)');
    }
  }, []);

  const userIcon = L.divIcon({
    className: 'bg-transparent',
    html: `<div class="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3)]"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  const supplierIcon = L.divIcon({
    className: 'bg-transparent',
    html: `<div class="w-4 h-4 bg-[#E8530E] border-2 border-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3)]"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  const getSupplierLocation = (baseLat, baseLng, index) => {
    const seed1 = Math.sin(index * 12.9898 + 1) * 43758.5453;
    const seed2 = Math.cos(index * 78.233 + 1) * 43758.5453;
    const latOffset = ((seed1 - Math.floor(seed1)) - 0.5) * 0.08;
    const lngOffset = ((seed2 - Math.floor(seed2)) - 0.5) * 0.08;
    return [baseLat + latOffset, baseLng + lngOffset];
  };

  const filters = ['All', 'Same Day', 'Under ₹500', 'Verified'];

  // Fetch products from DB based on search query
  const fetchProducts = async (query) => {
    setLoading(true);
    try {
      let data = [];
      
      // Try backend API first
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/products`);
        if (response.ok) {
          data = await response.json();
        }
      } catch {
        // Fallback to Supabase direct query
        const { data: supaData } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        data = supaData || [];
      }

      // Client-side NLP parsing and filtering if there's a search query
      if (query && query.trim()) {
        const q = query.toLowerCase().trim();
        let itemQuery = q;
        let locationQuery = '';
        let priceLimit = null;

        // Extract price limits (e.g. under 2000rs, < 500)
        const priceMatch = itemQuery.match(/(?:under|below|<)\s*(\d+)(?:\s*(?:rs|rupees|₹))?/i);
        if (priceMatch) {
          priceLimit = parseInt(priceMatch[1], 10);
          itemQuery = itemQuery.replace(priceMatch[0], '').trim();
        }

        // Check for location patterns
        const nearMatch = itemQuery.match(/^(.*?)\s+near\s+(.*)$/);
        const inMatch = itemQuery.match(/^(.*?)\s+(?:in|at)\s+(.*)$/);

        if (nearMatch) {
          itemQuery = nearMatch[1].trim();
          locationQuery = nearMatch[2].trim();
        } else if (inMatch) {
          itemQuery = inMatch[1].trim();
          locationQuery = inMatch[2].trim();
        }

        // Synonym / Noise Reduction (e.g., rice bags -> rice)
        const noiseWords = ['bags', 'bag', 'packets', 'packet', 'boxes', 'box', 'kg', 'liters', 'grams'];
        const words = itemQuery.split(/\s+/).filter(w => !noiseWords.includes(w));
        itemQuery = words.join(' ').trim();

        data = data.filter(p => {
          const productLoc = (p.location || 'Hyderabad').toLowerCase();
          let itemMatch = false;
          
          if (itemQuery) {
            itemMatch = (p.name && p.name.toLowerCase().includes(itemQuery)) ||
                        (p.description && p.description.toLowerCase().includes(itemQuery)) ||
                        (p.category && p.category.toLowerCase().includes(itemQuery));
          } else {
            itemMatch = true; // Match all if item query is empty
          }

          let locationMatch = true;
          if (locationQuery && locationQuery !== 'me') {
            locationMatch = productLoc.includes(locationQuery);
          } else if (itemQuery && !locationQuery) {
            // If no explicit location, check if the item query itself matches the location
            itemMatch = itemMatch || productLoc.includes(itemQuery);
          }

          let priceMatch = true;
          if (priceLimit !== null) {
            priceMatch = Number(p.price) <= priceLimit;
          }

          return itemMatch && locationMatch && priceMatch;
        });
      }

      // Calculate consistent distance for map plotting and sorting
      data = data.map((p, i) => {
        const seed = String(p.id || p.name).split('').reduce((acc, char) => acc + char.charCodeAt(0), i);
        const computedDistance = 1 + (Math.abs(Math.sin(seed)) * 8); 
        return { ...p, computedDistance: parseFloat(computedDistance.toFixed(1)) };
      });

      // Sort by distance if a location query like "near me" or "in" was used
      if (query && (query.toLowerCase().includes('near') || query.toLowerCase().includes('in') || query.toLowerCase().includes('at'))) {
        data.sort((a, b) => a.computedDistance - b.computedDistance);
      }

      // Apply filter pills
      if (activeFilter === 'Under ₹500') {
        data = data.filter(p => Number(p.price) < 500);
      }

      setProducts(data);
    } catch (err) {
      console.error('Search error:', err);
      setProducts([]);
    }
    setLoading(false);
  };

  // Fetch on mount and when search params change
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchQuery(q);
    fetchProducts(q);
  }, [searchParams, activeFilter]);

  // Handle search form submit
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(searchQuery.trim() ? { q: searchQuery.trim() } : {});
  };

  // Supplier data enrichment for display
  const getSupplierData = (product, index) => {
    const names = ['Sri Venkata Agencies', 'Lakshmi Rice World', 'Global Agro Mart', 'Fresh Grocers Hub', 'Rajesh Traders', 'Bharat Wholesale'];
    const badges = [['FSSAI VERIFIED', 'BEST MATCH'], ['WHOLESALE HUB'], ['FSSAI PREMIUM', 'BULK ONLY'], ['ORGANIC'], ['TRUSTED SELLER'], ['EXPRESS']];
    const ratings = [4.8, 4.5, 4.3, 4.7, 4.2, 4.6];
    const deliveryTimes = ['2-3 hrs', 'Within 4 hrs', '60 min', '1-2 hrs', '3-4 hrs', 'Same Day'];
    const stocks = ['850kg', '1,200kg', '2,500kg', '300kg', '600kg', '900kg'];
    
    return {
      supplierName: names[index % names.length],
      badges: badges[index % badges.length],
      rating: ratings[index % ratings.length],
      deliveryTime: deliveryTimes[index % deliveryTimes.length],
      stock: stocks[index % stocks.length],
      distance: `${product.computedDistance || (1 + Math.random() * 4).toFixed(1)}km`,
      location: product.location || 'Hyderabad'
    };
  };

  const lowestPrice = products.length > 0 ? Math.min(...products.map(p => Number(p.price) || 0)) : 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 pt-6">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">Find Suppliers</h1>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Search products, suppliers..." 
                className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#E8530E] transition-all font-medium text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchParams({});
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button type="submit" className="bg-[#E8530E] text-white p-3.5 rounded-xl flex items-center hover:bg-orange-700 transition shadow-sm">
              <Search size={20} />
            </button>
          </form>
          {searchParams.get('q') && (
            <p className="mt-3 text-sm text-gray-500">
              Showing results for: <span className="font-bold text-gray-900">"{searchParams.get('q')}"</span>
            </p>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeFilter === f 
                  ? 'bg-[#1A2744] text-white' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {f === 'All' ? `All (${products.length})` : f}
            </button>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl">
              <Zap className="text-[#E8530E]" size={20} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{searchParams.get('q') ? products.length : 0}</p>
              <p className="text-xs text-gray-500 font-semibold">Suppliers Found</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Truck className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{searchParams.get('q') ? Math.ceil(products.length * 0.6) : 0}</p>
              <p className="text-xs text-gray-500 font-semibold">Same Day Delivery</p>
            </div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <Package className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900">₹{searchParams.get('q') && products.length > 0 ? lowestPrice.toLocaleString() : 0}</p>
              <p className="text-xs text-gray-500 font-semibold">Lowest Price Found</p>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <Star className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{searchParams.get('q') && products.length > 0 ? '4.8★' : '0★'}</p>
              <p className="text-xs text-gray-500 font-semibold">Top Rated Supplier</p>
            </div>
          </div>
        </div>

        {/* Live Map View */}
        <div className="relative z-0 w-full h-48 sm:h-64 bg-[#FCFBF9] rounded-2xl border border-gray-200 mb-8 overflow-hidden shadow-inner">
          <MapContainer center={userLocation} zoom={12} className="w-full h-full z-0" scrollWheelZoom={false} zoomControl={false}>
            <ZoomControl position="bottomleft" />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <MapUpdater center={userLocation} />
            
            <Marker position={userLocation} icon={userIcon}>
              <Popup>You are here</Popup>
            </Marker>

            {searchParams.get('q') && products.map((p, i) => (
              <Marker key={`supplier-${p.id || i}`} position={getSupplierLocation(userLocation[0], userLocation[1], i)} icon={supplierIcon}>
                <Popup>{getSupplierData(p, i).supplierName}</Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Location Badge (Top Left) */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-1.5 z-[1000] pointer-events-auto">
            <MapPin size={14} className="text-pink-500" fill="currentColor" />
            <span className="text-xs font-bold text-gray-800 tracking-tight">{locationName}</span>
          </div>

          {/* Legend (Bottom Right) */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 z-[1000] pointer-events-auto">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></div>
              <span className="text-[10px] font-bold text-gray-600">You</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#E8530E] shadow-sm"></div>
              <span className="text-[10px] font-bold text-gray-600">Supplier</span>
            </div>
          </div>
        </div>

        {/* Supplier Cards */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => <div key={n} className="bg-gray-200 rounded-2xl h-48 animate-pulse"></div>)}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => {
              const supplier = getSupplierData(product, index);
              return (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  {/* Supplier Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                      {product.image_url ? (
                        <img src={product.image_url} className="w-full h-full object-cover" alt={product.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#E8530E] text-white font-bold text-lg">
                          {supplier.supplierName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{supplier.supplierName}</h3>
                          <p className="text-sm text-gray-700 font-medium">{product.name}</p>
                        </div>
                        <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded-md text-sm font-bold">
                          <Star size={12} className="mr-1" fill="white" /> {supplier.rating}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{supplier.distance} • {supplier.location}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {supplier.badges.map((badge, i) => (
                          <span key={i} className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            badge.includes('VERIFIED') || badge.includes('FSSAI') ? 'bg-green-100 text-green-700' :
                            badge.includes('BEST') ? 'bg-orange-100 text-orange-700' :
                            badge.includes('WHOLESALE') ? 'bg-blue-100 text-blue-700' :
                            badge.includes('BULK') ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Product Details Row */}
                  <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} className="text-gray-400" />
                        <span className="font-semibold">{supplier.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Package size={14} className="text-gray-400" />
                        <span className="font-semibold">{supplier.stock}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Best Price</p>
                        <p className="text-xl font-extrabold text-gray-900">₹{Number(product.price).toLocaleString('en-IN')}</p>
                      </div>
                      <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition hidden sm:block">
                        <MessageSquare size={18} className="text-gray-500" />
                      </button>
                      
                      {(() => {
                        const cartItem = items.find(i => i.product_id === product.id);
                        if (cartItem) {
                          return (
                            <div className="flex items-center bg-[#E8530E] rounded-xl overflow-hidden shadow-sm h-[42px] shrink-0">
                              <button 
                                onClick={() => updateQuantity(product.id, -1)}
                                className="px-3 sm:px-4 h-full text-white hover:bg-orange-700 transition font-bold"
                              >
                                -
                              </button>
                              <span className="px-1 sm:px-2 text-white font-extrabold text-sm w-6 text-center">{cartItem.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(product.id, 1)}
                                className="px-3 sm:px-4 h-full text-white hover:bg-orange-700 transition font-bold"
                              >
                                +
                              </button>
                            </div>
                          );
                        }
                        
                        return (
                          <button 
                            onClick={() => addToCart(product)}
                            className="bg-[#E8530E] text-white px-3 sm:px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-700 transition-colors shadow-sm h-[42px] shrink-0 whitespace-nowrap"
                          >
                            Order Now
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
            {!loading && products.length === 0 && (
              <div className="py-20 text-center">
                <Search className="mx-auto text-gray-200 mb-4" size={48} />
                <p className="text-xl font-bold text-gray-700 mb-2">No suppliers found</p>
                <p className="text-gray-500 font-medium">Try a different keyword like "rice", "dal", or "wheat"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerSearch;
