import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DesktopHeader from '../components/desktop/DesktopHeader';

function Wishlist() {
  const navigate = useNavigate();

  // 1. Current logged-in user get karein
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

  // 2. Load Wishlist for active user ID
  const [wishlist, setWishlist] = useState(() => {
    try {
      if (currentUser) {
        const userSaved = localStorage.getItem(wishlistKey);
        if (userSaved) return JSON.parse(userSaved);
      }
      const genericSaved = localStorage.getItem('wishlist');
      if (genericSaved) return JSON.parse(genericSaved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 3. Sync state to both user specific key & generic fallback
  const syncWishlist = (newList) => {
    setWishlist(newList);
    try {
      localStorage.setItem('wishlist', JSON.stringify(newList));
      if (currentUser) {
        localStorage.setItem(wishlistKey, JSON.stringify(newList));
      }
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle/Remove Wishlist item
  const handleRemove = (productId) => {
    const updated = wishlist.filter((item) => (item._id || item.id) !== productId);
    syncWishlist(updated);
  };

  // Direct ID-safe Add to Cart from Wishlist
  const handleAddToCart = (product) => {
    try {
      const userKey = currentUser ? `handy_cart_${currentUser.email}` : 'handy_cart_guest';
      let cart = [];
      const userSaved = currentUser ? localStorage.getItem(userKey) : null;
      const genericSaved = localStorage.getItem('cart');

      if (userSaved) cart = JSON.parse(userSaved);
      else if (genericSaved) cart = JSON.parse(genericSaved);

      const prodId = product._id || product.id;
      const idx = cart.findIndex((i) => (i._id || i.id) === prodId);

      if (idx > -1) {
        cart[idx].quantity = (Number(cart[idx].quantity) || 0) + 1;
      } else {
        cart.push({
          id: prodId,
          _id: prodId,
          name: product.title || product.name || 'Handcrafted Hamper',
          price: Number(product.price) || 0,
          image: product.mainImage || (product.images && product.images[0]) || product.img || '',
          quantity: 5, // minimum 5 pcs
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      if (currentUser) localStorage.setItem(userKey, JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
      alert('Product Cart me add ho gaya (Min. 5 units)!');
    } catch (e) {
      console.error(e);
    }
  };

  // Login Guard
  if (!currentUser) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen">
        <div className="hidden md:block">
          <DesktopHeader />
        </div>
        <div className="max-w-md mx-auto px-6 py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-100 rounded-2xl mx-auto flex items-center justify-center text-3xl">
            ❤️
          </div>
          <h2 className="text-2xl font-black text-stone-900">Please Sign In First</h2>
          <p className="text-stone-500 text-xs">
            Aapki Wishlist aapki Google ID ke sath secure save hoti hai. Kripya pehle login karein.
          </p>
          <button
            onClick={() => navigate('/my-account')}
            className="w-full py-3 bg-[#2C1A11] hover:bg-stone-900 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
          >
            Sign In with Google 🔑
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-8">
        <div className="border-b border-stone-200 pb-4 flex justify-between items-end">
          <div>
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-widest">
              Account: {currentUser.email}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-[#2C1A11] mt-1">My Wishlist ❤️</h1>
          </div>
          <span className="text-xs font-bold text-stone-500">{wishlist.length} Saved Hampers</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 space-y-3">
            <span className="text-4xl block">💔</span>
            <h3 className="text-lg font-bold text-[#2C1A11]">Aapki Wishlist khali hai!</h3>
            <p className="text-xs text-stone-500">Apne pasandida hampers ko save karne ke liye heart icon dabaein.</p>
            <Link
              to="/all-hampers"
              className="inline-block mt-2 bg-[#2C1A11] text-amber-300 font-black px-6 py-2.5 rounded-xl text-xs shadow-xs hover:bg-stone-900 transition-colors"
            >
              Explore Hampers 🎁
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlist.map((p) => {
              const prodId = p._id || p.id;
              const displayImg = p.mainImage || (p.images && p.images[0]) || p.img || '';
              const displayPrice = p.isVariable && p.variants?.length > 0
                ? Math.min(...p.variants.map((v) => Number(v.price)).filter(Boolean))
                : (p.price || 999);

              return (
                <div
                  key={prodId}
                  className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative"
                >
                  <button
                    onClick={() => handleRemove(prodId)}
                    className="absolute top-2.5 right-2.5 z-10 bg-white/90 p-2 rounded-full shadow-md text-red-500 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    title="Remove from wishlist"
                  >
                    ❤️
                  </button>

                  <div>
                    <div className="h-44 md:h-56 bg-stone-50 relative overflow-hidden flex items-center justify-center p-2">
                      {displayImg ? (
                        <img
                          src={displayImg}
                          alt={p.title || p.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-xs text-stone-400 font-bold">No Image</div>
                      )}
                    </div>

                    <div className="p-3.5 space-y-1">
                      <h3 className="font-extrabold text-[#2C1A11] text-xs md:text-sm line-clamp-1">{p.title || p.name}</h3>
                      <p className="font-black text-[#2C1A11] text-sm md:text-base">₹{displayPrice}</p>
                    </div>
                  </div>

                  <div className="p-3.5 pt-0 flex gap-2 border-t border-stone-100 mt-2">
                    <Link
                      to={`/product/${prodId}`}
                      className="flex-1 text-center bg-stone-100 text-stone-800 text-xs font-bold py-2 rounded-xl hover:bg-stone-200 transition-colors no-underline"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="flex-1 bg-[#2C1A11] text-amber-300 text-xs font-black py-2 rounded-xl hover:bg-stone-900 transition-colors cursor-pointer active:scale-95"
                    >
                      Add to Cart
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

export default Wishlist;