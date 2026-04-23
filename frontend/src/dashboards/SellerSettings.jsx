import { useAuth } from '../context/AuthContext';
import SellerSubNav from './SellerSubNav';

const SellerSettings = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <SellerSubNav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-gray-500">Manage your business profile and preferences.</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-4">
             <div className="pb-6 border-b border-gray-100">
               <h3 className="text-lg font-bold text-gray-900 mb-2">Business Profile</h3>
               <p className="text-sm text-gray-500 mb-4">Update your business details and contact information.</p>
               <button className="w-full sm:w-auto bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-xl border border-gray-100 hover:bg-gray-100 transition">Update Details</button>
             </div>
             
             <div className="py-6 border-b border-gray-100">
               <h3 className="text-lg font-bold text-gray-900 mb-2">Payment Methods</h3>
               <p className="text-sm text-gray-500 mb-4">Manage how you receive payouts from your sales.</p>
               <button className="w-full sm:w-auto bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-xl border border-gray-100 hover:bg-gray-100 transition">Manage Payments</button>
             </div>

             <div className="pt-6">
               <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
               <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
               <button className="w-full sm:w-auto bg-red-50 text-red-600 font-bold px-6 py-3 rounded-xl border border-red-100 hover:bg-red-100 transition">Deactivate Account</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSettings;
