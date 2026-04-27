import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, CreditCard, MapPin, Bell, Shield, HelpCircle, 
  LogOut, ChevronRight, Home, Briefcase, Gift, Wallet, Plus
} from 'lucide-react';

const BuyerProfile = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const profileName = user?.profile?.name || 'Guest User';
  const profileEmail = user?.email || 'guest@openbuy.com';
  const initials = profileName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-br from-[#1A2744] to-[#2D3E5F] rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E8530E] to-[#FF8C42] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {initials}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#E8530E" className="w-3.5 h-3.5">
                  <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                </svg>
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white">{profileName}</h2>
              <p className="text-sm text-gray-300">{profileEmail}</p>
              <span className="inline-block mt-2 bg-[#E8530E] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Premium Member
              </span>
            </div>
          </div>
        </div>

        {/* Balance & Rewards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <Wallet className="text-blue-600" size={20} />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Balance</span>
            </div>
            <p className="text-3xl font-extrabold text-gray-900">₹12,450</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-50 rounded-xl">
                <Gift className="text-[#E8530E]" size={20} />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reward Points</span>
            </div>
            <p className="text-3xl font-extrabold text-gray-900">2,840</p>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h3 className="text-lg font-extrabold text-gray-900">Saved Addresses</h3>
            <button className="text-sm font-bold text-[#E8530E] hover:underline flex items-center">
              <Plus size={14} className="mr-1" /> ADD NEW
            </button>
          </div>
          
          <div className="divide-y divide-gray-50">
            <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition cursor-pointer">
              <div className="p-2.5 bg-gray-100 rounded-xl">
                <Home size={18} className="text-gray-600" />
              </div>
              <div className="flex-grow">
                <p className="font-bold text-gray-900 text-sm">Home</p>
                <p className="text-sm text-gray-500">123 Madhapur Road, Hitech City, Hyderabad, 500081</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
            <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition cursor-pointer">
              <div className="p-2.5 bg-gray-100 rounded-xl">
                <Briefcase size={18} className="text-gray-600" />
              </div>
              <div className="flex-grow">
                <p className="font-bold text-gray-900 text-sm">Office</p>
                <p className="text-sm text-gray-500">Tech Tower, Floor 15, Financial District, Hyderabad, 500032</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h3 className="text-lg font-extrabold text-gray-900">Payment Methods</h3>
            <button className="text-sm font-bold text-[#E8530E] hover:underline">MANAGE</button>
          </div>
          
          <div className="divide-y divide-gray-50">
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="w-12 h-8 bg-[#1A1F71] rounded-lg flex items-center justify-center text-white text-[10px] font-bold tracking-wider">
                VISA
              </div>
              <div className="flex-grow">
                <p className="font-bold text-gray-900 text-sm">Visa ending in 4242</p>
                <p className="text-xs text-gray-500">Expires 12/26</p>
              </div>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md">PRIMARY</span>
            </div>
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="w-12 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-sm">📱</span>
              </div>
              <div className="flex-grow">
                <p className="font-bold text-gray-900 text-sm">UPI</p>
                <p className="text-xs text-gray-500">Connected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
          <div className="px-6 pt-6 pb-4">
            <h3 className="text-lg font-extrabold text-gray-900">Account Settings</h3>
          </div>
          
          <div className="divide-y divide-gray-50">
            {[
              { icon: Bell, label: 'Notifications', color: 'text-gray-600' },
              { icon: Shield, label: 'Privacy & Security', color: 'text-gray-600' },
              { icon: HelpCircle, label: 'Help & Support', color: 'text-gray-600' },
            ].map((item, idx) => (
              <button key={idx} className="flex items-center gap-4 px-6 py-4 w-full hover:bg-gray-50 transition text-left">
                <item.icon size={20} className={item.color} />
                <span className="flex-grow font-semibold text-gray-800">{item.label}</span>
                <ChevronRight size={18} className="text-gray-300" />
              </button>
            ))}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-4 px-6 py-4 w-full hover:bg-red-50 transition text-left"
            >
              <LogOut size={20} className="text-red-500" />
              <span className="flex-grow font-semibold text-red-500">Sign Out</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mb-8">Version 2.4.1 (Build 120)</p>
      </div>
    </div>
  );
};

export default BuyerProfile;
