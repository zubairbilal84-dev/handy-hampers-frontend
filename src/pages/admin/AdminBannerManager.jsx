import React, { useState, useEffect } from 'react';

const API_URL = 'https://handy-hampers.onrender.com/api/banners';

export default function AdminBannerManager() {
  const [loading, setLoading] = useState(false);

  // 1. Hero Banners State
  const [heroDesktop, setHeroDesktop] = useState([]);
  const [heroMobile, setHeroMobile] = useState([]);
  const [heroDesktopLink, setHeroDesktopLink] = useState('');
  const [heroMobileLink, setHeroMobileLink] = useState('');

  // 2. Square Banners State (3 Desktop, 2 Mobile)
  const [squareDesktop, setSquareDesktop] = useState([null, null, null]);
  const [squareMobile, setSquareMobile] = useState([null, null]);
  const [sqDesktopLinks, setSqDesktopLinks] = useState(['', '', '']);
  const [sqMobileLinks, setSqMobileLinks] = useState(['', '']);

  // 3. Reel Banners State
  const [reels, setReels] = useState([]);
  const [reelTitleInput, setReelTitleInput] = useState('');
  const [reelLinkInput, setReelLinkInput] = useState('');

  // 4. Promo Slide Banners State
  const [promoDesktop, setPromoDesktop] = useState([]);
  const [promoMobile, setPromoMobile] = useState([]);
  const [promoDesktopLink, setPromoDesktopLink] = useState('');
  const [promoMobileLink, setPromoMobileLink] = useState('');

  // Fetch initial banners from Database
  const fetchBanners = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (!Array.isArray(data)) return;

      setHeroDesktop(data.filter((b) => b.type === 'heroDesktop'));
      setHeroMobile(data.filter((b) => b.type === 'heroMobile'));

      const sqDesk = [null, null, null];
      const sqDeskLinksInitial = ['', '', ''];
      data.filter((b) => b.type === 'squareDesktop').forEach((b) => {
        const slot = Number(b.slotIndex);
        if (slot >= 0 && slot < 3) {
          sqDesk[slot] = b;
          sqDeskLinksInitial[slot] = b.link || b.targetUrl || '';
        }
      });
      setSquareDesktop(sqDesk);
      setSqDesktopLinks(sqDeskLinksInitial);

      const sqMob = [null, null];
      const sqMobLinksInitial = ['', ''];
      data.filter((b) => b.type === 'squareMobile').forEach((b) => {
        const slot = Number(b.slotIndex);
        if (slot >= 0 && slot < 2) {
          sqMob[slot] = b;
          sqMobLinksInitial[slot] = b.link || b.targetUrl || '';
        }
      });
      setSquareMobile(sqMob);
      setSqMobileLinks(sqMobLinksInitial);

      setReels(data.filter((b) => b.type === 'reels'));
      setPromoDesktop(data.filter((b) => b.type === 'promoDesktop'));
      setPromoMobile(data.filter((b) => b.type === 'promoMobile'));
    } catch (err) {
      console.error('Failed to fetch banners:', err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Generic Upload Handler with link & title
  const handleUploadBanner = async (file, type, extraData = {}) => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    if (extraData.title) formData.append('title', extraData.title);
    if (extraData.link) formData.append('link', extraData.link);
    if (extraData.slotIndex !== undefined && extraData.slotIndex !== null) {
      formData.append('slotIndex', Number(extraData.slotIndex));
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Upload failed');
      }

      await fetchBanners();
    } catch (err) {
      alert(`Upload Fail Ho Gaya: ${err.message}`);
      console.error('Upload Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDeleteBanner = async (id) => {
    if (!id) return;
    if (!window.confirm('Kya aap is banner ko delete karna chahte hain?')) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || 'Delete failed');
      }

      await fetchBanners();
    } catch (err) {
      alert(`Delete Fail Ho Gaya: ${err.message}`);
      console.error('Delete Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10 bg-stone-50 min-h-screen relative">
      
      {/* Syncing Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center text-white font-bold text-sm backdrop-blur-sm">
          ⚡ Database & Cloudinary Sync Ho Raha Hai...
        </div>
      )}

      {/* Header */}
      <div className="border-b pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-rose-950">Store Banner Management Admin Panel</h1>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Manage Hero, Square, Reel, and Promo banners with custom destination links.
          </p>
        </div>
      </div>

      {/* 1. HERO BANNERS SECTION */}
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-6">
        <h2 className="text-lg font-black text-stone-800 flex items-center gap-2">🖼️ 1. Hero Slide Banners</h2>

        {/* Desktop Hero */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-stone-700">Desktop Banners (Landscape)</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Link / Route (e.g. /products, /styles/closed-boxes)"
                value={heroDesktopLink}
                onChange={(e) => setHeroDesktopLink(e.target.value)}
                className="p-1.5 px-3 border border-stone-300 rounded-xl text-xs w-full sm:w-64 bg-stone-50"
              />
              <label className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:bg-rose-700 transition-all shrink-0">
                + Upload Banner
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    handleUploadBanner(e.target.files[0], 'heroDesktop', { link: heroDesktopLink });
                    setHeroDesktopLink('');
                  }} 
                />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {heroDesktop.map((item) => (
              <div key={item._id} className="relative group border rounded-xl overflow-hidden bg-stone-100 flex flex-col justify-between">
                <img src={item.image} alt="" className="w-full h-24 object-cover" />
                <div className="p-1.5 bg-white border-t text-[10px] text-stone-600 truncate">
                  🔗 {item.link || item.targetUrl || 'No link set'}
                </div>
                <button 
                  onClick={() => handleDeleteBanner(item._id)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md hover:bg-red-700 shadow"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Hero */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-stone-700">Mobile Banners (Portrait/Square)</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Link / Route (e.g. /styles/bags-style)"
                value={heroMobileLink}
                onChange={(e) => setHeroMobileLink(e.target.value)}
                className="p-1.5 px-3 border border-stone-300 rounded-xl text-xs w-full sm:w-64 bg-stone-50"
              />
              <label className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:bg-rose-700 transition-all shrink-0">
                + Upload Banner
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    handleUploadBanner(e.target.files[0], 'heroMobile', { link: heroMobileLink });
                    setHeroMobileLink('');
                  }} 
                />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {heroMobile.map((item) => (
              <div key={item._id} className="relative group border rounded-xl overflow-hidden bg-stone-100 flex flex-col justify-between">
                <img src={item.image} alt="" className="w-full h-24 object-cover" />
                <div className="p-1.5 bg-white border-t text-[10px] text-stone-600 truncate">
                  🔗 {item.link || item.targetUrl || 'No link'}
                </div>
                <button 
                  onClick={() => handleDeleteBanner(item._id)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md hover:bg-red-700 shadow"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SQUARE SPOTLIGHT BANNERS SECTION */}
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-6">
        <h2 className="text-lg font-black text-stone-800 flex items-center gap-2">✨ 2. Square Spotlight Banners (Fixed Boxes)</h2>

        {/* Desktop Square (3 Boxes: Slot 0, 1, 2) */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-stone-700">Desktop Slots (3 Fixed Boxes)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {squareDesktop.map((item, slotIdx) => (
              <div key={slotIdx} className="border-2 border-dashed border-stone-300 rounded-2xl p-3 text-center space-y-2 bg-stone-50">
                <p className="text-xs font-extrabold text-stone-600">Desktop Box #{slotIdx + 1}</p>
                {item ? (
                  <div className="relative h-32 rounded-xl overflow-hidden border">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => handleDeleteBanner(item._id)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-xs text-stone-400 font-bold">No Banner Selected</div>
                )}

                <input
                  type="text"
                  placeholder="Target Link (e.g. /products?cat=wedding)"
                  value={sqDesktopLinks[slotIdx] || ''}
                  onChange={(e) => {
                    const newArr = [...sqDesktopLinks];
                    newArr[slotIdx] = e.target.value;
                    setSqDesktopLinks(newArr);
                  }}
                  className="w-full p-1.5 px-2.5 border rounded-xl text-xs bg-white"
                />

                <label className="block w-full bg-stone-800 text-white text-xs font-bold py-1.5 rounded-xl cursor-pointer hover:bg-stone-900">
                  {item ? "Replace Banner" : "Upload Banner"}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleUploadBanner(e.target.files[0], 'squareDesktop', { 
                      slotIndex: slotIdx,
                      link: sqDesktopLinks[slotIdx]
                    })} 
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Square (2 Boxes: Slot 0, 1) */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-sm font-bold text-stone-700">Mobile Slots (2 Fixed Boxes)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {squareMobile.map((item, slotIdx) => (
              <div key={slotIdx} className="border-2 border-dashed border-stone-300 rounded-2xl p-3 text-center space-y-2 bg-stone-50">
                <p className="text-xs font-extrabold text-stone-600">Mobile Box #{slotIdx + 1}</p>
                {item ? (
                  <div className="relative h-32 rounded-xl overflow-hidden border">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => handleDeleteBanner(item._id)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-xs text-stone-400 font-bold">No Banner Selected</div>
                )}

                <input
                  type="text"
                  placeholder="Target Link (e.g. /styles/ring-style)"
                  value={sqMobileLinks[slotIdx] || ''}
                  onChange={(e) => {
                    const newArr = [...sqMobileLinks];
                    newArr[slotIdx] = e.target.value;
                    setSqMobileLinks(newArr);
                  }}
                  className="w-full p-1.5 px-2.5 border rounded-xl text-xs bg-white"
                />

                <label className="block w-full bg-stone-800 text-white text-xs font-bold py-1.5 rounded-xl cursor-pointer hover:bg-stone-900">
                  {item ? "Replace Banner" : "Upload Banner"}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleUploadBanner(e.target.files[0], 'squareMobile', { 
                      slotIndex: slotIdx,
                      link: sqMobileLinks[slotIdx]
                    })} 
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. REEL SHOWCASE BANNERS SECTION */}
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-6">
        <h2 className="text-lg font-black text-stone-800 flex items-center gap-2">👑 3. Reel Showcase Banners</h2>
        
        <div className="flex flex-col md:flex-row gap-3 items-center bg-rose-50 p-3 rounded-xl border border-rose-100">
          <input 
            type="text" 
            placeholder="Banner Title (Optional)" 
            value={reelTitleInput}
            onChange={(e) => setReelTitleInput(e.target.value)}
            className="p-2 border rounded-xl text-xs w-full md:w-1/3 bg-white"
          />
          <input 
            type="text" 
            placeholder="Destination Link (e.g. /product/123 or /products)" 
            value={reelLinkInput}
            onChange={(e) => setReelLinkInput(e.target.value)}
            className="p-2 border rounded-xl text-xs w-full md:w-1/3 bg-white"
          />
          <label className="w-full md:w-auto bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-rose-700 text-center shrink-0">
            Upload Reel Image & Add
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                handleUploadBanner(e.target.files[0], 'reels', { 
                  title: reelTitleInput,
                  link: reelLinkInput
                });
                setReelTitleInput('');
                setReelLinkInput('');
              }} 
            />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {reels.map((reel) => (
            <div key={reel._id} className="relative border rounded-xl overflow-hidden bg-stone-100 group flex flex-col justify-between">
              <img src={reel.image} alt="" className="w-full h-36 object-cover" />
              <div className="p-1.5 bg-black/80 text-white text-[10px] space-y-0.5 text-center">
                {reel.title && <p className="font-bold truncate">{reel.title}</p>}
                <p className="text-[9px] text-amber-300 truncate">🔗 {reel.link || reel.targetUrl || 'No link'}</p>
              </div>
              <button 
                onClick={() => handleDeleteBanner(reel._id)}
                className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PROMO SLIDE BANNERS SECTION (Multi-Slide Auto Transition) */}
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-6">
        <div>
          <h2 className="text-lg font-black text-stone-800 flex items-center gap-2">🎁 4. Bottom Promo Slide Banners</h2>
          <p className="text-xs text-stone-500 mt-1">
            Yahan jitne banners upload karenge, storefront ke sabse niche wo automatic slide hokar aate rahenge aur unke alag links trigger honge.
          </p>
        </div>

        {/* Promo Desktop */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-stone-700">Promo Desktop Banners (Landscape Slider)</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Slide Link (e.g. /products?cat=festive)"
                value={promoDesktopLink}
                onChange={(e) => setPromoDesktopLink(e.target.value)}
                className="p-1.5 px-3 border border-stone-300 rounded-xl text-xs w-full sm:w-64 bg-stone-50"
              />
              <label className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:bg-rose-700 transition-all shrink-0">
                + Add Slide Banner
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    handleUploadBanner(e.target.files[0], 'promoDesktop', { link: promoDesktopLink });
                    setPromoDesktopLink('');
                  }} 
                />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {promoDesktop.map((item) => (
              <div key={item._id} className="relative group border rounded-xl overflow-hidden bg-stone-100 flex flex-col justify-between">
                <img src={item.image} alt="" className="w-full h-24 object-cover" />
                <div className="p-1.5 bg-white border-t text-[10px] text-stone-600 truncate">
                  🔗 {item.link || item.targetUrl || 'No link set'}
                </div>
                <button 
                  onClick={() => handleDeleteBanner(item._id)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md hover:bg-red-700 shadow"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Mobile */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-stone-700">Promo Mobile Banners (Slider)</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Slide Link (e.g. /styles/boat-style)"
                value={promoMobileLink}
                onChange={(e) => setPromoMobileLink(e.target.value)}
                className="p-1.5 px-3 border border-stone-300 rounded-xl text-xs w-full sm:w-64 bg-stone-50"
              />
              <label className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:bg-rose-700 transition-all shrink-0">
                + Add Slide Banner
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    handleUploadBanner(e.target.files[0], 'promoMobile', { link: promoMobileLink });
                    setPromoMobileLink('');
                  }} 
                />
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {promoMobile.map((item) => (
              <div key={item._id} className="relative group border rounded-xl overflow-hidden bg-stone-100 flex flex-col justify-between">
                <img src={item.image} alt="" className="w-full h-24 object-cover" />
                <div className="p-1.5 bg-white border-t text-[10px] text-stone-600 truncate">
                  🔗 {item.link || item.targetUrl || 'No link set'}
                </div>
                <button 
                  onClick={() => handleDeleteBanner(item._id)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md hover:bg-red-700 shadow"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}