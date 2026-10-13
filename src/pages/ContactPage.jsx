import React from 'react';
import DesktopHeader from '../components/desktop/DesktopHeader';

export default function ContactPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      <div className="py-10 md:py-14 px-4 lg:px-10">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* HEADER */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-black text-[#2C1A11]">
              Get In <span className="text-amber-600">Touch</span>
            </h1>
            <p className="text-xs md:text-sm text-gray-600">
              Have questions about bulk orders or customized hampers? We’re here to help!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
            {/* CONTACT INFO */}
            <div className="space-y-6">
              <h2 className="text-xl font-black text-[#2C1A11]">Contact Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Address</p>
                    <p className="text-sm font-semibold text-gray-800">Handy Hampers Studio, Moradabad, Uttar Pradesh – 244001, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Email Us</p>
                    <p className="text-sm font-semibold text-gray-800">support@handyhampers.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Call / WhatsApp</p>
                    <p className="text-sm font-semibold text-gray-800">+91 9837874676</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTACT FORM */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Your Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-amber-500 bg-stone-50" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-amber-500 bg-stone-50" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Message</label>
                <textarea rows="4" placeholder="Tell us about your requirement..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-amber-500 bg-stone-50"></textarea>
              </div>

              <button className="w-full bg-[#1E2421] hover:bg-black text-white font-bold py-3 rounded-xl transition shadow-md cursor-pointer">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}