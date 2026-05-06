"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Mobile Bottom Nav Links (Now the primary navigation)
const navItems = [
  { name: "Classes", path: "/", icon: "calendar_today" }, // Path changed to "/" to match your page.tsx
  { name: "History", path: "/history", icon: "history" },
  { name: "Profile", path: "/profile", icon: "person" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="bg-background text-on-background antialiased min-h-screen pb-24 flex flex-col">
      
      {/* MAIN CONTENT AREA (Takes full width now) */}
      <main className="flex-1 w-full">
        
        {/* TOP APP BAR (Sticky Header) */}
        <header className="bg-surface flex justify-between items-center w-full px-container-padding py-sm sticky top-0 z-40">
          <button className="p-2 text-primary hover:bg-surface-container-low rounded-full opacity-80 transition-opacity duration-150">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-h2 text-h2 text-primary font-bold tracking-tight text-center flex-1">
            Assalamu Alaikum
          </h1>
          <button className="p-2 text-primary hover:bg-surface-container-low rounded-full opacity-80 transition-opacity duration-150">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </header>

        {/* Page Content injected here */}
        <div className="px-container-padding py-lg max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* BOTTOM NAV BAR */}
      <nav className="bg-surface-container-lowest rounded-t-xl shadow-[0_-4px_15px_rgba(0,0,0,0.04)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-gutter py-sm pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center justify-center px-5 py-1 transition-transform duration-200 group ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container rounded-full scale-95"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span
                className="material-symbols-outlined group-hover:text-primary"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-label-caps text-label-caps mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}