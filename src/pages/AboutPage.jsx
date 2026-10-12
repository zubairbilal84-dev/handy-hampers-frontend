import React from 'react';
import { Link } from 'react-router-dom';
import DesktopHeader from '../components/desktop/DesktopHeader';

export default function AboutPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      <div className="py-10 md:py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto space-y-16">
        {/* ================= 1. HERO SECTION ================= */}
        <section className="text-center space-y-5 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-amber-800 bg-amber-100/80 px-3.5 py-1.5 rounded-full border border-amber-200">
            <span>✨</span> Rooted in Brass City Moradabad
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#2C1A11] tracking-tight leading-tight">
            Crafting Timeless <span className="text-amber-600">Gifting Legacies</span> & Bespoke Hampers
          </h1>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed">
            Welcome to <strong className="text-stone-900 font-extrabold">Handy Hampers</strong>. Born in the artisanal heart of Moradabad (Uttar Pradesh – 244001), we turn metal craftsmanship, authentic festive delicacies, and custom bespoke packaging into unforgettable celebration memories.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/products"
              className="bg-[#2C1A11] hover:bg-stone-900 text-amber-50 font-black text-xs md:text-sm px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
            >
              Explore Our Hampers
            </Link>
            <Link
              to="/contact"
              className="bg-amber-500 hover:bg-amber-600 text-[#2C1A11] font-black text-xs md:text-sm px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
            >
              Corporate & Bulk Inquiry
            </Link>
          </div>
        </section>

        {/* ================= 2. OUR MORADABAD HERITAGE (2-COLUMN STORY) ================= */}
        <section className="bg-white rounded-3xl p-6 md:p-12 border border-stone-200/80 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
              Heritage & Craftsmanship
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#2C1A11] leading-tight">
              Where Century-Old Metal Craft Meets Modern Gifting
            </h2>
            <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
              Moradabad is globally celebrated as the Brass City of India. At Handy Hampers, our roots in <span className="font-semibold text-stone-800">Moradabad (244001)</span> enable us to collaborate directly with master artisans.
            </p>
            <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
              From hand-hammered Mughal brass urlis and filigree metal platters to copper trunks, every metallic keepsake in our hampers is crafted with precision, authentic polish, and generational pride.
            </p>
            <div className="pt-2 flex items-center gap-6 border-t border-stone-100 text-stone-700">
              <div>
                <span className="block text-2xl font-black text-amber-700">100%</span>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Artisan Crafted</span>
              </div>
              <div className="h-8 w-px bg-stone-200"></div>
              <div>
                <span className="block text-2xl font-black text-amber-700">50K+</span>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Smiles Delivered</span>
              </div>
              <div className="h-8 w-px bg-stone-200"></div>
              <div>
                <span className="block text-2xl font-black text-amber-700">PAN</span>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">India Safe Transit</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-amber-200/60 bg-amber-50">
              <img
                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop"
                alt="Handcrafted Metal Hampers Moradabad"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#2C1A11] text-amber-300 p-4 rounded-2xl shadow-xl hidden sm:block border border-amber-400/20">
              <span className="text-xs font-black block">Handy Hampers HQ</span>
              <span className="text-[11px] text-stone-300">Moradabad, Uttar Pradesh, 244001</span>
            </div>
          </div>
        </section>

        {/* ================= 3. OUR SIX GIFTING PILLARS ================= */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-[#2C1A11]">What Makes Handy Hampers Special</h2>
            <p className="text-xs md:text-sm text-stone-500">Every box is packed with thought, hygiene, elegance, and durability.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-2.5 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-black">
                🪙
              </div>
              <h3 className="font-extrabold text-[#2C1A11] text-sm md:text-base">Artisanal Metal Trays & Trunks</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Direct from Moradabad’s metal artisans—pure brass, wrought iron, and copper keepsake hampers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-2.5 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-lg font-black">
                💍
              </div>
              <h3 className="font-extrabold text-[#2C1A11] text-sm md:text-base">Royal Wedding Trousseau</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Velvet-lined bridal trunks, shagun platters, and bespoke return gift favors designed for grand weddings.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-2.5 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center text-lg font-black">
                💼
              </div>
              <h3 className="font-extrabold text-[#2C1A11] text-sm md:text-base">Corporate & B2B Custom Swag</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Employee onboarding welcome kits, VIP client executive trunks, and branded festive bulk shipments.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-2.5 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center text-lg font-black">
                🪔
              </div>
              <h3 className="font-extrabold text-[#2C1A11] text-sm md:text-base">Traditional Festive Collections</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Diwali, Holi, and seasonal celebration boxes filled with gourmet dry fruits and artisanal sweets.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-2.5 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg font-black">
                🎈
              </div>
              <h3 className="font-extrabold text-[#2C1A11] text-sm md:text-base">Milestone & Life Occasions</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Birthdays, housewarming Griha Pravesh blessings, baby showers, and anniversary gift baskets.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs space-y-2.5 hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg font-black">
                🛡️
              </div>
              <h3 className="font-extrabold text-[#2C1A11] text-sm md:text-base">Zero-Breakage Packaging</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Multi-layer protective insulation and insured courier delivery ensure pristine doorstep delivery across India.
              </p>
            </div>
          </div>
        </section>

        {/* ================= 4. OUR PROMISE & LOCATION CARD ================= */}
        <section className="bg-gradient-to-r from-[#2C1A11] via-stone-900 to-amber-950 text-white rounded-3xl p-6 md:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-500/20">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Direct Workshop Fulfillment
            </span>
            <h3 className="text-xl md:text-2xl font-black text-amber-50">
              Need Custom Hampers or Bulk Orders?
            </h3>
            <p className="text-xs md:text-sm text-stone-300 max-w-xl">
              Operating out of <strong>Moradabad, Uttar Pradesh (PIN: 244001)</strong>, our team provides doorstep delivery, personalized logo branding, and tailored hamper curation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/contact"
              className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs md:text-sm px-6 py-3 rounded-xl shadow transition-transform active:scale-95 text-center"
            >
              Contact Our Studio
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}