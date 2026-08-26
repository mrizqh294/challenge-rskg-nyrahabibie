"use client";

import { logout } from "./../services/auth.services";

export default function Sidebar({ activeMenu, setActiveMenu, sidebarOpen, setSidebarOpen, menuItems }) {
  const handleLogout = async() => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
    if (!confirmLogout) return;
    try {
        await logout();
    } catch (error) {
        console.error(error);
        alert("Gagal logout");
    }

    window.location.href = "/";
  };

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);

    // Tutup sidebar ketika layar mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-slate-900 text-white transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* LOGO */}
      <div className="flex h-16 shrink-0 items-center border-b border-slate-700 px-6">
        <div>
          <h1 className="text-xl font-bold">SIMRS</h1>
          <p className="text-xs text-slate-400">Sistem Informasi Rumah Sakit</p>
        </div>
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-slate-500">
          Menu Utama
        </p>

        <nav className="space-y-1">
          {menuItems.map((menu) => (
            <button
              key={menu.id}
              onClick={() => handleMenuClick(menu.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                activeMenu === menu.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{menu.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* USER + LOGOUT */}
      <div className="shrink-0 border-t border-slate-700 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <span className="flex w-5 justify-center text-lg">↪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}