"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Overview", path: "/admin", icon: "dashboard" },
  { label: "Products", path: "/admin/products", icon: "inventory_2" },
  { label: "Categories & Collections", path: "/admin/categories", icon: "category" },
  { label: "Inventory", path: "/admin/inventory", icon: "warehouse" },
  { label: "Orders", path: "/admin/orders", icon: "shopping_cart" },
  { label: "Customers", path: "/admin/customers", icon: "group" },
  { label: "Discounts & Promotions", path: "/admin/discounts", icon: "sell" },
  { label: "Shipping & Logistics", path: "/admin/logistics", icon: "local_shipping" },
  { label: "Reports & Analytics", path: "/admin/reports", icon: "analytics" },
  { label: "Staff Management", path: "/admin/staff", icon: "manage_accounts" },
  { label: "Settings", path: "/admin/settings", icon: "settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [globalSearch, setGlobalSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-sans antialiased flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
        />
      )}

      {/* ASIDE NAVIGATION SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-[#0e0e0e] z-50 flex flex-col justify-between border-r border-[#201f1f] transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#201f1f]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#b89552] flex items-center justify-center font-bold text-xs text-[#432e00]">
                V
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-[#e5e2e1] tracking-tight">LA VER’nO</span>
                <span className="text-[11px] text-[#d1c5b4]/80 font-normal">Directoire Admin</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#d1c5b4] hover:text-[#e5e2e1]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav className="flex flex-col gap-1 p-4">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.path === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded text-xs transition-colors ${
                    isActive
                      ? "bg-[#b89552] text-[#432e00] font-medium shadow-sm"
                      : "text-[#d1c5b4] hover:bg-[#201f1f] hover:text-[#e5e2e1]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#201f1f] bg-[#161d20]/40 space-y-3">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded bg-[#201f1f] hover:bg-[#2a2a2a] text-xs text-[#d1c5b4] hover:text-[#e5e2e1] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">storefront</span>
            <span>View Customer Storefront</span>
          </Link>

          <div className="flex items-center justify-between text-[11px] text-[#d1c5b4]/70 px-1 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#e9c349]"></span>
              Pakistan Hub
            </span>
            <span className="uppercase">v4.8.2</span>
          </div>
        </div>
      </aside>

      {/* MAIN SHELL */}
      <div className="lg:pl-72 flex flex-col flex-1 min-h-screen w-full overflow-x-hidden">
        {/* Sticky Utility Header */}
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#131313]/95 backdrop-blur-md border-b border-[#201f1f] z-40 flex items-center justify-between px-4 sm:px-8 gap-3">
          <div className="flex items-center gap-3 sm:gap-6 flex-1 max-w-xl">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Navigation"
              className="lg:hidden p-1.5 text-[#d1c5b4] hover:text-[#e5e2e1] bg-[#1c1b1b] border border-[#2a2a2a] rounded"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>

            <span className="text-xs uppercase tracking-wider text-[#d1c5b4] hidden md:inline-block font-medium">
              LA VER’nO Directoire — Catalogue Operations
            </span>
            <div className="relative w-full max-w-xs hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#d1c5b4] text-[17px]">
                search
              </span>
              <input
                type="text"
                placeholder="Quick search SKU, product..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full bg-[#1c1b1b] border border-[#2a2a2a] pl-9 pr-3 py-1.5 text-xs text-[#e5e2e1] placeholder:text-[#9a8f80] rounded focus:outline-none focus:border-[#b89552]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#d1c5b4] hover:text-[#b89552] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              <span>Storefront</span>
            </Link>

            <div className="flex items-center gap-3 px-3 py-1 rounded bg-[#1c1b1b] border border-[#2a2a2a]">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#b89552] flex items-center justify-center text-[#432e00] font-bold text-xs">
                TA
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs text-[#e5e2e1] font-medium leading-tight">Tariq Al-Mansoor</span>
                <span className="text-[10px] text-[#d1c5b4]/80">Executive Director</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Workspace */}
        <main className="flex-1 pt-20 sm:pt-24 bg-[#131313] p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
