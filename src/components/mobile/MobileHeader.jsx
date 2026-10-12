import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import logoIcon from '../../assets/logo.png';

// 🎨 Local Basket Icons (Color vs Black from src/assets/icons/)
import GiftColor from '../../assets/icons/GiftColor.png';
import GiftBlack from '../../assets/icons/GiftBlack.png';

import MetalColor from '../../assets/icons/MetalColor.png';
import MetalBlack from '../../assets/icons/MetalBlack.png';

import CorporateColor from '../../assets/icons/Corporotecolor.png'; // File name exactly as in explorer
import CorporateBlack from '../../assets/icons/CorporateBlack.png';

import FestivalColor from '../../assets/icons/FestivalColor.png';
import FestivalBlack from '../../assets/icons/FestivalBlack.png';

import OccasionsColor from '../../assets/icons/OccasionsColor.png';
import OccasionsBlack from '../../assets/icons/OccasionsBlack.png';

import WeddingColor from '../../assets/icons/WeddingColor.png';
import WeddingBlack from '../../assets/icons/WeddingBlack.png';

// Category Data Imports
import { allHampersData } from '../../data/allHampers.jsx';
import { giftHampersData } from '../../data/giftHampers.jsx';
import { metalHampersData } from '../../data/metalHampers.jsx';
import { corporateHampersData } from '../../data/corporateHampers.jsx';
import { festivalHampersData } from '../../data/festivalHampers.jsx';
import { occasionsHampersData } from '../../data/occasionsHampers.jsx';
import { weddingHampersData } from '../../data/weddingHampers.jsx';

const categoryNavItems = [
  { 
    key: 'all', 
    name: 'All Hampers', 
    iconActive: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png', 
    iconInactive: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png', 
    data: allHampersData 
  },
  { 
    key: 'gift', 
    name: 'Gift Hampers', 
    iconActive: GiftColor, 
    iconInactive: GiftBlack, 
    data: giftHampersData || allHampersData 
  },
  { 
    key: 'metal', 
    name: 'Metal Hampers', 
    iconActive: MetalColor, 
    iconInactive: MetalBlack, 
    data: metalHampersData || allHampersData 
  },
  { 
    key: 'corporate', 
    name: 'Corporate', 
    iconActive: CorporateColor, 
    iconInactive: CorporateBlack, 
    data: corporateHampersData || allHampersData 
  },
  { 
    key: 'festival', 
    name: 'Festival', 
    iconActive: FestivalColor, 
    iconInactive: FestivalBlack, 
    data: festivalHampersData || allHampersData 
  },
  { 
    key: 'occasions', 
    name: 'Occasions', 
    iconActive: OccasionsColor, 
    iconInactive: OccasionsBlack, 
    data: occasionsHampersData || allHampersData 
  },
  { 
    key: 'wedding', 
    name: 'Wedding', 
    iconActive: WeddingColor, 
    iconInactive: WeddingBlack, 
    data: weddingHampersData || allHampersData 
  },
];

export default function MobileHeader() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // 🎯 User ID-Safe Dynamic Counters
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const syncUserStats = () => {
      try {
        const userStr = localStorage.getItem('handyUser');
        const currentUser = userStr ? JSON.parse(userStr) : null;

        // 1. User specific Cart Read
        const userCartKey = currentUser ? `handy_cart_${currentUser.email}` : 'handy_cart_guest';
        let cItems = [];
        const uSavedCart = currentUser ? localStorage.getItem(userCartKey) : null;
        const gSavedCart = localStorage.getItem('cart');
        if (uSavedCart) cItems = JSON.parse(uSavedCart);
        else if (gSavedCart) cItems = JSON.parse(gSavedCart);

        const qty = Array.isArray(cItems)
          ? cItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0)
          : 0;
        setTotalQuantity(qty);

        // 2. User specific Wishlist Read
        const userWishKey = currentUser ? `handy_wishlist_${currentUser.email}` : 'handy_wishlist_guest';
        let wItems = [];
        const uSavedWish = currentUser ? localStorage.getItem(userWishKey) : null;
        const gSavedWish = localStorage.getItem('wishlist');
        if (uSavedWish) wItems = JSON.parse(uSavedWish);
        else if (gSavedWish) wItems = JSON.parse(gSavedWish);

        setWishlistCount(Array.isArray(wItems) ? wItems.length : 0);
      } catch (e) {
        console.error(e);
      }
    };

    syncUserStats();
    window.addEventListener('storage', syncUserStats);
    window.addEventListener('focus', syncUserStats);
    return () => {
      window.removeEventListener('storage', syncUserStats);
      window.removeEventListener('focus', syncUserStats);
    };
  }, [location.pathname]);

  const queryParams = new URLSearchParams(location.search);
  const activeCatKey = queryParams.get('cat') || 'all';

  const activeNavItem = categoryNavItems.find(item => item.key === activeCatKey) || categoryNavItems[0];
  const activeData = activeNavItem.data;

  const topGradient = activeData?.topBgGradient || 'from-amber-100/80 via-yellow-50 to-white';
  const searchPlaceholderText = activeData?.searchPlaceholder || 'hampers, chocolates...';

  // Smooth Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`sticky top-0 z-50 transition-all duration-300 ease-in-out pb-1 rounded-b-3xl ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-[2px] shadow-sm border-b border-amber-900/10' 
        : `bg-gradient-to-b ${topGradient} shadow-xs`
    }`}>
      
      {/* TOP BAR: LOGO & ICONS AREA */}
      <div className={`relative flex items-center px-4 transition-all duration-300 ${
        isScrolled ? 'justify-center pt-2 pb-1 min-h-[44px]' : 'justify-between pt-3 pb-2 min-h-[60px]'
      }`}>
        
        {/* LOGO (Gentle Swing Effect) */}
        <div className={`transition-all duration-300 ease-out z-20 ${
          isScrolled 
            ? 'flex justify-center w-full' 
            : 'flex justify-start'
        }`}>
          <style>{`
            @keyframes gentleLogoSway {
              0% { transform: rotate(0deg); }
              25% { transform: rotate(4deg); }
              50% { transform: rotate(-4deg); }
              75% { transform: rotate(2deg); }
              100% { transform: rotate(0deg); }
            }
            .sway-logo-icon {
              transform-origin: top center;
              animation: gentleLogoSway 3.2s ease-in-out infinite;
              display: inline-block;
            }
          `}</style>
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="sway-logo-icon">
              <img 
                src={logoIcon} 
                alt="Handy Hampers Logo" 
                className={`object-contain transition-all duration-300 filter drop-shadow-xs ${
                  isScrolled ? 'h-10 w-auto' : 'h-12 w-auto'
                }`} 
              />
            </div>
            <div className="flex flex-col text-left">
              <span className={`font-black tracking-tight text-[#2C1A11] leading-none transition-all duration-300 ${
                isScrolled ? 'text-lg' : 'text-xl'
              }`}>
                Handy <span className="text-amber-600">Hampers</span>
              </span>
              <span className={`font-extrabold text-amber-800 tracking-wider uppercase transition-all duration-300 ${
                isScrolled ? 'text-[9px]' : 'text-[10px]'
              }`}>
                Luxury Basket Gifting
              </span>
            </div>
          </Link>
        </div>

        {/* TOP RIGHT ICONS */}
        <div className={`flex flex-col items-end gap-1.5 z-20 transition-all duration-200 ${
          isScrolled 
            ? 'hidden opacity-0 pointer-events-none' 
            : 'flex opacity-100'
        }`}>
          <div className="flex items-center gap-2.5">
            <Link
              to="/wishlist"
              className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-[1.5px] shadow-sm active:scale-95 transition-transform"
              title="Wishlist"
            >
              <div className="w-full h-full bg-white/95 rounded-[10px] flex items-center justify-center text-rose-600">
                <i className="fa-solid fa-heart text-base animate-pulse"></i>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Link>

            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-[1.5px] shadow-sm active:scale-95 transition-transform"
              title="Shopping Cart"
            >
              <div className="w-full h-full bg-white/95 rounded-[10px] flex items-center justify-center text-emerald-800">
                <i className="fa-solid fa-bag-shopping text-base"></i>
                {totalQuantity > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-emerald-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {totalQuantity}
                  </span>
                )}
              </div>
            </Link>
          </div>

          <Link
            to="/contact"
            className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm active:scale-95 transition-all"
          >
            <i className="fa-solid fa-boxes-packing text-[10px]"></i>
            <span>For Bulk Order</span>
          </Link>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className={`px-4 transition-all duration-300 ${
        isScrolled ? 'pt-0.5 pb-1.5' : 'pt-1 pb-2.5'
      }`}>
        <div className="flex items-center bg-white/95 rounded-xl px-3.5 py-2 shadow-xs border border-stone-200/80">
          <i className="fa-solid fa-magnifying-glass text-amber-600 text-xs mr-2.5"></i>
          <input
            type="text"
            placeholder={`Search for ${searchPlaceholderText}...`}
            className="w-full bg-transparent text-xs font-medium text-stone-800 outline-none placeholder-stone-400"
          />
        </div>
      </div>

      {/* CATEGORY ICON MENU WITH ACTIVE (COLOR) / INACTIVE (BLACK) ICONS */}
      <div className={`transition-all duration-300 overflow-hidden ${
        isScrolled 
          ? 'max-h-0 opacity-0 pointer-events-none py-0' 
          : 'max-h-28 opacity-100 flex overflow-x-auto no-scrollbar gap-5 px-4 pt-1 items-end'
      }`}>
        {categoryNavItems.map((item) => {
          const isActive = activeCatKey === item.key;
          const targetUrl = item.key === 'all' ? '/' : `/?cat=${item.key}`;
          const currentIcon = isActive ? item.iconActive : item.iconInactive;

          return (
            <Link 
              key={item.key}
              to={targetUrl}
              className="flex flex-col items-center min-w-[70px] cursor-pointer relative pb-2 transition-all duration-300 shrink-0"
            >
              <img 
                src={currentIcon} 
                alt={item.name}
                className={`w-11 h-11 object-contain mb-1 transition-all duration-300 ${
                  isActive 
                    ? 'scale-110 drop-shadow-sm opacity-100' 
                    : item.key === 'all'
                      ? 'grayscale opacity-60' 
                      : 'opacity-85 hover:opacity-100'
                }`}
              />
              <span className={`text-[11px] font-black tracking-tight whitespace-nowrap transition-colors ${
                isActive ? 'text-stone-900 font-black' : 'text-stone-500 font-bold'
              }`}>
                {item.name}
              </span>
              
              {isActive && (
                <div className="absolute bottom-0 w-full h-[3px] bg-[#E91E63] rounded-t-md"></div>
              )}
            </Link>
          );
        })}
      </div>

    </div>
  );
}