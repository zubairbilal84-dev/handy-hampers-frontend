import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

// Category Icons Imports
import closedBoxesImg from '../assets/closed boxes.jpeg';
import bagsStyleImg from '../assets/begs style.jpeg';
import hatImg from '../assets/hat.jpeg';
import jhulaImg from '../assets/Jhula.jpeg';
import ringStyleImg from '../assets/ring style.jpeg';
import boatStylesImg from '../assets/boat styles.jpeg';

// Product PNG Assets (Fallback only)
import pr1 from '../assets/pr1.png';
import pr2 from '../assets/pr2.png';
import pr3 from '../assets/pr3.png';
import pr4 from '../assets/pr4.png';
import pr5 from '../assets/pr5.png';
import pr6 from '../assets/pr6.png';
import pr7 from '../assets/pr7.png';
import pr8 from '../assets/pr8.png';
import pr9 from '../assets/pr9.png';
import pr10 from '../assets/pr10.png';
import pr11 from '../assets/pr11.png';
import pr12 from '../assets/pr12.png';

const BANNERS_API_URL = 'https://handy-hampers.onrender.com/api/banners';
const PRODUCTS_API_URL = 'https://handy-hampers.onrender.com/api/products';
const REVIEWS_API_URL = 'https://handy-hampers.onrender.com/api/reviews';

const DEFAULT_REVIEWS = [
  {
    _id: 'r-1',
    userName: 'Riya Singhania',
    productName: 'Royal Gold Mesh Basket',
    rating: 5,
    comment: 'The brass mesh work is incredible. Delivered in Delhi in flawless breakage-free packaging!',
    date: 'Oct 04, 2026',
    status: 'Approved'
  },
  {
    _id: 'r-2',
    userName: 'Karan Mehra',
    productName: 'Executive Leather Desk Trunk',
    rating: 5,
    comment: 'Ordered 40 bulk units for our corporate Diwali gifts. Every client was blown away by the craftsmanship.',
    date: 'Sep 29, 2026',
    status: 'Approved'
  },
  {
    _id: 'r-3',
    userName: 'Ananya Deshmukh',
    productName: 'Imperial Velvet Bridal Shagun Trunk',
    rating: 5,
    comment: 'Used this for my sister’s wedding trousseau. The gold embossing and velvet finish look straight out of a royal palace.',
    date: 'Sep 22, 2026',
    status: 'Approved'
  },
  {
    _id: 'r-4',
    userName: 'Vikram Malhotra',
    productName: 'Moradabad Heritage Brass Platter',
    rating: 4,
    comment: 'Pure authentic Moradabad brass finish. Sturdy, heavy, and extremely aesthetic.',
    date: 'Sep 15, 2026',
    status: 'Approved'
  }
];

export const allHampersData = {
  id: "all",
  name: "All Hampers",
  categoriesSectionTitle: "Shop By Style",
  categoriesSectionSubtitle: "Select a signature design shape to discover exclusive hamper collections",
  categories: [
    { id: "cat-closed-boxes", title: "Closed Boxes", badge: "New", image: closedBoxesImg, path: "/styles/closed-boxes", tag: "closed" },
    { id: "cat-bags-style", title: "Bags Style", badge: "Popular", image: bagsStyleImg, path: "/styles/bags-style", tag: "bags" },
    { id: "cat-hat-style", title: "Hat Style", badge: "Exclusive", image: hatImg, path: "/styles/hats-style", tag: "hat" },
    { id: "cat-jhula-style", title: "Jhula Style", badge: "Trending", image: jhulaImg, path: "/styles/jhula-style", tag: "jhula" },
    { id: "cat-ring-style", title: "Ring Style", badge: "Premium", image: ringStyleImg, path: "/styles/ring-style", tag: "ring" },
    { id: "cat-boat-styles", title: "Boat Styles", badge: "Bestseller", image: boatStylesImg, path: "/styles/boat-style", tag: "boat" }
  ],
  featuredProducts: [
    { id: "f-1", name: "Royal Gold Mesh Basket", price: 2499, originalPrice: 2999, img: pr1 },
    { id: "f-2", name: "Classic Woven Tray", price: 1850, originalPrice: 2200, img: pr2 },
    { id: "f-3", name: "Deluxe Celebration Hamper", price: 3499, originalPrice: 3999, img: pr3 },
    { id: "f-4", name: "Festive Sparkle Basket", price: 1299, originalPrice: 1599, img: pr4 },
    { id: "f-5", name: "Vintage Hexagon Crate", price: 2199, originalPrice: 2599, img: pr5 },
    { id: "f-6", name: "Pastel Elegance Basket", price: 1750, originalPrice: 2100, img: pr6 },
    { id: "f-7", name: "Imperial Crown Basket", price: 4200, originalPrice: 4800, img: pr7 },
    { id: "f-8", name: "Blush Pink Ribbed Tray", price: 1999, originalPrice: 2399, img: pr8 },
  ],
  newArrivals: [
    { id: "n-1", name: "Chic Pastel Gift Tray", price: 1599, originalPrice: 1899, img: pr9 },
    { id: "n-2", name: "Emerald Green Box", price: 2899, originalPrice: 3299, img: pr10 },
    { id: "n-3", name: "Handcrafted Rattan Oval", price: 1399, originalPrice: 1699, img: pr11 },
    { id: "n-4", name: "Royal Red Velvet Hamper", price: 3100, originalPrice: 3500, img: pr12 },
    { id: "n-5", name: "Golden Cage Delight", price: 2799, originalPrice: 3199, img: pr1 },
    { id: "n-6", name: "Artisanal Woven Basket", price: 1699, originalPrice: 1999, img: pr2 },
    { id: "n-7", name: "Heritage Gift Crate", price: 3899, originalPrice: 4399, img: pr3 },
    { id: "n-8", name: "Glow Party Festive Pack", price: 1499, originalPrice: 1799, img: pr4 },
  ],
  popularBaskets: [
    { id: "p-1", name: "Golden Harvest Hamper", price: 2299, originalPrice: 2699, img: pr5 },
    { id: "p-2", name: "Sweet Surprises Tray", price: 1799, originalPrice: 2099, img: pr6 },
    { id: "p-3", name: "Majestic Royal Crate", price: 4499, originalPrice: 4999, img: pr7 },
    { id: "p-4", name: "Rose Gold Basket", price: 1899, originalPrice: 2299, img: pr8 },
    { id: "p-5", name: "Soft Lilac Picnic Basket", price: 1699, originalPrice: 1999, img: pr9 },
    { id: "p-6", name: "Sage Green Elegance", price: 2999, originalPrice: 3499, img: pr10 },
    { id: "p-7", name: "Boho Chic Circle Basket", price: 1499, originalPrice: 1799, img: pr11 },
    { id: "p-8", name: "Festive Treasure Box", price: 3299, originalPrice: 3799, img: pr12 },
  ]
};

const animatedStrokeStyle = {
  border: '3px solid transparent',
  borderRadius: '16px',
  backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(90deg, #f59e0b, #ec4899, #a855f7, #f59e0b)',
  backgroundOrigin: 'border-box',
  backgroundClip: 'padding-box, border-box',
  backgroundSize: '200% 100%',
  animation: 'moveGradient 3s linear infinite',
  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.2)'
};

export default function AllHampers({ data = allHampersData }) {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();

  const [heroDesktopBanners, setHeroDesktopBanners] = useState([]);
  const [heroMobileBanners, setHeroMobileBanners] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const [squareDesktop, setSquareDesktop] = useState([null, null, null]);
  const [squareMobile, setSquareMobile] = useState([null, null]);

  const [reelBanners, setReelBanners] = useState([]);

  const [promoDesktopBanners, setPromoDesktopBanners] = useState([]);
  const [promoMobileBanners, setPromoMobileBanners] = useState([]);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  // Live Products State
  const [realNewArrivals, setRealNewArrivals] = useState([]);
  const [realFeatured, setRealFeatured] = useState([]);
  const [realPopular, setRealPopular] = useState([]);

  // Live Customer Reviews State
  const [reviewsList, setReviewsList] = useState(DEFAULT_REVIEWS);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [myReviewIds, setMyReviewIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mySubmittedReviewIds') || '[]');
    } catch {
      return [];
    }
  });

  const [newReview, setNewReview] = useState({
    userName: '',
    productName: '',
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const [activeTab, setActiveTab] = useState('newArrivals');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  const getCurrentUser = () => {
    try {
      const u = localStorage.getItem('handyUser');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch(BANNERS_API_URL);
      if (!res.ok) return;
      const banners = await res.json();
      if (!Array.isArray(banners)) return;

      setHeroDesktopBanners(banners.filter(b => b.type === 'heroDesktop'));
      setHeroMobileBanners(banners.filter(b => b.type === 'heroMobile'));

      const sqDesk = [null, null, null];
      banners.filter(b => b.type === 'squareDesktop').forEach(b => {
        const slot = Number(b.slotIndex);
        if (slot >= 0 && slot < 3) sqDesk[slot] = b;
      });
      setSquareDesktop(sqDesk);

      const sqMob = [null, null];
      banners.filter(b => b.type === 'squareMobile').forEach(b => {
        const slot = Number(b.slotIndex);
        if (slot >= 0 && slot < 2) sqMob[slot] = b;
      });
      setSquareMobile(sqMob);

      setReelBanners(banners.filter(b => b.type === 'reels'));
      setPromoDesktopBanners(banners.filter(b => b.type === 'promoDesktop'));
      setPromoMobileBanners(banners.filter(b => b.type === 'promoMobile'));
    } catch (err) {
      console.error('Error loading banners from API:', err);
    }
  };

  const fetchRealProducts = async () => {
    try {
      const res = await fetch(PRODUCTS_API_URL);
      if (!res.ok) return;
      const products = await res.json();

      if (Array.isArray(products) && products.length > 0) {
        const formatted = products.map((p) => {
          let displayImg = p.mainImage || (p.images && p.images[0]) || '';
          let displayPrice = p.price;
          let displayMrp = p.mrp;

          if (p.isVariable && p.variants?.length > 0) {
            const firstVariant = p.variants.find((v) => v.images?.[0] || v.image) || p.variants[0];
            displayImg = firstVariant?.images?.[0] || firstVariant?.image || displayImg;
            const prices = p.variants.map((v) => Number(v.price)).filter(Boolean);
            if (prices.length > 0) displayPrice = Math.min(...prices);
            displayMrp = firstVariant?.mrp || displayMrp;
          }

          return {
            id: p._id || p.id,
            _id: p._id || p.id,
            name: p.title || p.name || 'Handcrafted Hamper',
            title: p.title || p.name || 'Handcrafted Hamper',
            price: displayPrice || 999,
            originalPrice: displayMrp || null,
            img: displayImg || pr1,
            mainImage: displayImg || pr1
          };
        });

        const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

        setRealNewArrivals(shuffle(formatted));
        setRealFeatured(shuffle(formatted));
        setRealPopular(shuffle(formatted));
      }
    } catch (err) {
      console.error('Error loading real products:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(REVIEWS_API_URL);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const approved = data.filter(r => r.status !== 'Rejected');
          setReviewsList(approved.length > 0 ? approved : DEFAULT_REVIEWS);
          return;
        }
      }
      setReviewsList(DEFAULT_REVIEWS);
    } catch (err) {
      console.error('Reviews API Error (Using Defaults):', err);
      setReviewsList(DEFAULT_REVIEWS);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchRealProducts();
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.userName.trim() || !newReview.comment.trim()) {
      alert('Kripya apna naam aur review comment enter karein!');
      return;
    }

    setSubmittingReview(true);
    const currentUser = getCurrentUser();
    const userEmail = currentUser?.email || 'guest@handyhampers.com';

    const payload = {
      userName: newReview.userName.trim(),
      userEmail: userEmail,
      userId: currentUser?.sub || currentUser?.id || userEmail,
      productName: newReview.productName.trim() || 'Handy Hamper Collection',
      rating: Number(newReview.rating),
      comment: newReview.comment.trim(),
      status: 'Approved',
      date: new Date().toISOString().split('T')[0]
    };

    try {
      const res = await fetch(REVIEWS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        const savedId = saved._id || saved.id;
        setReviewsList(prev => [saved, ...prev]);

        if (savedId) {
          const updatedIds = [...myReviewIds, String(savedId)];
          setMyReviewIds(updatedIds);
          localStorage.setItem('mySubmittedReviewIds', JSON.stringify(updatedIds));
        }

        alert('Shukriya! Aapka review safaltapoorvak save ho gaya hai ⭐');
      } else {
        const tempId = `local-${Date.now()}`;
        setReviewsList(prev => [{ ...payload, _id: tempId }, ...prev]);
        const updatedIds = [...myReviewIds, tempId];
        setMyReviewIds(updatedIds);
        localStorage.setItem('mySubmittedReviewIds', JSON.stringify(updatedIds));
        alert('Review added! Shukriya ⭐');
      }

      setShowReviewModal(false);
      setNewReview({ userName: '', productName: '', rating: 5, comment: '' });
    } catch (err) {
      console.error('Review submit error:', err);
      const tempId = `local-${Date.now()}`;
      setReviewsList(prev => [{ ...payload, _id: tempId }, ...prev]);
      const updatedIds = [...myReviewIds, tempId];
      setMyReviewIds(updatedIds);
      localStorage.setItem('mySubmittedReviewIds', JSON.stringify(updatedIds));
      alert('Review added locally! ⭐');
      setShowReviewModal(false);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteMyReview = async (reviewId) => {
    if (!confirm('Kya aap apna review delete karna chahte hain?')) return;

    try {
      if (!String(reviewId).startsWith('local-') && !String(reviewId).startsWith('r-')) {
        await fetch(`${REVIEWS_API_URL}/${reviewId}`, {
          method: 'DELETE'
        });
      }

      setReviewsList(prev => prev.filter(r => (r._id || r.id) !== reviewId));
      const updatedIds = myReviewIds.filter(id => id !== String(reviewId));
      setMyReviewIds(updatedIds);
      localStorage.setItem('mySubmittedReviewIds', JSON.stringify(updatedIds));
      alert('Aapka review delete ho gaya hai.');
    } catch (err) {
      console.error('Delete review error:', err);
      setReviewsList(prev => prev.filter(r => (r._id || r.id) !== reviewId));
      alert('Review remove kar diya gaya.');
    }
  };

  const currentHeroBanners = isMobile 
    ? (heroMobileBanners.length > 0 ? heroMobileBanners : heroDesktopBanners)
    : heroDesktopBanners;

  const currentPromoBanners = isMobile 
    ? (promoMobileBanners.length > 0 ? promoMobileBanners : promoDesktopBanners)
    : (promoDesktopBanners.length > 0 ? promoDesktopBanners : promoMobileBanners);

  const queryParams = new URLSearchParams(location.search);
  const currentCatKey = queryParams.get('cat') || 'all';
  const isAllHampersPage = (data?.id === 'all' || !data?.id) && currentCatKey === 'all';

  const shippingLines = [
    "PAN India Safe Delivery",
    "Express 2-Hour Delivery Available",
    "100% Breakage-Free Insured Gifting",
    "Luxury Handcrafted Hampers",
    "Free Gift Wrapping On All Orders"
  ];

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [flipClass, setFlipClass] = useState("");
  const [truckAnimating, setTruckAnimating] = useState(false);

  useEffect(() => {
    if (!currentHeroBanners || currentHeroBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % currentHeroBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [currentHeroBanners]);

  useEffect(() => {
    if (!currentPromoBanners || currentPromoBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % currentPromoBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [currentPromoBanners]);

  useEffect(() => {
    if (!isAllHampersPage) return;

    let timerId, t1, t2, t3;
    const runMasterLoop = () => {
      setFlipClass("text-flip-out");

      t1 = setTimeout(() => {
        setCurrentLineIndex((prevIndex) => (prevIndex + 1) % shippingLines.length);
        setFlipClass("text-flip-in");

        t2 = setTimeout(() => {
          setFlipClass("");
        }, 400);
      }, 250);

      t3 = setTimeout(() => {
        setTruckAnimating(true);
      }, 1200);

      timerId = setTimeout(() => {
        setTruckAnimating(false);
        runMasterLoop();
      }, 4800);
    };

    const initialTimer = setTimeout(runMasterLoop, 1000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(timerId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [shippingLines.length, isAllHampersPage]);

  const handleBannerClick = (bannerObj) => {
    const destination = bannerObj?.link || bannerObj?.targetUrl || bannerObj?.url;
    if (!destination) return;

    if (destination.startsWith('http://') || destination.startsWith('https://')) {
      window.open(destination, '_blank', 'noopener,noreferrer');
    } else {
      navigate(destination);
    }
  };

  const isItemInWishlist = (productId) => {
    const currentUser = getCurrentUser();
    const wishlistKey = currentUser ? `handy_wishlist_${currentUser.email}` : 'handy_wishlist_guest';
    const saved = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
    if (Array.isArray(saved) && saved.length > 0) {
      return saved.some(item => (item._id || item.id) === productId);
    }
    if (!wishlist || !Array.isArray(wishlist)) return false;
    return wishlist.some(item => (item._id || item.id) === productId);
  };

  const handleToggleWishlist = (product, e) => {
    e.stopPropagation();
    const currentUser = getCurrentUser();
    const wishlistKey = currentUser ? `handy_wishlist_${currentUser.email}` : 'handy_wishlist_guest';

    let currentWishlist = [];
    try {
      const userSaved = currentUser ? localStorage.getItem(wishlistKey) : null;
      const genericSaved = localStorage.getItem('wishlist');
      if (userSaved) currentWishlist = JSON.parse(userSaved);
      else if (genericSaved) currentWishlist = JSON.parse(genericSaved);
    } catch (err) {
      console.error(err);
    }

    const productId = product._id || product.id;
    const index = currentWishlist.findIndex((item) => (item._id || item.id) === productId);

    const formattedItem = {
      ...product,
      id: productId,
      _id: productId,
      mainImage: product.img || product.mainImage,
      title: product.name || product.title,
    };

    if (index > -1) {
      currentWishlist.splice(index, 1);
    } else {
      currentWishlist.push(formattedItem);
    }

    localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
    if (currentUser) {
      localStorage.setItem(wishlistKey, JSON.stringify(currentWishlist));
    }
    window.dispatchEvent(new Event('storage'));

    if (toggleWishlist) {
      toggleWishlist(formattedItem);
    }
  };

  // Direct User-ID Safe Add to Cart Handler (Min 5 Units, +1 Next)
  const handleDirectAddToCart = (product, e) => {
    e.stopPropagation();

    try {
      const currentUser = getCurrentUser();
      const userKey = currentUser ? `handy_cart_${currentUser.email}` : 'handy_cart_guest';

      let existingCart = [];
      const userSaved = currentUser ? localStorage.getItem(userKey) : null;
      const genericSaved = localStorage.getItem('cart');

      if (userSaved) existingCart = JSON.parse(userSaved);
      else if (genericSaved) existingCart = JSON.parse(genericSaved);

      const productId = product._id || product.id;
      const index = existingCart.findIndex((item) => (item.id || item._id) === productId);

      if (index > -1) {
        existingCart[index].quantity = (Number(existingCart[index].quantity) || 0) + 1;
      } else {
        existingCart.push({
          id: productId,
          _id: productId,
          name: product.name || product.title,
          price: Number(product.price) || 0,
          image: product.img || product.mainImage,
          img: product.img || product.mainImage,
          quantity: 5, // minimum 5 pcs
        });
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      if (currentUser) {
        localStorage.setItem(userKey, JSON.stringify(existingCart));
      }
      window.dispatchEvent(new Event('storage'));

      const cartBtn = e.currentTarget;
      cartBtn.classList.add('scale-125');
      setTimeout(() => cartBtn.classList.remove('scale-125'), 200);
    } catch (err) {
      console.error('Direct cart add error:', err);
    }
  };

  const activeArrivals = realNewArrivals.length > 0 ? realNewArrivals : (data.newArrivals || []);
  const activeFeatured = realFeatured.length > 0 ? realFeatured : (data.featuredProducts || []);
  const activePopular = realPopular.length > 0 ? realPopular : (data.popularBaskets || []);

  const getTabProducts = () => {
    if (activeTab === 'newArrivals') return activeArrivals.slice(0, 4);
    if (activeTab === 'offers') return activeFeatured.slice(0, 4);
    return activePopular.slice(0, 4);
  };

  const tabThemes = {
    newArrivals: {
      wrapperBg: 'from-rose-100/90 via-pink-50 to-rose-50/80',
      borderColor: 'border-rose-300',
      glowShadow: 'shadow-[0_10px_30px_rgba(244,63,94,0.18)]',
      activeTabBtn: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-300/80 scale-105',
      btnBg: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-200',
      cardHoverBorder: 'hover:border-rose-300',
      cardBg: 'bg-gradient-to-br from-rose-50/70 to-pink-50/30',
      priceColor: 'text-rose-600'
    },
    offers: {
      wrapperBg: 'from-amber-100/90 via-amber-50 to-orange-50/80',
      borderColor: 'border-amber-300',
      glowShadow: 'shadow-[0_10px_30px_rgba(245,158,11,0.18)]',
      activeTabBtn: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-300/80 scale-105',
      btnBg: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-200',
      cardHoverBorder: 'hover:border-amber-300',
      cardBg: 'bg-gradient-to-br from-amber-50/70 to-orange-50/30',
      priceColor: 'text-amber-600'
    },
    trending: {
      wrapperBg: 'from-purple-100/90 via-purple-50 to-pink-50/80',
      borderColor: 'border-purple-300',
      glowShadow: 'shadow-[0_10px_30px_rgba(168,85,247,0.18)]',
      activeTabBtn: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-300/80 scale-105',
      btnBg: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-200',
      cardHoverBorder: 'hover:border-purple-300',
      cardBg: 'bg-gradient-to-br from-purple-50/70 to-pink-50/30',
      priceColor: 'text-purple-600'
    }
  };

  const currentTheme = tabThemes[activeTab];

  // Preserves exact browser scroll position on navigation
  const handleProductClick = (id) => {
    if (!id) return;
    navigate(`/product/${id}`);
  };

  const handleStyleCategoryClick = (cat) => {
    if (cat?.path) {
      navigate(cat.path);
    }
  };

  const renderProductGrid = (items) => {
    const limitedItems = items.slice(0, 8);

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full">
        {limitedItems.map((item, index) => {
          const itemId = item._id || item.id;
          const isLiked = isItemInWishlist(itemId);

          return (
            <div 
              key={itemId || `product-${index}`}
              onClick={() => handleProductClick(itemId)}
              className={`group relative p-2.5 md:p-3 bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer ${
                index >= 6 ? 'hidden md:block' : ''
              }`}
            >
              <button 
                type="button"
                onClick={(e) => handleToggleWishlist(item, e)}
                className="absolute top-4 right-4 z-20 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur-md border border-rose-100 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all"
                title="Wishlist"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill={isLiked ? "#f43f5e" : "none"} 
                  stroke={isLiked ? "#f43f5e" : "#9ca3af"} 
                  strokeWidth="2" 
                  className="w-4 h-4 md:w-4.5 md:h-4.5 transition-colors"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>

              {/* Uniform Zoom Container */}
              <div className="w-full h-36 md:h-52 rounded-xl overflow-hidden mb-2.5 bg-stone-100 relative flex items-center justify-center">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full h-full object-cover scale-105 group-hover:scale-115 transition-transform duration-500" 
                />
              </div>

              <h4 className="font-extrabold text-[12px] md:text-sm text-stone-800 truncate group-hover:text-rose-600 transition-colors">
                {item.name}
              </h4>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-rose-50/80">
                <div>
                  <span className="text-xs md:text-base font-black text-rose-700">₹{item.price}</span>
                  {item.originalPrice && (
                    <span className="text-[10px] md:text-xs text-stone-400 line-through font-semibold ml-1.5">₹{item.originalPrice}</span>
                  )}
                </div>

                {/* Direct Add to Cart Action */}
                <button 
                  type="button"
                  onClick={(e) => handleDirectAddToCart(item, e)}
                  title="Add to Cart"
                  className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-200 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const activeSquareBanners = isMobile ? squareMobile : squareDesktop;
  const hasSquareBanners = activeSquareBanners.some(b => b !== null);

  return (
    <div className="w-full space-y-8 md:space-y-14 pb-16 bg-gradient-to-b from-rose-50/30 via-stone-50/30 to-white text-stone-900 overflow-x-hidden">
      
      <style>{`
        @keyframes moveGradient {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }

        .cute-delivery-card-fixed-strip {
          position: relative;
          display: flex;
          align-items: center;
          height: 44px;
        }

        .truck-track-zone {
          position: relative;
          width: 0px; 
          height: 36px;
          flex-shrink: 0;
          z-index: 40;
        }

        .truck-core-box {
          position: absolute;
          left: 0;
          top: 0;
          width: 36px;
          height: 36px;
          transform-origin: bottom center;
        }

        @keyframes cartoonTruckLaunch {
          0% { transform: translateX(0px) translateY(0px) rotate(0deg); opacity: 1; }
          15% { transform: translateX(-2px) translateY(-5px) rotate(-8deg); opacity: 1; }
          20% { transform: translateX(1px) translateY(0.5px) rotate(3deg); opacity: 1; }
          25% { transform: translateX(0px) translateY(0px) rotate(0deg); opacity: 1; }
          28% { transform: translateX(20px) translateY(-1.5px) rotate(0.5deg); opacity: 1; }
          35% { transform: translateX(65px) translateY(1px) rotate(-0.5deg); opacity: 1; }
          42% { transform: translateX(115px) translateY(-1.5px) rotate(0.5deg); opacity: 1; }
          49% { transform: translateX(165px) translateY(1px) rotate(-0.5deg); opacity: 1; }
          56% { transform: translateX(215px) translateY(-1.5px) rotate(0.5deg); opacity: 1; }
          63% { transform: translateX(265px) translateY(1px) rotate(-0.5deg); opacity: 1; }
          70% { transform: translateX(315px) translateY(-1.5px) rotate(0.5deg); opacity: 1; }
          77% { transform: translateX(365px) translateY(0px) rotate(0deg); opacity: 1; }
          85% { transform: translateX(430px) translateY(0px) rotate(0deg); opacity: 0; }
          100% { transform: translateX(430px) translateY(0px); opacity: 0; }
        }

        .run-truck-animation {
          animation: cartoonTruckLaunch 3.5s linear forwards !important;
        }

        @keyframes staticTruckVibe {
          0% { transform: translateX(0px) translateY(0deg); }
          25% { transform: translateX(0px) translateY(-0.8px) rotate(0.2deg); }
          50% { transform: translateX(0px) translateY(0px) rotate(0deg); }
          75% { transform: translateX(0px) translateY(-0.8px) rotate(-0.2deg); }
          100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
        }

        .idle-truck-vibe {
          animation: staticTruckVibe 0.2s linear infinite;
        }

        .text-flip-container {
          perspective: 400px;
          height: 24px;
          width: 280px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          overflow: hidden;
          position: relative;
        }

        .text-flip-element {
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          transition: transform 0.4s ease, opacity 0.4s ease;
        }

        .text-flip-out {
          transform: rotateX(-90deg) translateY(8px);
          opacity: 0;
        }

        .text-flip-in {
          animation: bookPageFlipIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes bookPageFlipIn {
          0% { transform: rotateX(90deg) translateY(-8px); opacity: 0; }
          100% { transform: rotateX(0deg) translateY(0px); opacity: 1; }
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* 1. HERO BANNER SLIDER */}
      {isAllHampersPage && currentHeroBanners && currentHeroBanners.length > 0 && (
        <div className="px-3 md:px-0">
          <div className="relative w-full overflow-hidden h-[240px] md:h-[360px] rounded-2xl md:rounded-none bg-stone-900 shadow-lg">
            {currentHeroBanners.map((bannerObj, index) => {
              const imgSrc = typeof bannerObj === 'string' ? bannerObj : bannerObj?.image;
              const hasLink = Boolean(bannerObj?.link || bannerObj?.targetUrl || bannerObj?.url);

              return (
                <div
                  key={`hero-banner-${index}`}
                  onClick={() => handleBannerClick(bannerObj)}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                    index === currentHeroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  } ${hasLink ? 'cursor-pointer hover:opacity-95' : ''}`}
                >
                  <img 
                    src={imgSrc} 
                    alt={`Hero Banner ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="px-3 md:px-12 space-y-8 md:space-y-14">

        {/* 2. SHOP BY STYLE */}
        {isAllHampersPage && data.categories && data.categories.length > 0 && (
          <section className="w-full space-y-3 md:space-y-4">
            <div className="space-y-0.5">
              <h2 className="text-sm md:text-2xl font-black text-rose-900 tracking-tight flex items-center gap-1.5">
                <span>🎀</span> {data.categoriesSectionTitle || 'Shop By Style'}
              </h2>
              {data.categoriesSectionSubtitle && (
                <p className="text-[11px] md:text-xs text-stone-500 font-medium">
                  {data.categoriesSectionSubtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5 md:gap-5 w-full">
              {data.categories.map((cat, index) => (
                <div
                  key={cat.id || `style-cat-${index}`}
                  onClick={() => handleStyleCategoryClick(cat)}
                  style={animatedStrokeStyle}
                  className="group relative w-full aspect-[3/4] cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 overflow-hidden"
                >
                  <div className="relative w-full h-full overflow-hidden rounded-[13px]">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {cat.badge && (
                      <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[7px] md:text-[9px] font-black uppercase px-1.5 md:px-2 py-0.2 md:py-0.5 rounded-full z-10 shadow-sm">
                        {cat.badge}
                      </span>
                    )}

                    <div className="absolute inset-x-0 bottom-0 pt-6 pb-2 px-1 md:pt-8 md:pb-2.5 md:px-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-center z-10">
                      <h3 className="font-black text-[10px] md:text-sm text-white drop-shadow-md truncate">
                        {cat.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. TRUCK ANIMATION STRIP */}
        {isAllHampersPage && (
          <div className="w-full my-4 relative overflow-hidden md:hidden">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-rose-200/80 px-4 py-2 flex items-center justify-between overflow-hidden shadow-sm relative">
              <div className="cute-delivery-card-fixed-strip select-none">
                <div className="truck-track-zone">
                  <div
                    className={`truck-core-box filter drop-shadow-[0_2px_4px_rgba(244,63,94,0.2)] ${
                      truckAnimating ? 'run-truck-animation' : 'idle-truck-vibe'
                    }`}
                  >
                    <svg viewBox="0 0 64 64" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 18H42V44H6V18Z" fill="#f43f5e" rx="2" />
                      <path d="M42 24H52L58 34V44H42V24Z" fill="#fbbf24" rx="2" />
                      <circle cx="14.5" cy="45.5" r="5.5" fill="#1F2937" />
                      <circle cx="49.5" cy="45.5" r="5.5" fill="#1F2937" />
                    </svg>
                  </div>
                </div>

                <div className="text-flip-container pl-10">
                  <span
                    className={`text-flip-element text-[13px] font-extrabold tracking-wide bg-gradient-to-r from-rose-600 via-amber-500 to-purple-600 bg-clip-text text-transparent uppercase ${flipClass}`}
                  >
                    {shippingLines[currentLineIndex]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. SIGNATURE SPOTLIGHT BANNERS */}
        {isAllHampersPage && hasSquareBanners && (
          <section className="w-full space-y-3 md:space-y-4 bg-gradient-to-r from-rose-50/60 via-amber-50/40 to-purple-50/40 p-3 md:p-6 rounded-3xl border border-rose-100">
            <h2 className="text-sm md:text-2xl font-black text-rose-900 tracking-tight flex items-center gap-1.5">
              <span>✨</span> Signature Spotlight Banners
            </h2>
            <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-3 md:gap-6 w-full`}>
              {activeSquareBanners.map((bannerItem, index) => {
                if (!bannerItem) return null;
                const bannerImg = typeof bannerItem === 'string' ? bannerItem : bannerItem.image;
                const hasLink = Boolean(bannerItem?.link || bannerItem?.targetUrl || bannerItem?.url);

                return (
                  <div 
                    key={`sq-slot-${index}`}
                    onClick={() => handleBannerClick(bannerItem)}
                    className={`group relative w-full aspect-[771/705] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-rose-200/60 ${
                      hasLink ? 'cursor-pointer' : ''
                    }`}
                  >
                    <img 
                      src={bannerImg} 
                      alt={`Square Banner Slot ${index + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" 
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. SELECTION HUB */}
        {isAllHampersPage && (
          <section 
            className={`w-full bg-gradient-to-b ${currentTheme.wrapperBg} rounded-3xl p-3.5 md:p-7 border-2 ${currentTheme.borderColor} ${currentTheme.glowShadow} transition-all duration-500 space-y-4 relative overflow-hidden`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/60 pb-3 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 md:w-11 md:h-11 rounded-xl bg-white shadow-sm flex items-center justify-center text-base md:text-2xl border border-rose-100 flex-shrink-0">
                  🚀
                </div>
                <div>
                  <h2 className="text-sm md:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-1.5">
                    Selection Hub
                  </h2>
                  <p className="text-[10px] md:text-xs text-stone-600 font-semibold">Pick a tab to change your store vibe 💕</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 md:flex md:items-center md:gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-sm w-full md:w-auto">
                <button
                  onClick={() => setActiveTab('newArrivals')}
                  className={`relative px-2 md:px-5 py-1.5 md:py-2 rounded-xl font-black text-[10px] md:text-xs transition-all duration-300 cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'newArrivals' ? tabThemes.newArrivals.activeTabBtn : 'text-stone-600'
                  }`}
                >
                  <span>🎁</span> <span className="truncate">New Arrivals</span>
                </button>

                <button
                  onClick={() => setActiveTab('offers')}
                  className={`relative px-2 md:px-5 py-1.5 md:py-2 rounded-xl font-black text-[10px] md:text-xs transition-all duration-300 cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'offers' ? tabThemes.offers.activeTabBtn : 'text-stone-600'
                  }`}
                >
                  <span>🔥</span> <span className="truncate">Best Offers</span>
                </button>

                <button
                  onClick={() => setActiveTab('trending')}
                  className={`relative px-2 md:px-5 py-1.5 md:py-2 rounded-xl font-black text-[10px] md:text-xs transition-all duration-300 cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === 'trending' ? tabThemes.trending.activeTabBtn : 'text-stone-600'
                  }`}
                >
                  <span>⭐</span> <span className="truncate">Trending</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-6 relative z-10 pt-1">
              {getTabProducts().map((item, idx) => {
                const itemId = item._id || item.id;
                const isLiked = isItemInWishlist(itemId);

                return (
                  <div 
                    key={`tab-item-${idx}`}
                    onClick={() => handleProductClick(itemId)}
                    className={`group bg-white rounded-2xl p-2.5 md:p-3 border border-white/80 ${currentTheme.cardHoverBorder} shadow-xs hover:shadow-xl transition-all duration-400 flex flex-col justify-between hover:-translate-y-1 cursor-pointer`}
                  >
                    {/* Uniform Zoom Box */}
                    <div className="relative w-full h-32 md:h-52 rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center mb-2 border border-white/50">
                      <button 
                        type="button"
                        onClick={(e) => handleToggleWishlist(item, e)}
                        className="absolute top-1.5 right-1.5 z-10 w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-all"
                        title="Wishlist"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill={isLiked ? "#f43f5e" : "none"} 
                          stroke={isLiked ? "#f43f5e" : "#9ca3af"} 
                          strokeWidth="2" 
                          className="w-3 h-3 md:w-3.5 md:h-3.5 transition-colors"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </button>

                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-full h-full object-cover scale-105 group-hover:scale-115 transition-transform duration-500" 
                      />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="font-extrabold text-stone-800 text-[11px] md:text-sm truncate group-hover:text-stone-950 transition-colors">
                        {item.name}
                      </h4>
                      <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                        <div>
                          <span className={`font-black text-xs md:text-base ${currentTheme.priceColor} transition-colors duration-500`}>
                            ₹{item.price}
                          </span>
                          {item.originalPrice && (
                            <span className="text-[9px] md:text-xs text-stone-400 line-through font-semibold ml-1">
                              ₹{item.originalPrice}
                            </span>
                          )}
                        </div>
                        
                        {/* Direct Add to Cart Action */}
                        <button 
                          type="button"
                          onClick={(e) => handleDirectAddToCart(item, e)}
                          title="Add to Cart"
                          className={`${currentTheme.btnBg} font-black text-[10px] md:text-xs px-2.5 md:px-3 py-1 rounded-xl shadow-xs transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-1`}
                        >
                          Add 🛒
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 6. HIGHLIGHTED REEL BANNERS */}
        {isAllHampersPage && reelBanners && reelBanners.length > 0 && (
          <section className="w-full space-y-4 bg-gradient-to-br from-rose-100/90 via-pink-50/70 to-amber-100/80 p-3.5 md:p-7 rounded-3xl shadow-xs border border-rose-200/80 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 md:w-11 md:h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-md text-base md:text-xl">
                  👑
                </div>
                <div>
                  <h2 className="text-xs md:text-2xl font-black text-rose-950 tracking-tight flex items-center gap-1">
                    Highlighted Reel Showcase 💖
                  </h2>
                  <p className="text-[10px] md:text-xs text-rose-700 font-semibold">
                    Swipe to explore portrait hamper reels ✨
                  </p>
                </div>
              </div>

              <span className="hidden md:inline-flex bg-white/80 backdrop-blur-md text-rose-600 font-black text-xs px-3 py-1 rounded-full border border-rose-200 shadow-2xs">
                Handpicked Banners 👑
              </span>
            </div>
            
            <div className="flex md:grid md:grid-cols-5 gap-3 md:gap-5 w-full overflow-x-auto no-scrollbar snap-x snap-mandatory pt-1 pb-2">
              {reelBanners.map((hl, index) => {
                const hasLink = Boolean(hl.link || hl.targetUrl || hl.url);

                return (
                  <div 
                    key={hl._id || `hl-${index}`}
                    onClick={() => handleBannerClick(hl)}
                    className={`group relative flex-shrink-0 w-36 sm:w-44 md:w-full aspect-[445/675] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-rose-200/70 bg-white snap-start ${
                      hasLink ? 'cursor-pointer hover:scale-102' : ''
                    }`}
                  >
                    <img 
                      src={hl.image} 
                      alt={hl.title || `Reel Banner ${index + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" 
                    />
                    {hl.title && (
                      <div className="absolute inset-0 bg-gradient-to-t from-rose-950/85 via-black/10 to-transparent flex items-end p-2.5 md:p-3">
                        <p className="text-white font-extrabold text-[10px] md:text-xs leading-snug drop-shadow-md truncate w-full text-center">
                          {hl.title}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 7. CURATED FOR YOU SECTION */}
        {activeArrivals.length > 0 && (
          <section className="w-full space-y-3 md:space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div>
                <h2 className="text-sm md:text-2xl font-black text-rose-900 tracking-tight flex items-center gap-1.5">
                  <span>🎀</span> {isAllHampersPage ? "Curated For You" : data.name || "Collection"}
                </h2>
                <p className="text-[11px] md:text-xs text-stone-500 font-medium">
                  Explore handpicked baskets crafted for your special moments
                </p>
              </div>
              <button 
                onClick={() => navigate('/products')}
                className="text-xs font-black text-rose-600 hover:underline cursor-pointer"
              >
                View All →
              </button>
            </div>

            {renderProductGrid(activeArrivals)}
          </section>
        )}

        {/* 8. PROMO SLIDE BANNERS SECTION */}
        {isAllHampersPage && currentPromoBanners && currentPromoBanners.length > 0 && (
          <section className="w-full py-2">
            <div className="relative w-full overflow-hidden h-[180px] sm:h-[230px] md:h-[300px] rounded-3xl shadow-md border border-rose-100 bg-stone-100">
              {currentPromoBanners.map((banner, index) => {
                const bannerImg = typeof banner === 'string' ? banner : banner.image;
                const hasLink = Boolean(banner?.link || banner?.targetUrl || banner?.url);

                return (
                  <div
                    key={banner._id || `promo-${index}`}
                    onClick={() => handleBannerClick(banner)}
                    className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                      index === currentPromoIndex 
                        ? 'opacity-100 scale-100 z-10' 
                        : 'opacity-0 scale-105 z-0 pointer-events-none'
                    } ${hasLink ? 'cursor-pointer' : ''}`}
                  >
                    <img
                      src={bannerImg}
                      alt={banner.title || `Promotional Banner ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
                    />
                  </div>
                );
              })}

              {currentPromoBanners.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full shadow">
                  {currentPromoBanners.map((_, dotIdx) => (
                    <button
                      key={`promo-dot-${dotIdx}`}
                      onClick={() => setCurrentPromoIndex(dotIdx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        dotIdx === currentPromoIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/70 hover:bg-white'
                      }`}
                      aria-label={`Slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 9. POPULAR BASKETS SECTION */}
        {activePopular.length > 0 && (
          <section className="w-full space-y-3 md:space-y-4">
            <h2 className="text-sm md:text-2xl font-black text-rose-900 tracking-tight flex items-center gap-1.5">
              <span>🔥</span> Popular Baskets
            </h2>
            {renderProductGrid(activePopular)}
          </section>
        )}

        {/* 10. REAL CUSTOMER REVIEWS */}
        {isAllHampersPage && (
          <section className="w-full space-y-6 pt-4 border-t border-rose-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm md:text-2xl font-black text-rose-950 tracking-tight flex items-center gap-2">
                  <span>⭐</span> Customer Experiences & Reviews
                </h2>
                <p className="text-[11px] md:text-xs text-stone-500 font-medium">
                  Verified customer love from across India for our luxury handcrafted hampers
                </p>
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-xs md:text-sm rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
              >
                <span>✍️</span> Write a Review
              </button>
            </div>

            <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pt-1 pb-3 -mx-1 px-1">
              {reviewsList.slice(0, 8).map((rev) => {
                const reviewId = String(rev._id || rev.id);
                const currentUser = getCurrentUser();
                const isMyReview =
                  (currentUser?.email && rev.userEmail === currentUser.email) ||
                  myReviewIds.includes(reviewId);

                return (
                  <div
                    key={reviewId}
                    className="flex-shrink-0 w-[260px] sm:w-[300px] md:w-full snap-start bg-white/95 backdrop-blur-xs p-4 rounded-2xl border border-rose-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500 text-xs">
                          {'★'.repeat(Number(rev.rating || 5))}
                          {'☆'.repeat(5 - Number(rev.rating || 5))}
                        </div>
                        <span className="text-[10px] text-stone-400 font-semibold">{rev.date || 'Recent'}</span>
                      </div>

                      <p className="text-xs text-stone-700 font-medium leading-relaxed italic line-clamp-3">
                        "{rev.comment || rev.reviewText}"
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-rose-50 flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-xs text-stone-900 truncate">
                          {rev.userName || 'Verified Buyer'}
                        </h4>
                        <p className="text-[10px] text-rose-600 font-bold truncate max-w-[130px]">
                          {rev.productName || 'Luxury Hamper Basket'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isMyReview ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMyReview(reviewId);
                            }}
                            className="text-stone-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors text-xs cursor-pointer"
                            title="Delete your review"
                          >
                            🗑️
                          </button>
                        ) : (
                          <span className="text-emerald-600 text-xs font-bold" title="Verified Purchase">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>

      {/* WRITE REVIEW POPUP MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-rose-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-black text-rose-950 flex items-center gap-1.5">
                <span>⭐</span> Share Your Experience
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 font-black text-xs flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newReview.userName}
                  onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Product Purchased</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Gold Mesh Basket"
                  value={newReview.productName}
                  onChange={(e) => setNewReview({ ...newReview, productName: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Rating *</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-rose-500 outline-none bg-white cursor-pointer font-bold text-amber-600"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5) - Excellent</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5) - Very Good</option>
                  <option value={3}>⭐⭐⭐ (3/5) - Good</option>
                  <option value={2}>⭐⭐ (2/5) - Fair</option>
                  <option value={1}>⭐ (1/5) - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Your Review *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us what you loved about our hamper quality, design, or delivery..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-rose-500 outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review ⭐'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}