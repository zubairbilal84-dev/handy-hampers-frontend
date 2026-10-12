import { useState, useEffect } from 'react';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Load Orders from MongoDB Backend API with Local Storage fallback
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://handy-hampers.onrender.com/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
          return;
        }
      }
    } catch (error) {
      console.error('Orders fetching error:', error);
    } finally {
      setLoading(false);
    }

    // Fallback: local storage se orders load karein
    const local = JSON.parse(localStorage.getItem('handyOrders')) || [];
    setOrders(local);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update Tracking Status or Location in MongoDB + LocalStorage Sync
  const updateTracking = async (orderId, newStatus, newLocation) => {
    const targetOrder = orders.find((o) => (o._id || o.id) === orderId);
    if (!targetOrder) return;

    const updatedData = {
      status: newStatus !== undefined ? newStatus : targetOrder.status,
      currentLocation:
        newLocation !== undefined
          ? newLocation
          : targetOrder.currentLocation || 'Main Warehouse, Delhi',
    };

    try {
      setUpdatingId(orderId);
      const res = await fetch(`https://handy-hampers.onrender.com/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            (order._id || order.id) === orderId
              ? { ...order, ...updatedData }
              : order
          )
        );
      } else {
        // Fallback update
        setOrders((prev) =>
          prev.map((order) =>
            (order._id || order.id) === orderId
              ? { ...order, ...updatedData }
              : order
          )
        );
      }
    } catch (error) {
      console.error('Update order error:', error);
      // Client-side fallback update
      setOrders((prev) =>
        prev.map((order) =>
          (order._id || order.id) === orderId
            ? { ...order, ...updatedData }
            : order
        )
      );
    } finally {
      // LocalStorage me bhi sync karein
      const saved = JSON.parse(localStorage.getItem('handyOrders')) || [];
      const updatedLocal = saved.map((o) =>
        (o._id || o.id) === orderId ? { ...o, ...updatedData } : o
      );
      localStorage.setItem('handyOrders', JSON.stringify(updatedLocal));
      window.dispatchEvent(new Event('storage'));
      setUpdatingId(null);
    }
  };

  // Delete Order from MongoDB + LocalStorage Sync
  const deleteOrder = async (orderId) => {
    if (window.confirm('Kya aap is order ko permanently delete karna chahte hain?')) {
      try {
        await fetch(`https://handy-hampers.onrender.com/api/orders/${orderId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Delete order error:', error);
      }

      setOrders((prev) => prev.filter((o) => (o._id || o.id) !== orderId));

      // Local storage se bhi delete karein
      const saved = JSON.parse(localStorage.getItem('handyOrders')) || [];
      const filteredLocal = saved.filter((o) => (o._id || o.id) !== orderId);
      localStorage.setItem('handyOrders', JSON.stringify(filteredLocal));
      window.dispatchEvent(new Event('storage'));

      alert('✅ Order successfully delete ho gaya!');
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-amber-200 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-emerald-950">
            📦 Bulk Orders & Live Tracking Admin
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Storefront ke real-time orders, Google User ID aur vehicle tracking status manage karein.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          🔄 Refresh Orders
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-amber-200 text-center text-amber-900 font-bold shadow-xs">
          <span className="text-3xl block mb-2 animate-bounce">⏳</span>
          MongoDB se orders load ho rahe hain...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-amber-200 text-center text-gray-500 font-semibold shadow-xs space-y-2">
          <span className="text-4xl block">📦</span>
          <p className="text-base text-emerald-950 font-bold">Abhi tak koi order nahi aaya hai.</p>
          <p className="text-xs text-stone-400">Jaise hi user checkout karega, order live yahan show ho jayega.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-amber-200 overflow-hidden">
          <div className="p-4 bg-amber-50/60 border-b border-amber-100 flex justify-between items-center px-6">
            <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
              Total Orders ({orders.length})
            </span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full">
              Live Database Connected 🍃
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-amber-100/50 text-emerald-950 text-[11px] uppercase font-extrabold border-b border-amber-200">
                  <th className="p-4 pl-6">Order ID & User Account ID</th>
                  <th className="p-4">Payment & Amount</th>
                  <th className="p-4">Tracking Status</th>
                  <th className="p-4">Current Location</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100/60 text-sm">
                {orders.map((o) => {
                  const orderId = String(o._id || o.id);
                  const status = o.status || 'Packed';
                  const currentLocation = o.currentLocation || 'Main Warehouse, Delhi';
                  const customerName = o.customer?.name || o.customerName || 'Guest User';
                  const customerEmail = o.customer?.email || 'No Email';
                  const customerPhone = o.customer?.phone || 'N/A';
                  const customerCity = o.customer?.city || o.city || 'N/A';
                  const customerAddress = o.customer?.address || 'N/A';
                  const totalPrice = o.totalPrice || o.total || 0;
                  const totalItems = o.totalItems || o.items?.length || 0;
                  const paymentMethod = o.paymentMethod || 'Cash on Delivery';
                  const isUpdating = updatingId === orderId;

                  return (
                    <tr key={orderId} className="hover:bg-amber-50/20 transition-colors">
                      {/* Customer & ID */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-emerald-950 text-xs">
                            #{orderId.slice(-6).toUpperCase()}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(orderId, orderId)}
                            className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded cursor-pointer"
                            title="Copy Full MongoDB ID"
                          >
                            {copiedId === orderId ? 'Copied ✓' : '📋'}
                          </button>
                        </div>

                        {/* User Google ID / Account Email */}
                        <div className="mt-1">
                          <span className="inline-block text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200/60">
                            ID: {customerEmail}
                          </span>
                        </div>

                        <div className="text-xs text-gray-900 font-bold mt-1">
                          {customerName}
                        </div>
                        <div className="text-[11px] text-gray-500 font-medium">
                          📞 {customerPhone} • 📍 {customerCity}
                        </div>
                        <div className="text-[10px] text-gray-400 truncate max-w-xs" title={customerAddress}>
                          {customerAddress}
                        </div>
                      </td>

                      {/* Payment & Items */}
                      <td className="p-4">
                        <div className="text-sm font-black text-amber-700">
                          ₹{totalPrice}
                        </div>
                        <div className="text-[11px] text-emerald-800 font-bold">
                          {paymentMethod}
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedOrderItems(o)}
                          className="text-[10px] font-bold text-amber-900 hover:text-amber-700 underline mt-0.5 cursor-pointer"
                        >
                          View {totalItems} Hamper Item(s) 🔍
                        </button>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-4">
                        <select
                          value={status}
                          disabled={isUpdating}
                          onChange={(e) => updateTracking(orderId, e.target.value, undefined)}
                          className={`border rounded-xl p-2 text-xs font-bold text-emerald-950 focus:outline-amber-500 cursor-pointer shadow-2xs ${
                            status === 'Delivered'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                              : status === 'Cancelled'
                              ? 'bg-red-50 border-red-300 text-red-900'
                              : 'bg-white border-amber-200'
                          }`}
                        >
                          <option value="Packed">📦 Packed</option>
                          <option value="Shipped">🚢 Shipped</option>
                          <option value="Out for Delivery">🚚 Out for Delivery</option>
                          <option value="Delivered">🎉 Delivered</option>
                          <option value="Cancelled">❌ Cancelled</option>
                        </select>
                      </td>

                      {/* Current Location Input */}
                      <td className="p-4">
                        <input
                          type="text"
                          defaultValue={currentLocation}
                          disabled={isUpdating}
                          onBlur={(e) => {
                            if (e.target.value !== currentLocation) {
                              updateTracking(orderId, undefined, e.target.value);
                            }
                          }}
                          placeholder="e.g. Near Moradabad Depot"
                          className="bg-white border border-amber-200 rounded-xl p-2 text-xs w-full focus:outline-amber-500 font-medium shadow-2xs"
                        />
                        <span className="text-[9px] text-gray-400 block mt-1">
                          Type karke bahar click karein to auto-save hoga
                        </span>
                      </td>

                      {/* Delete Action */}
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => deleteOrder(orderId)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer transition-all border border-red-200 active:scale-95"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ordered Items Preview Modal */}
      {selectedOrderItems && (
        <div className="fixed inset-0 bg-emerald-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-amber-200 overflow-hidden">
            <div className="bg-emerald-950 p-5 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-black tracking-widest block">
                  Order Items Breakdown
                </span>
                <h3 className="text-lg font-black">
                  #{String(selectedOrderItems._id || selectedOrderItems.id).slice(-6).toUpperCase()}
                </h3>
                <span className="text-[10px] text-stone-300 block">
                  Customer ID: {selectedOrderItems.customer?.email || 'N/A'}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderItems(null)}
                className="text-amber-400 hover:text-white text-2xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 max-h-80 overflow-y-auto space-y-3">
              {Array.isArray(selectedOrderItems.items) && selectedOrderItems.items.length > 0 ? (
                selectedOrderItems.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-2xl border border-amber-100 bg-amber-50/30 gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {(item.img || item.image) && (
                        <img
                          src={item.img || item.image}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-amber-200"
                        />
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-emerald-950 truncate max-w-[200px]">
                          {item.name || item.title || 'Hamper Item'}
                        </h4>
                        <span className="text-[11px] text-gray-500 font-semibold">
                          Qty: {item.quantity || 1} units
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-amber-800">
                      ₹{item.price * (item.quantity || 1)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-4">
                  Items data is not available for this order.
                </p>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-between items-center px-6">
              <span className="text-xs font-bold text-gray-600">Total Order Amount</span>
              <span className="text-base font-black text-rose-600">
                ₹{selectedOrderItems.totalPrice}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;