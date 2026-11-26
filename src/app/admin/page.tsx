"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getOrders, getProducts, getInventory, getCustomers, updateOrderStatus } from "../../lib/store";
import { INITIAL_ORDERS, INITIAL_INVENTORY, INITIAL_PRODUCTS, INITIAL_CUSTOMERS } from "../../lib/data";
import { formatPKR } from "../../lib/utils";
import { Order, InventoryItem, Product, CustomerProfile } from "../../types";

export default function AdminOverviewPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [activeTab, setActiveTab] = useState<"all" | "wire" | "cod">("all");
  const [orderFilter, setOrderFilter] = useState("all");

  const loadData = () => {
    setOrders(getOrders());
    setInventory(getInventory());
    setProducts(getProducts());
    setCustomers(getCustomers());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("la_verno_storage_changed", loadData);
    return () => window.removeEventListener("la_verno_storage_changed", loadData);
  }, []);

  const lowStockItems = inventory.filter((i) => i.status === "Low Stock" || i.stock <= 5);
  const activeCount = products.filter((p) => p.status === "active").length;
  const draftCount = products.filter((p) => p.status === "draft").length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const catalogValuation = products.reduce((acc, p) => acc + p.price * Math.max(0, p.stock), 0);

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "all") return true;
    if (orderFilter === "in-transit") return o.status === "In Transit";
    if (orderFilter === "settled") return o.status === "Settled";
    if (orderFilter === "dispatched") return o.status === "Dispatched";
    return true;
  });

  const handleStatusChange = (orderId: string, status: Order["status"]) => {
    updateOrderStatus(orderId, status);
  };

  return (
    <div className="space-y-8">
      {/* Header Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#201f1f]">
        <div>
          <h1 className="text-2xl font-semibold text-[#e5e2e1] tracking-tight">Overview</h1>
          <p className="text-xs text-[#d1c5b4]/80 mt-1">
            Summary of LA VER’nO watches, ties, cufflinks & perfumes catalogue, Pakistan orders, and vault stock levels
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#1c1b1b] border border-[#2a2a2a] rounded px-3 py-1.5 text-xs text-[#e5e2e1]">
            <span className="material-symbols-outlined text-[16px] text-[#d1c5b4] mr-2">
              calendar_today
            </span>
            <span>Demo Period</span>
          </div>

          <button
            onClick={() => alert("Demo ledger exported as CSV.")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#201f1f] hover:bg-[#2a2a2a] text-[#e5e2e1] text-xs font-medium border border-[#2a2a2a] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export CSV</span>
          </button>

          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#b89552] text-[#432e00] hover:bg-[#e8c179] transition-colors text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Manage Products</span>
          </Link>
        </div>
      </div>

      {/* Top Metric KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded flex flex-col justify-between hover:border-[#b89552]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#d1c5b4] font-medium">Recorded Demo Revenue</span>
            <span className="flex items-center text-[11px] px-1.5 py-0.5 rounded bg-[#2a2a2a] text-[#e9c349] font-medium font-mono">
              PKR
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#e5e2e1] tracking-tight font-mono">
              {formatPKR(totalRevenue)}
            </div>
            <p className="text-[11px] text-[#d1c5b4]/80 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#e9c349]">check_circle</span>
              Across {orders.length} active demo orders
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2a2a2a] flex items-center justify-between text-[11px] text-[#d1c5b4]">
            <span>Currency</span>
            <span className="text-[#e5e2e1] font-medium font-mono">Pakistani Rupee</span>
          </div>
        </div>

        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded flex flex-col justify-between hover:border-[#b89552]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#d1c5b4] font-medium">Catalogue Products</span>
            <span className="flex items-center text-[11px] px-1.5 py-0.5 rounded bg-[#2a2a2a] text-[#e8c179] font-medium font-mono">
              4 Categories
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#e5e2e1] tracking-tight font-mono">
              {products.length} SKUs
            </div>
            <p className="text-[11px] text-[#d1c5b4]/80 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">watch</span>
              {activeCount} Active · {draftCount} Draft
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2a2a2a] flex items-center justify-between text-[11px] text-[#d1c5b4]">
            <span>Storefront Live</span>
            <span className="text-[#e5e2e1] font-medium">{activeCount} Published</span>
          </div>
        </div>

        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded flex flex-col justify-between hover:border-[#b89552]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#d1c5b4] font-medium">Patron Accounts</span>
            <span className="flex items-center text-[11px] px-1.5 py-0.5 rounded bg-[#2a2a2a] text-[#e9c349] font-medium font-mono">
              Demo Profiles
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#e5e2e1] tracking-tight font-mono">
              {customers.length} Patrons
            </div>
            <p className="text-[11px] text-[#d1c5b4]/80 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#b89552]">verified</span>
              Karachi · Lahore · Islamabad
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2a2a2a] flex items-center justify-between text-[11px] text-[#d1c5b4]">
            <span>Directory</span>
            <Link href="/admin/customers" className="text-[#e8c179] hover:underline font-medium">
              View All →
            </Link>
          </div>
        </div>

        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded flex flex-col justify-between hover:border-[#b89552]/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#d1c5b4] font-medium">Inventory Retail Value</span>
            <span className="flex items-center text-[11px] px-1.5 py-0.5 rounded bg-[#93000a]/40 text-[#ffb4ab] font-medium font-mono">
              {lowStockItems.length} Low Stock
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#e5e2e1] tracking-tight font-mono">
              {formatPKR(catalogValuation)}
            </div>
            <p className="text-[11px] text-[#d1c5b4]/80 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">inventory_2</span>
              {inventory.reduce((s, i) => s + i.stock, 0)} Total Units in Stock
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2a2a2a] flex items-center justify-between text-[11px] text-[#d1c5b4]">
            <span>Hubs: KHI · LHE · ISB</span>
            <Link href="/admin/inventory" className="text-[#e8c179] hover:underline font-medium">
              Adjust →
            </Link>
          </div>
        </div>
      </div>

      {/* Main 2-Column Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          {/* Chart Module */}
          <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-6 rounded space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[#e5e2e1]">Weekly City Order Share (Demo)</h2>
                <p className="text-xs text-[#d1c5b4]">Relative order volume across Pakistan salons</p>
              </div>

              <div className="flex items-center gap-1 bg-[#201f1f] p-1 rounded border border-[#2a2a2a]">
                {(["all", "wire", "cod"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-2.5 py-1 text-[11px] rounded transition-colors uppercase tracking-wider cursor-pointer ${
                      activeTab === t ? "bg-[#b89552] text-[#432e00] font-semibold" : "text-[#d1c5b4]"
                    }`}
                  >
                    {t === "all" ? "All Channels" : t === "wire" ? "Online / Wire" : "Cash on Delivery"}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#131313] rounded p-4 border border-[#201f1f]">
              <div className="h-48 w-full flex items-end justify-between gap-4 pt-4 pb-2 px-4">
                {[
                  { label: "Week 1", k: 58, l: 44, i: 30 },
                  { label: "Week 2", k: 74, l: 60, i: 42 },
                  { label: "Week 3", k: 66, l: 62, i: 48 },
                  { label: "Week 4", k: 90, l: 78, i: 56 },
                ].map((w, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1.5 h-36">
                      <div
                        className="w-1/3 bg-[#e8c179] rounded-t"
                        style={{ height: `${w.k}%` }}
                        title={`Karachi: ${w.k}%`}
                      ></div>
                      <div
                        className="w-1/3 bg-[#e9c349] rounded-t"
                        style={{ height: `${w.l}%` }}
                        title={`Lahore: ${w.l}%`}
                      ></div>
                      <div
                        className="w-1/3 bg-[#353534] rounded-t"
                        style={{ height: `${w.i}%` }}
                        title={`Islamabad: ${w.i}%`}
                      ></div>
                    </div>
                    <span className="text-[11px] text-[#d1c5b4] font-mono">{w.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between pt-3 mt-2 border-t border-[#201f1f] text-[11px] text-[#d1c5b4]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#e8c179]"></span> Karachi
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#e9c349]"></span> Lahore
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#353534]"></span> Islamabad
                  </span>
                </div>
                <span className="text-[#e5e2e1] font-mono">Illustrative Metrics</span>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-6 rounded space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[#e5e2e1]">Recent Orders Ledger</h2>
                <p className="text-xs text-[#d1c5b4]">Live local demo orders and fulfillment controls</p>
              </div>

              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="bg-[#201f1f] border border-[#2a2a2a] text-xs text-[#e5e2e1] px-3 py-1.5 rounded cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="in-transit">In Transit</option>
                <option value="settled">Settled</option>
                <option value="dispatched">Dispatched</option>
              </select>
            </div>

            <div className="overflow-x-auto rounded border border-[#201f1f]">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#201f1f] text-[#d1c5b4] uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4 text-right">Total (PKR)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#201f1f] text-[#e5e2e1]">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#201f1f]/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-[#e8c179] font-medium">#{o.id}</td>
                      <td className="py-3 px-4 font-medium">{o.shippingAddress.fullName}</td>
                      <td className="py-3 px-4 text-[#d1c5b4] truncate max-w-[160px]">
                        {o.items.map((i) => i.name).join(", ")}
                      </td>
                      <td className="py-3 px-4">{o.shippingAddress.city}</td>
                      <td className="py-3 px-4 text-right font-mono font-medium">
                        {formatPKR(o.total)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${
                            o.status === "Settled" || o.status === "Delivered"
                              ? "bg-[#2a2a2a] text-[#e9c349]"
                              : o.status === "In Transit" || o.status === "Dispatched"
                              ? "bg-[#e8c179]/20 text-[#e8c179]"
                              : "bg-[#93000a]/20 text-[#ffb4ab]"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value as any)}
                          className="bg-[#131313] border border-[#2a2a2a] text-[10px] text-[#d1c5b4] rounded px-1.5 py-1 cursor-pointer"
                        >
                          <option value="In Transit">In Transit</option>
                          <option value="Settled">Settled</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Low Stock Watchlist & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#201f1f]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#e9c349]">inventory_2</span>
                <h3 className="text-xs font-semibold text-[#e5e2e1] uppercase tracking-wider">
                  Low Stock Watchlist
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-[#93000a]/30 text-[#ffb4ab] rounded font-medium">
                {lowStockItems.length} Alerts
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {lowStockItems.map((item) => (
                <div key={item.id} className="p-3 bg-[#131313] border border-[#201f1f] rounded space-y-1">
                  <div className="flex justify-between items-center text-xs gap-2">
                    <span className="font-medium text-[#e5e2e1] truncate">{item.name}</span>
                    <span className="text-[#ffb4ab] font-mono text-[11px] font-medium whitespace-nowrap">
                      {item.stock} Left
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#d1c5b4]">
                    <span className="font-mono">{item.sku}</span>
                    <Link href="/admin/inventory" className="text-[#e8c179] hover:underline">
                      Adjust Stock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-5 rounded space-y-2">
            <h3 className="text-xs font-semibold text-[#e5e2e1] uppercase tracking-wider pb-2 border-b border-[#201f1f]">
              Catalogue Quick Links
            </h3>
            <Link
              href="/admin/products"
              className="w-full flex items-center justify-between p-2.5 bg-[#131313] hover:bg-[#201f1f] rounded text-left text-xs transition-colors border border-[#201f1f]"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px] text-[#e8c179]">edit_square</span>
                <span>Edit Prices, Sales & Status</span>
              </span>
              <span className="material-symbols-outlined text-sm text-[#d1c5b4]">chevron_right</span>
            </Link>

            <Link
              href="/admin/categories"
              className="w-full flex items-center justify-between p-2.5 bg-[#131313] hover:bg-[#201f1f] rounded text-left text-xs transition-colors border border-[#201f1f]"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[17px] text-[#e8c179]">category</span>
                <span>Manage Collections & Tags</span>
              </span>
              <span className="material-symbols-outlined text-sm text-[#d1c5b4]">chevron_right</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
