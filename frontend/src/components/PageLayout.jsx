import React from 'react';

const PageLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-white">
    {/* Header Section */}
    <div className="bg-black text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 animate-fade-in">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>

    {/* Content Section */}
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg prose-slate max-w-none text-gray-800 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default PageLayout;
