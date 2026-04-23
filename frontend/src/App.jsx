import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import HelpCenter from './pages/HelpCenter';
import Safety from './pages/Safety';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.FallbackComponent ? (
        <this.props.FallbackComponent error={this.state.error} />
      ) : (
        <div className="p-10 text-center">
          <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
          <button onClick={() => window.location.reload()} className="mt-6 bg-black text-white px-6 py-2 rounded-full">
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error }) => (
  <div className="p-10 text-center min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Application Error</h2>
      <p className="text-gray-500 mb-6 text-sm">We encountered an unexpected issue. Don't worry, your data is safe.</p>
      
      <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left border border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Technical Details</p>
        <code className="text-xs text-red-500 break-all font-mono">{error?.message || "Unknown error"}</code>
      </div>

      <button 
        onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }} 
        className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]"
      >
        Reset & Recover
      </button>
      <p className="mt-4 text-[11px] text-gray-400 italic">This will clear your local session and return you home.</p>
    </div>
  </div>
);

// Dashboards
import SellerDashboard from './dashboards/SellerDashboard';
import SellerInventory from './dashboards/SellerInventory';
import SellerOrders from './dashboards/SellerOrders';
import SellerSettings from './dashboards/SellerSettings';
import AdminDashboard from './dashboards/AdminDashboard';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Role Guard Component
const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.profile?.role)) return <Navigate to="/" replace />;
  return children;
};

// Protect Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          
          {/* Static Pages */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Customer paths */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/tracking/:orderId" element={
            <ProtectedRoute>
              <OrderTracking />
            </ProtectedRoute>
          } />

          {/* Dashboards */}
          <Route path="/seller" element={
            <RoleRoute allowedRoles={['seller', 'admin']}>
              <SellerDashboard />
            </RoleRoute>
          } />
          <Route path="/seller/inventory" element={
            <RoleRoute allowedRoles={['seller', 'admin']}>
              <SellerInventory />
            </RoleRoute>
          } />
          <Route path="/seller/orders" element={
            <RoleRoute allowedRoles={['seller', 'admin']}>
              <SellerOrders />
            </RoleRoute>
          } />
          <Route path="/seller/settings" element={
            <RoleRoute allowedRoles={['seller', 'admin']}>
              <SellerSettings />
            </RoleRoute>
          } />
          
          <Route path="/admin" element={
            <RoleRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
