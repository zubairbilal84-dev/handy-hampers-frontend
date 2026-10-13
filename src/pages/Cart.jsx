import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopHeader from '../components/desktop/DesktopHeader';

function Cart() {
  const navigate = useNavigate();

  // Helper function to read logged in user
  const getUser = () => {
    try {
      const u = localStorage.getItem('handyUser');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  };

  const currentUser = getUser();
  const userKey = currentUser ? `handy_cart_${currentUser.email}` : 'handy_cart_guest';

  // Read data reliably without getting wiped on refresh
  const getStoredCart = () => {
    try {
      if (currentUser) {
        const uData = localStorage.getItem(userKey);
        if (uData && JSON.parse(uData).length > 0) return JSON.parse(uData);
      }
      const gData = localStorage.getItem('cart');
      if (gData && JSON.parse(gData).length > 0) return JSON.parse(gData);
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  const [cart, setCart] = useState(getStoredCart);

  // Sync to both user-key and global cart on every state modification
  const syncCart = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('cart', JSON.stringify(newCart));
      if (currentUser) {
        localStorage.setItem(userKey, JSON.stringify(newCart));
      }
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  };

  // Quantity Handler
  const updateQuantity = (id, delta) => {
    const updated = cart
      .map((item) => {
        const itemId = item.id || item._id;
        if (itemId === id) {
          const nextQty = (Number(item.quantity) || 1) + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    syncCart(updated);
  };

  // Remove Item
  const removeFromCart = (id) => {
    const updated = cart.filter((item) => (item.id || item._id) !== id);
    syncCart(updated);
  };

  // Calculations
  const totalQuantity = cart.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
  const totalAmount = cart.reduce(
    (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  // Individual Product Checkout (Unlocked at 50 units for this specific product)
  const handleSingleProductCheckout = (item) => {
    if (!currentUser) {
      alert('⚠️ Please sign in first to proceed with checkout!');
      navigate('/my-account');
      return;
    }
    const itemQty = Number(item.quantity) || 0;
    if (itemQty < 50) {
      alert(`⚠️ A minimum of 50 units is required to checkout this item. Currently in cart: ${itemQty} units.`);
      return;
    }
    navigate('/checkout', { state: { singleItemCheckout: true, checkoutItem: item } });
  };

  // Global Cart Proceed To Checkout (All items combined)
  const handleProceedToCheckout = () => {
    if (!currentUser) {
      alert('⚠️ Please sign in first to proceed with checkout!');
      navigate('/my-account');
      return;
    }
    if (totalQuantity < 50) {
      alert(`⚠️ Bulk Order Requirement: A minimum of 50 total units is required. Currently in cart: ${totalQuantity} units.`);
      return;
    }
    navigate('/checkout');
  };

  // Login Check Guard Screen
  if (!currentUser) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen">
        <div className="hidden md:block">
          <DesktopHeader />
        </div>
        <div className="max-w-md mx-auto px-6 py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl mx-auto flex items-center justify-center text-3xl">
            🔒
          </div>
          <h2 className="text-2xl font-black text-gray-900">Please Sign In First</h2>
          <p className="text-gray-600 text-xs">
            Your cart and selected hampers are securely linked to your account.
          </p>
          <button
            onClick={() => navigate('/my-account')}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
          >
            Sign In with Google 🔑
          </button>
        </div>
      </div>
    );
  }

  // Empty Screen
  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen">
        <div className="hidden md:block">
          <DesktopHeader />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl mx-auto flex items-center justify-center text-3xl">
            🛒
          </div>
          <h2 className="text-2xl font-black text-gray-800">Your Cart is Empty</h2>
          <p className="text-gray-500 text-xs">
            Hello {currentUser.name || 'Customer'}, you do not have any hampers added to your cart yet.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Explore Hampers 🎁
          </button>
        </div>
      </div>
    );
  }

  // Newest items first (reversed copy of array)
  const sortedCart = cart.slice().reverse();

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
            Account: {currentUser.email}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-200">
          {sortedCart.map((item) => {
            const itemId = item.id || item._id;
            const itemImg = item.image || item.img || item.mainImage;
            const itemQty = Number(item.quantity) || 1;
            const isItemCheckoutReady = itemQty >= 50;

            return (
              <div 
                key={itemId} 
                className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-100 py-4 gap-4 last:border-0"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img 
                    src={itemImg} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-xl bg-stone-50 border border-stone-200 shrink-0" 
                  />
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm leading-snug">{item.name}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">₹{item.price} / item</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between w-full sm:w-auto gap-3 sm:gap-5">
                  {/* Quantity selector */}
                  <div className="flex items-center border rounded-xl overflow-hidden border-gray-300">
                    <button 
                      type="button"
                      onClick={() => updateQuantity(itemId, -1)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold text-gray-800">{itemQty}</span>
                    <button 
                      type="button"
                      onClick={() => updateQuantity(itemId, 1)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal for this item */}
                  <span className="font-black text-gray-900 w-20 text-right text-sm">
                    ₹{item.price * itemQty}
                  </span>

                  {/* Individual Product Checkout Button */}
                  <button
                    type="button"
                    disabled={!isItemCheckoutReady}
                    onClick={() => handleSingleProductCheckout(item)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wide transition-all ${
                      isItemCheckoutReady
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs active:scale-95'
                        : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                    }`}
                    title={
                      isItemCheckoutReady 
                        ? 'Checkout this individual hamper' 
                        : `Minimum 50 units required (add ${50 - itemQty} more)`
                    }
                  >
                    {isItemCheckoutReady ? 'Checkout Item 🛍️' : `Checkout (${itemQty}/50)`}
                  </button>
                  
                  {/* Remove Item */}
                  <button 
                    type="button"
                    onClick={() => removeFromCart(itemId)}
                    className="text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          {totalQuantity < 50 && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-medium">
              ⚠️ <strong>Bulk Order Policy:</strong> A minimum order quantity of <strong>50 total items</strong> is required to proceed to checkout. You currently have <strong>{totalQuantity}</strong> items in your cart. Individual item checkout also requires a minimum of 50 units for that specific product.
            </div>
          )}

          {/* Full Cart Combined Checkout */}
          <div className="mt-6 border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-sm sm:text-base font-bold text-gray-700">Total Items: </span>
              <span className="text-base sm:text-lg font-black text-gray-900">{totalQuantity}</span>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <div>
                <span className="text-sm font-bold text-gray-700">Total Amount: </span>
                <span className="text-xl sm:text-2xl font-black text-rose-600">₹{totalAmount}</span>
              </div>

              <button 
                disabled={totalQuantity < 50}
                onClick={handleProceedToCheckout}
                className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                  totalQuantity >= 50 
                    ? 'bg-rose-500 hover:bg-rose-600 text-white cursor-pointer shadow-md active:scale-95' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Proceed to Checkout (All Items)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;