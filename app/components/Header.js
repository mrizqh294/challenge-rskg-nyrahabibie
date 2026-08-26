"use client";
import { useState, useEffect } from "react"; // Tambahkan useEffect
import { me } from "./../services/auth.services";

export default function Header({ sidebarOpen, setSidebarOpen }) {
    // 1. Ubah inisialisasi awal menjadi null
    const [user, setUser] = useState(null);

    // 2. Gunakan useEffect untuk memanggil API saat komponen pertama kali dimuat
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await me();
                setUser(data);
            } catch (error) {
                console.error("Gagal mengambil data user:", error);
            }
        };

        fetchUser();
    }, []); // Array kosong memastikan ini hanya berjalan 1x saat pertama kali render

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
        >
          ☰
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          {/* 3. Panggil nama properti spesifik dari objek user (contoh: name dan role) */}
          {/* Gunakan tanda '?' (Optional Chaining) agar tidak error jika data user belum selesai diload */}
          <p className="text-sm font-medium text-gray-800">{user?.name || "Loading..."}</p>
          <p className="text-xs text-gray-500">{user?.role || "..."}</p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {/* Opsional: Ambil huruf pertama dari nama user untuk avatar */}
          {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
        </div>
      </div>
    </header>
  );
}