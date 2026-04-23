import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MapPin, ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      try {
        const response = await fetch(`${backendUrl}/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        }
      } catch (err) {
        // Dev fallback
        const { data } = await supabase.from('products').select('*, users(name)').eq('id', id).single();
        if (data) setProduct(data);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Product not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">
      <button onClick={() => navigate(-1)} className="mb-6 flex flex-row items-center text-gray-500 hover:text-black transition group">
        <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="flex flex-col md:flex-row gap-10 bg-white p-6 sm:p-10 rounded-3xl shadow-lg">
        <div className="w-full md:w-1/2 aspect-square bg-gray-100 rounded-2xl overflow-hidden relative">
          {product.image_url ? (
             <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
          )}
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="mb-6 text-sm flex items-center text-gray-500 space-x-4">
            <span className="flex items-center bg-gray-100 px-2 py-1 rounded"><MapPin size={14} className="mr-1"/> {product.location || 'Anywhere'}</span>
            <span>Sold by: <strong className="text-gray-900">{product.users?.name || 'Unknown'}</strong></span>
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed whitespace-pre-wrap">{product.description}</p>
          
          <div className="mt-auto">
            <div className="text-4xl font-mono font-bold text-gray-900 mb-6">
              ${Number(product.price).toFixed(2)}
            </div>
            
            <button 
              onClick={() => {
                addToCart(product);
                alert('Added to cart!');
              }}
              className="w-full bg-black text-white font-bold text-lg py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-xl hover:shadow-2xl active:scale-[0.98] transform"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
