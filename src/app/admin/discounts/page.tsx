"use client";

import React, { useState, useEffect } from "react";
import { getDiscounts } from "../../../lib/store";
import { INITIAL_DISCOUNTS } from "../../../lib/data";
import { formatPKR } from "../../../lib/utils";
import { DiscountCode } from "../../../types";

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountCode[]>(INITIAL_DISCOUNTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCode, setNewCode] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: 10,
    minOrder: 100000,
    expiryDate: "2026-12-31"
  });

  useEffect(() => {
    setDiscounts(getDiscounts());
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: DiscountCode = {
      code: newCode.code.toUpperCase(),
      type: newCode.type,
      value: Number(newCode.value),
      minOrder: Number(newCode.minOrder),
      expiryDate: newCode.expiryDate
    };
    const updated = [...discounts, created];
    setDiscounts(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("la_verno_discounts", JSON.stringify(updated));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#201f1f]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#d1c5b4] uppercase tracking-wider">
            <span>Directoire Back-Office</span>
            <span>/</span>
            <span className="text-[#b89552] font-semibold">Discounts & Promotions</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#e5e2e1] mt-1">
            Discounts & Promotion Protocols
          </h1>
          <p className="text-xs text-[#d1c5b4]/80 mt-0.5">
            Manage confidential concessions, patron privilege codes, and minimum order qualifiers.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#b89552] text-[#432e00] hover:bg-[#e8c179] transition-colors rounded text-xs font-semibold self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[17px]">add</span>
          <span>Create Protocol Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {discounts.map((d) => (
          <div
            key={d.code}
            className="p-6 bg-[#1c1b1b] border border-[#2a2a2a] rounded space-y-4 hover:border-[#b89552]/40 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#b89552] font-mono">
                  Active Concession
                </span>
                <h3 className="text-xl font-bold font-mono text-[#e5e2e1] mt-0.5">{d.code}</h3>
              </div>
              <span className="px-2.5 py-1 bg-[#201f1f] text-[#e8c179] text-xs font-mono rounded font-semibold">
                {d.type === "percentage" ? `${d.value}% Off` : formatPKR(d.value)}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-[#d1c5b4]">
              <div className="flex justify-between">
                <span>Minimum Order Threshold:</span>
                <span className="font-mono text-[#e5e2e1]">{formatPKR(d.minOrder)}</span>
              </div>
              <div className="flex justify-between">
                <span>Protocol Expiry Date:</span>
                <span className="font-mono text-[#e5e2e1]">{d.expiryDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-[#e5e2e1]">Create Concession Code</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase text-[#d1c5b4] block mb-1">Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PRIVILEGE20"
                  value={newCode.code}
                  onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
                  className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase text-[#d1c5b4] block mb-1">Type</label>
                  <select
                    value={newCode.type}
                    onChange={(e) => setNewCode({ ...newCode, type: e.target.value as any })}
                    className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (PKR)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase text-[#d1c5b4] block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCode.value}
                    onChange={(e) => setNewCode({ ...newCode, value: Number(e.target.value) })}
                    className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-[#d1c5b4] block mb-1">Min. Order (PKR)</label>
                <input
                  type="number"
                  required
                  value={newCode.minOrder}
                  onChange={(e) => setNewCode({ ...newCode, minOrder: Number(e.target.value) })}
                  className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#201f1f] text-[#d1c5b4]"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 rounded bg-[#b89552] text-[#432e00] font-semibold">
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
