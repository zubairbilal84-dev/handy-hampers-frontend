import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DesktopHeader from '../components/desktop/DesktopHeader';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    setError('');

    if (!orderId.trim()) {
      setError('Kripya apna Order ID ya AWB Tracking number enter karein.');
      return;
    }

    setLoading(true);

    // Mock tracking status response (Isko backend API se replace kar sakte hain)
    setTimeout(() => {
      setLoading(false);
      setTrackingData({
        orderNumber: orderId.toUpperCase(),
        currentStatus: 'In Transit',
        estimatedDelivery: 'Oct 09, 2026',
        carrier: 'Blue Dart Express (Air Cargo)',
        awbNumber: 'BD89472910IN',
        origin: 'Handy Hampers Studio, Moradabad (244001)',
        destination: 'Customer Doorstep',
        timeline: [
          {
            title: 'Order Confirmed',
            desc: 'Your hamper order has been placed and confirmed.',
            date: 'Oct 05, 2026 - 11:20 AM',
            done: true,
          },
          {
            title: 'Handcrafted & Packed in Moradabad',
            desc: 'Customized in our Moradabad workshop with protective multi-layer packaging.',
            date: 'Oct 05, 2026 - 04:30 PM',
            done: true,
          },
          {
            title: 'Handed Over to Courier',
            desc: 'Dispatched via Blue Dart priority air transit.',
            date: 'Oct 06, 2026 - 10:15 AM',
            done: true,
          },
          {
            title: 'Out for Delivery',
            desc: 'Your package has arrived at the destination hub and will be out soon.',
            date: 'Pending',
            done: false,
          },
          {
            title: 'Delivered',
            desc: 'Package delivered safely to the recipient.',
            date: 'Pending',
            done: false,
          },
        ],
      });
    }, 800);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-10">
        {/* Title Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-amber-700 bg-amber-100/80 px-3.5 py-1.5 rounded-full border border-amber-200">
            Realtime Delivery Tracking
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-[#2C1A11] tracking-tight">
            Track Your <span className="text-amber-600">Hamper Package</span>
          </h1>
          <p className="text-xs md:text-sm text-stone-500 max-w-lg mx-auto leading-relaxed">
            Apna Handy Hampers Order ID ya AWB number enter karein aur live shipping status check karein.
          </p>
        </div>

        {/* Tracking Search Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-xs">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#2C1A11] uppercase tracking-wider mb-1.5">
                  Order ID / Tracking No. *
                </label>
                <input
                  type="text"
                  placeholder="e.g. HH-92814 ya BD89472910IN"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-[#FAF8F5] text-stone-800 text-xs md:text-sm px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-amber-500 font-medium transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#2C1A11] uppercase tracking-wider mb-1.5">
                  Phone / Email (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Registered mobile or email"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full bg-[#FAF8F5] text-stone-800 text-xs md:text-sm px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-amber-500 font-medium transition-colors"
                />
              </div>
            </div>

            {error && <p className="text-xs font-bold text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#2C1A11] via-stone-900 to-amber-950 hover:from-black hover:to-amber-900 text-amber-100 font-black text-xs md:text-sm py-3.5 rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Fetching Details...</span>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Track Consignment</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tracking Result Card */}
        {trackingData && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-xs space-y-6">
            {/* Top Shipment Overview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-100 gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                  Order: #{trackingData.orderNumber}
                </span>
                <h3 className="text-lg font-black text-[#2C1A11] mt-2 flex items-center gap-2">
                  Status: <span className="text-emerald-700">{trackingData.currentStatus}</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Courier: <strong>{trackingData.carrier}</strong> | AWB: <strong>{trackingData.awbNumber}</strong>
                </p>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 text-right sm:text-right">
                <span className="text-[11px] font-bold text-stone-500 block">Expected Doorstep Arrival</span>
                <span className="text-base font-black text-amber-800">{trackingData.estimatedDelivery}</span>
              </div>
            </div>

            {/* Shipment Route Tag */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/60 flex items-center justify-between text-xs text-stone-600 font-semibold">
              <div className="flex items-center gap-2">
                <span className="text-base">🏭</span>
                <span>{trackingData.origin}</span>
              </div>
              <span className="text-stone-400">➔</span>
              <div className="flex items-center gap-2">
                <span className="text-base">🏡</span>
                <span>{trackingData.destination}</span>
              </div>
            </div>

            {/* Vertical Progress Timeline */}
            <div className="pt-2 space-y-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-stone-400">
                Delivery Milestones
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                {trackingData.timeline.map((item, idx) => (
                  <div key={idx} className="relative group">
                    {/* Step Dot */}
                    <div
                      className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full border-2 ${
                        item.done
                          ? 'bg-emerald-600 border-white shadow-xs'
                          : 'bg-white border-stone-300'
                      }`}
                    />

                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <h5
                          className={`text-xs md:text-sm font-extrabold ${
                            item.done ? 'text-stone-900' : 'text-stone-400'
                          }`}
                        >
                          {item.title}
                        </h5>
                        <span className="text-[11px] font-bold text-stone-400">{item.date}</span>
                      </div>
                      <p className="text-[11px] md:text-xs text-stone-500 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customer Helpdesk Card */}
        <div className="bg-[#2C1A11] text-white rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm md:text-base font-black text-amber-300">
              Need assistance with your consignment?
            </h4>
            <p className="text-xs text-stone-300">
              Handy Hampers customer support team is available Mon–Sat (10 AM to 7 PM IST).
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            Contact Helpdesk
          </Link>
        </div>
      </main>
    </div>
  );
}