import React from 'react';
import PageLayout from '../components/PageLayout';

const Blog = () => (
  <PageLayout 
    title="Blog" 
    subtitle="The latest news, updates, and stories from the OpenBuy team."
  >
    {/* Featured Post */}
    <div className="mb-16 group cursor-pointer">
      <div className="bg-gray-100 rounded-3xl overflow-hidden mb-8 h-96 relative">
        <img src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop" alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-6 left-6 bg-black text-white px-4 py-1 rounded-full text-xs font-bold">FEATURED</div>
      </div>
      <div>
        <h2 className="text-4xl font-bold text-black mb-4 tracking-tighter">Announcing our ₹100M Series B Funding</h2>
        <p className="text-lg text-gray-600 mb-4">
          Today marks a significant milestone in our journey to redefine local commerce. We are excited to announce our latest funding round which will accelerate our expansion into 100 new cities...
        </p>
        <span className="font-bold text-black border-b-2 border-black pb-1">Read the full story</span>
      </div>
    </div>

    {/* Recent Posts Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {[
        { category: "ENGINEERING", title: "Optimizing sub-second delivery routes", excerpt: "How we use machine learning to predict delivery times with 99% accuracy.", date: "April 12, 2026" },
        { category: "COMPANY", title: "Welcome our new VP of Product", excerpt: "Meet Sarah Jenkins, who joins us from Uber to lead our consumer experience team.", date: "April 8, 2026" },
        { category: "MERCHANTS", title: "Empowering small businesses in Chicago", excerpt: "A look at how local Chicago merchants are growing their sales through OpenBuy.", date: "April 3, 2026" },
        { category: "PRODUCT", title: "New Feature: Scheduled Deliveries", excerpt: "You can now schedule your orders up to 7 days in advance with our latest update.", date: "March 28, 2026" }
      ].map((post, idx) => (
        <div key={idx} className="group cursor-pointer">
          <div className="bg-gray-50 aspect-video rounded-2xl overflow-hidden mb-4 relative">
             <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
          </div>
          <span className="text-xs font-bold text-gray-400 tracking-widest">{post.category}</span>
          <h3 className="text-2xl font-bold text-black mt-2 mb-3 leading-tight group-hover:underline">{post.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
          <span className="text-xs text-gray-400 font-medium">{post.date}</span>
        </div>
      ))}
    </div>

    <div className="mt-20 pt-12 border-t border-gray-100 flex justify-between items-center">
      <div className="text-black font-bold text-lg">Subscribe to our newsletter</div>
      <div className="flex bg-gray-100 rounded-full p-1 w-full max-w-md ml-4">
        <input type="email" placeholder="Email address" className="bg-transparent border-none focus:ring-0 px-4 py-2 flex-grow text-sm" />
        <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold">Join</button>
      </div>
    </div>
  </PageLayout>
);

export default Blog;
