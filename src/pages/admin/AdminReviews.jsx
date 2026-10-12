import { useState, useEffect } from 'react';

const API_BASE = 'https://handy-hampers.onrender.com/api/reviews';

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  // Manual Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    productName: '',
    rating: 5,
    comment: '',
    status: 'Approved'
  });
  const [submitting, setSubmitting] = useState(false);

  // 1. Load Reviews from MongoDB Backend API
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      if (res.ok) {
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Reviews fetching error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 2. Toggle Status (Approve / Unpublish) in MongoDB
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Approved' ? 'Pending' : 'Approved';
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => ((r._id || r.id) === id ? { ...r, status: newStatus } : r))
        );
      } else {
        alert('❌ Status update error!');
      }
    } catch (error) {
      console.error('Update review error:', error);
    }
  };

  // 3. Delete Review from MongoDB
  const handleDelete = async (id) => {
    if (confirm('Kya aap is customer review ko delete karna chahte hain?')) {
      try {
        const res = await fetch(`${API_BASE}/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setReviews((prev) => prev.filter((r) => (r._id || r.id) !== id));
          alert('✅ Review delete ho gaya!');
        } else {
          alert('❌ Delete karne me error aaya!');
        }
      } catch (error) {
        console.error('Delete review error:', error);
      }
    }
  };

  // 4. Create New Review in MongoDB with ID support
  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!formData.userName.trim() || !formData.comment.trim()) {
      alert('Kripya name aur review comment bharein!');
      return;
    }

    const payload = {
      ...formData,
      userEmail: formData.userEmail.trim() || 'admin_manual@handyhampers.com',
      userId: formData.userEmail.trim() || 'admin_manual@handyhampers.com',
      date: new Date().toISOString().split('T')[0]
    };

    try {
      setSubmitting(true);
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedReview = await res.json();
        setReviews((prev) => [savedReview, ...prev]);
        setShowAddModal(false);
        setFormData({ userName: '', userEmail: '', productName: '', rating: 5, comment: '', status: 'Approved' });
        alert('✅ Review ID ke sath MongoDB me save ho gaya!');
      } else {
        alert('❌ Review save nahi ho paya!');
      }
    } catch (err) {
      console.error('Create review error:', err);
      alert('❌ Server error!');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / totalReviews).toFixed(1)
      : '5.0';

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === 'ALL') return true;
    return String(r.rating) === String(filterRating);
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-amber-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-emerald-950 mb-1">Customer Reviews</h1>
          <p className="text-sm text-gray-600">
            MongoDB Database se direct live connected reviews aur User ID tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            ➕ Add Manual Review
          </button>

          <div className="bg-amber-100 border border-amber-300 px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <div>
              <div className="text-base font-black text-emerald-950">{avgRating} / 5.0</div>
              <div className="text-[10px] font-bold text-amber-800">
                {totalReviews} Total Reviews
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-emerald-950 p-4 rounded-2xl flex justify-between items-center">
        <span className="text-white text-xs font-bold uppercase">
          Filter By Rating
        </span>
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="bg-emerald-900 text-amber-300 font-bold border border-emerald-800 rounded-xl px-3 py-1.5 text-xs outline-none cursor-pointer"
        >
          <option value="ALL">⭐ All Ratings</option>
          <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
          <option value="4">⭐⭐⭐⭐ 4 Stars</option>
          <option value="3">⭐⭐⭐ 3 Stars</option>
          <option value="2">⭐⭐ 2 Stars</option>
          <option value="1">⭐ 1 Star</option>
        </select>
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-amber-200 text-center text-amber-800 font-bold">
          ⏳ MongoDB se reviews load ho rahe hain...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-amber-200 text-center text-gray-500 font-medium">
          Database me koi review nahi mila.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((r) => {
            const reviewId = String(r._id || r.id);
            const userIdentifier = r.userEmail || r.userId || 'Guest User';
            const isApproved = r.status === 'Approved';

            return (
              <div
                key={reviewId}
                className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-emerald-950 text-sm">
                          {r.userName || 'Verified Buyer'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(reviewId, reviewId)}
                          className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-600 px-1.5 py-0.5 rounded cursor-pointer"
                          title="Copy Full MongoDB Review ID"
                        >
                          {copiedId === reviewId ? 'Copied ✓' : '📋'}
                        </button>
                      </div>

                      {/* User Google ID / Account Email */}
                      <span className="inline-block text-[10px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200/60 mt-1">
                        User ID: {userIdentifier}
                      </span>

                      <p className="text-[11px] text-amber-700 font-semibold mt-1">
                        Product: {r.productName || 'Handcrafted Hamper'}
                      </p>
                    </div>

                    <div className="flex items-center text-amber-500 text-sm shrink-0">
                      {'★'.repeat(Number(r.rating || 5))}
                      {'☆'.repeat(5 - Number(r.rating || 5))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 mt-3 font-medium bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                    "{r.comment || r.reviewText}"
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-amber-100 pt-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.status || 'Approved'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">{r.date || ''}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(reviewId, r.status || 'Approved')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        isApproved
                          ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                          : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                      }`}
                    >
                      {isApproved ? 'Unpublish' : 'Approve'}
                    </button>

                    <button
                      onClick={() => handleDelete(reviewId)}
                      className="bg-red-100 text-red-600 font-bold px-2.5 py-1 rounded-lg text-xs hover:bg-red-200 cursor-pointer border border-red-200"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-amber-200">
            <div className="flex justify-between items-center border-b border-amber-100 pb-3">
              <h3 className="text-base font-black text-emerald-950">Add Review to MongoDB</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Customer Email / User ID</label>
                <input
                  type="email"
                  placeholder="e.g. ramesh@gmail.com"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Brass Urli Hamper"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none font-bold text-amber-600 bg-white"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                  <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                  <option value={3}>⭐⭐⭐ 3 Stars</option>
                  <option value={2}>⭐⭐ 2 Stars</option>
                  <option value={1}>⭐ 1 Star</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Comment *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Customer ka feedback likhein..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReviews;