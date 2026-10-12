import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopHeader from '../components/desktop/DesktopHeader';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [truckStage, setTruckStage] = useState(0);
  const navigate = useNavigate();

  // Helper: Active user info
  const getCurrentUser = () => {
    try {
      const u = localStorage.getItem('handyUser');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();

  const fetchUserOrders = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const userEmail = currentUser.email?.toLowerCase().trim();
    let allOrders = [];

    // 1. Fetch from MongoDB
    try {
      setLoading(true);
      const res = await fetch('https://handy-hampers.onrender.com/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          allOrders = data;
        }
      }
    } catch (err) {
      console.error('API Error, checking local storage:', err);
    }

    // 2. Fallback to LocalStorage
    if (allOrders.length === 0) {
      const saved = JSON.parse(localStorage.getItem('handyOrders')) || [];
      allOrders = saved;
    }

    // 3. User Filter: Sirf wahi orders jo is user ID/Email ke hon
    const myFilteredOrders = allOrders.filter((ord) => {
      const orderEmail = ord.customer?.email?.toLowerCase().trim();
      return orderEmail === userEmail;
    });

    setOrders(myFilteredOrders);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const stages = ['Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const getStageIndex = (status) => {
    const idx = stages.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const handleOpenTracking = (order) => {
    setSelectedOrder(order);
    setTruckStage(0);
    setTimeout(() => {
      setTruckStage(getStageIndex(order.status || 'Packed'));
    }, 150);
  };

  // Login Guard
  if (!currentUser) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen">
        <div className="hidden md:block">
          <DesktopHeader />
        </div>
        <div className="max-w-md mx-auto px-6 py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl mx-auto flex items-center justify-center text-3xl">
            📦
          </div>
          <h2 className="text-2xl font-black text-stone-900">Please Sign In First</h2>
          <p className="text-stone-500 text-xs">
            Apne orders aur shipment tracking dekhne ke liye pehle Google se login karein.
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

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
        <div className="flex justify-between items-center mb-8 border-b border-stone-200 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#2C1A11]">My Orders</h1>
            <p className="text-stone-500 text-xs md:text-sm mt-1">
              Account: <span className="font-bold text-stone-800">{currentUser.email}</span>
            </p>
          </div>
          <button
            onClick={() => navigate('/all-hampers')}
            className="bg-[#2C1A11] hover:bg-stone-900 text-amber-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            + Order More Hampers
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-stone-500 font-bold">
            ⏳ Orders load ho rahe hain...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-stone-200/80 text-center shadow-xs space-y-3">
            <span className="text-5xl block">📦</span>
            <h3 className="text-lg font-black text-[#2C1A11]">Is Account Par Koi Order Nahi Hai</h3>
            <p className="text-xs text-stone-500">Jab aap is Google ID se checkout karenge, toh aapke live tracking orders yahan dikhenge.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderId = order._id || order.id;
              const status = order.status || 'Packed';
              const displayDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date || 'Recent';

              return (
                <div
                  key={orderId}
                  onClick={() => handleOpenTracking(order)}
                  className="bg-white p-5 md:p-6 rounded-2xl shadow-xs border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-base md:text-lg font-black text-[#2C1A11]">
                        #{typeof orderId === 'string' ? orderId.slice(-6).toUpperCase() : orderId}
                      </span>
                      <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full border border-amber-200">
                        {displayDate}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm font-medium text-stone-600 mt-1">
                      {order.totalItems} Hampers • Destination: <span className="font-bold text-stone-800">{order.customer?.city || 'N/A'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-stone-400 block uppercase font-bold">Total Amount</span>
                      <span className="text-base md:text-lg font-extrabold text-amber-700">₹{order.totalPrice}</span>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      🚚 {status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Live Truck Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white max-w-xl w-full rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
              
              <div className="bg-[#2C1A11] p-5 md:p-6 text-white flex justify-between items-center">
                <div>
                  <span className="text-xs text-amber-300 uppercase font-bold tracking-widest block">Live Route Tracker</span>
                  <h3 className="text-xl font-black">
                    #{typeof (selectedOrder._id || selectedOrder.id) === 'string' ? (selectedOrder._id || selectedOrder.id).slice(-6).toUpperCase() : selectedOrder.id}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-amber-300 hover:text-white text-2xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 relative overflow-hidden">
                  <div className="flex justify-between text-xs font-bold text-stone-600 mb-8 border-b border-stone-200 pb-2">
                    <span className={truckStage >= 0 ? "text-emerald-800 font-extrabold" : ""}>📦 Packed</span>
                    <span className={truckStage >= 1 ? "text-emerald-800 font-extrabold" : ""}>🚢 Shipped</span>
                    <span className={truckStage >= 2 ? "text-emerald-800 font-extrabold" : ""}>🚚 Out for Delivery</span>
                    <span className={truckStage >= 3 ? "text-emerald-800 font-extrabold" : ""}>🎉 Delivered</span>
                  </div>

                  <div className="relative w-full bg-stone-200 h-2.5 rounded-full my-5">
                    <div
                      className="bg-amber-600 h-2.5 rounded-full transition-all duration-[2400ms] ease-out"
                      style={{ width: `${(truckStage / 3) * 100}%` }}
                    ></div>

                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs transition-colors duration-500 ${
                          truckStage >= idx ? "bg-amber-600" : "bg-stone-300"
                        }`}
                        style={{ left: `calc(${(idx / 3) * 100}% - 7px)` }}
                      />
                    ))}

                    <div
                      className="absolute -top-6 transition-all duration-[2400ms] ease-out text-2xl z-10"
                      style={{ left: `calc(${(truckStage / 3) * 100}% - 16px)` }}
                    >
                      <span className="inline-block transform scale-x-[-1] select-none">
                        🚚
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center gap-3">
                    <span className="text-xl">📍</span>
                    <div>
                      <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wider block">Current Location</span>
                      <span className="text-sm font-black text-[#2C1A11]">
                        {selectedOrder.currentLocation || 'Main Warehouse, Delhi'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 space-y-1.5 text-xs text-stone-700">
                  <p><strong>Customer:</strong> {selectedOrder.customer?.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer?.email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customer?.phone}</p>
                  <p><strong>Delivery Address:</strong> {selectedOrder.customer?.address}, {selectedOrder.customer?.city} - {selectedOrder.customer?.pincode}</p>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full bg-[#2C1A11] text-amber-300 font-bold py-3 rounded-xl hover:bg-stone-900 transition-colors cursor-pointer text-xs uppercase tracking-wider"
                >
                  Close Tracking
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default MyOrders;