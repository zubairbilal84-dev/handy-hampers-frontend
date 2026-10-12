import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const linkClasses = ({ isActive }) =>
    `px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${
      isActive
        ? 'bg-amber-500 text-stone-900 shadow-sm'
        : 'text-stone-300 hover:bg-stone-800 hover:text-white'
    }`;

  return (
    <div className="flex min-h-screen bg-stone-100">
      {/* Left Sidebar */}
      <aside className="w-64 bg-stone-900 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <span className="text-2xl">🎁</span>
            <div>
              <h1 className="font-black text-white text-lg leading-none">Handy Admin</h1>
              <p className="text-[10px] text-amber-500 font-bold uppercase mt-1">Bulk Operations</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            <NavLink to="/admin" end className={linkClasses}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/categories" className={linkClasses}>
              Manage Categories
            </NavLink>
            <NavLink to="/admin/products" className={linkClasses}>
              Manage Products
            </NavLink>
            
            {/* 👈 Yeh Option Sidebar Me Add Ho Gaya Hai */}
            <NavLink to="/admin/banners" className={linkClasses}>
              🎨 Manage Banners
            </NavLink>

            <NavLink to="/admin/orders" className={linkClasses}>
              Orders & Tracking
            </NavLink>
            <NavLink to="/admin/reviews" className={linkClasses}>
              Reviews
            </NavLink>
            <NavLink to="/admin/blogs" className={linkClasses}>
              Blogs
            </NavLink>
            
          </nav>
         
        </div>
      </aside>

      {/* Main Page Body */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}