"use client";

import React, { useState, useEffect } from "react";
import { getCustomers, addCustomer } from "../../../lib/store";
import { INITIAL_CUSTOMERS } from "../../../lib/data";
import { formatPKR, formatDate } from "../../../lib/utils";
import { CustomerProfile } from "../../../types";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCust, setNewCust] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Karachi",
    tier: "Patron" as CustomerProfile["tier"]
  });

  const loadData = () => {
    setCustomers(getCustomers());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("la_verno_storage_changed", loadData);
    return () => window.removeEventListener("la_verno_storage_changed", loadData);
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const created: CustomerProfile = {
      id: `cust-${Date.now()}`,
      fullName: newCust.fullName,
      email: newCust.email,
      phone: newCust.phone,
      city: newCust.city,
      tier: newCust.tier,
      registeredDate: new Date().toISOString().split("T")[0],
      kycVerified: true
    };
    addCustomer(created);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#201f1f]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#d1c5b4] uppercase tracking-wider">
            <span>Directoire Back-Office</span>
            <span>/</span>
            <span className="text-[#b89552] font-semibold">Patron Directory</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#e5e2e1] mt-1">
            Customers & Patron Registry
          </h1>
          <p className="text-xs text-[#d1c5b4]/80 mt-0.5">
            Verified high-net-worth patrons, salon privileges, and State Bank KYC escrow status.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#b89552] text-[#432e00] hover:bg-[#e8c179] transition-colors rounded text-xs font-semibold self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[17px]">person_add</span>
          <span>Register New Patron</span>
        </button>
      </div>

      <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-4 rounded flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 w-full sm:w-80">
          <span className="material-symbols-outlined text-[#d1c5b4] text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search patron by name, email or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-1.5 rounded text-[#e5e2e1] placeholder:text-[#9a8f80] focus:outline-none focus:border-[#b89552]"
          />
        </div>
        <span className="text-[#e8c179] font-mono">{filtered.length} Patrons Registered</span>
      </div>

      <div className="overflow-x-auto rounded border border-[#201f1f] bg-[#1c1b1b]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#201f1f] text-[#d1c5b4] uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Patron Full Name</th>
              <th className="py-3 px-4">Correspondence Email</th>
              <th className="py-3 px-4">Phone / WhatsApp</th>
              <th className="py-3 px-4">City</th>
              <th className="py-3 px-4">Membership Tier</th>
              <th className="py-3 px-4 text-center">KYC Status</th>
              <th className="py-3 px-4">Member Since</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#201f1f] text-[#e5e2e1]">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[#201f1f]/50 transition-colors">
                <td className="py-3 px-4 font-medium">{c.fullName}</td>
                <td className="py-3 px-4 text-[#d1c5b4]">{c.email}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-[#d1c5b4]">{c.phone}</td>
                <td className="py-3 px-4">{c.city}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#2a2a2a] text-[#e8c179] font-mono">
                    {c.tier}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-[11px] text-[#e9c349] flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Verified
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-[#d1c5b4]">{formatDate(c.registeredDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-[#e5e2e1]">Register Patron Profile</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase text-[#d1c5b4] block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={newCust.fullName}
                  onChange={(e) => setNewCust({ ...newCust, fullName: e.target.value })}
                  className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-[#d1c5b4] block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newCust.email}
                  onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                  className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-[#d1c5b4] block mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={newCust.phone}
                  onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                  className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase text-[#d1c5b4] block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newCust.city}
                    onChange={(e) => setNewCust({ ...newCust, city: e.target.value })}
                    className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-[#d1c5b4] block mb-1">Tier</label>
                  <select
                    value={newCust.tier}
                    onChange={(e) => setNewCust({ ...newCust, tier: e.target.value as any })}
                    className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
                  >
                    <option value="Patron">Patron</option>
                    <option value="Tier 1 Privileged">Tier 1 Privileged</option>
                    <option value="Salon Privé Member">Salon Privé Member</option>
                  </select>
                </div>
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
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
