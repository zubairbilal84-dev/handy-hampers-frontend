import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopHeader from '../components/desktop/DesktopHeader';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper: Active user get karna
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

  const [wishlist, setWishlist] = useState(() => {
    try {
      const userSaved = currentUser ? localStorage.getItem(wishlistKey) : null;
      const genericSaved = localStorage.getItem('wishlist');
      if (userSaved) return JSON.parse(userSaved);
      if (genericSaved) return JSON.parse(genericSaved);
    } catch {
      return [];
    }
    return [];
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://handy-hampers.onrender.com/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Preserve scroll position (removed window.scrollTo)
  const handleProductClick = (productId) => {
    if (!productId) return;
    navigate(`/product/${productId}`);
  };

  // Direct ID-Safe Wishlist Toggle
  const handleToggleWishlist = (product, e) => {
    e.stopPropagation();
    const prodId = product._id || product.id || product.customId;

    let currentWishlist = [...wishlist];
    const idx = currentWishlist.findIndex((w) => (w._id || w.id) === prodId);

    const formattedItem = {
      ...product,
      id: prodId,
      _id: prodId,
      title: product.title || product.name,
      mainImage: product.mainImage || (product.images && product.images[0]) || '',
      price: product.price
    };

    if (idx > -1) {
      currentWishlist.splice(idx, 1);
    } else {
      currentWishlist.push(formattedItem);
    }

    setWishlist(currentWishlist);
    localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
    if (currentUser) {
      localStorage.setItem(wishlistKey, JSON.stringify(currentWishlist));
    }
    window.dispatchEvent(new Event('storage'));
  };

  // Direct ID-Safe Add to Cart Handler (First time 5 units, then +1)
  const handleDirectAddToCart = (product, e) => {
    e.stopPropagation();
    try {
      const userKey = currentUser ? `handy_cart_${currentUser.email}` : 'handy_cart_guest';

      let existingCart = [];
      const userSaved = currentUser ? localStorage.getItem(userKey) : null;
      const genericSaved = localStorage.getItem('cart');

      if (userSaved) existingCart = JSON.parse(userSaved);
      else if (genericSaved) existingCart = JSON.parse(genericSaved);

      const prodId = product._id || product.id || product.customId;
      const idx = existingCart.findIndex((p) => (p.id || p._id) === prodId);

      let unitPrice = product.price;
      if (product.isVariable && product.variants?.length > 0) {
        const prices = product.variants.map((v) => Number(v.price)).filter(Boolean);
        if (prices.length > 0) unitPrice = Math.min(...prices);
      }

      if (idx > -1) {
        existingCart[idx].quantity = (Number(existingCart[idx].quantity) || 0) + 1;
      } else {
        existingCart.push({
          id: prodId,
          _id: prodId,
          name: product.title || product.name || 'Handcrafted Hamper',
          price: Number(unitPrice) || 0,
          image: product.mainImage || (product.images && product.images[0]) || '',
          img: product.mainImage || (product.images && product.images[0]) || '',
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
        btn.innerText = 'Add to Cart 🛒';
      }, 1200);
    } catch (err) {
      console.error('Products page cart error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        <div className="border-b border-amber-200 pb-4 flex justify-between items-end">
          <div>
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">Handmade & Corporate</span>
            <h1 className="text-2xl md:text-3xl font-black text-emerald-950 mt-1">Explore Hampers & Gifts</h1>
          </div>
          <span className="text-xs font-bold text-gray-500">
            {loading ? 'Loading...' : `Showing ${products.length} Items`}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-stone-500 font-bold">
            <span className="text-3xl block mb-2 animate-bounce">⏳</span>
            Products load ho rahe hain...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-amber-300">
            <span className="text-4xl">🎁</span>
            <h3 className="text-lg font-bold text-emerald-950 mt-2">Abhi koi Products Screen par nahi hain!</h3>
            <p className="text-xs text-gray-500 mt-1">Admin Panel mein jaakar pehle kuch Products Add karein.</p>
            <button
              onClick={() => navigate('/admin/products/new')}
              className="inline-block mt-4 bg-amber-500 text-emerald-950 font-black px-6 py-2.5 rounded-xl text-xs shadow hover:bg-amber-600 cursor-pointer"
            >
              Go To Admin Panel
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => {
              const productId = p._id || p.id || p.customId;
              const productTitle = p.title || p.name || 'Unnamed Hamper';
              let displayImg = p.mainImage || (p.images && p.images[0]) || '';
              let displayPrice = p.price;
              let displayMrp = p.mrp;

              if (p.isVariable && p.variants?.length > 0) {
                const firstVariant = p.variants.find((v) => v.images?.[0] || v.image) || p.variants[0];
                displayImg = firstVariant?.images?.[0] || firstVariant?.image || displayImg;
                
                const prices = p.variants.map((v) => Number(v.price)).filter(Boolean);
                if (prices.length > 0) {
                  displayPrice = Math.min(...prices);
                }
                displayMrp = firstVariant?.mrp || displayMrp;
              }

              const discount = displayMrp && displayPrice ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100) : 0;
              const isLiked = Array.isArray(wishlist) && wishlist.some((w) => (w._id || w.id) === productId);

              return (
                <div
                  key={productId || Math.random()}
                  onClick={() => handleProductClick(productId)}
                  className="group bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between cursor-pointer hover:-translate-y-1 relative"
                >
                  {/* Wishlist Heart Button */}
                  <button 
                    type="button"
                    onClick={(e) => handleToggleWishlist(p, e)}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-amber-200 flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-all"
                    title="Add to Wishlist"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill={isLiked ? "#f43f5e" : "none"} 
                      stroke={isLiked ? "#f43f5e" : "#9ca3af"} 
                      strokeWidth="2" 
                      className="w-4 h-4 transition-colors"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </button>

                  <div>
                    {/* Uniform Zoom Container */}
                    <div className="h-56 bg-amber-50/50 relative overflow-hidden flex items-center justify-center">
                      {displayImg ? (
                        <img
                          src={displayImg}
                          alt={productTitle}
                          className="w-full h-full object-cover scale-105 group-hover:scale-115 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-xs text-gray-400 font-bold">
                          No Image Set
                        </div>
                      )}

                      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                        {discount > 0 && (
                          <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
                            {discount}% OFF
                          </span>
                        )}
                        {p.isVariable && (
                          <span className="bg-emerald-950 text-amber-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
                            Multiple Options
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      {p.category && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          {p.category}
                        </span>
                      )}
                      <h3 className="font-extrabold text-emerald-950 text-sm line-clamp-1 group-hover:text-amber-600 transition-colors">
                        {productTitle}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {p.shortDesc || p.longDesc || p.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-50 mt-2">
                    <div>
                      <span className="text-xs text-gray-400 block font-medium">Starting from</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-black text-emerald-950 text-base">₹{displayPrice || 'N/A'}</span>
                        {displayMrp && (
                          <span className="text-xs text-gray-400 line-through font-semibold">₹{displayMrp}</span>
                        )}
                      </div>
                    </div>

                    {/* Direct Add to Cart Action */}
                    <button
                      type="button"
                      onClick={(e) => handleDirectAddToCart(p, e)}
                      className="bg-amber-500 text-emerald-950 text-xs font-black px-3.5 py-2 rounded-xl group-hover:bg-amber-600 transition-colors cursor-pointer active:scale-95"
                    >
                      Add to Cart 🛒
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;