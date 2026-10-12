import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopHeader from '../../components/desktop/DesktopHeader';

export default function Boatstyle() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://handy-hampers.onrender.com/api/products');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            // Strict 'boat' tag matching
            const matched = data.filter((p) => {
              const pTags = Array.isArray(p.tags) 
                ? p.tags.map(t => String(t).toLowerCase().trim()) 
                : [];
              return pTags.includes('boat');
            });
            setProducts(matched);
          }
        }
      } catch (err) {
        console.error('Error fetching boat style:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoats();
  }, []);

  const handleProductClick = (id) => {
    if (!id) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/product/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFA]">
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-10">
        {/* Ocean Teal & Brass Gondola Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-950 via-cyan-950 to-slate-900 p-7 md:p-12 text-white shadow-2xl border border-teal-800/40">
          <div className="absolute top-0 right-10 w-48 h-48 rounded-full bg-teal-400/15 blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase bg-teal-400/20 text-teal-300 border border-teal-400/30">
                <span>🛶</span> Sculptural Gondola Trays
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Boat Style Platters & Baskets
              </h1>
              <p className="text-xs md:text-sm text-teal-100/90 leading-relaxed">
                Elongated oval baskets, carved wooden canoes, and artisan hammered brass troughs with expansive horizontal arrangement displays.
              </p>
            </div>
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-white/10 backdrop-blur-md border border-teal-300/30 flex items-center justify-center text-4xl md:text-6xl shrink-0 shadow-inner">
              🛶
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-teal-100 pb-3">
            <h2 className="text-sm md:text-xl font-black text-teal-950">
              Boat Style Collection ({products.length})
            </h2>
            <span className="text-[11px] md:text-xs font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
              Tag: #boat
            </span>
          </div>

          {loading ? (
            <div className="text-center py-24 text-teal-300 font-bold">
              <span className="text-3xl block mb-2 animate-bounce">⏳</span>
              Boat style hampers load ho rahe hain...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-teal-200 space-y-2">
              <span className="text-4xl">🛶</span>
              <h3 className="text-base font-bold text-teal-950">Koi Boat Style Hamper Nahi Mila!</h3>
              <p className="text-xs text-stone-500">Admin panel mein product me 'Boat Style' tag select karein.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {products.map((item) => {
                const prodId = item._id || item.id;
                let displayImg = item.mainImage || (item.images && item.images[0]) || '';
                let displayPrice = item.price;
                let displayMrp = item.mrp;

                if (item.isVariable && item.variants?.length > 0) {
                  const firstVariant = item.variants.find((v) => v.images?.[0] || v.image) || item.variants[0];
                  displayImg = firstVariant?.images?.[0] || firstVariant?.image || displayImg;
                  const prices = item.variants.map((v) => Number(v.price)).filter(Boolean);
                  if (prices.length > 0) displayPrice = Math.min(...prices);
                  displayMrp = firstVariant?.mrp || displayMrp;
                }

                return (
                  <div
                    key={prodId}
                    onClick={() => handleProductClick(prodId)}
                    className="group bg-white rounded-2xl p-3 border border-teal-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <div className="w-full h-36 md:h-52 rounded-xl overflow-hidden mb-2.5 bg-teal-50/50 relative flex items-center justify-center p-2">
                        <span className="absolute top-2 left-2 bg-teal-950 text-teal-300 font-black text-[8px] md:text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider z-10 shadow-xs">
                          Boat Style
                        </span>
                        {displayImg ? (
                          <img
                            src={displayImg}
                            alt={item.title || item.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <span className="text-xs text-stone-400 font-bold">No Image</span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-[12px] md:text-sm text-stone-800 truncate group-hover:text-teal-700 transition-colors">
                        {item.title || item.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs md:text-base font-black text-teal-900">₹{displayPrice}</span>
                        {displayMrp && (
                          <span className="text-[10px] md:text-xs text-stone-400 line-through">₹{displayMrp}</span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(prodId);
                      }}
                      className="w-full mt-3 py-2 bg-teal-950 hover:bg-teal-900 text-teal-200 font-black text-[11px] md:text-xs rounded-xl shadow-xs transition-colors duration-200 cursor-pointer active:scale-95"
                    >
                      View Hamper 🛶
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}