import { Routes, Route, Navigate } from 'react-router-dom';
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
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error }) => (
  <div className="p-10 text-center">
    <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
    <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto max-w-full text-left inline-block">
      {error.message}
    </pre>
    <button onClick={() => window.location.reload()} className="mt-6 block mx-auto bg-black text-white px-6 py-2 rounded-full">
      Try Refreshing
    </button>
  </div>
);

// Dashboards
import SellerDashboard from './dashboards/SellerDashboard';
import SellerInventory from './dashboards/SellerInventory';
import SellerOrders from './dashboards/SellerOrders';
import SellerSettings from './dashboards/SellerSettings';
import AdminDashboard from './dashboards/AdminDashboard';

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
