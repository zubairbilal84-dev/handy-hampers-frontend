import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import MobileBottomNav from './components/mobile/MobileBottomNav';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Wishlist from './pages/Wishlist';

// New Pages Imports
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MyAccountPage from './pages/MyAccountPage';
import Blog from './pages/Blog';
import TrackOrder from './pages/TrackOrder';
import RefundPolicy from './pages/RefundPolicy';
import Offers from './pages/Offers';

// 🎀 Shop By Style Pages Imports
import Bagsstyle from './pages/styles/Bagsstyle';
import Boatstyle from './pages/styles/Boatstyle';
import Closedboxes from './pages/styles/Closedboxes';
import Hatsstyle from './pages/styles/Hatsstyle';
import Jhulastyle from './pages/styles/Jhulastyle';
import Ringstyle from './pages/styles/Ringstyle';

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminManageProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReviews from './pages/admin/AdminReviews';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBannerManager from './pages/admin/AdminBannerManager';

// Category Banner Managers
import GiftBanners from './pages/admin/GiftBanners';
import MetalBanners from './pages/admin/MetalBanners';
import FestivalBanners from './pages/admin/FestivalBanners';
import WeddingBanners from './pages/admin/WeddingBanners';
import OccasionsBanners from './pages/admin/OccasionsBanners';
import CorporateBanners from './pages/admin/CorporateBanners';

function App() {
  return (
    <Router>
      <Routes>
        {/* Client Store Front Routes */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gray-50 flex flex-col justify-between pb-16 md:pb-0">
              <div>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/my-account" element={<MyAccountPage />} />
                  
                  {/* Store Auxiliary Pages */}
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blogs" element={<Blog />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/offers" element={<Offers />} />

                  {/* 🎀 Shop By Style Category Routes */}
                  <Route path="/styles/bags-style" element={<Bagsstyle />} />
                  <Route path="/styles/boat-style" element={<Boatstyle />} />
                  <Route path="/styles/closed-boxes" element={<Closedboxes />} />
                  <Route path="/styles/hats-style" element={<Hatsstyle />} />
                  <Route path="/styles/jhula-style" element={<Jhulastyle />} />
                  <Route path="/styles/ring-style" element={<Ringstyle />} />
                </Routes>
              </div>
              <Footer />
              
              {/* Mobile Fixed Bottom Widget (Home, Shop, My Account) */}
              <MobileBottomNav />
            </div>
          }
        />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminAddProduct />} />
          <Route path="banners" element={<AdminBannerManager />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="categories" element={<AdminCategories />} />

          {/* All 6 Dedicated Category Banners Routes */}
          <Route path="gift-banners" element={<GiftBanners />} />
          <Route path="metal-banners" element={<MetalBanners />} />
          <Route path="festival-banners" element={<FestivalBanners />} />
          <Route path="wedding-banners" element={<WeddingBanners />} />
          <Route path="occasions-banners" element={<OccasionsBanners />} />
          <Route path="corporate-banners" element={<CorporateBanners />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
