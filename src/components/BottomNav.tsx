"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, BarChart3, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const pathname = usePathname();

  // Hide on public pages
  if (pathname === '/login' || pathname.startsWith('/verify') || pathname.startsWith('/print')) {
    return null;
  }

  const menuItems = [
    { name: "Input", path: "/", icon: FileText, id: "tour-nav-input" },
    { name: "Rekap", path: "/rekap", icon: BarChart3, id: "tour-nav-rekap-mobile" },
    { name: "Settings", path: "/settings", icon: Settings, id: "tour-nav-settings-mobile" },
  ];

  const handleHelp = () => {
    // Trigger tutorial for current page
    const url = new URL(window.location.href);
    url.searchParams.set('tutorial', 'true');
    window.location.href = url.toString();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-slate-900 border-t border-white/10 px-6 py-3 flex items-center justify-between sm:hidden no-print">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            id={item.id}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              isActive ? "text-brand-primary" : "text-gray-400"
            )}
          >
            <Icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(255,221,0,0.5)]")} />
            <span className="text-[9px] font-black uppercase tracking-widest">{item.name}</span>
          </Link>
        );
      })}
      
      <button
        onClick={handleHelp}
        id="tour-help-mobile"
        className="flex flex-col items-center gap-1 text-gray-400 hover:text-brand-primary transition-all"
      >
        <HelpCircle className="w-6 h-6" />
        <span className="text-[9px] font-black uppercase tracking-widest">Bantuan</span>
      </button>
    </nav>
  );
};
