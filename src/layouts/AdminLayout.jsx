import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAdminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
    navigate('/admin');
  };

  // Agar admin login nahi hai toh Login Form dikhao
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Manage Categories', path: '/admin/categories' },
    { name: 'Manage Products', path: '/admin/products' },
    { name: '🖼️ Store Banners', path: '/admin/banners' },
    
    // Category Banner Managers
    { name: '🎁 Gift Banners', path: '/admin/gift-banners' },
    { name: '🪙 Metal Banners', path: '/admin/metal-banners' },
    { name: '🪔 Festival Banners', path: '/admin/festival-banners' },
    { name: '💍 Wedding Banners', path: '/admin/wedding-banners' },
    { name: '🎈 Occasions Banners', path: '/admin/occasions-banners' },
    { name: '💼 Corporate Banners', path: '/admin/corporate-banners' },

    { name: 'Orders & Tracking', path: '/admin/orders' },
    { name: '✍️ Blog Articles', path: '/admin/blogs' },
    { name: '⭐ Customer Reviews', path: '/admin/reviews' },
  ];

  return (
    <div className="min-h-screen bg-amber-50/20 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-emerald-950 text-white p-6 border-r border-amber-200/20 flex-shrink-0 flex flex-col justify-between">
        <div>
          <div className="mb-8 flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <div>
              <h2 className="font-extrabold text-amber-400 text-lg">Handy Admin</h2>
              <p className="text-[10px] text-emerald-300 uppercase font-semibold">Bulk Operations</p>
            </div>
          </div>

          <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-210px)] pr-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3.5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
                    isActive
                      ? 'bg-amber-500 text-emerald-950 shadow-md font-black'
                      : 'text-emerald-100 hover:bg-emerald-900 hover:text-amber-300'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="pt-4 border-t border-emerald-900 mt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs md:text-sm bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white transition-all cursor-pointer border border-red-500/30"
          >
            <span>🚪</span> Logout Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;