import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

export const corporateHampersData = {
  id: "corporate",
  name: "Corporate Hampers",
  topBgGradient: "from-slate-200/80 via-cyan-50/60 to-white",
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  searchPlaceholder: "executive kits, onboarding swag, bulk client hampers...",

  vipClientGifts: [
    {
      id: "ch-vip-1",
      name: "Signature Leatherette Executive Desk Trunk",
      price: 3899,
      originalPrice: 4800,
      img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: "ch-vip-2",
      name: "Artisanal Pour-Over Coffee & Stainless Flask Kit",
      price: 2499,
      originalPrice: 3200,
      img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: "ch-vip-3",
      name: "Royal Matte Black Gourmet Dry Fruit Caddy",
      price: 2999,
      originalPrice: 3750,
      img: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: "ch-vip-4",
      name: "Smart Tech & Wireless Charger Desk Hamper",
      price: 4499,
      originalPrice: 5500,
      img: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=400&auto=format&fit=crop"
    },
  ],

  employeeKits: [
    {
      id: "ch-emp-1",
      name: "Premium Day-One Welcome Swag Hamper",
      price: 1899,
      originalPrice: 2499,
      img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: "ch-emp-2",
      name: "Eco-Friendly Bamboo Journal & Sipper Box",
      price: 1450,
      originalPrice: 1950,
      img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: "ch-emp-3",
      name: "Milestone Work Anniversary Treat Basket",
      price: 2299,
      originalPrice: 2999,
      img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: "ch-emp-4",
      name: "Wellness & De-Stress Office Goodies Box",
      price: 1750,
      originalPrice: 2300,
      img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&auto=format&fit=crop"
    },
  ],

  allCorporateProducts: [
    { id: "ch-a-1", name: "Signature Leatherette Executive Desk Trunk", price: 3899, originalPrice: 4800, img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop" },
    { id: "ch-a-2", name: "Artisanal Pour-Over Coffee & Stainless Flask Kit", price: 2499, originalPrice: 3200, img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&auto=format&fit=crop" },
    { id: "ch-a-3", name: "Royal Matte Black Gourmet Dry Fruit Caddy", price: 2999, originalPrice: 3750, img: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=400&auto=format&fit=crop" },
    { id: "ch-a-4", name: "Smart Tech & Wireless Charger Desk Hamper", price: 4499, originalPrice: 5500, img: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=400&auto=format&fit=crop" },
    { id: "ch-a-5", name: "Premium Day-One Welcome Swag Hamper", price: 1899, originalPrice: 2499, img: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=400&auto=format&fit=crop" },
    { id: "ch-a-6", name: "Eco-Friendly Bamboo Journal & Sipper Box", price: 1450, originalPrice: 1950, img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400&auto=format&fit=crop" },
    { id: "ch-a-7", name: "Milestone Work Anniversary Treat Basket", price: 2299, originalPrice: 2999, img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400&auto=format&fit=crop" },
    { id: "ch-a-8", name: "Wellness & De-Stress Office Goodies Box", price: 1750, originalPrice: 2300, img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&auto=format&fit=crop" },
  ]
};

function CorporateProductCard({ item, index = 0 }) {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();

  const itemId = item._id || item.id;

  // Active Google User Check
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

  // Check wishlist status from active user storage
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
        btn.innerText = 'Add to Cart 💼';
      }, 1200);
    } catch (err) {
      console.error('Corporate cart error:', err);
    }
  };

  return (
    <div 
      onClick={handleOpen}
      className={`group bg-white/95 backdrop-blur-xs rounded-2xl p-3 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer relative ${
        index >= 6 ? 'hidden md:flex' : 'flex'
      }`}
    >
      {/* Wishlist Button */}
      <button 
        type="button"
        onClick={handleHeartClick}
        className="absolute top-4 right-4 z-20 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-all"
        title="Add to Wishlist"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill={isLiked ? "#f43f5e" : "none"} 
          stroke={isLiked ? "#f43f5e" : "#94a3b8"} 
          strokeWidth="2" 
          className="w-4 h-4 transition-colors"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>

      <div>
        {/* Uniform Zoom Container */}
        <div className="h-40 md:h-48 rounded-xl overflow-hidden bg-slate-100 relative flex items-center justify-center">
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover scale-105 group-hover:scale-115 transition-transform duration-500"
          />
        </div>
        <div className="mt-3">
          <h3 className="text-xs md:text-sm font-extrabold text-slate-800 line-clamp-1 group-hover:text-cyan-800 transition-colors">
            {item.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm md:text-base font-black text-slate-900">₹{item.price}</span>
            {item.originalPrice && (
              <span className="text-xs text-slate-400 line-through">₹{item.originalPrice}</span>
            )}
          </div>
        </div>
      </div>

      {/* Direct Add to Cart Action */}
      <button 
        type="button"
        onClick={handleDirectAddToCart}
        className="w-full mt-3 py-2 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900 hover:from-slate-800 hover:to-cyan-800 text-cyan-50 font-black text-[11px] md:text-xs rounded-xl shadow-xs transition-all duration-200 cursor-pointer active:scale-95"
      >
        Add to Cart 💼
      </button>
    </div>
  );
}

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
        className={`w-full ${heightClass} ${aspectClass} rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-slate-200 transition-all duration-300 relative group ${
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
    <div className={`w-full ${heightClass} ${aspectClass} border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-1 select-none`}>
      <span className={isLarge ? "text-3xl" : "text-2xl"}>💼</span>
      <span className="text-[11px] md:text-xs font-black uppercase tracking-wider text-slate-600">Corporate Banner Not Found</span>
      <span className="text-[9px] text-slate-400">{slotLabel}</span>
    </div>
  );
}

export default function CorporateHampers() {
  const [desktopBanners, setDesktopBanners] = useState({});
  const [mobileBanners, setMobileBanners] = useState({});
  const [loading, setLoading] = useState(true);

  const [vipGifts, setVipGifts] = useState(corporateHampersData.vipClientGifts);
  const [empKits, setEmpKits] = useState(corporateHampersData.employeeKits);
  const [allCorporate, setAllCorporate] = useState(corporateHampersData.allCorporateProducts);

  useEffect(() => {
    fetch('https://handy-hampers.onrender.com/api/banners')
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const desk = {};
        const mob = {};

        data.forEach((b) => {
          if (b.type === 'corporateHampersDesktop' && b.slotIndex !== null) desk[b.slotIndex] = b;
          if (b.type === 'corporateHampersMobile' && b.slotIndex !== null) mob[b.slotIndex] = b;
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
              name: p.title || p.name || 'Corporate Gift Set',
              title: p.title || p.name || 'Corporate Gift Set',
              price: displayPrice || 1999,
              originalPrice: displayMrp || null,
              img: displayImg || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop'
            };
          });

          const corporateFiltered = formatted.filter(
            (p) => String(p.name).toLowerCase().includes('corp') || String(p.title).toLowerCase().includes('corp')
          );

          const basePool = corporateFiltered.length >= 4 ? corporateFiltered : formatted;
          const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

          setVipGifts(shuffle(basePool).slice(0, 8));
          setEmpKits(shuffle(basePool).slice(0, 8));
          setAllCorporate(shuffle(formatted).slice(0, 8));
        }
      })
      .catch((err) => console.error('Corporate products load error:', err));
  }, []);

  return (
    <div className="w-full space-y-10 pb-20">

      {/* ================= 1. CORPORATE BANNERS SHOWCASE ================= */}
      <section className="px-3 md:px-12 pt-4">
        {loading ? (
          <div className="w-full h-56 md:h-80 rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center text-xs font-bold text-slate-400">
            Loading Corporate B2B Showcase...
          </div>
        ) : (
          <>
            <div className="hidden md:grid md:grid-cols-12 gap-4">
              <div className="md:col-span-7 flex">
                <BannerSlot
                  banner={desktopBanners[0]}
                  slotLabel="Corporate Slot #1 (Main Executive Feature)"
                  heightClass="h-[460px]"
                  isLarge={true}
                />
              </div>

              <div className="md:col-span-5 flex flex-col gap-4 justify-between">
                <BannerSlot
                  banner={desktopBanners[1]}
                  slotLabel="Corporate Slot #2 (Top Right)"
                  heightClass="h-[222px]"
                />
                <BannerSlot
                  banner={desktopBanners[2]}
                  slotLabel="Corporate Slot #3 (Bottom Right)"
                  heightClass="h-[222px]"
                />
              </div>
            </div>

            <div className="block md:hidden space-y-3">
              <BannerSlot
                banner={mobileBanners[0]}
                fallbackBanner={desktopBanners[0]}
                slotLabel="Mobile Slot #1 (Top Wide)"
                heightClass="h-44"
              />
              <div className="grid grid-cols-2 gap-3">
                <BannerSlot
                  banner={mobileBanners[1]}
                  fallbackBanner={desktopBanners[1]}
                  slotLabel="Mobile Slot #2 (Left)"
                  aspectClass="aspect-square"
                />
                <BannerSlot
                  banner={mobileBanners[2]}
                  fallbackBanner={desktopBanners[2]}
                  slotLabel="Mobile Slot #3 (Right)"
                  aspectClass="aspect-square"
                />
              </div>
            </div>
          </>
        )}
      </section>

      {/* ================= 2. SECTION: VIP CLIENT GIFTS ================= */}
      <section className="bg-gradient-to-b from-cyan-50/70 via-slate-50/40 to-transparent py-8 px-3 md:px-12 rounded-3xl mx-2 md:mx-6 border border-cyan-100/60">
        <div className="flex items-center justify-between border-b border-cyan-200/50 pb-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">👔</span>
              <h2 className="text-base md:text-2xl font-black text-slate-900 tracking-tight">
                VIP Executive & Premium Client Gifts
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">High-end bespoke gifting solutions tailored for key partners and leadership</p>
          </div>
          <span className="text-xs font-bold text-cyan-800 hover:text-cyan-950 cursor-pointer">Explore VIP →</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {vipGifts.slice(0, 8).map((item, index) => (
            <CorporateProductCard key={item.id || item._id} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* ================= 3. SECTION: EMPLOYEE ONBOARDING & KITS ================= */}
      <section className="bg-gradient-to-b from-slate-100/70 via-gray-50/40 to-transparent py-8 px-3 md:px-12 rounded-3xl mx-2 md:mx-6 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📦</span>
              <h2 className="text-base md:text-2xl font-black text-slate-900 tracking-tight">
                Employee Onboarding Kits & Milestones
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Custom branded merchandise, welcome swag and work anniversary packs</p>
          </div>
          <span className="text-xs font-bold text-slate-800 hover:text-slate-950 cursor-pointer">Bulk Swag →</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {empKits.slice(0, 8).map((item, index) => (
            <CorporateProductCard key={item.id || item._id} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* ================= 4. SECTION: ALL CORPORATE CATALOG ================= */}
      <section className="bg-gradient-to-b from-zinc-50/70 via-stone-50/30 to-white py-8 px-3 md:px-12 rounded-3xl mx-2 md:mx-6 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">💼</span>
              <h2 className="text-base md:text-2xl font-black text-slate-900 tracking-tight">
                All Corporate B2B Hampers
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Custom branding and doorstep bulk delivery across India</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {allCorporate.slice(0, 8).map((item, index) => (
            <CorporateProductCard key={item.id || item._id} item={item} index={index} />
          ))}
        </div>
      </section>

    </div>
  );
}