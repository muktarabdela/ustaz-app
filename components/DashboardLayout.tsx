"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="bg-background text-on-background antialiased min-h-screen pb-24 flex flex-col">
      
      {/* MAIN CONTENT AREA (Takes full width now) */}
      <main className="flex-1 w-full">
        
        {/* TOP APP BAR (Sticky Header) */}
        <header className="bg-surface flex justify-end items-center w-full px-container-padding py-sm sticky top-0 z-40">
          <button 
            onClick={logout}
            className="p-2 text-primary hover:bg-surface-container-low rounded-full opacity-80 transition-opacity duration-150"
            title="Logout"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </header>

        {/* Page Content injected here */}
        <div className="px-container-padding py-lg max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* BOTTOM NAV BAR */}
    

    </div>
  );
}