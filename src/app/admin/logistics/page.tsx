"use client";

import React, { useState } from "react";

interface ShipmentUnit {
  id: string;
  trackingNumber: string;
  partner: "TCS Express Direct" | "Trax Secured Courier" | "Private Salon Courier";
  route: string;
  recipient: string;
  status: "In Transit" | "Delivered" | "Dispatched" | "Pending Handover";
  eta: string;
  sealNumber: string;
}

const INITIAL_SHIPMENTS: ShipmentUnit[] = [
  {
    id: "shp-1",
    trackingNumber: "TCS-PK-4109",
    partner: "TCS Express Direct",
    route: "Clifton Hub (Karachi) → DHA Phase V (Karachi)",
    recipient: "Malik Sikandar Khan",
    status: "In Transit",
    eta: "Today, 17:30 PKT",
    sealNumber: "LV-PARCEL-8921",
  },
  {
    id: "shp-2",
    trackingNumber: "TCS-PK-4107",
    partner: "TCS Express Direct",
    route: "Lahore Hub → Sector F-7/1 (Islamabad)",
    recipient: "Barrister Farooq Afridi",
    status: "Dispatched",
    eta: "Tomorrow, 14:00 PKT",
    sealNumber: "LV-PARCEL-8919",
  },
  {
    id: "shp-3",
    trackingNumber: "SLN-LHE-4108",
    partner: "Private Salon Courier",
    route: "Gulberg Reserve (Lahore) → Zafar Ali Road",
    recipient: "Nawabzada Jahangir Tareen",
    status: "Delivered",
    eta: "Settled",
    sealNumber: "LV-SALON-004",
  },
];

export default function AdminLogisticsPage() {
  const [shipments] = useState<ShipmentUnit[]>(INITIAL_SHIPMENTS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#201f1f]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#d1c5b4] uppercase tracking-wider">
            <span>Directoire Back-Office</span>
            <span>/</span>
            <span className="text-[#b89552] font-semibold">Shipping & Logistics</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#e5e2e1] mt-1">
            Shipping & Nationwide Courier Operations
          </h1>
          <p className="text-xs text-[#d1c5b4]/80 mt-0.5">
            Simulated courier tracking, parcel dispatch manifests, and salon handovers across Pakistan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#1c1b1b] border border-[#2a2a2a] rounded">
          <p className="text-[10px] uppercase text-[#d1c5b4]">Active Dispatches</p>
          <p className="text-2xl font-bold font-mono text-[#e5e2e1] mt-1">{shipments.length} Parcels</p>
          <p className="text-xs text-[#e9c349] mt-1">Demo Tracking Simulation</p>
        </div>
        <div className="p-4 bg-[#1c1b1b] border border-[#2a2a2a] rounded">
          <p className="text-[10px] uppercase text-[#d1c5b4]">Standard Delivery Window</p>
          <p className="text-2xl font-bold font-mono text-[#e5e2e1] mt-1">24–48 Hours</p>
          <p className="text-xs text-[#d1c5b4] mt-1">Same-Day in Karachi & Lahore</p>
        </div>
        <div className="p-4 bg-[#1c1b1b] border border-[#2a2a2a] rounded">
          <p className="text-[10px] uppercase text-[#d1c5b4]">Complimentary Threshold</p>
          <p className="text-lg font-bold font-mono text-[#e5e2e1] mt-1">PKR 15,000+</p>
          <p className="text-xs text-[#b89552] mt-1">PKR 500 Flat Courier Below</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-[#201f1f] bg-[#1c1b1b]">
        <table className="w-full text-left text-xs border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-[#201f1f] text-[#d1c5b4] uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Tracking Code</th>
              <th className="py-3 px-4">Logistics Partner</th>
              <th className="py-3 px-4">Route Manifest</th>
              <th className="py-3 px-4">Recipient</th>
              <th className="py-3 px-4">Parcel Seal</th>
              <th className="py-3 px-4">Estimated Arrival</th>
              <th className="py-3 px-4 text-center">Transit State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#201f1f] text-[#e5e2e1]">
            {shipments.map((s) => (
              <tr key={s.id} className="hover:bg-[#201f1f]/50 transition-colors">
                <td className="py-3 px-4 font-mono text-[#e8c179] font-medium">{s.trackingNumber}</td>
                <td className="py-3 px-4 font-medium">{s.partner}</td>
                <td className="py-3 px-4 text-[#d1c5b4]">{s.route}</td>
                <td className="py-3 px-4">{s.recipient}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-[#d1c5b4]">{s.sealNumber}</td>
                <td className="py-3 px-4 font-mono text-[11px]">{s.eta}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${
                      s.status === "In Transit"
                        ? "bg-[#e8c179]/20 text-[#e8c179]"
                        : "bg-[#2a2a2a] text-[#e5e2e1]"
                    }`}
                  >
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
