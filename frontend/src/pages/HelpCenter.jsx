import React from 'react';
import PageLayout from '../components/PageLayout';

const HelpCenter = () => (
  <PageLayout 
    title="Help Center" 
    subtitle="We're here to help. Find answers to common questions or contact support."
  >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      {[
        { title: "Orders", icon: "📦", desc: "Tracking, changes, and cancellations" },
        { title: "Payments", icon: "💳", desc: "Refunds, billing, and payment methods" },
        { title: "Account", icon: "👤", desc: "Profile settings and security" },
        { title: "Sellers", icon: "🏪", desc: "Merchant tools and dashboard" },
        { title: "Delivery", icon: "🚲", desc: "Partners, timing, and areas" },
        { title: "Promos", icon: "🏷️", desc: "Discounts and OpenBuy credits" }
      ].map((cat, idx) => (
        <div key={idx} className="p-6 border border-gray-100 rounded-2xl bg-gray-50 hover:border-black transition-colors cursor-pointer group">
          <div className="text-3xl mb-4">{cat.icon}</div>
          <h3 className="font-bold text-black mb-1">{cat.title}</h3>
          <p className="text-sm text-gray-500">{cat.desc}</p>
        </div>
      ))}
    </div>

    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-black tracking-tight">Frequently Asked Questions</h2>
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-black mb-2">How do I track my order?</h3>
          <p className="text-gray-600">Once your order is confirmed, you can track it in real-time through the 'Orders' section in your account. You'll see the live location of your delivery partner and an estimated time of arrival.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-black mb-2">Can I cancel my order?</h3>
          <p className="text-gray-600">Orders can be cancelled free of charge before the merchant starts preparing them. Once preparation has begun, a cancellation fee may apply depending on the merchant's policy.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-black mb-2">What if my items are missing or damaged?</h3>
          <p className="text-gray-600">We take quality seriously. If something is wrong, please report it through the app within 24 hours of delivery. Our support team will review and issue a refund or replacement accordingly.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-black mb-2">How do I become a seller on OpenBuy?</h3>
          <p className="text-gray-600">Join our community of merchants by clicking 'Sign Up as Seller' on our registration page. You'll need to provide business documentation and bank details for verification.</p>
        </div>
      </div>
    </section>

    <div className="bg-black text-white p-10 rounded-3xl text-center">
      <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
      <p className="text-gray-400 mb-8">Our support team is available 24/7 to assist you with any questions or concerns.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button className="bg-white text-black px-8 py-3 rounded-full font-bold">Chat with us</button>
        <button className="bg-transparent border border-white text-white px-8 py-3 rounded-full font-bold">Email Support</button>
      </div>
    </div>
  </PageLayout>
);

export default HelpCenter;
