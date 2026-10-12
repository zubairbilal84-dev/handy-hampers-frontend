import { Link, Outlet, useLocation } from 'react-router-dom';

function AdminLayout() {
  const location = useLocation();

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
      <aside className="w-full md:w-64 bg-emerald-950 text-white p-6 border-r border-amber-200/20 flex-shrink-0">
        <div className="mb-8 flex items-center gap-2">
          <span className="text-2xl">🎁</span>
          <div>
            <h2 className="font-extrabold text-amber-400 text-lg">Handy Admin</h2>
            <p className="text-[10px] text-emerald-300 uppercase font-semibold">Bulk Operations</p>
          </div>
        </div>

        <nav className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
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
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;