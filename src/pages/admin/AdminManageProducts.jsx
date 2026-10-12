import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AdminManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST');

  // Backend API se Products aur Categories Load Karein
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch Products from Express / MongoDB Backend API
        const prodRes = await fetch('https://handy-hampers.onrender.com/api/products');
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }

        // Fetch Categories from Backend API
        const catRes = await fetch('https://handy-hampers.onrender.com/api/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategoriesList(catData);
        }
      } catch (error) {
        console.error('Error fetching data from server:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Delete Handler (MongoDB API Call)
  const handleDelete = async (id) => {
    if (window.confirm('Kya aap is product ko delete karna chahte hain?')) {
      try {
        const res = await fetch(`https://handy-hampers.onrender.com/api/products/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          setProducts(products.filter((p) => p._id !== id && p.id !== id));
          alert('✅ Product MongoDB se successfully delete ho gaya!');
        } else {
          alert('❌ Delete karne me error aaya!');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('❌ Server se connection fail ho gaya!');
      }
    }
  };

  // Edit Handler
  const handleEdit = (id) => {
    navigate(`/admin/products/new?edit=${id}`);
  };

  // Filter & Sorting Logic
  const filteredAndSortedProducts = products
    .filter((p) => {
      // Search filter
      const matchesSearch =
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase());

      // Category dropdown filter
      const matchesCategory =
        selectedCategory === 'ALL' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sorting Newest / Oldest
      const dateA = new Date(a.createdAt || a.id || 0);
      const dateB = new Date(b.createdAt || b.id || 0);
      if (sortOrder === 'NEWEST') {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-amber-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-emerald-950">Manage Products</h1>
          <p className="text-sm text-gray-600">Aapke sabhi added Single aur Variable products ki list</p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-black px-5 py-3 rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
        >
          <span>➕</span> Add New Product
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-emerald-950 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
        
        {/* Search Input */}
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="🔍 Search product title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-emerald-900/80 text-white placeholder-emerald-300 border border-emerald-800 rounded-xl px-4 py-2 text-xs outline-none focus:border-amber-400 font-medium"
          />
        </div>

        {/* Dropdowns Container */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto">
          
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-emerald-900 text-amber-300 font-bold border border-emerald-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 cursor-pointer flex-1 sm:flex-none"
          >
            <option value="ALL">📁 All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat._id || cat.id || cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Newest / Oldest Dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-emerald-900 text-amber-300 font-bold border border-emerald-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 cursor-pointer flex-1 sm:flex-none"
          >
            <option value="NEWEST">⏳ Sort: Newest First</option>
            <option value="OLDEST">⌛ Sort: Oldest First</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
        <div className="p-3 bg-amber-50/50 border-b border-amber-100 flex justify-between items-center px-4">
          <span className="text-xs font-black text-emerald-950 uppercase">
            Product List ({filteredAndSortedProducts.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-amber-100/60 text-emerald-950 text-xs uppercase font-extrabold border-b border-amber-200">
                <th className="p-4">Image</th>
                <th className="p-4">Title & Category</th>
                <th className="p-4">Type</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-amber-800 font-bold">
                    ⏳ Server se products load ho rahe hain...
                  </td>
                </tr>
              ) : filteredAndSortedProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">
                    Koi product nahi mila! Filter change karein ya naya product add karein.
                  </td>
                </tr>
              ) : (
                filteredAndSortedProducts.map((p) => {
                  const productId = p._id || p.id;
                  const displayImage = p.isVariable
                    ? p.variants?.find((v) => v.images?.[0])?.images?.[0] || p.mainImage
                    : p.mainImage;

                  let priceDisplay = '';
                  if (p.isVariable && p.variants?.length > 0) {
                    const validPrices = p.variants.map((v) => Number(v.price)).filter(Boolean);
                    if (validPrices.length > 0) {
                      const minPrice = Math.min(...validPrices);
                      const maxPrice = Math.max(...validPrices);
                      priceDisplay = minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`;
                    } else {
                      priceDisplay = 'Variable';
                    }
                  } else {
                    priceDisplay = `₹${p.price || '0'}`;
                  }

                  return (
                    <tr key={productId} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden border border-amber-200">
                          {displayImage ? (
                            <img src={displayImage} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-bold">
                              No Image
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-extrabold text-emerald-950">{p.title}</div>
                        <div className="text-xs text-amber-700 font-semibold">{p.category || 'Uncategorized'}</div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-black ${
                          p.isVariable ? 'bg-purple-100 text-purple-900 border border-purple-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}>
                          {p.isVariable ? `Variable (${p.variants?.length || 0})` : 'Single'}
                        </span>
                      </td>

                      <td className="p-4 font-black text-amber-600">{priceDisplay}</td>

                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                          p.stockStatus === 'In Stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                        }`}>
                          {p.stockStatus || 'In Stock'}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/product/${productId}`}
                            target="_blank"
                            className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-lg text-xs hover:bg-emerald-200 transition-all"
                            title="View on Store"
                          >
                            👁️ View
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleEdit(productId)}
                            className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-lg text-xs hover:bg-amber-200 cursor-pointer transition-all border border-amber-300"
                            title="Edit Product"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(productId)}
                            className="bg-red-100 text-red-600 font-bold px-2.5 py-1 rounded-lg text-xs hover:bg-red-200 cursor-pointer transition-all border border-red-200"
                            title="Delete Product"
                          >
                            🗑️ Delete
                          </button>
                        </div>
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
  );
}

export default AdminManageProducts;