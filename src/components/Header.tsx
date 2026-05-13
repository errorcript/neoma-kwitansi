"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, BarChart3, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export const Header = () => {
  const pathname = usePathname();

  // Hide header on login or verify pages
  if (pathname === '/login' || pathname.startsWith('/verify')) {
    return null;
  }

  const menuItems = [
    { name: "Input", path: "/", icon: FileText },
    { name: "Rekapitulasi", path: "/rekap", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  return (
    <header className="no-print bg-brand-secondary text-white sticky top-0 z-50 shadow-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-brand-primary/20">
            <img src="/logo-paguyuban.png" alt="Logo" className="w-7 h-7 object-contain" />
          </div>
          <span className="font-black tracking-tighter text-xl uppercase italic group-hover:text-brand-primary transition-colors">NEOMA KWITANSI</span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1 sm:gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  id={item.name === "Rekapitulasi" ? "tour-nav-rekap" : undefined}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    pathname === item.path 
                      ? "bg-brand-primary text-brand-secondary shadow-lg shadow-brand-primary/30" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="w-px h-8 bg-white/10 mx-4 hidden sm:block" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
