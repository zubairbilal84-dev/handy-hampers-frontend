import React from 'react';
import { Link } from 'react-router-dom';
import logoIcon from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#FAF8F5] via-[#F4EFEA] to-[#ECE5DC] text-stone-700 pt-12 pb-8 border-t-2 border-amber-200/60 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
        
        {/* ================= 1. TRUST PILLS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pb-8 border-b border-amber-200/50">
          <div className="bg-white/85 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-100 shadow-2xs flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg shrink-0">
              🚚
            </span>
            <div>
              <h4 className="text-xs font-black text-stone-800">Pan India Delivery</h4>
              <p className="text-[10px] text-stone-500 font-medium">Safe & insured transit</p>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-100 shadow-2xs flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
            <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg shrink-0">
              🪙
            </span>
            <div>
              <h4 className="text-xs font-black text-stone-800">Moradabad Metal Art</h4>
              <p className="text-[10px] text-stone-500 font-medium">Authentic brass & metal craft</p>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-100 shadow-2xs flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-lg shrink-0">
              🎀
            </span>
            <div>
              <h4 className="text-xs font-black text-stone-800">Luxury Packaging</h4>
              <p className="text-[10px] text-stone-500 font-medium">Handcrafted with care</p>
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-100 shadow-2xs flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
            <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg shrink-0">
              💝
            </span>
            <div>
              <h4 className="text-xs font-black text-stone-800">Custom Hampers</h4>
              <p className="text-[10px] text-stone-500 font-medium">Bulk & wedding favors</p>
            </div>
          </div>
        </div>

        {/* ================= 2. MAIN BALANCED SECTION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Intro & Contact Info */}
          <div className="lg:col-span-2 space-y-3.5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-13 h-13 rounded-2xl bg-white p-2 shadow-xs border border-amber-200/70 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img
                  src={logoIcon}
                  alt="Handy Hampers Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight leading-none text-emerald-950">
                  Handy <span className="text-amber-500">Hampers</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 mt-1">
                  Bespoke Metal Art & Luxury Gifting
                </span>
              </div>
            </Link>

            <p className="text-xs text-stone-600 leading-relaxed max-w-sm">
              Handcrafted metal baskets, brass trunks, gourmet delicacies, and bespoke gift hampers handcrafted by master artisans of Moradabad to make every celebration memorable.
            </p>

            <div className="bg-white/90 p-3.5 rounded-2xl border border-amber-200/50 shadow-2xs space-y-2 text-xs text-stone-600 max-w-sm">
              <p className="flex items-center gap-2 font-semibold">
                <span className="text-emerald-800 text-sm">📍</span>
                <span>Moradabad, Uttar Pradesh – 244001, India</span>
              </p>
              <p className="flex items-center gap-2 font-semibold">
                <span className="text-amber-600 text-sm">💌</span>
                <span>support@handyhampers.in</span>
              </p>
            </div>
          </div>

          {/* Quick Links Wrapped in a 2-Col Mobile Grid to fill empty right side */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8">
            
            {/* Hamper Collections */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 border-b border-amber-200/50 pb-1">
                <span>🎁</span> Hampers
              </h4>
              <ul className="space-y-2 text-xs font-bold text-stone-600">
                <li>
                  <Link to="/gift" className="hover:text-amber-600 transition-colors">Gift Hampers</Link>
                </li>
                <li>
                  <Link to="/metal" className="hover:text-amber-600 transition-colors">Metal & Brass Trunks</Link>
                </li>
                <li>
                  <Link to="/festival" className="hover:text-amber-600 transition-colors">Festive Delights</Link>
                </li>
                <li>
                  <Link to="/wedding" className="hover:text-amber-600 transition-colors">Wedding Trousseau</Link>
                </li>
                <li>
                  <Link to="/corporate" className="hover:text-amber-600 transition-colors">Corporate Hampers</Link>
                </li>
                <li>
                  <Link to="/occasions" className="hover:text-amber-600 transition-colors">Special Occasions</Link>
                </li>
              </ul>
            </div>

            {/* Quick Support & Services */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 border-b border-amber-200/50 pb-1">
                <span>🛡️</span> Support
              </h4>
              <ul className="space-y-2 text-xs font-bold text-stone-600">
                <li>
                  <Link to="/track-order" className="hover:text-amber-600 transition-colors">Track Order</Link>
                </li>
                <li>
                  <Link to="/refund-policy" className="hover:text-amber-600 transition-colors">Refund & Policy</Link>
                </li>
                <li>
                  <Link to="/my-orders" className="hover:text-amber-600 transition-colors">My Orders</Link>
                </li>
                <li>
                  <Link to="/wishlist" className="hover:text-amber-600 transition-colors">Saved Baskets</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-amber-600 transition-colors">Customer Care</Link>
                </li>
              </ul>
            </div>

            {/* Discover & Corporate Action (Spans full width on small screens if 2-col) */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 border-b border-amber-200/50 pb-1">
                <span>✨</span> Discover
              </h4>
              <ul className="space-y-2 text-xs font-bold text-stone-600">
                <li>
                  <Link to="/about" className="hover:text-amber-600 transition-colors">About Our Story</Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-amber-600 transition-colors">Shop All Hampers</Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-amber-600 transition-colors">Gifting Journal</Link>
                </li>
                <li>
                  <Link to="/offers" className="text-amber-600 hover:text-amber-700 font-extrabold flex items-center gap-1">
                    <span>🔥 Special Offers</span>
                  </Link>
                </li>
                <li className="pt-2">
                  <Link
                    to="/contact"
                    className="inline-block bg-gradient-to-r from-emerald-800 to-amber-600 hover:from-emerald-900 hover:to-amber-700 text-white font-black text-[11px] px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95"
                  >
                    Bulk Inquiry 💼
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* ================= 3. BOTTOM FOOTER BAR ================= */}
        <div className="pt-6 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p className="flex items-center gap-1.5 font-medium text-center sm:text-left">
            <span>Handcrafted with pride in Moradabad (244001) &copy; {new Date().getFullYear()} Handy Hampers. All rights reserved.</span>
          </p>

          <div className="flex items-center gap-2 text-stone-600 bg-white/80 px-3 py-1.5 rounded-full border border-amber-200/60 text-[11px] font-bold">
            <span>🛡️ 100% Verified Payments & Secure Checkout</span>
          </div>
        </div>

      </div>
    </footer>
  );
}