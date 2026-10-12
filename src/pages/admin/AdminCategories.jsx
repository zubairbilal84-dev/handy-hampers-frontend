import { useState, useEffect } from 'react';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Main',
    parent: 'None',
    status: 'Active'
  });

  // Load Categories from Backend API (Express + MongoDB)
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://handy-hampers.onrender.com/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        // Fallback Default Data if DB empty
        setCategories([
          { id: '1', _id: '1', name: 'Corporate Hampers', type: 'Main', parent: 'None', status: 'Active' },
          { id: '2', _id: '2', name: 'Festive Special', type: 'Main', parent: 'None', status: 'Active' },
          { id: '3', _id: '3', name: 'Diwali Combos', type: 'Sub-Category', parent: 'Festive Special', status: 'Active' },
          { id: '4', _id: '4', name: 'Executive Luxury Box', type: 'Sub-Category', parent: 'Corporate Hampers', status: 'Active' },
        ]);
      }
    } catch (error) {
      console.error('Categories fetching error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Save / Update Category (API Submit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return alert('⚠️ Category name zaroori hai!');

    try {
      const endpoint = isEditing
        ? `https://handy-hampers.onrender.com/api/categories/${isEditing}`
        : 'https://handy-hampers.onrender.com/api/categories';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(isEditing ? '✅ Category Update Ho Gayi!' : '✅ Nayi Category Save Ho Gayi!');
        setIsEditing(null);
        setFormData({ name: '', type: 'Main', parent: 'None', status: 'Active' });
        fetchCategories(); // Refresh List
      } else {
        alert('❌ Save Karne Me Error Aaya!');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('❌ Server Connect Nahi Ho Paya!');
    }
  };

  const handleEdit = (category) => {
    const catId = category._id || category.id;
    setIsEditing(catId);
    setFormData({
      name: category.name || '',
      type: category.type || 'Main',
      parent: category.parent || 'None',
      status: category.status || 'Active',
    });
  };

  // Delete Category
  const handleDelete = async (category) => {
    const catId = category._id || category.id;
    if (confirm('Kya aap is category ko delete karna chahte hain?')) {
      try {
        const res = await fetch(`https://handy-hampers.onrender.com/api/categories/${catId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          alert('✅ Category Delete Ho Gayi!');
          setCategories(categories.filter((c) => (c._id || c.id) !== catId));
        } else {
          alert('❌ Delete Karne Me Error Aaya!');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('❌ Server Connect Nahi Ho Paya!');
      }
    }
  };

  const mainCategories = categories.filter((c) => c.type === 'Main');

  const filteredCategories = categories.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.type?.toLowerCase().includes(search.toLowerCase()) ||
      c.parent?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-emerald-950">Category Management</h1>
        <p className="text-sm text-gray-600">Main Categories aur Sub-Categories yahan se control karein</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form: Add / Edit Category */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-200 h-fit">
          <h2 className="text-lg font-bold text-emerald-950 mb-4 border-b pb-2">
            {isEditing ? '✏️ Edit Category' : '➕ Add New Category'}
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Wedding Gift Sets"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value,
                    parent: e.target.value === 'Main' ? 'None' : formData.parent,
                  })
                }
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-amber-500 font-semibold"
              >
                <option value="Main">Main Category</option>
                <option value="Sub-Category">Sub Category</option>
              </select>
            </div>

            {formData.type === 'Sub-Category' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Select Parent Main Category
                </label>
                <select
                  value={formData.parent}
                  onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-amber-500"
                >
                  <option value="None">-- Select Parent Category --</option>
                  {mainCategories.map((c) => (
                    <option key={c._id || c.id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-amber-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-black py-3 rounded-xl transition-colors cursor-pointer"
              >
                {isEditing ? 'Update Category' : 'Save Category'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(null);
                    setFormData({ name: '', type: 'Main', parent: 'None', status: 'Active' });
                  }}
                  className="px-4 bg-gray-200 text-gray-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories Table View & Search */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-amber-200 overflow-hidden">
          <div className="p-4 bg-emerald-950 flex flex-col sm:flex-row justify-between items-center gap-3">
            <h3 className="text-white font-extrabold text-base">
              All Categories ({filteredCategories.length})
            </h3>
            <input
              type="text"
              placeholder="🔍 Search category or parent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-emerald-900 text-white placeholder-emerald-300 border border-emerald-800 rounded-lg px-3 py-1.5 text-xs w-full sm:w-64 outline-none focus:border-amber-400"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-amber-50 text-emerald-900 text-xs uppercase border-b border-amber-100">
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Parent Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-amber-800 font-bold">
                      ⏳ Server se categories load ho rahi hain...
                    </td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-500">
                      Koi Category Nahi Mili.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((c) => {
                    const catId = c._id || c.id;
                    return (
                      <tr key={catId} className="hover:bg-amber-50/40 transition-colors">
                        <td className="p-4 font-bold text-emerald-950">{c.name}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                              c.type === 'Main' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {c.type}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 font-medium text-xs">{c.parent}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                              c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(c)}
                            className="bg-amber-500 text-emerald-950 font-bold px-3 py-1 rounded-lg text-xs hover:bg-amber-600 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c)}
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

export default AdminCategories;