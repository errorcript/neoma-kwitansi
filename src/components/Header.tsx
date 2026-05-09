"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, BarChart3, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export const Header = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Input", path: "/", icon: FileText },
    { name: "Rekap", path: "/rekap", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <header className="no-print bg-brand-secondary text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo-paguyuban.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-black tracking-tighter text-lg hidden sm:inline">NEOMA KWITANSI</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all",
                  pathname === item.path 
                    ? "bg-brand-primary text-brand-secondary" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden xs:inline">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
