import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

// Product Assets Import (Fallback)
import giftImg1 from '../assets/pr1.png';
import giftImg2 from '../assets/pr2.png';
import giftImg3 from '../assets/pr3.png';
import giftImg4 from '../assets/pr4.png';
import giftImg5 from '../assets/pr5.png';
import giftImg6 from '../assets/pr6.png';
import giftImg7 from '../assets/pr7.png';
import giftImg8 from '../assets/pr8.png';

export const giftHampersData = {
  id: "gift",
  name: "Gift Hampers",
  topBgGradient: "from-rose-100/80 via-pink-50 to-white",
  searchPlaceholder: "Search Luxury Hampers, Chocolates & Occasion Gifts",
  newArrivals: [
    { id: "gh-1", name: "Royal Velvet Birthday Basket", price: 2499, originalPrice: 2999, img: giftImg1 },
    { id: "gh-2", name: "Luxury Couples Romance Trunk", price: 3999, originalPrice: 4500, img: giftImg2 },
    { id: "gh-3", name: "Gourmet Artisan Chocolate Box", price: 1850, originalPrice: 2200, img: giftImg3 },
    { id: "gh-4", name: "Handcrafted Keepsake Memory Trunk", price: 2990, originalPrice: 3400, img: giftImg4 },
  ],
  bestOffers: [
    { id: "gh-bo-1", name: "Grand Celebration Gourmet Box", price: 1999, originalPrice: 2999, img: giftImg5 },
    { id: "gh-bo-2", name: "Golden Treasure Sweet Box", price: 2199, originalPrice: 3199, img: giftImg6 },
    { id: "gh-bo-3", name: "Radiant Bliss Flower & Treats", price: 1699, originalPrice: 2499, img: giftImg7 },
    { id: "gh-bo-4", name: "Signature Royal Dry Fruit Trunk", price: 3499, originalPrice: 4999, img: giftImg8 },
  ],
  popularBaskets: [
    { id: "gh-5", name: "Sweet Blossoms Bloom Box", price: 2199, originalPrice: 2599, img: giftImg5 },
    { id: "gh-6", name: "Golden Celebration Hamper", price: 3200, originalPrice: 3700, img: giftImg6 },
    { id: "gh-7", name: "Golden Party Surprise Hamper", price: 2299, originalPrice: 2699, img: giftImg7 },
    { id: "gh-8", name: "Cute Pastel Goodies Tray", price: 1799, originalPrice: 2099, img: giftImg8 },
  ],
  allProducts: [
    { id: "gh-all-1", name: "Royal Velvet Birthday Basket", price: 2499, originalPrice: 2999, img: giftImg1 },
    { id: "gh-all-2", name: "Luxury Couples Romance Trunk", price: 3999, originalPrice: 4500, img: giftImg2 },
    { id: "gh-all-3", name: "Gourmet Artisan Chocolate Box", price: 1850, originalPrice: 2200, img: giftImg3 },
    { id: "gh-all-4", name: "Handcrafted Keepsake Memory Trunk", price: 2990, originalPrice: 3400, img: giftImg4 },
    { id: "gh-all-5", name: "Grand Celebration Gourmet Box", price: 1999, originalPrice: 2999, img: giftImg5 },
    { id: "gh-all-6", name: "Golden Treasure Sweet Box", price: 2199, originalPrice: 3199, img: giftImg6 },
    { id: "gh-all-7", name: "Radiant Bliss Flower & Treats", price: 1699, originalPrice: 2499, img: giftImg7 },
    { id: "gh-all-8", name: "Signature Royal Dry Fruit Trunk", price: 3499, originalPrice: 4999, img: giftImg8 },
  ]
};

// Reusable Product Card
function ProductCard({ item, index = 0 }) {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();

  const itemId = item._id || item.id;

  // Active Google User Helper
  const getCurrentUser = () => {
    try {
      const u = localStorage.getItem('handyUser');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();
  const wishlistKey = currentUser ? `handy_wishlist_${currentUser.email}` : 'handy_wishlist_guest';

  // Read saved wishlist from active user ID
  const savedWishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
  const isLiked = Array.isArray(savedWishlist) && savedWishlist.some((w) => (w._id || w.id) === itemId);

  // Preserve scroll position (removed window.scrollTo)
  const handleOpen = () => {
    if (!itemId) return;
    navigate(`/product/${itemId}`);
  };

  // Direct ID-Safe Wishlist Toggle
  const handleHeartClick = (e) => {
    e.stopPropagation();

    let currentWishlist = [];
    try {
      const userSaved = currentUser ? localStorage.getItem(wishlistKey) : null;
      const genericSaved = localStorage.getItem('wishlist');
      if (userSaved) currentWishlist = JSON.parse(userSaved);
      else if (genericSaved) currentWishlist = JSON.parse(genericSaved);
    } catch (err) {
      console.error(err);
    }

    const idx = currentWishlist.findIndex((w) => (w._id || w.id) === itemId);
    const formattedItem = {
      ...item,
      id: itemId,
      _id: itemId,
      title: item.name || item.title,
      mainImage: item.img || item.mainImage,
      price: item.price
    };

    if (idx > -1) {
      currentWishlist.splice(idx, 1);
    } else {
      currentWishlist.push(formattedItem);
    }

    localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
    if (currentUser) {
      localStorage.setItem(wishlistKey, JSON.stringify(currentWishlist));
    }
    window.dispatchEvent(new Event('storage'));

    if (toggleWishlist) {
      toggleWishlist(formattedItem);
    }
  };

  // Direct ID-Safe Cart Insertion (First time 5 units, then +1)
  const handleDirectAddToCart = (e) => {
    e.stopPropagation();

    try {
      const userKey = currentUser ? `handy_cart_${currentUser.email}` : 'handy_cart_guest';

      let existingCart = [];
      const userSaved = currentUser ? localStorage.getItem(userKey) : null;
      const genericSaved = localStorage.getItem('cart');

      if (userSaved) existingCart = JSON.parse(userSaved);
      else if (genericSaved) existingCart = JSON.parse(genericSaved);

      const idx = existingCart.findIndex((p) => (p.id || p._id) === itemId);

      if (idx > -1) {
        existingCart[idx].quantity = (Number(existingCart[idx].quantity) || 0) + 1;
      } else {
        existingCart.push({
          id: itemId,
          _id: itemId,
          name: item.name || item.title,
          price: Number(item.price) || 0,
          image: item.img || item.mainImage,
          img: item.img || item.mainImage,
          quantity: 5, // minimum 5 pcs bulk rule
        });
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      if (currentUser) {
        localStorage.setItem(userKey, JSON.stringify(existingCart));
      }
      window.dispatchEvent(new Event('storage'));

      const btn = e.currentTarget;
      btn.innerText = 'Added ✓ (5 Units)';
      setTimeout(() => {
        btn.innerText = 'Add to Cart 🛒';
      }, 1200);
    } catch (err) {
      console.error('Gift cart error:', err);
    }
  };

  return (
    <div 
      onClick={handleOpen}
      className={`group bg-white rounded-2xl p-2.5 md:p-3 border border-stone-100 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer relative ${
        index >= 6 ? 'hidden md:flex' : 'flex'
      }`}
    >
      {/* Wishlist Button */}
      <button 
        type="button"
        onClick={handleHeartClick}
        className="absolute top-4 right-4 z-20 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur-md border border-rose-100 flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-all"
        title="Add to Wishlist"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill={isLiked ? "#f43f5e" : "none"} 
          stroke={isLiked ? "#f43f5e" : "#9ca3af"} 
          strokeWidth="2" 
          className="w-4 h-4 transition-colors"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>

      <div>
        {/* Uniform Zoom Container */}
        <div className="h-36 md:h-52 rounded-xl overflow-hidden bg-rose-50/40 relative flex items-center justify-center">
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover scale-105 group-hover:scale-115 transition-transform duration-500"
          />
        </div>
        <div className="mt-2.5">
          <h3 className="text-xs md:text-sm font-extrabold text-stone-800 line-clamp-1 group-hover:text-rose-600 transition-colors">
            {item.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs md:text-base font-black text-rose-600">₹{item.price}</span>
            {item.originalPrice && (
              <span className="text-[10px] md:text-xs text-stone-400 line-through">₹{item.originalPrice}</span>
            )}
          </div>
        </div>
      </div>

      {/* Direct Add to Cart Action */}
      <button 
        type="button"
        onClick={handleDirectAddToCart}
        className="w-full mt-2.5 py-1.5 md:py-2 bg-stone-900 hover:bg-rose-600 text-white font-extrabold text-[11px] md:text-xs rounded-xl shadow-xs transition-colors duration-200 cursor-pointer active:scale-95"
      >
        Add to Cart 🛒
      </button>
    </div>
  );
}

// Banner Slot Renderer with Click Link & Fallback
function BannerSlot({ banner, fallbackBanner, slotLabel, heightClass = "", aspectClass = "", isLarge = false }) {
  const navigate = useNavigate();
  const activeImage = banner?.image || fallbackBanner?.image;
  const activeLink = banner?.link || banner?.targetUrl || fallbackBanner?.link || fallbackBanner?.targetUrl;

  const handleClick = () => {
    if (!activeLink) return;
    if (activeLink.startsWith('http://') || activeLink.startsWith('https://')) {
      window.open(activeLink, '_blank', 'noopener,noreferrer');
    } else {
      navigate(activeLink);
    }
  };

  if (activeImage) {
    return (
      <div 
        onClick={handleClick}
        className={`w-full ${heightClass} ${aspectClass} rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative group ${
          activeLink ? 'cursor-pointer' : ''
        }`}
      >
        <img
          src={activeImage}
          alt={slotLabel}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />
      </div>
    );
  }

  return (
    <div className={`w-full ${heightClass} ${aspectClass} border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center bg-stone-50/90 text-stone-400 gap-1 select-none`}>
      <span className={isLarge ? "text-3xl" : "text-2xl"}>🖼️</span>
      <span className="text-[11px] md:text-xs font-black uppercase tracking-wider text-stone-500">Banner Not Found</span>
      <span className="text-[9px] text-stone-400">{slotLabel}</span>
    </div>
  );
}

export default function GiftHampers() {
  const [desktopBanners, setDesktopBanners] = useState({});
  const [mobileBanners, setMobileBanners] = useState({});
  const [loading, setLoading] = useState(true);

  // Live Database Products
  const [offersProducts, setOffersProducts] = useState(giftHampersData.bestOffers);
  const [arrivalsProducts, setArrivalsProducts] = useState(giftHampersData.newArrivals);
  const [popularProducts, setPopularProducts] = useState(giftHampersData.popularBaskets);
  const [allProductsList, setAllProductsList] = useState(giftHampersData.allProducts);

  useEffect(() => {
    fetch('https://handy-hampers.onrender.com/api/banners')
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const desk = {};
        const mob = {};

        data.forEach((b) => {
          if (b.type === 'giftHampersDesktop' && b.slotIndex !== null) desk[b.slotIndex] = b;
          if (b.type === 'giftHampersMobile' && b.slotIndex !== null) mob[b.slotIndex] = b;
        });

        setDesktopBanners(desk);
        setMobileBanners(mob);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    fetch('https://handy-hampers.onrender.com/api/products')
      .then((res) => res.json())
      .then((products) => {
        if (Array.isArray(products) && products.length > 0) {
          const formatted = products.map((p) => {
            let displayImg = p.mainImage || (p.images && p.images[0]) || '';
            let displayPrice = p.price;
            let displayMrp = p.mrp;

            if (p.isVariable && p.variants?.length > 0) {
              const firstVariant = p.variants.find((v) => v.images?.[0] || v.image) || p.variants[0];
              displayImg = firstVariant?.images?.[0] || firstVariant?.image || displayImg;
              const prices = p.variants.map((v) => Number(v.price)).filter(Boolean);
              if (prices.length > 0) displayPrice = Math.min(...prices);
              displayMrp = firstVariant?.mrp || displayMrp;
            }

            return {
              id: p._id || p.id,
              _id: p._id || p.id,
              name: p.title || p.name || 'Gift Hamper Basket',
              title: p.title || p.name || 'Gift Hamper Basket',
              price: displayPrice || 1499,
              originalPrice: displayMrp || null,
              img: displayImg || giftImg1
            };
          });

          const giftFiltered = formatted.filter(
            (p) => String(p.title).toLowerCase().includes('gift') || String(p.name).toLowerCase().includes('gift')
          );

          const basePool = giftFiltered.length >= 4 ? giftFiltered : formatted;
          const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

          setOffersProducts(shuffle(basePool).slice(0, 8));
          setArrivalsProducts(shuffle(basePool).slice(0, 8));
          setPopularProducts(shuffle(basePool).slice(0, 8));
          setAllProductsList(shuffle(formatted).slice(0, 8));
        }
      })
      .catch((err) => console.error('Gift products load error:', err));
  }, []);

  return (
    <div className="w-full space-y-8 md:space-y-12 pb-20 px-3 md:px-12 pt-2 md:pt-4">

      {/* ================= 1. BANNERS SECTION ================= */}
      <section className="w-full">
        {loading ? (
          <div className="w-full h-56 md:h-80 rounded-2xl bg-stone-100 animate-pulse flex items-center justify-center text-xs font-bold text-stone-400">
            Loading Banners...
          </div>
        ) : (
          <>
            <div className="hidden md:grid md:grid-cols-12 gap-4">
              <div className="md:col-span-7 flex">
                <BannerSlot
                  banner={desktopBanners[0]}
                  slotLabel="Desktop Slot #1"
                  heightClass="h-[460px]"
                  isLarge={true}
                />
              </div>

              <div className="md:col-span-5 flex flex-col gap-4 justify-between">
                <BannerSlot
                  banner={desktopBanners[1]}
                  slotLabel="Desktop Slot #2"
                  heightClass="h-[222px]"
                />
                <BannerSlot
                  banner={desktopBanners[2]}
                  slotLabel="Desktop Slot #3"
                  heightClass="h-[222px]"
                />
              </div>
            </div>

            <div className="block md:hidden space-y-3">
              <BannerSlot
                banner={mobileBanners[0]}
                fallbackBanner={desktopBanners[0]}
                slotLabel="Mobile Slot #1 (Top)"
                heightClass="h-44"
              />

              <div className="grid grid-cols-2 gap-3">
                <BannerSlot
                  banner={mobileBanners[1]}
                  fallbackBanner={desktopBanners[1]}
                  slotLabel="Mobile Slot #2 (Left Square)"
                  aspectClass="aspect-square"
                />
                <BannerSlot
                  banner={mobileBanners[2]}
                  fallbackBanner={desktopBanners[2]}
                  slotLabel="Mobile Slot #3 (Right Square)"
                  aspectClass="aspect-square"
                />
              </div>
            </div>
          </>
        )}
      </section>

      {/* ================= 2. BEST OFFERS ================= */}
      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 pb-2">
          <div>
            <h2 className="text-sm md:text-2xl font-black text-stone-900 flex items-center gap-1.5">
              🔥 Best Offers & Deals
            </h2>
            <p className="text-[11px] md:text-xs text-stone-400">Curated special discounts on luxury gifts</p>
          </div>
          <span className="text-xs font-bold text-rose-600 cursor-pointer hover:underline">View All →</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-6">
          {offersProducts.slice(0, 8).map((item, index) => (
            <ProductCard key={item.id || item._id} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* ================= 3. NEW ARRIVALS ================= */}
      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 pb-2">
          <div>
            <h2 className="text-sm md:text-2xl font-black text-stone-900 flex items-center gap-1.5">
              ✨ Fresh New Arrivals
            </h2>
            <p className="text-[11px] md:text-xs text-stone-400">Newly added items for festive season</p>
          </div>
          <span className="text-xs font-bold text-rose-600 cursor-pointer hover:underline">View All →</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-6">
          {arrivalsProducts.slice(0, 8).map((item, index) => (
            <ProductCard key={item.id || item._id} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* ================= 4. POPULAR GIFTS ================= */}
      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 pb-2">
          <div>
            <h2 className="text-sm md:text-2xl font-black text-stone-900 flex items-center gap-1.5">
              ⭐ Most Loved Hampers
            </h2>
            <p className="text-[11px] md:text-xs text-stone-400">Top-rated gift boxes chosen by customers</p>
          </div>
          <span className="text-xs font-bold text-rose-600 cursor-pointer hover:underline">View All →</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-6">
          {popularProducts.slice(0, 8).map((item, index) => (
            <ProductCard key={item.id || item._id} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* ================= 5. ALL PRODUCTS ================= */}
      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between border-b border-rose-100 pb-2">
          <div>
            <h2 className="text-sm md:text-2xl font-black text-stone-900 flex items-center gap-1.5">
              🎁 All Gift Hampers
            </h2>
            <p className="text-[11px] md:text-xs text-stone-400">Explore the complete catalogue</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-6">
          {allProductsList.slice(0, 8).map((item, index) => (
            <ProductCard key={item.id || item._id} item={item} index={index} />
          ))}
        </div>
      </section>

    </div>
  );
}