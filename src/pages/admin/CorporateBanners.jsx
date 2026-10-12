import React, { useState, useEffect } from 'react';

const DESKTOP_SLOTS = [
  { id: 0, label: "Slot 1: Left Main Executive B2B Showcase", desc: "Large Portrait/Tall (approx 600x800 px)" },
  { id: 1, label: "Slot 2: Right Top Employee Welcoming & Kits", desc: "Landscape Banner (approx 600x390 px)" },
  { id: 2, label: "Slot 3: Right Bottom VIP Client Luxury Trunks", desc: "Landscape Banner (approx 600x390 px)" },
];

const MOBILE_SLOTS = [
  { id: 0, label: "Slot 1: Top Corporate Spotlight Banner", desc: "Wide Landscape (approx 800x420 px)" },
  { id: 1, label: "Slot 2: Left Client Gifting Square", desc: "Square Banner (1:1 ratio, 500x500 px)" },
  { id: 2, label: "Slot 3: Right Onboarding Kit Square", desc: "Square Banner (1:1 ratio, 500x500 px)" },
];

export default function CorporateBanners() {
  const [activeTab, setActiveTab] = useState('desktop');
  const [banners, setBanners] = useState({ desktop: {}, mobile: {} });
  const [links, setLinks] = useState({
    desktop: ['', '', ''],
    mobile: ['', '', '']
  });
  const [loadingSlot, setLoadingSlot] = useState(null);

  const fetchBanners = async () => {
    try {
      const res = await fetch('https://handy-hampers.onrender.com/api/banners');
      const data = await res.json();
      
      const deskMap = {};
      const mobMap = {};
      const deskLinks = ['', '', ''];
      const mobLinks = ['', '', ''];

      data.forEach((b) => {
        if (b.type === 'corporateHampersDesktop' && b.slotIndex !== null) {
          deskMap[b.slotIndex] = b;
          deskLinks[b.slotIndex] = b.link || b.targetUrl || '';
        }
        if (b.type === 'corporateHampersMobile' && b.slotIndex !== null) {
          mobMap[b.slotIndex] = b;
          mobLinks[b.slotIndex] = b.link || b.targetUrl || '';
        }
      });

      setBanners({ desktop: deskMap, mobile: mobMap });
      setLinks({ desktop: deskLinks, mobile: mobLinks });
    } catch (err) {
      console.error("Banner fetch failed", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleUpload = async (slotIndex, isMobile, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const bannerType = isMobile ? 'corporateHampersMobile' : 'corporateHampersDesktop';
    const tabKey = isMobile ? 'mobile' : 'desktop';
    const slotLink = links[tabKey][slotIndex] || '';

    setLoadingSlot(`${bannerType}_${slotIndex}`);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', bannerType);
    formData.append('slotIndex', slotIndex);
    if (slotLink.trim()) {
      formData.append('link', slotLink.trim());
    }

    try {
      const res = await fetch('https://handy-hampers.onrender.com/api/banners', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        await fetchBanners();
      } else {
        alert("Upload fail ho gaya!");
      }
    } catch (error) {
      console.error(error);
      alert("Server upload error!");
    } finally {
      setLoadingSlot(null);
    }
  };

  const handleDelete = async (slotIndex, isMobile) => {
    const bannerType = isMobile ? 'mobile' : 'desktop';
    const banner = banners[bannerType][slotIndex];
    if (!banner?._id) return;
    if (!window.confirm("Kya aap is corporate banner ko delete karna chahte hain?")) return;

    try {
      const res = await fetch(`https://handy-hampers.onrender.com/api/banners/${banner._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchBanners();
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  const handleLinkChange = (slotId, val) => {
    setLinks((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((l, idx) => (idx === slotId ? val : l))
    }));
  };

  const currentSlots = activeTab === 'desktop' ? DESKTOP_SLOTS : MOBILE_SLOTS;
  const currentMap = activeTab === 'desktop' ? banners.desktop : banners.mobile;

  return (
    <div className="p-4 md:p-8 max-w-6xl space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>💼</span> Corporate Hampers Banners Manager
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            B2B Client Gifting, Employee Onboarding Kits aur Festive Bulk Order banners ko target links ke sath manage karein[cite: 14].
          </p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-xl gap-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('desktop')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'desktop' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🖥️ Desktop Banners (3)
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'mobile' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📱 Mobile Banners (3)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentSlots.map((slot) => {
          const banner = currentMap[slot.id];
          const isSlotLoading = loadingSlot === `${activeTab === 'mobile' ? 'corporateHampersMobile' : 'corporateHampersDesktop'}_${slot.id}`;
          const currentLinkVal = links[activeTab][slot.id] || '';

          return (
            <div key={slot.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md">
                  {activeTab.toUpperCase()} SLOT #{slot.id + 1}
                </span>
                <h3 className="font-extrabold text-sm text-slate-800 mt-1">{slot.label}</h3>
                <p className="text-[11px] text-slate-400">{slot.desc}</p>
              </div>

              <div className={`w-full ${slot.desc.includes("Square") ? "aspect-square" : "h-44"} bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center relative group`}>
                {banner?.image ? (
                  <>
                    <img src={banner.image} alt="Banner" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleDelete(slot.id, activeTab === 'mobile')}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition shadow cursor-pointer"
                      title="Delete Banner"
                    >
                      🗑
                    </button>
                  </>
                ) : (
                  <div className="text-center text-slate-400 select-none">
                    <span className="text-2xl block mb-1">💼</span>
                    <span className="text-xs font-bold uppercase tracking-wider">Corporate Banner Not Found</span>
                  </div>
                )}
              </div>

              {/* Destination Link Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-700 tracking-wider flex items-center gap-1">
                  🔗 Redirect Link / URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. /products?cat=corporate or /styles/bags-style"
                  value={currentLinkVal}
                  onChange={(e) => handleLinkChange(slot.id, e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl text-xs bg-slate-50 font-medium outline-none focus:border-slate-800"
                />
                {banner?.link && (
                  <span className="text-[10px] text-cyan-800 font-bold truncate block">
                    Saved: {banner.link}
                  </span>
                )}
              </div>

              <label className="w-full text-center py-2.5 bg-gradient-to-r from-slate-900 to-cyan-900 hover:from-slate-800 hover:to-cyan-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition active:scale-95">
                <span>{isSlotLoading ? "Uploading..." : banner?.image ? "🔄 Replace Banner with Link" : "📁 Upload Banner with Link"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(slot.id, activeTab === 'mobile', e)}
                  disabled={isSlotLoading}
                />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}