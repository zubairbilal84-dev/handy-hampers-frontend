import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [bannerCounts, setBannerCounts] = useState({
    hero: 0,
    square: 0,
    reel: 0,
    promo: 0
  });

  useEffect(() => {
    // Sync live banner counts from LocalStorage
    const hero = JSON.parse(localStorage.getItem('app_hero_banners')) || [];
    const square = JSON.parse(localStorage.getItem('app_square_banners')) || [];
    const reel = JSON.parse(localStorage.getItem('app_reel_banners')) || [];
    const promo = JSON.parse(localStorage.getItem('app_promo_banners')) || [];

    setBannerCounts({
      hero: hero.length,
      square: square.length,
      reel: reel.length,
      promo: promo.length
    });
  }, []);

  const stats = [
    { label: 'Total Revenue', value: '₹1,48,500', badge: '+12% this week', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'Bulk Orders', value: '42 Orders', badge: 'Active Rules', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: 'Active Banners', value: `${bannerCounts.hero + bannerCounts.square + bannerCounts.reel + bannerCounts.promo} Active`, badge: 'Live Sync', color: 'bg-purple-50 text-purple-600 border-purple-100' },
    { label: 'Pending Reviews', value: '7 Reviews', badge: 'Needs Action', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  ];

  return (
    <div className="space-y-8 bg-stone-50 min-h-screen p-4 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-stone-900">Dashboard Overview</h1>
        <p className="text-xs md:text-sm text-stone-500 font-medium">Welcome back, Admin! Here is a summary of your store's performance.</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-xs border border-stone-200/70 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${stat.color}`}>
                {stat.badge}
              </span>
            </div>
            <p className="text-stone-500 text-xs font-semibold mt-4">{stat.label}</p>
            <h3 className="text-2xl font-black text-stone-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* System Banner Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-stone-200/70 space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b pb-2">🖼️ Banner Management Status</h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <span className="text-stone-500 font-semibold block">Hero Banners</span>
              <span className="text-base font-black text-rose-600">{bannerCounts.hero} Active</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <span className="text-stone-500 font-semibold block">Square Banners</span>
              <span className="text-base font-black text-amber-600">{bannerCounts.square} Fixed Slots</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <span className="text-stone-500 font-semibold block">Reel Banners</span>
              <span className="text-base font-black text-purple-600">{bannerCounts.reel} Items</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <span className="text-stone-500 font-semibold block">Promo Banners</span>
              <span className="text-base font-black text-emerald-600">{bannerCounts.promo} Active</span>
            </div>
          </div>
        </div>

        {/* System Health Card */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-stone-200/70 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900 mb-2">⚙️ Bulk Order & System Status</h2>
            <p className="text-stone-500 text-xs leading-relaxed">
              System is running smoothly. All 50-unit cart minimum rules are currently enforced for bulk items. 
              Local Storage syncing enabled for instant frontend banner updates.
            </p>
          </div>
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-600">
            <span>● Store API & Sync Status: Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}