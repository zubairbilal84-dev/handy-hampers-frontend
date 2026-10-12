import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopHeader from '../../components/desktop/DesktopHeader';

export default function Jhulastyle() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJhula = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://handy-hampers.onrender.com/api/products');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            // Strict 'jhula' or 'swing' tag matching
            const matched = data.filter((p) => {
              const pTags = Array.isArray(p.tags) 
                ? p.tags.map(t => String(t).toLowerCase().trim()) 
                : [];
              return pTags.includes('jhula') || pTags.includes('swing');
            });
            setProducts(matched);
          }
        }
      } catch (err) {
        console.error('Error fetching jhula style:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJhula();
  }, []);

  const handleProductClick = (id) => {
    if (!id) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/product/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-10">
        {/* Festive Marigold & Emerald Swing Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-[#133e2a] to-amber-950 p-7 md:p-12 text-white shadow-2xl border border-amber-600/30">
          <div className="absolute top-0 right-12 w-48 h-48 rounded-full bg-amber-400/20 blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <span>🪢</span> Festive Shagun Suspended Swings
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Jhula & Swing Hampers
              </h1>
              <p className="text-xs md:text-sm text-amber-100/90 leading-relaxed">
                Elaborately decorated floral swing cradles and gold-plated swinging platters crafted for Laddu Gopal, baby showers, and wedding rituals.
              </p>
            </div>
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-white/10 backdrop-blur-md border border-amber-400/40 flex items-center justify-center text-4xl md:text-6xl shrink-0 shadow-inner">
              🪢
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
            <h2 className="text-sm md:text-xl font-black text-emerald-950">
              Jhula Style Collection ({products.length})
            </h2>
            <span className="text-[11px] md:text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
              Tag: #jhula
            </span>
          </div>

          {loading ? (
            <div className="text-center py-24 text-amber-300 font-bold">
              <span className="text-3xl block mb-2 animate-bounce">⏳</span>
              Jhula style hampers load ho rahe hain...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-amber-200 space-y-2">
              <span className="text-4xl">🪢</span>
              <h3 className="text-base font-bold text-emerald-950">Koi Jhula Style Hamper Nahi Mila!</h3>
              <p className="text-xs text-stone-500">Admin panel mein product create karte waqt 'Jhula Style' tag select karein.</p>
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
                    className="group bg-white rounded-2xl p-3 border border-amber-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <div className="w-full h-36 md:h-52 rounded-xl overflow-hidden mb-2.5 bg-amber-50/50 relative flex items-center justify-center p-2">
                        <span className="absolute top-2 left-2 bg-emerald-950 text-amber-300 font-black text-[8px] md:text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider z-10 shadow-xs">
                          Jhula Style
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

                      <h3 className="font-extrabold text-[12px] md:text-sm text-stone-800 truncate group-hover:text-emerald-700 transition-colors">
                        {item.title || item.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs md:text-base font-black text-emerald-900">₹{displayPrice}</span>
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
                      className="w-full mt-3 py-2 bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-black text-[11px] md:text-xs rounded-xl shadow-xs transition-colors duration-200 cursor-pointer active:scale-95"
                    >
                      View Hamper 🪢
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