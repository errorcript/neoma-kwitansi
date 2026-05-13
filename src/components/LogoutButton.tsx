"use client";

import { LogOut } from "lucide-react";

export const LogoutButton = () => {
  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      id="tour-logout"
      className="w-full bg-rose-50 text-rose-600 p-8 rounded-[3rem] flex items-center justify-center gap-4 hover:bg-rose-600 hover:text-white transition-all shadow-xl shadow-rose-100 group border-2 border-rose-100/50"
    >
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
        <LogOut className="w-8 h-8 text-rose-600" />
      </div>
      <div className="text-left">
        <p className="font-black text-2xl leading-none uppercase tracking-tighter">Keluar Sistem</p>
        <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">Selesaikan Sesi Admin Anda</p>
      </div>
    </button>
  );
};
