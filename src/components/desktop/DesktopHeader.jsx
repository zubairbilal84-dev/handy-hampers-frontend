import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import logoIcon from '../../assets/logo.png';
import homeIcon from '../../assets/home.png';

export default function DesktopHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [showTopBar, setShowTopBar] = useState(true);

  // Active Google User & Cart/Wishlist Counts State
  const [userProfile, setUserProfile] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Helper function: Real user data aur counts storage se read karna
  const syncHeaderState = () => {
    try {
      // 1. User Profile load karein
      const savedUser = localStorage.getItem('handyUser');
      const currentUser = savedUser ? JSON.parse(savedUser) : null;
      setUserProfile(currentUser);

      // 2. Cart Count load karein (ID specific key priority)
      const userCartKey = currentUser ? `handy_cart_${currentUser.email}` : 'handy_cart_guest';
      let cartItems = [];
      const userSavedCart = currentUser ? localStorage.getItem(userCartKey) : null;
      const genericCart = localStorage.getItem('cart');

      if (userSavedCart) cartItems = JSON.parse(userSavedCart);
      else if (genericCart) cartItems = JSON.parse(genericCart);

      const totalQty = Array.isArray(cartItems)
        ? cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
        : 0;
      setCartCount(totalQty);

      // 3. Wishlist Count load karein (ID specific key priority)
      const userWishlistKey = currentUser ? `handy_wishlist_${currentUser.email}` : 'handy_wishlist_guest';
      let wishlistItems = [];
      const userSavedWish = currentUser ? localStorage.getItem(userWishlistKey) : null;
      const genericWish = localStorage.getItem('wishlist');

      if (userSavedWish) wishlistItems = JSON.parse(userSavedWish);
      else if (genericWish) wishlistItems = JSON.parse(genericWish);

      setWishlistCount(Array.isArray(wishlistItems) ? wishlistItems.length : 0);
    } catch (err) {
      console.error('Header state sync error:', err);
    }
  };

  // Initial load + Real-time storage change listener
  useEffect(() => {
    syncHeaderState();

    const handleStorageChange = () => {
      syncHeaderState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', syncHeaderState);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', syncHeaderState);
    };
  }, [location.pathname]);

  // Window Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setShowTopBar(false);
      } else {
        setShowTopBar(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/products');
    }
  };

  // Shipping Truck Text Animation State
  // Shipping Truck Text Animation State
  const shippingLines = [
    "PAN India Safe Delivery",
    "Express 2-Hour Delivery Available",
    "100% Breakage-Free Insured Gifting",
    "Luxury Handcrafted Hampers",
    "Free Gift Wrapping On All Orders"
  ];

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [flipClass, setFlipClass] = useState("");
  const [truckAnimating, setTruckAnimating] = useState(false);

  useEffect(() => {
    let timerId;

    const runMasterLoop = () => {
      setFlipClass("text-flip-out");

      setTimeout(() => {
        setCurrentLineIndex((prevIndex) => (prevIndex + 1) % shippingLines.length);
        setFlipClass("text-flip-in");

        setTimeout(() => {
          setFlipClass("");
        }, 400);
      }, 250);

      setTimeout(() => {
        setTruckAnimating(true);
      }, 1200);

      setTimeout(() => {
        setTruckAnimating(false);
        timerId = setTimeout(runMasterLoop, 300);
      }, 4800);
    };

    const initialTimer = setTimeout(runMasterLoop, 1000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(timerId);
    };
  }, [shippingLines.length]);

  const isCatActive = (catKey) => {
    if (catKey === 'all') {
      return location.pathname === '/' && (new URLSearchParams(location.search).get('cat') === 'all' || !new URLSearchParams(location.search).get('cat'));
    }
    return new URLSearchParams(location.search).get('cat') === catKey;
  };

  return (
    <>
      {/* 🛑 Placeholder Spacer */}
      <div className="hidden md:block h-[155px]" />

      <header className="hidden md:block fixed top-0 inset-x-0 w-full z-50 bg-white border-b border-gray-100 shadow-xs transition-all duration-300">
        
        {/* 1. TOP UTILITY BAR */}
        <div 
          className={`bg-[#2C1A11] text-stone-200 text-[11px] font-bold border-b border-[#3D2518] transition-all duration-300 ease-in-out overflow-hidden ${
            showTopBar ? 'max-h-12 py-1.5 opacity-100' : 'max-h-0 py-0 opacity-0 border-b-0'
          }`}
        >
          <div className="max-w-[1440px] mx-auto px-4 lg:px-10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400">
              <i className="fa-solid fa-sparkles text-xs"></i>
              <span>India's Premier Luxury Hamper & Custom Gifting Store</span>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <Link to="/contact" className="hover:text-amber-400 transition flex items-center gap-1.5">
                <i className="fa-regular fa-circle-question text-xs text-amber-500"></i>
                <span>Help</span>
              </Link>

              <span className="text-stone-600">|</span>

              <Link to="/my-orders" className="hover:text-amber-400 transition flex items-center gap-1.5">
                <i className="fa-solid fa-box-open text-xs text-amber-500"></i>
                <span>My Orders</span>
              </Link>

              <span className="text-stone-600">|</span>

              <Link to="/track-order" className="hover:text-amber-400 transition flex items-center gap-1.5">
                <i className="fa-solid fa-truck-fast text-xs text-amber-500"></i>
                <span>Track Order</span>
              </Link>

              <span className="text-stone-600">|</span>

              <Link to="/refund-policy" className="hover:text-amber-400 transition flex items-center gap-1.5">
                <i className="fa-solid fa-arrow-rotate-left text-xs text-amber-500"></i>
                <span>Refund Policy</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. MIDDLE MAIN LAYER */}
        <div className="px-4 lg:px-10 py-3 border-b border-gray-100 bg-white">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
            
            {/* BRAND LOGO */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative">
                <img
                  src={logoIcon}
                  alt="Handy Hampers Logo"
                  className="h-12 w-auto object-contain animate-logo-sway filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-[#2C1A11] leading-tight">
                  Handy <span className="text-amber-600">Hampers</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-700 block">
                  Bulk & Custom Gifting
                </span>
              </div>
            </Link>

            {/* SEARCH BAR */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-2 relative hidden md:block">
              <div className="flex items-center bg-[#F8F9FA] rounded-full overflow-hidden w-full h-[42px] border border-amber-200 focus-within:border-amber-600 focus-within:bg-white transition-all duration-300 shadow-2xs">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search hampers, chocolates, festive boxes..."
                  className="w-full bg-transparent pl-5 pr-10 py-2 text-[13px] outline-none text-gray-700 placeholder-gray-400 font-medium"
                />
                <button type="submit" className="pr-4 text-amber-600 hover:text-emerald-800 transition duration-200 cursor-pointer">
                  <i className="fa-solid fa-magnifying-glass text-lg hover:scale-125 transition-transform inline-block"></i>
                </button>
              </div>
            </form>

            {/* ABOUT & CONTACT */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <Link
                to="/about"
                className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl transition-all duration-300 ease-out group shadow-2xs hover:shadow-md hover:shadow-stone-900/10 hover:-translate-y-0.5 border ${
                  location.pathname === '/about'
                    ? 'bg-[#EBDCD0] border-amber-400 text-amber-950 font-black'
                    : 'bg-[#F5EBE1] hover:bg-[#EBDCD0] text-[#2C1A11] border-[#E8D8C8]'
                }`}
              >
                <i className="fa-regular fa-circle-question text-base text-emerald-700 group-hover:scale-120 group-hover:rotate-12 transition-transform duration-300"></i>
                <span className="text-sm font-bold tracking-tight">About</span>
              </Link>

              <Link
                to="/contact"
                className={`flex items-center gap-2.5 px-5 py-2 rounded-2xl transition-all duration-300 ease-out group shadow-sm hover:shadow-lg hover:shadow-emerald-950/25 hover:-translate-y-0.5 border ${
                  location.pathname === '/contact'
                    ? 'bg-amber-600 border-amber-500 text-white font-black'
                    : 'bg-[#1E2421] hover:bg-[#111614] text-white border-[#2E3632]'
                }`}
              >
                <i className="fa-regular fa-envelope text-base text-gray-200 group-hover:scale-120 group-hover:-rotate-12 transition-transform duration-300"></i>
                <span className="text-sm font-bold tracking-tight">Contact</span>
              </Link>
            </div>

            {/* WISHLIST, ACCOUNT & CART */}
            <div className="flex items-center gap-3 shrink-0 pl-1">
              
              {/* WISHLIST BUTTON (ID Synced) */}
              <Link
                to="/wishlist"
                className="relative w-11 h-11 rounded-2xl bg-[#FDEEE4] hover:bg-[#FCD8C5] border border-[#FADCCB] flex items-center justify-center text-[#B24429] transition-all duration-300 shadow-2xs group cursor-pointer"
                title="Wishlist"
              >
                <i className="fa-regular fa-heart text-xl group-hover:scale-125 group-hover:text-rose-600 transition-transform duration-300"></i>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* ACCOUNT BUTTON (Real Google Name/Pic) */}
              <Link
                to="/my-account"
                className="animate-shimmer flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-amber-300 cursor-pointer group"
              >
                {userProfile?.picture ? (
                  <img
                    src={userProfile.picture}
                    alt={userProfile.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-900 shrink-0"
                  />
                ) : (
                  <i className="fa-solid fa-user-gear text-lg text-slate-950 group-hover:scale-125 transition-transform duration-300"></i>
                )}
                
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-950">
                    My Account
                  </span>
                  <span className="text-[10px] font-extrabold text-amber-950/90 truncate max-w-[85px]">
                    {userProfile?.name ? userProfile.name.split(' ')[0] : 'Sign In'}
                  </span>
                </div>
              </Link>

              {/* CART BUTTON (ID Synced Quantity) */}
              <Link
                to="/cart"
                className="relative w-11 h-11 rounded-2xl bg-[#E6F0EB] hover:bg-[#D5E6DC] border border-[#C8DFD2] flex items-center justify-center text-[#1E4D38] transition-all duration-300 shadow-2xs group cursor-pointer"
                title="Shopping Cart"
              >
                <i className="fa-solid fa-bag-shopping text-xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-emerald-950 text-[10px] font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

          </div>
        </div>

        {/* 3. BOTTOM NAV LAYER */}
        <div className="bg-[#ECECEC] border-b border-[#DFDFDF] px-4 lg:px-10 hidden md:block overflow-x-clip">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            
            <nav className="flex items-center gap-1">
              <Link
                to="/?cat=all"
                className={`flex items-center gap-1.5 font-black text-[13px] tracking-wide px-3 py-3 transition group ${
                  isCatActive('all') ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-900 hover:text-amber-600'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-300 shrink-0">
                  <img src={homeIcon} alt="Home Icon" className="w-full h-full object-contain filter drop-shadow-2xs" />
                </div>
                <span className="text-[13px]">HOME</span>
              </Link>

              <span className="text-gray-300 font-bold mx-0.5">|</span>

              {[
                { key: 'gift', label: 'GIFT' },
                { key: 'metal', label: 'METAL' },
                { key: 'festival', label: 'FESTIVAL' },
                { key: 'wedding', label: 'WEDDING' },
                { key: 'occasions', label: 'OCCASIONS' },
                { key: 'corporate', label: 'CORPORATE' }
              ].map(cat => (
                <Link 
                  key={cat.key}
                  to={`/?cat=${cat.key}`} 
                  className={`font-bold text-[13px] tracking-wide px-3 py-3 transition ${
                    isCatActive(cat.key) ? 'text-amber-600 border-b-2 border-amber-600 font-black' : 'text-gray-800 hover:text-amber-600'
                  }`}
                >
                  {cat.label}
                </Link>
              ))}

              <span className="text-gray-300 font-bold mx-0.5">|</span>

              <Link
                to="/products"
                className={`flex items-center gap-2 font-extrabold text-[13px] tracking-wide px-3 py-3 transition group ${
                  location.pathname === '/products' ? 'text-amber-600 border-b-2 border-amber-600 font-black' : 'text-gray-800 hover:text-amber-600'
                }`}
              >
                <i className="fa-solid fa-store text-emerald-700 text-sm group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 inline-block"></i>
                <span>SHOP</span>
              </Link>

              <Link
                to="/blogs"
                className={`flex items-center gap-2 font-extrabold text-[13px] tracking-wide px-3 py-3 transition group ${
                  location.pathname === '/blogs' || location.pathname === '/blog' ? 'text-amber-600 border-b-2 border-amber-600 font-black' : 'text-gray-800 hover:text-amber-600'
                }`}
              >
                <i className="fa-solid fa-newspaper text-rose-600 text-sm group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-300 inline-block"></i>
                <span>BLOG</span>
              </Link>
              <span className="text-gray-300 font-bold mx-1">|</span>

              {/* Special Offers Badge */}
              <div className="relative inline-flex items-center my-auto ml-2 mr-auto px-2 select-none">
                <span className="absolute -top-2 left-1 text-[11px] text-amber-400 font-black pointer-events-none anim-star-a">★</span>
                <span className="absolute -bottom-1 left-4 w-2.5 h-2.5 rounded-full border border-pink-500 pointer-events-none anim-ring-a"></span>
                <span className="absolute -top-2.5 right-6 text-[10px] text-rose-500 font-black pointer-events-none anim-star-b">✦</span>
                <span className="absolute -bottom-1.5 right-1 w-2.5 h-2.5 rounded-full border border-yellow-400 pointer-events-none anim-ring-b"></span>
                <span className="absolute top-1/2 -right-2 text-[9px] text-pink-400 font-black pointer-events-none anim-star-c">★</span>
                <span className="absolute top-1 -left-2 w-1.5 h-1.5 rounded-full bg-yellow-400 pointer-events-none anim-star-b"></span>

                <Link
                  to="/offers"
                  className="anim-pro-float relative inline-flex items-center group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
                  title="Special Offers"
                >
                  <div className="absolute -top-2.5 left-2.5 z-20 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[8px] uppercase tracking-wider px-2 py-0.2 rounded-t-[3px] rounded-br-[5px] shadow-[0_2px_4px_rgba(249,115,22,0.4)] transform -rotate-3 border-b border-orange-700">
                    SPECIAL
                    <span className="inline-block ml-0.5 text-[7px] animate-pulse">⚡</span>
                  </div>

                  <div className="bg-[#121214] hover:bg-black text-white pl-3.5 pr-3 py-1 rounded-l-[4px] rounded-r-xl shadow-[3px_3px_0px_#e11d48] group-hover:shadow-[4px_4px_0px_#f43f5e] transition-all duration-300 flex items-center gap-1.5 transform -skew-x-6 border-r-2 border-pink-500">
                    <span className="font-black text-[13px] tracking-wider uppercase transform skew-x-6 leading-none">
                      OFF<span className="text-pink-500 group-hover:text-pink-400 transition-colors">ERS</span>
                    </span>
                    <span className="text-xs transform skew-x-6 inline-block group-hover:rotate-12 transition-transform duration-300 animate-bounce">
                      🔥
                    </span>
                  </div>
                </Link>
              </div>
            </nav>

            {/* TRUCK ANIMATION SECTION */}
            <div className="relative flex items-center h-[44px] pr-3 border-l border-gray-300 select-none">
              <div className="relative w-0 h-9 shrink-0 z-40">
                <div
                  className={`absolute left-0 top-0 w-9 h-9 transform-gpu origin-bottom-center ${
                    truckAnimating ? 'run-truck-animation' : 'idle-truck-vibe'
                  }`}
                >
                  <svg viewBox="0 0 64 64" className="w-full h-full filter drop-shadow-xs" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18H42V44H6V18Z" fill="#EA580C" rx="2" />
                    <path d="M42 24H52L58 34V44H42V24Z" fill="#0D9488" rx="2" />
                    <circle cx="14.5" cy="45.5" r="5.5" fill="#1F2937" />
                    <circle cx="49.5" cy="45.5" r="5.5" fill="#1F2937" />
                  </svg>
                </div>
              </div>

              <div className="pl-10 [perspective:400px] h-6 w-[270px] max-w-[270px] flex items-center justify-start overflow-hidden relative">
                <span
                  title={shippingLines[currentLineIndex]}
                  className={`text-flip-element text-[13px] font-extrabold tracking-wide bg-gradient-to-r from-emerald-800 via-orange-600 to-amber-600 bg-clip-text text-transparent uppercase truncate whitespace-nowrap leading-none block w-full ${flipClass}`}
                >
                  {shippingLines[currentLineIndex]}
                </span>
              </div>
            </div>

          </div>
        </div>

      </header>
    </>
  );
}