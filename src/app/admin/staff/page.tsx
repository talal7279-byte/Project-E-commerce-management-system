"use client";

import React, { useState } from "react";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  hub: string;
  email: string;
  status: "Active" | "On Leave";
  accessTier: string;
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "st-1",
    name: "Tariq Al-Mansoor",
    role: "Executive Director",
    hub: "Karachi Central Operational Hub",
    email: "tariq.mansoor@la-verno.pk",
    status: "Active",
    accessTier: "Tier 1 Sovereign Access"
  },
  {
    id: "st-2",
    name: "Hamza Bilgrami",
    role: "Head Horologist & Custodian",
    hub: "Lahore Gulberg Conservatory",
    email: "hamza.bilgrami@la-verno.pk",
    status: "Active",
    accessTier: "Vault Access (Safe 1–4)"
  },
  {
    id: "st-3",
    name: "Zainab Qazi",
    role: "Salon Privé Director",
    hub: "Islamabad Sector F-7 Lounge",
    email: "zainab.qazi@la-verno.pk",
    status: "Active",
    accessTier: "Patron Protocol Direct"
  },
  {
    id: "st-4",
    name: "Capt. (R) Asad Mehmood",
    role: "Chief of Armored Logistics",
    hub: "TCS Armored Direct Liaison",
    email: "asad.mehmood@la-verno.pk",
    status: "Active",
    accessTier: "Logistics Escrow Clear"
  }
];

export default function AdminStaffPage() {
  const [staff] = useState<StaffMember[]>(INITIAL_STAFF);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#201f1f]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#d1c5b4] uppercase tracking-wider">
            <span>Directoire Back-Office</span>
            <span>/</span>
            <span className="text-[#b89552] font-semibold">Staff Management</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#e5e2e1] mt-1">
            Staff Directory & Sovereign Permissions
          </h1>
          <p className="text-xs text-[#d1c5b4]/80 mt-0.5">
            Oversee directoire officers, salon curators, and vault custodians across Pakistan facilities.
          </p>
        </div>

        <button
          onClick={() => alert("Staff invitation sent via secure mail.")}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#b89552] text-[#432e00] hover:bg-[#e8c179] transition-colors rounded text-xs font-semibold self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[17px]">person_add</span>
          <span>Invite Officer</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded border border-[#201f1f] bg-[#1c1b1b]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#201f1f] text-[#d1c5b4] uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Officer Name</th>
              <th className="py-3 px-4">Designation</th>
              <th className="py-3 px-4">Operational Hub</th>
              <th className="py-3 px-4">Direct Email</th>
              <th className="py-3 px-4">Security Clearance</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#201f1f] text-[#e5e2e1]">
            {staff.map((s) => (
              <tr key={s.id} className="hover:bg-[#201f1f]/50 transition-colors">
                <td className="py-3 px-4 font-medium">{s.name}</td>
                <td className="py-3 px-4 text-[#e8c179]">{s.role}</td>
                <td className="py-3 px-4 text-[#d1c5b4]">{s.hub}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-[#d1c5b4]">{s.email}</td>
                <td className="py-3 px-4 font-mono text-[10px] text-[#d1c5b4]">{s.accessTier}</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#2a2a2a] text-[#e9c349] font-mono">
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
