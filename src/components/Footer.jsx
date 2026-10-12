import React from 'react';
import { Link } from 'react-router-dom';
import logoIcon from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#FFFDF9] via-[#FFF8F3] to-[#FFF0E6] text-stone-700 pt-12 pb-8 border-t-2 border-rose-200/80 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
        
        {/* ================= 1. CUTE TRUST PILLS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pb-8 border-b border-rose-100">
          <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-rose-100/80 shadow-2xs flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
            <span className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-lg shrink-0">
              🚚
            </span>
            <div>
              <h4 className="text-xs font-black text-stone-800">Pan India Delivery</h4>
              <p className="text-[10px] text-stone-500 font-medium">Safe & insured transit</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-100/80 shadow-2xs flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
            <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg shrink-0">
              🪙
            </span>
            <div>
              <h4 className="text-xs font-black text-stone-800">Moradabad Art</h4>
              <p className="text-[10px] text-stone-500 font-medium">Authentic metal craft</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-purple-100/80 shadow-2xs flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
            <span className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg shrink-0">
              🎀
            </span>
            <div>
              <h4 className="text-xs font-black text-stone-800">Cute Packing</h4>
              <p className="text-[10px] text-stone-500 font-medium">Handmade with love</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-100/80 shadow-2xs flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shrink-0">
              💝
            </span>
            <div>
              <h4 className="text-xs font-black text-stone-800">Custom Baskets</h4>
              <p className="text-[10px] text-stone-500 font-medium">Bulk & wedding favors</p>
            </div>
          </div>
        </div>

        {/* ================= 2. MAIN 4-COLUMN CUTE SECTION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Intro & Moradabad Badge */}
          <div className="lg:col-span-2 space-y-3.5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow-xs border border-rose-100 flex items-center justify-center group-hover:rotate-6 transition-transform">
                <img
                  src={logoIcon}
                  alt="Handy Hampers Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#2C1A11] tracking-tight leading-none">
                  Handy <span className="text-rose-500">Hampers</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 mt-1">
                  Bespoke & Metal Gifting 💕
                </span>
              </div>
            </Link>

            <p className="text-xs text-stone-600 leading-relaxed max-w-sm">
              Moradabad ke master artisans ke hath se bani khoobsurat metal baskets, gourmet dry fruits aur luxury gift hampers jo aapke har celebration ko yaadgar banayein.
            </p>

            <div className="bg-white/90 p-3 rounded-2xl border border-rose-100/80 shadow-2xs space-y-1.5 text-xs text-stone-600 max-w-sm">
              <p className="flex items-center gap-2 font-semibold">
                <span>📍</span>
                <span>Moradabad, Uttar Pradesh – 244001</span>
              </p>
              <p className="flex items-center gap-2 font-semibold">
                <span>💌</span>
                <span>support@handyhampers.com</span>
              </p>
            </div>
          </div>

          {/* Hamper Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <span>🎁</span> Hampers
            </h4>
            <ul className="space-y-2 text-xs font-bold text-stone-600">
              <li>
                <Link to="/?cat=gift" className="hover:text-rose-600 transition-colors">Gift Hampers</Link>
              </li>
              <li>
                <Link to="/?cat=metal" className="hover:text-rose-600 transition-colors">Metal & Brass Trunks</Link>
              </li>
              <li>
                <Link to="/?cat=festival" className="hover:text-rose-600 transition-colors">Festive Delights</Link>
              </li>
              <li>
                <Link to="/?cat=wedding" className="hover:text-rose-600 transition-colors">Wedding Trousseau</Link>
              </li>
              <li>
                <Link to="/?cat=corporate" className="hover:text-rose-600 transition-colors">Corporate Hampers</Link>
              </li>
              <li>
                <Link to="/?cat=occasions" className="hover:text-rose-600 transition-colors">Special Occasions</Link>
              </li>
            </ul>
          </div>

          {/* Quick Help & Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <span>🧸</span> Quick Help
            </h4>
            <ul className="space-y-2 text-xs font-bold text-stone-600">
              <li>
                <Link to="/track-order" className="hover:text-rose-600 transition-colors">Track Order</Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-rose-600 transition-colors">Refund & Return Policy</Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-rose-600 transition-colors">My Orders</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-rose-600 transition-colors">Saved Baskets</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-rose-600 transition-colors">Customer Care</Link>
              </li>
            </ul>
          </div>

          {/* Pages & Offers Card */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <span>✨</span> Discover
            </h4>
            <ul className="space-y-2 text-xs font-bold text-stone-600">
              <li>
                <Link to="/about" className="hover:text-rose-600 transition-colors">Our Story</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-rose-600 transition-colors">Shop Hampers</Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-rose-600 transition-colors">Gifting Blog</Link>
              </li>
              <li>
                <Link to="/offers" className="text-rose-600 hover:text-rose-700 font-extrabold flex items-center gap-1">
                  <span>🔥 Special Offers</span>
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/contact"
                  className="inline-block bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-[11px] px-3.5 py-2 rounded-xl shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  Bulk Inquiry 🎀
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ================= 3. BOTTOM CUTE BAR ================= */}
        <div className="pt-6 border-t border-rose-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p className="flex items-center gap-1.5 font-medium">
            <span>Handmade with</span>
            <span className="text-rose-500 animate-pulse">💖</span>
            <span>in Moradabad (244001) &copy; {new Date().getFullYear()} Handy Hampers</span>
          </p>

          <div className="flex items-center gap-2 text-stone-600 bg-white/70 px-3 py-1.5 rounded-full border border-rose-100 text-[11px] font-bold">
            <span>🛡️ 100% Safe Payments & Secure Checkout</span>
          </div>
        </div>

      </div>
    </footer>
  );
}