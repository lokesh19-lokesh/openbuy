import { useAuth } from '../context/AuthContext';
import { User, Mail, Store, Phone, MapPin, Edit3 } from 'lucide-react';

const SellerProfile = () => {
  const { user } = useAuth();
  
  const profileName = user?.profile?.name || 'Seller';
  const profileEmail = user?.email || 'seller@openbuy.com';
  const initials = profileName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-fade-in-up">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1A1F71] to-blue-800 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {initials}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{profileName}</h1>
              <p className="text-gray-500 font-medium mt-1">{profileEmail}</p>
              <span className="inline-flex items-center gap-1 mt-3 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Store size={12} /> Verified Seller
              </span>
            </div>
            <button className="ml-auto p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition">
              <Edit3 size={20} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 pt-8 pb-4">
            <h2 className="text-xl font-extrabold text-gray-900">Business Details</h2>
          </div>
          <div className="divide-y divide-gray-50">
            <div className="px-8 py-5 flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <User size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Owner Name</p>
                <p className="text-sm text-gray-500">{profileName}</p>
              </div>
            </div>
            <div className="px-8 py-5 flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <Mail size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Email Address</p>
                <p className="text-sm text-gray-500">{profileEmail}</p>
              </div>
            </div>
            <div className="px-8 py-5 flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <Phone size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Phone Number</p>
                <p className="text-sm text-gray-500">+91 98765 43210</p>
              </div>
            </div>
            <div className="px-8 py-5 flex items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <MapPin size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Store Location</p>
                <p className="text-sm text-gray-500">123 Market Street, Hyderabad, 500081</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
