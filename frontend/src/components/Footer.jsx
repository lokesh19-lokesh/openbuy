import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-black text-white pt-16 pb-28 sm:pb-16 px-4 sm:px-6 lg:px-8 mt-auto relative z-10">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="col-span-2 md:col-span-1">
        <h3 className="text-2xl font-bold mb-4 tracking-tighter">OpenBuy.</h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Get anything delivered instantly. From local goods to global imports. Choose from thousands of verified sellers on OpenBuy.
        </p>
      </div>
      <div className="col-span-1">
        <h4 className="font-bold mb-4 text-gray-100">Company</h4>
        <ul className="space-y-3 text-sm text-gray-400">
          <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
          <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
          <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
        </ul>
      </div>
      <div className="col-span-1">
        <h4 className="font-bold mb-4 text-gray-100">Support</h4>
        <ul className="space-y-3 text-sm text-gray-400">
          <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
          <li><Link to="/safety" className="hover:text-white transition-colors">Safety</Link></li>
          <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
        </ul>
      </div>
      <div className="col-span-2 md:col-span-1">
        <h4 className="font-bold mb-4 text-gray-100">Connect</h4>
        <ul className="space-y-3 text-sm text-gray-400">
          <li><Link to="#" className="hover:text-white transition-colors">Twitter</Link></li>
          <li><Link to="#" className="hover:text-white transition-colors">Instagram</Link></li>
          <li><Link to="#" className="hover:text-white transition-colors">Facebook</Link></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
      <p className="mb-4 md:mb-0 leading-relaxed">
        &copy; {new Date().getFullYear()} OpenBuy Powered by <a href="https://thepatternscompany.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Patterns Infotech Pvt Ltd</a>
      </p>
      <div className="space-x-6">
        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
