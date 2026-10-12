import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DesktopHeader from '../components/desktop/DesktopHeader';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [currentMrp, setCurrentMrp] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [quantity, setQuantity] = useState(5); // Minimum 5 items default
  const [addedMessage, setAddedMessage] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Helper: Active user get karna
  const getCurrentUser = () => {
    try {
      const u = localStorage.getItem('handyUser');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        // 1. Fetch current product
        const res = await fetch(`https://handy-hampers.onrender.com/api/products/${id}`);
        if (res.ok) {
          const found = await res.json();
          setProduct(found);

          const mainImg = found.mainImage || (found.images && found.images[0]) || '';

          if (found.isVariable && found.variants?.length > 0) {
            const firstVariant = found.variants[0];
            const defaultColor = firstVariant.color || found.colors?.[0] || '';
            const defaultSize = firstVariant.size || found.sizes?.[0] || '';

            setSelectedColor(defaultColor);
            setSelectedSize(defaultSize);
            updateActiveVariantData(found, defaultColor, defaultSize, mainImg);
          } else {
            setCurrentImage(mainImg);
            setCurrentMrp(found.mrp || '');
            setCurrentPrice(found.price || '');
          }

          // Check if already in Wishlist
          const currentUser = getCurrentUser();
          const wishlistKey = currentUser ? `handy_wishlist_${currentUser.email}` : 'handy_wishlist_guest';
          const savedWishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
          const isPresent = savedWishlist.some((item) => (item._id || item.id) === (found._id || found.id));
          setIsWishlisted(isPresent);
        } else {
          setProduct(null);
        }

        // 2. Fetch recommended products
        const allRes = await fetch('https://handy-hampers.onrender.com/api/products');
        if (allRes.ok) {
          const allProducts = await allRes.json();
          const filtered = allProducts
            .filter((p) => (p._id || p.id) !== id)
            .slice(0, 8);
          setRecommended(filtered);
        }
      } catch (error) {
        console.error('Data Fetching Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProductData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  const updateActiveVariantData = (productData, color, size, fallbackImg) => {
    if (!productData?.variants) return;

    const matched = productData.variants.find(
      (v) => (!color || v.color === color) && (!size || v.size === size)
    ) || productData.variants[0];

    const baseImg = fallbackImg || productData.mainImage || (productData.images && productData.images[0]) || '';

    if (matched) {
      if (matched.images?.[0]) {
        setCurrentImage(matched.images[0]);
      } else if (matched.image) {
        setCurrentImage(matched.image);
      } else {
        setCurrentImage(baseImg);
      }
      setCurrentMrp(matched.mrp || productData.mrp || '');
      setCurrentPrice(matched.price || productData.price || '');
    } else {
      setCurrentImage(baseImg);
      setCurrentMrp(productData.mrp || '');
      setCurrentPrice(productData.price || '');
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    updateActiveVariantData(product, color, selectedSize);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    updateActiveVariantData(product, selectedColor, size);
  };

  const allImages = product
    ? [
        product.mainImage,
        ...(product.galleryImages || (Array.isArray(product.images) ? product.images : []))
      ].filter(Boolean)
    : [];

  const handlePrevImage = () => {
    if (allImages.length <= 1) return;
    const currentIndex = allImages.indexOf(currentImage);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setCurrentImage(allImages[prevIndex]);
  };

  const handleNextImage = () => {
    if (allImages.length <= 1) return;
    const currentIndex = allImages.indexOf(currentImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setCurrentImage(allImages[nextIndex]);
  };

  // User-ID Specific Wishlist Toggle Function
  const handleToggleWishlist = () => {
    try {
      const currentUser = getCurrentUser();
      const wishlistKey = currentUser ? `handy_wishlist_${currentUser.email}` : 'handy_wishlist_guest';

      let currentWishlist = [];
      const userSaved = currentUser ? localStorage.getItem(wishlistKey) : null;
      const genericSaved = localStorage.getItem('wishlist');

      if (userSaved) currentWishlist = JSON.parse(userSaved);
      else if (genericSaved) currentWishlist = JSON.parse(genericSaved);

      const productId = product._id || product.id;
      const index = currentWishlist.findIndex((item) => (item._id || item.id) === productId);

      if (index > -1) {
        // Remove from Wishlist
        currentWishlist.splice(index, 1);
        setIsWishlisted(false);
      } else {
        // Add to Wishlist
        currentWishlist.push({
          id: productId,
          _id: productId,
          title: product.title || product.name,
          name: product.title || product.name,
          price: Number(currentPrice) || Number(product.price) || 0,
          mainImage: currentImage || product.mainImage || '',
          img: currentImage || product.mainImage || '',
          category: product.category || 'Luxury Hampers'
        });
        setIsWishlisted(true);
      }

      // Save to active user ID and generic fallback
      localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
      if (currentUser) {
        localStorage.setItem(wishlistKey, JSON.stringify(currentWishlist));
      }

      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    }
  };

  // Direct Cart Insertion
  const handleAddToCart = () => {
    try {
      const currentUser = getCurrentUser();
      const userKey = currentUser ? `handy_cart_${currentUser.email}` : 'handy_cart_guest';

      let existingCart = [];
      const userSaved = currentUser ? localStorage.getItem(userKey) : null;
      const genericSaved = localStorage.getItem('cart');

      if (userSaved) {
        existingCart = JSON.parse(userSaved);
      } else if (genericSaved) {
        existingCart = JSON.parse(genericSaved);
      }

      const productId = product._id || product.id;
      const title = product.title || product.name || 'Handcrafted Hamper';
      const price = Number(currentPrice) || Number(product.price) || 0;
      const img = currentImage || product.mainImage || '';

      const index = existingCart.findIndex((item) => (item.id || item._id) === productId);

      if (index > -1) {
        existingCart[index].quantity = (Number(existingCart[index].quantity) || 0) + 1;
      } else {
        existingCart.push({
          id: productId,
          _id: productId,
          name: title,
          price: price,
          image: img,
          img: img,
          quantity: quantity,
          selectedColor: product.isVariable ? selectedColor : null,
          selectedSize: product.isVariable ? selectedSize : null,
        });
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      if (currentUser) {
        localStorage.setItem(userKey, JSON.stringify(existingCart));
      }

      window.dispatchEvent(new Event('storage'));

      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 2500);
    } catch (err) {
      console.error('Add to cart failed:', err);
      alert('Cart me item add karne me error aaya.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        <div className="hidden md:block">
          <DesktopHeader />
        </div>
        <div className="max-w-4xl mx-auto my-24 p-8 text-center text-stone-500 font-bold">
          <span className="text-4xl block mb-3 animate-bounce">🎁</span>
          <p className="text-sm font-semibold tracking-wide">Loading Luxury Hamper Details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        <div className="hidden md:block">
          <DesktopHeader />
        </div>
        <div className="max-w-md mx-auto my-16 p-8 text-center bg-white rounded-3xl border border-stone-200/80 shadow-sm">
          <span className="text-4xl block mb-2">📦</span>
          <h2 className="text-lg font-black text-[#2C1A11]">Product Not Found</h2>
          <p className="text-xs text-stone-500 mt-1">Yeh hamper uplabdh nahi hai ya link badal chuki hai.</p>
          <Link to="/products" className="inline-block mt-5 bg-[#2C1A11] text-amber-300 text-xs font-black px-6 py-2.5 rounded-xl shadow hover:bg-stone-900 transition-colors">
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent =
    currentMrp && currentPrice && Number(currentMrp) > Number(currentPrice)
      ? Math.round(((Number(currentMrp) - Number(currentPrice)) / Number(currentMrp)) * 100)
      : 0;

  const productTitle = product.title || product.name || 'Handcrafted Hamper';
  const whatsappNumber = '9837874676';
  const whatsappMessage = encodeURIComponent(
    `Namaste Handy Hampers Studio!\nMujhe is hamper ki bulk inquiry/order karni hai:\n\n*Product:* ${productTitle}\n*Quantity:* ${quantity} units\n*Price:* ₹${currentPrice}\n${selectedColor ? `*Color:* \${selectedColor}\n` : ''}${selectedSize ? `*Size:* \${selectedSize}\n` : ''}\nKripya dispatch timeline aur details share karein.`
  );
  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900">
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-12 space-y-16">
        
        {/* ================= MAIN PRODUCT DETAIL SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: IMAGES & LONG DESCRIPTION */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs h-[360px] sm:h-[440px] relative flex items-center justify-center p-4 group">
              {currentImage ? (
                <img 
                  src={currentImage} 
                  alt={productTitle} 
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                />
              ) : (
                <span className="text-xs text-stone-400 font-bold">No Image Available</span>
              )}

              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-sm tracking-wider z-10">
                  {discountPercent}% OFF
                </span>
              )}

              {/* Wishlist Heart Button on Main Image */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-white shadow-md border border-stone-200 flex items-center justify-center text-xl transition-transform hover:scale-110 active:scale-90 cursor-pointer"
                title={isWishlisted ? "Wishlist se remove karein" : "Wishlist me save karein"}
              >
                {isWishlisted ? '❤️' : '🤍'}
              </button>

              {/* Glass Slider Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md border border-stone-200 flex items-center justify-center text-xl font-bold transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                    title="Previous"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md border border-stone-200 flex items-center justify-center text-xl font-bold transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                    title="Next"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      currentImage === img 
                        ? 'border-amber-600 ring-2 ring-amber-500/20 shadow-sm' 
                        : 'border-stone-200 opacity-70 hover:opacity-100 hover:border-stone-300'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Long Description Under Images */}
            {product.longDesc && (
              <div className="bg-white rounded-3xl border border-stone-200/80 p-6 md:p-8 shadow-xs space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  <h3 className="font-black text-sm uppercase tracking-wider text-[#2C1A11]">
                    Artisan Specifications & Details
                  </h3>
                </div>
                <p className="text-xs text-stone-600 whitespace-pre-line leading-relaxed font-normal">
                  {product.longDesc}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: PRICING & ACTIONS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#2C1A11] leading-tight">
                {productTitle}
              </h1>
              {(product.shortDesc || product.description) && (
                <p className="text-xs text-stone-500 leading-relaxed">
                  {product.shortDesc || product.description}
                </p>
              )}
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#2C1A11]">
                  ₹{currentPrice || '0'}
                </span>
                {currentMrp && (
                  <span className="text-sm text-stone-400 line-through font-bold">
                    ₹{currentMrp}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                ✓ Handcrafted Studio
              </span>
            </div>

            {product.isVariable && (
              <div className="space-y-4 bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs">
                {product.colors?.length > 0 && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                      Finish / Color: <span className="text-amber-800 font-black">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => handleColorSelect(c)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            selectedColor === c
                              ? 'bg-[#2C1A11] text-amber-300 border-[#2C1A11] shadow-xs'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-400'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes?.length > 0 && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                      Size: <span className="text-amber-800 font-black">{selectedSize}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleSizeSelect(s)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            selectedSize === s
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector Card */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-[#2C1A11] block">Order Quantity</span>
                  <span className="text-[10px] text-amber-700 font-bold block">Min. 5 items bulk rule</span>
                </div>

                <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => (prev > 5 ? prev - 1 : 5))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-stone-200 text-stone-700 font-black text-base transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-black text-[#2C1A11]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-stone-200 text-stone-700 font-black text-base transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">Calculated Subtotal:</span>
                <span className="font-black text-[#2C1A11]">₹{(Number(currentPrice) || 0) * quantity}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-[#2C1A11] hover:bg-stone-900 text-amber-300 font-black py-4 rounded-2xl text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-[0.99] flex items-center justify-center gap-2.5"
              >
                <span>🛍️</span> Add to Bag ({quantity} units)
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer transition-all active:scale-[0.99] flex items-center justify-center gap-2.5 no-underline"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Order via WhatsApp</span>
              </a>

              {addedMessage && (
                <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold animate-in fade-in">
                  <span>✓ {quantity} units cart me add ho gaye!</span>
                  <button 
                    onClick={() => navigate('/cart')} 
                    className="underline text-emerald-950 font-black cursor-pointer"
                  >
                    View Cart →
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ================= 2 ROWS: RECOMMENDED PRODUCTS ================= */}
        {recommended.length > 0 && (
          <div className="pt-8 border-t border-stone-200/80 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#2C1A11]">
                  You May Also Like
                </h2>
                <p className="text-xs text-stone-500">
                  Similar luxury handcrafted hampers for weddings & occasions
                </p>
              </div>
              <Link 
                to="/all-hampers" 
                className="text-xs font-black text-amber-800 hover:text-amber-900 flex items-center gap-1"
              >
                View All →
              </Link>
            </div>

            {/* 2 Rows Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {recommended.map((item) => {
                const recId = item._id || item.id;
                const recImg = item.mainImage || (item.images && item.images[0]) || '';
                const recPrice = item.price || (item.variants && item.variants[0]?.price) || '0';
                const recMrp = item.mrp || (item.variants && item.variants[0]?.mrp) || null;

                return (
                  <Link
                    key={recId}
                    to={`/product/${recId}`}
                    className="bg-white rounded-3xl p-3 border border-stone-200/80 hover:shadow-md transition-all flex flex-col justify-between group no-underline text-stone-900"
                  >
                    <div className="space-y-3">
                      <div className="w-full h-36 sm:h-44 bg-stone-50 rounded-2xl overflow-hidden relative flex items-center justify-center p-2">
                        {recImg ? (
                          <img
                            src={recImg}
                            alt={item.title || item.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <span className="text-[10px] text-stone-400 font-bold">No Image</span>
                        )}
                        <span className="absolute bottom-2 left-2 bg-stone-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                          Min. 5 Pcs
                        </span>
                      </div>

                      <div className="space-y-1 px-1">
                        <h3 className="font-black text-xs text-[#2C1A11] line-clamp-1 group-hover:text-amber-800 transition-colors">
                          {item.title || item.name}
                        </h3>
                        <p className="text-[10px] text-stone-400 line-clamp-1">
                          Studio Handcrafted Box
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 px-1 flex items-baseline justify-between border-t border-stone-100 mt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-[#2C1A11]">
                          ₹{recPrice}
                        </span>
                        {recMrp && (
                          <span className="text-[10px] text-stone-400 line-through font-medium">
                            ₹{recMrp}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform">
                        Explore →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProductDetail;