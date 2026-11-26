"use client";

import React, { useState, useEffect } from "react";
import { getInventory, updateStock, getProducts } from "../../../lib/store";
import { INITIAL_INVENTORY, INITIAL_PRODUCTS, PRODUCT_CATEGORIES } from "../../../lib/data";
import { InventoryItem, Product } from "../../../types";

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(0);

  const loadData = () => {
    setInventory(getInventory());
    setProducts(getProducts());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("la_verno_storage_changed", loadData);
    return () => window.removeEventListener("la_verno_storage_changed", loadData);
  }, []);

  const filtered = inventory.filter((item) => {
    const matchLoc =
      selectedLocation === "all" ||
      item.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchCat =
      categoryFilter === "all" ||
      item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchLoc && matchCat;
  });

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setNewStockVal(item.stock);
  };

  const handleSaveStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateStock(editingItem.id, Math.max(0, Number(newStockVal)));
    setEditingItem(null);
  };

  const getProductImage = (productId: string) => {
    return products.find((p) => p.id === productId)?.images[0] || "/images/products/watch-obsidian.jpg";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#201f1f]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#d1c5b4] uppercase tracking-wider">
            <span>Directoire Back-Office</span>
            <span>/</span>
            <span className="text-[#b89552] font-semibold">Inventory Management</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#e5e2e1] mt-1">
            Stock Levels & Warehouse Hubs
          </h1>
          <p className="text-xs text-[#d1c5b4]/80 mt-0.5">
            Adjusting stock here updates storefront availability and low-stock indicators immediately.
          </p>
        </div>

        <button
          onClick={() => alert("Stock audit ledger exported.")}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#201f1f] border border-[#2a2a2a] text-[#e5e2e1] hover:bg-[#2a2a2a] rounded text-xs font-medium self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px]">print</span>
          <span>Print Audit Sheet</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-4 rounded flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-[#131313] border border-[#2a2a2a] text-[#e5e2e1] px-3 py-1.5 rounded cursor-pointer"
          >
            <option value="all">All Locations</option>
            <option value="karachi">Karachi Clifton Vault</option>
            <option value="lahore">Lahore Gulberg Reserve</option>
            <option value="islamabad">Islamabad F-7 Safe</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#131313] border border-[#2a2a2a] text-[#e5e2e1] px-3 py-1.5 rounded cursor-pointer"
          >
            <option value="all">All Categories</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <span className="text-[#e8c179] font-mono">{filtered.length} SKUs Tracked</span>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto rounded border border-[#201f1f] bg-[#1c1b1b]">
        <table className="w-full text-left text-xs border-collapse min-w-[780px]">
          <thead>
            <tr className="bg-[#201f1f] text-[#d1c5b4] uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Hub Location</th>
              <th className="py-3 px-4 text-center">Available Units</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4">Last Audit</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#201f1f] text-[#e5e2e1]">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-[#201f1f]/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={getProductImage(item.productId)}
                      alt={item.name}
                      className="w-9 h-10 object-cover rounded border border-[#2a2a2a] bg-[#131313]"
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono text-[#d1c5b4]">{item.sku}</td>
                <td className="py-3 px-4 text-[#d1c5b4]">{item.category}</td>
                <td className="py-3 px-4 text-[#e5e2e1]">{item.location}</td>
                <td className="py-3 px-4 text-center font-mono text-sm font-semibold">
                  {item.stock}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${
                      item.status === "In Stock"
                        ? "bg-[#2a2a2a] text-[#e9c349]"
                        : "bg-[#93000a]/30 text-[#ffb4ab]"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#d1c5b4] font-mono text-[11px]">{item.lastAuditDate}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="px-3 py-1 rounded bg-[#201f1f] hover:bg-[#b89552] hover:text-[#432e00] text-[#d1c5b4] transition-colors font-medium text-[11px] cursor-pointer"
                  >
                    Adjust Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Adjust Stock Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded p-6 max-w-sm w-full space-y-4">
            <h3 className="text-sm font-semibold text-[#e5e2e1]">Adjust Stock Quantity</h3>
            <p className="text-xs text-[#d1c5b4]">
              {editingItem.name} ({editingItem.sku})
            </p>

            <form onSubmit={handleSaveStock} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                  Available Units
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newStockVal}
                  onChange={(e) => setNewStockVal(Number(e.target.value))}
                  className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] font-mono text-lg text-center"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 rounded bg-[#201f1f] text-[#d1c5b4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#b89552] text-[#432e00] font-semibold cursor-pointer"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
