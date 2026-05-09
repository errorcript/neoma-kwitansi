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
    <header className="no-print sticky top-0 z-50 px-4 pt-4 pb-2">
      <div className="max-w-7xl mx-auto glass-card rounded-[2rem] h-16 flex items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-brand-secondary p-1.5 rounded-xl transition-transform group-hover:rotate-12">
            <img src="/logo-paguyuban.png" alt="Logo" className="w-7 h-7 object-contain" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="font-black tracking-tighter text-lg text-brand-secondary">NEOMA</span>
            <span className="text-[10px] font-bold text-brand-primary tracking-[0.2em] uppercase">Kwitansi</span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-black transition-all",
                  isActive 
                    ? "bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20 scale-105" 
                    : "text-slate-500 hover:text-brand-secondary hover:bg-slate-100"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-brand-primary" : "")} />
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            );
          })}

          <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block"></div>

          <button
            onClick={async () => {
              if (confirm("Yakin mau logout bre?")) {
                await fetch("/api/logout", { method: "POST" });
                window.location.href = "/login";
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-black text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
