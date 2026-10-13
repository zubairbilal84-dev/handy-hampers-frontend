import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import DesktopHeader from '../components/desktop/DesktopHeader';

export default function MyAccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [userProfile, setUserProfile] = useState({
    userId: 'HH-USER-NEW',
    name: 'Customer',
    email: '',
    picture: '',
    joinedDate: 'October 2026'
  });

  useEffect(() => {
    const saved = localStorage.getItem('handyUser');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserProfile((prev) => ({
          ...prev,
          ...parsed,
          userId: parsed.userId || parsed._id || 'HH-USER'
        }));
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Session load error:', err);
      }
    }
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleLoading(true);
      const decoded = jwtDecode(credentialResponse.credential);

      const googlePayload = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        sub: decoded.sub,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };

      const targetUserKey = `handy_cart_${decoded.email}`;
      try {
        const guestCart = localStorage.getItem('cart');
        if (guestCart && JSON.parse(guestCart).length > 0) {
          localStorage.setItem(targetUserKey, guestCart);
        }
      } catch (cErr) {
        console.error('Cart transfer error:', cErr);
      }

      try {
        const res = await fetch('https://handy-hampers.onrender.com/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(googlePayload)
        });

        if (res.ok) {
          const dbUser = await res.json();
          const merged = { ...googlePayload, ...dbUser, userId: dbUser._id || decoded.sub.slice(0, 8) };
          setUserProfile(merged);
          localStorage.setItem('handyUser', JSON.stringify(merged));
        } else {
          setUserProfile((prev) => ({ ...prev, ...googlePayload, userId: decoded.sub.slice(0, 8) }));
          localStorage.setItem('handyUser', JSON.stringify(googlePayload));
        }
      } catch (backendErr) {
        setUserProfile((prev) => ({ ...prev, ...googlePayload, userId: decoded.sub.slice(0, 8) }));
        localStorage.setItem('handyUser', JSON.stringify(googlePayload));
      }

      setIsLoggedIn(true);
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Google login error:', err);
      alert('Google login me error aaya, kripya dobara try karein!');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Kya aap logout karna chahte hain?')) {
      localStorage.removeItem('handyUser');
      setIsLoggedIn(false);
      setUserProfile({
        userId: 'HH-USER-NEW',
        name: 'Customer',
        email: '',
        picture: '',
        joinedDate: 'October 2026'
      });
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      <div className="py-6 md:py-16 px-4 lg:px-10">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* ================= 1. AUTH / PROFILE SECTION ================= */}
          {!isLoggedIn ? (
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-stone-200 shadow-sm text-center max-w-xl mx-auto space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-3xl mx-auto shadow-inner border border-amber-200">
                🎁
              </div>
              
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-[#2C1A11]">Welcome to Handy Hampers</h2>
                <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                  Apne orders track karne, wishlist save karne aur profile manage karne ke liye Google se login karein.
                </p>
              </div>

              <div className="pt-1 flex flex-col items-center justify-center">
                {googleLoading ? (
                  <div className="text-xs font-bold text-amber-700 animate-pulse py-2">
                    Signing in with Google... ⏳
                  </div>
                ) : (
                  <div className="w-full flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => alert('Google Sign-In Failed!')}
                      shape="pill"
                      theme="outline"
                      size="large"
                      width="300"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-400">
                🔒 Safe & 100% verified authentication via Google
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-[#2C1A11] via-[#3D2518] to-[#1E2421] p-6 md:p-8 rounded-3xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
                <div className="relative shrink-0">
                  {userProfile.picture ? (
                    <img
                      src={userProfile.picture}
                      alt={userProfile.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg border-2 border-amber-300"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg border-2 border-amber-200">
                      {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-[#2C1A11] w-4 h-4 rounded-full" title="Active Account"></span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black truncate max-w-[200px] sm:max-w-none">{userProfile.name}</h1>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-black px-2 py-0.5 rounded-md shrink-0">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 truncate max-w-[220px]">{userProfile.email || 'Handy Hampers Member'}</p>
                  <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold text-amber-300 border border-white/10">
                    <i className="fa-solid fa-id-card text-[10px]"></i>
                    <span>{userProfile.userId}</span>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 sm:border-l border-stone-700/60 pt-3 sm:pt-0 sm:pl-6 text-stone-300 text-xs">
                <div>
                  <span className="text-stone-400 text-[11px] block">Member Since</span>
                  <span className="font-bold text-white text-xs">{userProfile.joinedDate}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* ================= 2. ORDER & SHOPPING BUTTONS (Always Visible) ================= */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-500 px-1">
              Orders & Shopping
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                to="/my-orders"
                className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                  📦
                </span>
                <div>
                  <h4 className="text-xs font-black text-stone-900 leading-tight">My Orders</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">Track your orders</p>
                </div>
              </Link>

              <Link
                to="/track-order"
                className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                  🚚
                </span>
                <div>
                  <h4 className="text-xs font-black text-stone-900 leading-tight">Live Tracking</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">Realtime order route</p>
                </div>
              </Link>

              <Link
                to="/wishlist"
                className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <span className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                  ❤️
                </span>
                <div>
                  <h4 className="text-xs font-black text-stone-900 leading-tight">My Wishlist</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">Saved hampers</p>
                </div>
              </Link>

              <Link
                to="/offers"
                className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <span className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                  🔥
                </span>
                <div>
                  <h4 className="text-xs font-black text-stone-900 leading-tight">Hot Offers</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">Vouchers & Deals</p>
                </div>
              </Link>
            </div>
          </div>

          {/* ================= 3. DISCOVER & SUPPORT BUTTONS (Always Visible) ================= */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-500 px-1">
              Store, Help & Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                to="/about"
                className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                  ℹ️
                </span>
                <div>
                  <h4 className="text-xs font-black text-stone-900 leading-tight">About Us</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">Craftsmanship story</p>
                </div>
              </Link>

              <Link
                to="/contact"
                className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <span className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                  📞
                </span>
                <div>
                  <h4 className="text-xs font-black text-stone-900 leading-tight">Contact Us</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">Support & Inquiries</p>
                </div>
              </Link>

              <Link
                to="/blog"
                className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <span className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                  ✍️
                </span>
                <div>
                  <h4 className="text-xs font-black text-stone-900 leading-tight">Our Blog</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">Articles & Trends</p>
                </div>
              </Link>

              <Link
                to="/refund-policy"
                className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <span className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                  🔄
                </span>
                <div>
                  <h4 className="text-xs font-black text-stone-900 leading-tight">Refund Policy</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">Return & Exchange</p>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}