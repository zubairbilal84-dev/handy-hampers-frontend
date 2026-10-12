import React from 'react';
import { Link } from 'react-router-dom';
import DesktopHeader from '../components/desktop/DesktopHeader';

export default function RefundPolicy() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-10">
        {/* Page Header */}
        <section className="text-center space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-amber-700 bg-amber-100/80 px-3.5 py-1.5 rounded-full border border-amber-200">
            Trust & Transparency
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-[#2C1A11] tracking-tight">
            Cancellation & <span className="text-amber-600">Refund Policy</span>
          </h1>
          <p className="text-xs md:text-sm text-stone-500 max-w-xl mx-auto leading-relaxed">
            Handy Hampers ensures premium quality and zero-breakage packing from our Moradabad workshop. Here is how our returns, replacements, and refunds work.
          </p>
        </section>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200/80 shadow-xs space-y-8 text-stone-700 text-xs md:text-sm leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">📦</span>
              <h2 className="text-base md:text-lg font-black text-[#2C1A11]">
                1. Transit Damage & Replacement Policy
              </h2>
            </div>
            <p>
              Handy Hampers operates out of <strong>Moradabad, Uttar Pradesh (244001)</strong> with multi-layer protective packaging. However, if your hamper or metallic craft arrives damaged or broken during courier transit:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-stone-600">
              <li>Please inspect your package upon delivery.</li>
              <li>An <strong>unboxing video (from start to finish without cuts)</strong> along with clear photos of the damaged item must be shared with us within <strong>24 to 48 hours</strong> of delivery.</li>
              <li>Upon verification, our support team will initiate a <strong>free replacement</strong> or issue a refund immediately.</li>
            </ul>
          </section>

          <hr className="border-stone-100" />

          {/* Section 2 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">⏳</span>
              <h2 className="text-base md:text-lg font-black text-[#2C1A11]">
                2. Order Cancellation
              </h2>
            </div>
            <p>
              Standard non-customized orders can be canceled within <strong>4 hours</strong> of placement or before the consignment is dispatched from our fulfillment facility.
            </p>
            <p>
              Once dispatched or handed over to our shipping partners (Blue Dart, Delhivery, etc.), orders cannot be canceled.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 3 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">🎁</span>
              <h2 className="text-base md:text-lg font-black text-[#2C1A11]">
                3. Non-Returnable & Customized Items
              </h2>
            </div>
            <p>
              Due to hygiene and personalized craftsmanship, the following categories are strictly non-returnable unless received defective or damaged:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-stone-600">
              <li><strong>Perishable & Edible Goods:</strong> Gourmet sweets, chocolates, fresh bakery, and packaged edibles once unsealed.</li>
              <li><strong>Personalized & Custom Hampers:</strong> Products engraved with custom initials, branded corporate swag, or customized wedding trousseau boxes.</li>
              <li>Items damaged due to customer misuse or improper storage.</li>
            </ul>
          </section>

          <hr className="border-stone-100" />

          {/* Section 4 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">💳</span>
              <h2 className="text-base md:text-lg font-black text-[#2C1A11]">
                4. Refund Processing Timelines
              </h2>
            </div>
            <p>
              Once an eligible return or canceled order is approved:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-stone-600">
              <li><strong>Prepaid Orders (UPI / Cards / Net Banking):</strong> Refunds are credited back to the original source payment method within <strong>5–7 business days</strong>.</li>
              <li><strong>Cash on Delivery (COD) Orders:</strong> In case of an approved COD refund, payments will be transferred via NEFT/UPI to the bank account details shared by the customer.</li>
            </ul>
          </section>

          <hr className="border-stone-100" />

          {/* Section 5 */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">📍</span>
              <h2 className="text-base md:text-lg font-black text-[#2C1A11]">
                5. How to Initiate a Return or Claim
              </h2>
            </div>
            <p>
              To file a claim or request support, reach out to our customer resolution desk with your Order ID:
            </p>
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/70 space-y-1.5 text-xs">
              <p><strong>Studio Address:</strong> Handy Hampers, Moradabad, Uttar Pradesh – 244001</p>
              <p><strong>Support Email:</strong> support@handyhampers.com</p>
              <p><strong>Support Hours:</strong> Monday – Saturday (10:00 AM – 7:00 PM IST)</p>
            </div>
          </section>

        </div>

        {/* Bottom Support CTA */}
        <div className="bg-[#2C1A11] text-white rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm md:text-base font-black text-amber-300">
              Have questions regarding an ongoing return?
            </h4>
            <p className="text-xs text-stone-300">
              Our support executives in Moradabad are ready to help resolve your issue promptly.
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </main>
    </div>
  );
}