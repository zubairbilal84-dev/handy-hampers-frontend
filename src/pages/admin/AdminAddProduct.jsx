import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// 6 Signature Style Recommended Tags (One for each style file)
const RECOMMENDED_STYLE_TAGS = [
  { label: '📦 Closed Boxes', value: 'closed' },
  { label: '👜 Bags Style', value: 'bags' },
  { label: '👒 Hat Style', value: 'hat' },
  { label: '🛶 Boat Style', value: 'boat' },
  { label: '🪢 Jhula Style', value: 'jhula' },
  { label: '💍 Ring Style', value: 'ring' },
];

function AdminAddProduct() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // Categories & Basic States
  const [availableCategories, setAvailableCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [stockStatus, setStockStatus] = useState('In Stock');

  // Tags State
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // Single / Variable Switch
  const [isVariable, setIsVariable] = useState(false);

  // Main Cover Image
  const [mainImage, setMainImage] = useState('');

  // Single Product extra pricing/gallery
  const [mrp, setMrp] = useState('');
  const [price, setPrice] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);

  // Variable Variant Form State
  const [variants, setVariants] = useState([]);
  const [editingVariantId, setEditingVariantId] = useState(null);

  // Form fields for adding/editing single variant
  const [varColor, setVarColor] = useState('');
  const [varSize, setVarSize] = useState('');
  const [varMrp, setVarMrp] = useState('');
  const [varPrice, setVarPrice] = useState('');
  const [varStock, setVarStock] = useState('In Stock');
  const [varImages, setVarImages] = useState([]);

  // Fetch Categories & Product Data from Express/MongoDB Server
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Categories
        const catRes = await fetch('https://handy-hampers.onrender.com/api/categories');
        if (catRes.ok) {
          const catData = await catRes.json();
          setAvailableCategories(catData);
        } else {
          setAvailableCategories([
            { id: 1, name: 'Hampers', parent: null },
            { id: 2, name: 'Diwali Hampers', parent: 'Hampers' },
            { id: 3, name: 'Corporate Gifts', parent: null },
            { id: 4, name: 'Office Sets', parent: 'Corporate Gifts' },
          ]);
        }

        // 2. Fetch Product Data for Edit Mode
        if (editId) {
          const prodRes = await fetch(`https://handy-hampers.onrender.com/api/products/${editId}`);
          if (prodRes.ok) {
            const found = await prodRes.json();
            setTitle(found.title || '');
            setSelectedCategories(
              Array.isArray(found.categories) 
                ? found.categories 
                : found.category ? [found.category] : []
            );
            setShortDesc(found.shortDesc || '');
            setLongDesc(found.longDesc || '');
            setStockStatus(found.stockStatus || 'In Stock');
            setTags(found.tags || []);
            setIsVariable(!!found.isVariable);
            setMainImage(found.mainImage || '');
            setMrp(found.mrp || '');
            setPrice(found.price || '');
            setGalleryImages(found.galleryImages || []);
            if (found.isVariable) {
              setVariants(found.variants || []);
            }
          }
        }
      } catch (err) {
        console.error('Data Loading Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [editId]);

  // Direct Backend API Upload Helper
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('https://handy-hampers.onrender.com/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Cloudinary Upload Failed');
    const data = await res.json();
    return data.url;
  };

  // Category Checkbox Toggle Logic
  const handleCategoryToggle = (catName) => {
    let updatedCats = [...selectedCategories];

    if (updatedCats.includes(catName)) {
      const subCats = availableCategories.filter((c) => c.parent === catName).map((c) => c.name);
      updatedCats = updatedCats.filter((c) => c !== catName && !subCats.includes(c));
    } else {
      updatedCats.push(catName);
      const subCats = availableCategories.filter((c) => c.parent === catName).map((c) => c.name);
      subCats.forEach((sub) => {
        if (!updatedCats.includes(sub)) updatedCats.push(sub);
      });
    }

    setSelectedCategories(updatedCats);
  };

  // Tag Handlers
  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/^#/, '');
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Recommended Tag Toggle
  const toggleRecommendedTag = (tagVal) => {
    if (tags.includes(tagVal)) {
      setTags(tags.filter((t) => t !== tagVal));
    } else {
      setTags([...tags, tagVal]);
    }
  };

  // Image Upload Handlers
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setUploadingImg(true);
        const url = await uploadImageToCloudinary(file);
        setMainImage(url);
      } catch (err) {
        alert('Cover Image Upload Error!');
      } finally {
        setUploadingImg(false);
      }
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    try {
      setUploadingImg(true);
      const uploadedUrls = await Promise.all(files.map((file) => uploadImageToCloudinary(file)));
      setGalleryImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      alert('Gallery Upload Failed!');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleVariantImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    try {
      setUploadingImg(true);
      const uploadedUrls = await Promise.all(files.map((file) => uploadImageToCloudinary(file)));
      setVarImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      alert('Variant Images Upload Failed!');
    } finally {
      setUploadingImg(false);
    }
  };

  // Add or Update Variant Logic
  const handleAddOrUpdateVariant = () => {
    if (!varColor && !varSize) {
      return alert('⚠️ Kam se kam Color ya Size bharna zaroori hai!');
    }
    if (!varPrice) {
      return alert('⚠️ Variant Selling Price bharna zaroori hai!');
    }

    if (editingVariantId) {
      setVariants(
        variants.map((v) =>
          v.id === editingVariantId
            ? {
                ...v,
                color: varColor,
                size: varSize,
                mrp: varMrp,
                price: varPrice,
                stock: varStock,
                images: varImages,
              }
            : v
        )
      );
      setEditingVariantId(null);
    } else {
      const newVar = {
        id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        color: varColor,
        size: varSize,
        mrp: varMrp,
        price: varPrice,
        stock: varStock,
        images: varImages,
      };
      setVariants([...variants, newVar]);
    }

    setVarColor('');
    setVarSize('');
    setVarMrp('');
    setVarPrice('');
    setVarStock('In Stock');
    setVarImages([]);
  };

  const handleEditVariant = (v) => {
    setEditingVariantId(v.id);
    setVarColor(v.color || '');
    setVarSize(v.size || '');
    setVarMrp(v.mrp || '');
    setVarPrice(v.price || '');
    setVarStock(v.stock || 'In Stock');
    setVarImages(v.images || []);
  };

  const handleDeleteVariant = (id) => {
    if (window.confirm('Kya aap is variant ko delete karna chahte hain?')) {
      setVariants(variants.filter((v) => v.id !== id));
      if (editingVariantId === id) {
        setEditingVariantId(null);
        setVarColor('');
        setVarSize('');
        setVarMrp('');
        setVarPrice('');
        setVarImages([]);
      }
    }
  };

  // MongoDB Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return alert('⚠️ Product title zaroori hai!');
    if (!mainImage) return alert('⚠️ Main Cover Image zaroori hai!');

    if (isVariable && variants.length === 0) {
      return alert('⚠️ Variable Product ke liye at least 1 Variant add karein!');
    }

    const extractedColors = [...new Set(variants.map((v) => v.color).filter(Boolean))];
    const extractedSizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];

    const payload = {
      title,
      category: selectedCategories.length > 0 ? selectedCategories[0] : 'Uncategorized',
      categories: selectedCategories,
      shortDesc,
      longDesc,
      stockStatus,
      tags: tags.map(t => t.toLowerCase().trim()),
      isVariable,
      mainImage,
      mrp: isVariable ? null : Number(mrp) || null,
      price: isVariable ? null : Number(price) || null,
      galleryImages: isVariable ? [] : galleryImages,
      colors: isVariable ? extractedColors : [],
      sizes: isVariable ? extractedSizes : [],
      variants: isVariable ? variants : [],
    };

    try {
      setLoading(true);
      const endpoint = editId
        ? `https://handy-hampers.onrender.com/api/products/${editId}`
        : 'https://handy-hampers.onrender.com/api/products';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(editId ? '✅ Product MongoDB me Update Ho Gaya!' : '✅ Product Successfully MongoDB me Save Ho Gaya!');
        navigate('/admin/products');
      } else {
        alert('❌ Product Save Karne Me Error Aaya!');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Server Connect Nahi Ho Paya!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-amber-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-emerald-950">
            {editId ? '✏️ Edit Product' : '➕ Add New Product'}
          </h1>
          <p className="text-xs text-gray-600">Product details, tags, categories aur variants manage karein</p>
        </div>
        <button
          type="submit"
          disabled={loading || uploadingImg}
          className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-black px-6 py-3 rounded-xl text-sm shadow-md cursor-pointer transition-all disabled:opacity-50"
        >
          {loading ? 'Saving...' : editId ? 'Update Product' : 'Save Product'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Form Content */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-amber-200 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-emerald-950 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Royal Diwali Gift Box"
                className="w-full bg-amber-50/40 border border-amber-200 rounded-xl p-3 text-sm font-semibold outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-emerald-950 mb-1">
                Short Description
              </label>
              <textarea
                rows="2"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Bullet points / Brief highlights..."
                className="w-full bg-amber-50/40 border border-amber-200 rounded-xl p-3 text-xs outline-none focus:border-amber-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-emerald-950 mb-1">
                Full Long Description
              </label>
              <textarea
                rows="4"
                value={longDesc}
                onChange={(e) => setLongDesc(e.target.value)}
                placeholder="Detailed information..."
                className="w-full bg-amber-50/40 border border-amber-200 rounded-xl p-3 text-xs outline-none focus:border-amber-500"
              ></textarea>
            </div>
          </div>

          {/* Main Cover Image */}
          <div className="bg-white p-6 rounded-2xl border border-amber-200 space-y-3">
            <h3 className="font-extrabold text-emerald-950 text-sm">
              🖼️ Main Cover Image (Storefront Image)
            </h3>
            <p className="text-[11px] text-gray-500">
              Ye image main catalog aur product card cover par dikhegi.
            </p>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-amber-100 file:text-emerald-950 file:font-bold hover:file:bg-amber-200 cursor-pointer"
              />
              {uploadingImg && <span className="text-xs text-amber-600 font-bold animate-pulse">Uploading Image...</span>}
              {mainImage && (
                <img
                  src={mainImage}
                  alt="Main Cover"
                  className="w-16 h-16 object-cover rounded-xl border-2 border-amber-400"
                />
              )}
            </div>
          </div>

          {/* Product Type Switcher */}
          <div className="bg-emerald-950 p-4 rounded-2xl flex justify-between items-center text-white">
            <div>
              <span className="font-black text-sm block">Variable Product?</span>
              <span className="text-[10px] text-amber-300">
                Colors, Sizes ya Packs ke alag price & images wale variants ke liye
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isVariable}
                onChange={(e) => setIsVariable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-emerald-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-amber-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Single Product Pricing & Gallery */}
          {!isVariable && (
            <div className="bg-white p-6 rounded-2xl border border-amber-200 space-y-4">
              <h3 className="font-extrabold text-emerald-950 text-sm">Single Product Pricing & Gallery</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full border border-amber-200 rounded-xl p-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full border border-amber-200 rounded-xl p-2.5 text-xs font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Gallery Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="text-xs text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-amber-100 file:text-emerald-950 file:font-bold cursor-pointer"
                />
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {galleryImages.map((img, idx) => (
                    <img key={idx} src={img} alt="" className="w-12 h-12 object-cover rounded-lg border" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Variable Product Section */}
          {isVariable && (
            <div className="bg-white p-6 rounded-2xl border border-amber-200 space-y-6">
              <div className="border-b pb-3 flex justify-between items-center">
                <h3 className="font-black text-emerald-950 text-sm">
                  ⚡ Add Variable Options
                </h3>
                {editingVariantId && (
                  <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md">
                    ✏️ Editing Variant
                  </span>
                )}
              </div>

              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-extrabold text-emerald-950 block mb-1">Color Name</label>
                    <input
                      type="text"
                      value={varColor}
                      onChange={(e) => setVarColor(e.target.value)}
                      placeholder="e.g. Red / Gold"
                      className="w-full bg-white border border-amber-200 rounded-xl p-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-emerald-950 block mb-1">Size / Pack</label>
                    <input
                      type="text"
                      value={varSize}
                      onChange={(e) => setVarSize(e.target.value)}
                      placeholder="e.g. Pack of 2"
                      className="w-full bg-white border border-amber-200 rounded-xl p-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-emerald-950 block mb-1">MRP (₹)</label>
                    <input
                      type="number"
                      value={varMrp}
                      onChange={(e) => setVarMrp(e.target.value)}
                      placeholder="e.g. 999"
                      className="w-full bg-white border border-amber-200 rounded-xl p-2 text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-emerald-950 block mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      value={varPrice}
                      onChange={(e) => setVarPrice(e.target.value)}
                      placeholder="e.g. 799"
                      className="w-full bg-white border border-amber-200 rounded-xl p-2 text-xs font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-emerald-950 block mb-1">Stock Status</label>
                    <select
                      value={varStock}
                      onChange={(e) => setVarStock(e.target.value)}
                      className="w-full bg-white border border-amber-200 rounded-xl p-2 text-xs font-semibold outline-none"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-emerald-950 block mb-1">
                    Variant Images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleVariantImagesUpload}
                    className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-amber-200 file:text-emerald-950 file:font-bold cursor-pointer"
                  />
                  {varImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {varImages.map((img, idx) => (
                        <div key={idx} className="relative">
                          <img src={img} alt="" className="w-12 h-12 object-cover rounded-lg border" />
                          <button
                            type="button"
                            onClick={() => setVarImages(varImages.filter((_, i) => i !== idx))}
                            className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAddOrUpdateVariant}
                  className="w-full bg-emerald-950 text-amber-400 font-extrabold py-2.5 rounded-xl text-xs shadow hover:bg-emerald-900 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {editingVariantId ? '✏️ Save / Update Variant' : '➕ Add Variant'}
                </button>
              </div>

              {/* Added Variants Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-emerald-950">
                  Added Variants ({variants.length})
                </h4>

                {variants.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Abhi koi variant add nahi kiya hai.</p>
                ) : (
                  <div className="space-y-2">
                    {variants.map((v) => (
                      <div
                        key={v.id}
                        className="bg-white border border-amber-200 p-3 rounded-xl flex items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          {v.images?.[0] ? (
                            <img src={v.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg border" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-[9px] text-gray-400">
                              No Img
                            </div>
                          )}
                          <div>
                            <div className="font-extrabold text-xs text-emerald-950">
                              {v.color || 'No Color'} {v.size ? `/ ${v.size}` : ''}
                            </div>
                            <div className="text-[11px] text-amber-700 font-bold">
                              ₹{v.price}{' '}
                              {v.mrp && <span className="line-through text-gray-400 text-[10px]">₹{v.mrp}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            v.stock === 'In Stock' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                          }`}>
                            {v.stock}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleEditVariant(v)}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer border border-amber-300"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteVariant(v.id)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 font-bold px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer border border-red-200"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-amber-200 space-y-3">
            <h3 className="font-extrabold text-emerald-950 text-xs uppercase tracking-wider">
              📁 Select Categories
            </h3>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1 border-t pt-3">
              {availableCategories.map((cat) => {
                const isParent = !cat.parent;
                const isChecked = selectedCategories.includes(cat.name);

                return (
                  <label
                    key={cat.id || cat.name}
                    className={`flex items-center gap-2 text-xs font-semibold cursor-pointer p-1.5 rounded-lg hover:bg-amber-50 ${
                      isParent ? 'font-extrabold text-emerald-950' : 'ml-4 text-gray-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategoryToggle(cat.name)}
                      className="rounded text-amber-500 focus:ring-amber-400 h-4 w-4 accent-amber-500 cursor-pointer"
                    />
                    <span>{cat.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 🏷️ Product Tags + 6 Recommended Clickable Tags */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200 space-y-3">
            <h3 className="font-extrabold text-emerald-950 text-xs uppercase tracking-wider">
              🏷️ Product Tags
            </h3>
            
            {/* 🌟 6 Recommended Style Tags Section */}
            <div className="space-y-1.5 bg-amber-50/60 p-3 rounded-xl border border-amber-200/80">
              <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block">
                ✨ Recommended Style Tags (Click to select)
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {RECOMMENDED_STYLE_TAGS.map((st) => {
                  const isSelected = tags.includes(st.value);
                  return (
                    <button
                      key={st.value}
                      type="button"
                      onClick={() => toggleRecommendedTag(st.value)}
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border transition-all cursor-pointer active:scale-95 flex items-center gap-1 ${
                        isSelected
                          ? 'bg-emerald-950 text-amber-300 border-emerald-950 shadow-xs'
                          : 'bg-white text-stone-700 border-amber-300 hover:border-amber-500'
                      }`}
                    >
                      <span>{st.label}</span>
                      <span>{isSelected ? '✓' : '+'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-[10px] text-gray-500">
              Custom tag type karke <kbd className="bg-gray-100 px-1 rounded">Enter</kbd> ya comma (,) dabayein.
            </p>

            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="e.g. diwali, corporate, luxury"
              className="w-full bg-amber-50/40 border border-amber-200 rounded-xl p-2.5 text-xs outline-none focus:border-amber-500"
            />

            {/* Selected Tags Display */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="bg-emerald-950 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="hover:text-red-400 font-black text-xs ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 space-y-2">
            <label className="block text-xs font-extrabold uppercase text-emerald-950">
              Overall Stock Status
            </label>
            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="w-full bg-amber-50/40 border border-amber-200 rounded-xl p-2.5 text-xs font-bold outline-none cursor-pointer"
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

      </div>
    </form>
  );
}

export default AdminAddProduct;