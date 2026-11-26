"use client";

import React, { useState, useEffect } from "react";
import { getProducts, getOrders } from "../../../lib/store";
import { INITIAL_PRODUCTS, INITIAL_ORDERS, PRODUCT_CATEGORIES } from "../../../lib/data";
import { formatPKR } from "../../../lib/utils";
import { Product, Order } from "../../../types";

export default function AdminReportsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  useEffect(() => {
    setProducts(getProducts());
    setOrders(getOrders());
  }, []);

  const totalOrderValue = orders.reduce((acc, o) => acc + o.total, 0);
  const avgOrder = orders.length ? Math.round(totalOrderValue / orders.length) : 0;
  const inventoryValueByCategory = PRODUCT_CATEGORIES.map((cat) => {
    const items = products.filter((p) => p.category === cat);
    const val = items.reduce((s, p) => s + p.price * Math.max(0, p.stock), 0);
    return { category: cat, count: items.length, val };
  });
  const totalStockValue = Math.max(1, inventoryValueByCategory.reduce((s, c) => s + c.val, 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#201f1f]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#d1c5b4] uppercase tracking-wider">
            <span>Directoire Back-Office</span>
            <span>/</span>
            <span className="text-[#b89552] font-semibold">Reports & Analytics</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#e5e2e1] mt-1">
            Catalogue & Settlement Analytics
          </h1>
          <p className="text-xs text-[#d1c5b4]/80 mt-0.5">
            Live catalogue inventory value across Watches, Ties, Cufflinks, and Perfumes plus order performance.
          </p>
        </div>

        <button
          onClick={() => alert("Demo analytics report downloaded.")}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#b89552] text-[#432e00] hover:bg-[#e8c179] transition-colors rounded text-xs font-semibold self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px]">download</span>
          <span>Export Report</span>
        </button>
      </div>

      {/* Top Figures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#1c1b1b] border border-[#2a2a2a] rounded space-y-1">
          <span className="text-[10px] uppercase text-[#d1c5b4]">Recorded Demo Orders</span>
          <p className="text-2xl font-bold font-mono text-[#e5e2e1]">{formatPKR(totalOrderValue)}</p>
          <p className="text-[11px] text-[#e9c349]">{orders.length} Orders Settled</p>
        </div>
        <div className="p-5 bg-[#1c1b1b] border border-[#2a2a2a] rounded space-y-1">
          <span className="text-[10px] uppercase text-[#d1c5b4]">Average Order Value</span>
          <p className="text-2xl font-bold font-mono text-[#e5e2e1]">{formatPKR(avgOrder)}</p>
          <p className="text-[11px] text-[#d1c5b4]">PKR Luxury Object Basket</p>
        </div>
        <div className="p-5 bg-[#1c1b1b] border border-[#2a2a2a] rounded space-y-1">
          <span className="text-[10px] uppercase text-[#d1c5b4]">Active vs Draft Ratio</span>
          <p className="text-2xl font-bold font-mono text-[#e5e2e1]">
            {products.filter((p) => p.status === "active").length} / {products.length}
          </p>
          <p className="text-[11px] text-[#e9c349]">Published on Storefront</p>
        </div>
        <div className="p-5 bg-[#1c1b1b] border border-[#2a2a2a] rounded space-y-1">
          <span className="text-[10px] uppercase text-[#d1c5b4]">Total Stock Valuation</span>
          <p className="text-2xl font-bold font-mono text-[#e5e2e1]">{formatPKR(totalStockValue)}</p>
          <p className="text-[11px] text-[#d1c5b4]">Across 3 Hub Locations</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="p-6 bg-[#1c1b1b] border border-[#2a2a2a] rounded space-y-4">
        <h3 className="text-sm font-semibold text-[#e5e2e1]">Stock Valuation by Category (Live Catalogue)</h3>
        <div className="space-y-3 text-xs">
          {inventoryValueByCategory.map((h) => {
            const share = Math.round((h.val / totalStockValue) * 100);
            return (
              <div key={h.category} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-[#e5e2e1]">
                    {h.category} ({h.count} SKUs)
                  </span>
                  <span className="font-mono text-[#d1c5b4]">
                    {formatPKR(h.val)} ({share}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-[#131313] rounded overflow-hidden">
                  <div className="h-full bg-[#b89552]" style={{ width: `${Math.max(3, share)}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
