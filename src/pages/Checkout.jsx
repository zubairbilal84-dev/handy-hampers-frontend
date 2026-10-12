import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DesktopHeader from '../components/desktop/DesktopHeader';

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Current logged-in Google User get karein
  const getCurrentUser = () => {
    try {
      const u = localStorage.getItem('handyUser');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();
  const userCartKey = currentUser ? `handy_cart_${currentUser.email}` : 'handy_cart_guest';

  // 2. Check if Single Item checkout was triggered from Cart.jsx
  const singleItemCheckout = location.state?.singleItemCheckout;
  const passedCheckoutItem = location.state?.checkoutItem;

  // 3. Load Cart (Single Item vs Entire Cart)
  const [cart, setCart] = useState(() => {
    if (singleItemCheckout && passedCheckoutItem) {
      return [passedCheckoutItem];
    }
    try {
      if (currentUser) {
        const uSaved = localStorage.getItem(userCartKey);
        if (uSaved && JSON.parse(uSaved).length > 0) return JSON.parse(uSaved);
      }
      const gSaved = localStorage.getItem('cart');
      if (gSaved && JSON.parse(gSaved).length > 0) return JSON.parse(gSaved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Auto-fill Google Account Data
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  // Login Guard
  useEffect(() => {
    if (!currentUser) {
      alert('⚠️ Checkout karne ke liye pehle login karein!');
      navigate('/my-account');
    }
  }, [currentUser, navigate]);

  const totalQuantity = cart.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
  const totalAmount = cart.reduce(
    (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Clear or remove ordered item from storage
  const clearPurchasedItemsFromCart = () => {
    try {
      if (singleItemCheckout && passedCheckoutItem) {
        const singleId = passedCheckoutItem.id || passedCheckoutItem._id;
        
        let existingUserCart = [];
        if (currentUser) {
          existingUserCart = JSON.parse(localStorage.getItem(userCartKey) || '[]');
        }
        let existingGlobalCart = JSON.parse(localStorage.getItem('cart') || '[]');

        const updatedUser = existingUserCart.filter((item) => (item.id || item._id) !== singleId);
        const updatedGlobal = existingGlobalCart.filter((item) => (item.id || item._id) !== singleId);

        localStorage.setItem('cart', JSON.stringify(updatedGlobal));
        if (currentUser) {
          localStorage.setItem(userCartKey, JSON.stringify(updatedUser));
        }
      } else {
        localStorage.removeItem('cart');
        if (currentUser) {
          localStorage.removeItem(userCartKey);
        }
      }
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      return alert('⚠️ Aapka cart empty hai!');
    }
    if (totalQuantity < 50) {
      return alert(`⚠️ Bulk checkout ke liye minimum 50 items required hain. Abhi checkout me ${totalQuantity} items hain.`);
    }

    setIsSubmitting(true);

    const payload = {
      customer: {
        ...formData,
        email: currentUser?.email || formData.email,
      },
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid',
      items: cart.map((item) => ({
        id: item.id || item._id,
        name: item.name || item.title,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        img: item.img || item.image || item.mainImage
      })),
      totalItems: totalQuantity,
      totalPrice: totalAmount,
      status: 'Packed',
      currentLocation: 'Main Warehouse, Moradabad'
    };

    try {
      const res = await fetch('https://handy-hampers.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedOrder = await res.json();
        const existingOrders = JSON.parse(localStorage.getItem('handyOrders')) || [];
        localStorage.setItem('handyOrders', JSON.stringify([savedOrder, ...existingOrders]));

        clearPurchasedItemsFromCart();
        setOrderDetails(savedOrder);
        setOrderSuccess(true);
      } else {
        alert('❌ Order place karne me error aaya! Server response invalid.');
      }
    } catch (err) {
      console.error('Order Submission Error:', err);
      const fallbackOrder = {
        ...payload,
        _id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        createdAt: new Date().toISOString()
      };
      const existingOrders = JSON.parse(localStorage.getItem('handyOrders')) || [];
      localStorage.setItem('handyOrders', JSON.stringify([fallbackOrder, ...existingOrders]));

      clearPurchasedItemsFromCart();
      setOrderDetails(fallbackOrder);
      setOrderSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) return null;

  if (orderSuccess && orderDetails) {
    const displayId = orderDetails._id || orderDetails.id;
    return (
      <div className="bg-[#FAF8F5] min-h-screen text-stone-900">
        <div className="hidden md:block">
          <DesktopHeader />
        </div>

        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 font-black">
              ✓
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2C1A11]">Order Confirmed!</h1>
            <p className="text-stone-500 text-xs mt-1">
              Order ID: <span className="font-bold text-stone-900">#{typeof displayId === 'string' ? displayId.slice(-6).toUpperCase() : displayId}</span>
            </p>

            <div className="mt-6 p-5 bg-stone-50 rounded-2xl text-left border border-stone-200 text-xs space-y-2">
              <p><strong>Account:</strong> {currentUser.email}</p>
              <p><strong>Customer:</strong> {orderDetails.customer?.name}</p>
              <p><strong>Phone:</strong> {orderDetails.customer?.phone}</p>
              <p><strong>Address:</strong> {orderDetails.customer?.address}, {orderDetails.customer?.city} - {orderDetails.customer?.pincode}</p>
              <p><strong>Payment Mode:</strong> <span className="text-amber-800 bg-amber-100 font-bold px-2 py-0.5 rounded">Cash on Delivery</span></p>
              <p><strong>Total Items:</strong> {orderDetails.totalItems} hampers</p>
              <p><strong>Amount to Pay:</strong> <span className="text-rose-600 font-black text-sm">₹{orderDetails.totalPrice}</span></p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <button
                type="button"
                onClick={() => navigate('/my-orders')}
                className="bg-[#2C1A11] text-amber-300 font-black px-6 py-3 rounded-xl cursor-pointer hover:bg-stone-900 transition-colors text-xs uppercase tracking-wider"
              >
                Track Live Order 🚚
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-stone-100 text-stone-700 font-bold px-6 py-3 rounded-xl hover:bg-stone-200 cursor-pointer transition-colors text-xs"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-stone-900">
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2C1A11]">
              {singleItemCheckout ? 'Single Hamper Checkout' : 'Bulk Order Checkout'}
            </h1>
            {singleItemCheckout && (
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block mt-1">
                Direct item purchase mode active 🛍️
              </span>
            )}
          </div>
          <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
            Logged in: {currentUser.email}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-xs border border-stone-200">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#2C1A11] mb-4 pb-2 border-b border-stone-100">
                1. Delivery & Recipient Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border border-stone-200 bg-stone-50 rounded-xl p-2.5 text-xs font-semibold focus:outline-amber-600" placeholder="Rahul Sharma" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full border border-stone-200 bg-stone-50 rounded-xl p-2.5 text-xs font-semibold focus:outline-amber-600" placeholder="+91 9876543210" />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-stone-700 mb-1">Account Email (Verified)</label>
                <input type="email" name="email" readOnly disabled value={formData.email} className="w-full border border-stone-200 bg-stone-100 rounded-xl p-2.5 text-xs font-semibold text-stone-500 cursor-not-allowed" />
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-stone-700 mb-1">Complete Shipping Address</label>
                <textarea name="address" required rows="2" value={formData.address} onChange={handleChange} className="w-full border border-stone-200 bg-stone-50 rounded-xl p-2.5 text-xs font-semibold focus:outline-amber-600" placeholder="Building name, Street, Area"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full border border-stone-200 bg-stone-50 rounded-xl p-2.5 text-xs font-semibold focus:outline-amber-600" placeholder="Delhi / Mumbai" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Pincode</label>
                  <input type="text" name="pincode" required value={formData.pincode} onChange={handleChange} className="w-full border border-stone-200 bg-stone-50 rounded-xl p-2.5 text-xs font-semibold focus:outline-amber-600" placeholder="110001" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-xs border border-stone-200">
              <h2 className="text-sm font-black uppercase tracking-wider text-[#2C1A11] mb-4 pb-2 border-b border-stone-100">
                2. Select Payment Method
              </h2>

              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#2C1A11] bg-amber-50/20' : 'border-stone-200'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-amber-700" />
                    <div>
                      <span className="font-bold text-stone-900 text-xs block">Cash on Delivery (COD)</span>
                      <span className="text-[10px] text-stone-500">Pay cash upon bulk shipment delivery</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">Available</span>
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 bg-stone-50 opacity-60 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="online" disabled className="accent-stone-400" />
                    <div>
                      <span className="font-bold text-stone-700 text-xs block">Online Prepaid (UPI, Cards, Netbanking)</span>
                      <span className="text-[10px] text-stone-500">Instant digital checkout gateway</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full">Coming Soon</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xs border border-stone-200 h-fit space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#2C1A11] pb-2 border-b border-stone-100">
              Order Summary
            </h2>

            <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div key={item.id || item._id} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-800 line-clamp-1 max-w-[130px]">{item.name}</span>
                    <span className="text-stone-400">x{item.quantity}</span>
                  </div>
                  <span className="font-black text-stone-900">₹{(Number(item.price) || 0) * (Number(item.quantity) || 1)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-100 pt-3 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Total Bulk Quantity:</span>
                <span className="font-black text-stone-900">{totalQuantity} units</span>
              </div>
              <div className="flex justify-between">
                <span>Bulk Transit Shipping:</span>
                <span className="text-emerald-700 font-black">FREE (PAN-India)</span>
              </div>
            </div>

            <div className="border-t border-stone-100 pt-3 flex justify-between items-center">
              <span className="font-bold text-stone-900 text-xs">Final Total:</span>
              <span className="text-xl font-black text-rose-600">₹{totalAmount}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full bg-[#2C1A11] hover:bg-stone-900 text-amber-300 font-black py-4 rounded-2xl text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50 mt-4"
            >
              {isSubmitting ? 'Placing Order to MongoDB... ⏳' : 'Confirm & Place Bulk Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;