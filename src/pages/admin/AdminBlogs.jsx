import { useState, useEffect } from 'react';

function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    author: 'Admin',
    image: '',
    excerpt: '',
    content: '',
    tags: '',
    status: 'Published',
  });

  // Fetch Blogs from MongoDB Backend API
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://handy-hampers.onrender.com/api/blogs');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Upload Blog Cover Image to Cloudinary via Backend
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      setUploadingImg(true);
      const res = await fetch('https://handy-hampers.onrender.com/api/upload', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        const result = await res.json();
        setFormData((prev) => ({ ...prev, image: result.url }));
      } else {
        alert('❌ Image upload fail ho gaya!');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      alert('❌ Server error during upload!');
    } finally {
      setUploadingImg(false);
    }
  };

  // Submit Blog Post
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert('⚠️ Blog Title zaroori hai!');

    try {
      const endpoint = isEditing
        ? `https://handy-hampers.onrender.com/api/blogs/${isEditing}`
        : 'https://handy-hampers.onrender.com/api/blogs';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(isEditing ? '✅ Blog Article Update Ho Gaya!' : '✅ Naya Blog Save Ho Gaya!');
        setIsEditing(null);
        setFormData({
          title: '',
          slug: '',
          author: 'Admin',
          image: '',
          excerpt: '',
          content: '',
          tags: '',
          status: 'Published',
        });
        fetchBlogs();
      } else {
        alert('❌ Save karne me error aaya!');
      }
    } catch (error) {
      console.error('Save blog error:', error);
      alert('❌ Server connect nahi ho paya!');
    }
  };

  const handleEdit = (blog) => {
    const blogId = blog._id || blog.id;
    setIsEditing(blogId);
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      author: blog.author || 'Admin',
      image: blog.image || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || '',
      status: blog.status || 'Published',
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Kya aap is blog article ko delete karna chahte hain?')) {
      try {
        const res = await fetch(`https://handy-hampers.onrender.com/api/blogs/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          alert('✅ Blog Article Delete Ho Gaya!');
          setBlogs((prev) => prev.filter((b) => (b._id || b.id) !== id));
        } else {
          alert('❌ Delete karne me error aaya!');
        }
      } catch (error) {
        console.error('Delete blog error:', error);
      }
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-emerald-950 mb-1">Blog Articles</h1>
        <p className="text-sm text-gray-600">
          Gifting ideas, hamper guides aur SEO articles yahan se publish & manage karein
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-200 h-fit space-y-4">
          <h2 className="text-lg font-bold text-emerald-950 border-b pb-2">
            {isEditing ? '✏️ Edit Article' : '✍️ Write New Article'}
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Article Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Top 10 Diwali Corporate Gift Ideas"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-0]/g, '-'),
                  })
                }
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-amber-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-amber-500 font-bold"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-amber-100 file:text-emerald-950 file:font-bold cursor-pointer"
              />
              {uploadingImg && (
                <span className="text-[11px] text-amber-600 font-bold animate-pulse block mt-1">
                  Uploading Image...
                </span>
              )}
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Cover"
                  className="w-20 h-16 object-cover rounded-lg border mt-2"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Short Excerpt
              </label>
              <textarea
                rows="2"
                placeholder="Brief summary for list view..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Full Article Content
              </label>
              <textarea
                rows="5"
                placeholder="Write full blog text or HTML here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="diwali, corporate gifts, hampers"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-amber-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={uploadingImg}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-black py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                {isEditing ? 'Update Article' : 'Publish Article'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(null);
                    setFormData({
                      title: '',
                      slug: '',
                      author: 'Admin',
                      image: '',
                      excerpt: '',
                      content: '',
                      tags: '',
                      status: 'Published',
                    });
                  }}
                  className="px-4 bg-gray-200 text-gray-700 rounded-xl font-bold cursor-pointer text-xs"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Blogs Table Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-amber-200 overflow-hidden">
          <div className="p-4 bg-emerald-950 flex flex-col sm:flex-row justify-between items-center gap-3">
            <h3 className="text-white font-extrabold text-base">
              All Articles ({filteredBlogs.length})
            </h3>
            <input
              type="text"
              placeholder="🔍 Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-emerald-900 text-white placeholder-emerald-300 border border-emerald-800 rounded-lg px-3 py-1.5 text-xs w-full sm:w-64 outline-none focus:border-amber-400"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-amber-50 text-emerald-900 text-xs uppercase border-b border-amber-100">
                  <th className="p-4">Cover</th>
                  <th className="p-4">Title & Author</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-amber-800 font-bold">
                      ⏳ Server se blog articles load ho rahe hain...
                    </td>
                  </tr>
                ) : filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-gray-500">
                      Koi blog article nahi mila.
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((b) => {
                    const blogId = b._id || b.id;
                    return (
                      <tr key={blogId} className="hover:bg-amber-50/40 transition-colors">
                        <td className="p-4">
                          {b.image ? (
                            <img
                              src={b.image}
                              alt=""
                              className="w-12 h-12 object-cover rounded-xl border"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-xl border flex items-center justify-center text-[10px] text-gray-400">
                              No Cover
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-emerald-950">{b.title}</div>
                          <div className="text-xs text-gray-500">By {b.author || 'Admin'}</div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                              b.status === 'Published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {b.status || 'Published'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(b)}
                            className="bg-amber-500 text-emerald-950 font-bold px-3 py-1 rounded-lg text-xs hover:bg-amber-600 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(blogId)}
                            className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded-lg text-xs hover:bg-red-200 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminBlogs;