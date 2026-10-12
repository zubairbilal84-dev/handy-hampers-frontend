import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DesktopHeader from '../components/desktop/DesktopHeader';
import { useCart } from '../context/CartContext';

// Product PNGs
import pr1 from '../assets/pr1.png';
import pr2 from '../assets/pr2.png';
import pr3 from '../assets/pr3.png';
import pr4 from '../assets/pr4.png';
import pr5 from '../assets/pr5.png';
import pr6 from '../assets/pr6.png';
import pr7 from '../assets/pr7.png';
import pr8 from '../assets/pr8.png';

const COUPONS = [
  {
    code: 'FESTIVE40',
    discount: '40% OFF',
    desc: 'Valid on handcrafted metal & brass festive hampers above ₹2,999',
    tag: 'Trending',
  },
  {
    code: 'BULKGIFT',
    discount: 'FLAT ₹1,500 OFF',
    desc: 'Applicable on corporate orders and trousseau boxes above ₹9,999',
    tag: 'Corporate',
  },
  {
    code: 'FIRSTHAMPER',
    discount: '15% OFF',
    desc: 'Instant discount on your first bespoke luxury hamper order',
    tag: 'Welcome',
  },
];

const OFFER_PRODUCTS = [
  { id: 'off-1', name: 'Royal Velvet Wedding Trunk', category: 'wedding', price: 2999, originalPrice: 4999, discount: '40% OFF', img: pr1 },
  { id: 'off-2', name: 'Moradabad Filigree Brass Platter', category: 'metal', price: 1899, originalPrice: 2899, discount: '34% OFF', img: pr2 },
  { id: 'off-3', name: 'Grand Celebration Gourmet Trunk', category: 'gift', price: 2199, originalPrice: 3299, discount: '33% OFF', img: pr3 },
  { id: 'off-4', name: 'Artisanal Saffron & Dry Fruit Hamper', category: 'festival', price: 2499, originalPrice: 3999, discount: '37% OFF', img: pr4 },
  { id: 'off-5', name: 'Executive Wooden Swag Crate', category: 'corporate', price: 3499, originalPrice: 4999, discount: '30% OFF', img: pr5 },
  { id: 'off-6', name: 'Pastel Baby Shower Gift Tray', category: 'occasions', price: 1599, originalPrice: 2299, discount: '30% OFF', img: pr6 },
  { id: 'off-7', name: 'Imperial Mughal Urli & Treats Box', category: 'metal', price: 2799, originalPrice: 4200, discount: '33% OFF', img: pr7 },
  { id: 'off-8', name: 'Blush Pink Bride Shagun Trunk', category: 'wedding', price: 3899, originalPrice: 5500, discount: '29% OFF', img: pr8 },
];

export default function Offers() {
  const { addToCart } = useCart();
  const [copiedCode, setCopiedCode] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  const filteredProducts = activeCategory === 'all'
    ? OFFER_PRODUCTS
    : OFFER_PRODUCTS.filter(item => item.category === activeCategory);

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12 space-y-12">
        {/* ================= 1. HERO BANNER ================= */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2C1A11] via-stone-900 to-amber-950 text-white p-6 md:p-12 shadow-xl border border-amber-500/20">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black text-xs uppercase px-3.5 py-1 rounded-full shadow-md">
              <span>🔥</span>
              <span>Exclusive Festive & Studio Offers</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-amber-50 tracking-tight leading-tight">
              Luxury Gifting, <br />
              <span className="text-amber-400">Unbeatable Studio Savings</span>
            </h1>
            <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
              Curated directly from our Moradabad (244001) artisan workshop. Enjoy exclusive discounts on handmade metal platters, gourmet dry fruit trunks, and bespoke corporate packages.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none hidden md:flex items-center justify-center">
            <span className="text-[180px] font-black text-amber-500 select-none">%</span>
          </div>
        </section>

        {/* ================= 2. ACTIVE COUPON VOUCHERS ================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
            <div>
              <h2 className="text-lg md:text-2xl font-black text-[#2C1A11] flex items-center gap-2">
                <span>🎟️</span> Available Coupon Codes
              </h2>
              <p className="text-xs text-stone-500">Tap to copy code and apply during checkout</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COUPONS.map((coupon) => (
              <div
                key={coupon.code}
                className="relative bg-white rounded-2xl p-5 border-2 border-dashed border-amber-300 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      {coupon.tag}
                    </span>
                    <span className="text-xs font-black text-rose-600">{coupon.discount}</span>
                  </div>
                  <h3 className="font-black text-base text-stone-900 tracking-wide mt-1">
                    {coupon.code}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {coupon.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(coupon.code)}
                  className={`w-full py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                    copiedCode === coupon.code
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-900 hover:bg-amber-600 text-white'
                  }`}
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <span>✓</span>
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <span>📋</span>
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 3. FILTER BY CATEGORY ================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg md:text-2xl font-black text-[#2C1A11] flex items-center gap-2">
                <span>💥</span> Steal Deals & Discounted Hampers
              </h2>
              <p className="text-xs text-stone-500">Handcrafted hampers with up to 40% discount</p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { key: 'all', label: 'All Deals' },
                { key: 'metal', label: 'Metal' },
                { key: 'gift', label: 'Gift Hampers' },
                { key: 'wedding', label: 'Wedding' },
                { key: 'corporate', label: 'Corporate' },
                { key: 'festival', label: 'Festive' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategory(tab.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black tracking-wide shrink-0 transition-colors cursor-pointer ${
                    activeCategory === tab.key
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl p-2.5 md:p-3.5 border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full h-36 md:h-52 rounded-xl overflow-hidden bg-rose-50/40 flex items-center justify-center p-2 mb-2">
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-rose-600 to-orange-500 text-white font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs z-10">
                      {item.discount}
                    </span>
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="font-extrabold text-stone-800 text-xs md:text-sm truncate group-hover:text-amber-700 transition-colors">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-xs md:text-base font-black text-rose-600">
                      ₹{item.price}
                    </span>
                    <span className="text-[10px] md:text-xs text-stone-400 line-through">
                      ₹{item.originalPrice}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => addToCart ? addToCart({ ...item, quantity: 1 }) : null}
                  className="w-full mt-3 py-2 bg-stone-900 hover:bg-amber-600 text-white font-black text-[11px] rounded-xl shadow-xs transition-colors duration-200 cursor-pointer"
                >
                  Claim Offer 🛒
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 4. BULK & CORPORATE CALLOUT ================= */}
        <section className="bg-white rounded-3xl p-6 md:p-8 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
              Bulk Gifting
            </span>
            <h3 className="text-base md:text-xl font-black text-stone-900">
              Planning Bulk Orders for Weddings or Corporate Events?
            </h3>
            <p className="text-xs text-stone-500 max-w-xl">
              Get direct factory pricing from our Moradabad brass workshop on bulk orders above 25+ units. Custom logo branding & personalised ribbon packing included.
            </p>
          </div>

          <Link
            to="/contact"
            className="shrink-0 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs md:text-sm px-6 py-3 rounded-xl shadow-xs transition-all active:scale-95"
          >
            Request Bulk Quote
          </Link>
        </section>
      </main>
    </div>
  );
}