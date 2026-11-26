"use client";

import React, { useState, useEffect } from "react";
import { getStoreSettings, updateStoreSettings, StoreSettings, DEFAULT_SETTINGS } from "../../../lib/store";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getStoreSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    updateStoreSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!settings) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#201f1f]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#d1c5b4] uppercase tracking-wider">
            <span>Directoire Back-Office</span>
            <span>/</span>
            <span className="text-[#b89552] font-semibold">Operational Settings</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#e5e2e1] mt-1">
            Store & Directoire Settings
          </h1>
          <p className="text-xs text-[#d1c5b4]/80 mt-0.5">
            Configure default currency, salon contact protocols, and Pakistan armored logistics thresholds.
          </p>
        </div>

        {saved && (
          <span className="text-xs text-[#e9c349] font-medium animate-in fade-in">
            ✓ Settings Persisted Locally
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs font-light">
        {/* Section 1: Brand & Currency */}
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-6 rounded space-y-4">
          <h3 className="text-sm font-semibold text-[#e5e2e1] pb-2 border-b border-[#201f1f]">
            1. Brand Identity & Currency
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-[#d1c5b4] block">House Brand Name</label>
              <input
                type="text"
                disabled
                value={settings.storeName}
                className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] opacity-70 cursor-not-allowed"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-[#d1c5b4] block">Tagline</label>
              <input
                type="text"
                disabled
                value={settings.tagline}
                className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] opacity-70 cursor-not-allowed"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-[#d1c5b4] block">Default Currency</label>
              <input
                type="text"
                disabled
                value="Pakistani Rupee (PKR)"
                className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e8c179] font-mono opacity-80 cursor-not-allowed"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-[#d1c5b4] block">Free Transit Threshold (PKR)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })
                }
                className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pakistan Salon Addresses & Concierge */}
        <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-6 rounded space-y-4">
          <h3 className="text-sm font-semibold text-[#e5e2e1] pb-2 border-b border-[#201f1f]">
            2. Pakistan Salon Concierge Contact Protocols
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-[#d1c5b4] block">Concierge Telephone Desk</label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-[#d1c5b4] block">Concierge Formal Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] uppercase text-[#d1c5b4] block">Karachi Viewing Salon</label>
              <input
                type="text"
                value={settings.salonAddressKarachi}
                onChange={(e) => setSettings({ ...settings, salonAddressKarachi: e.target.value })}
                className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] uppercase text-[#d1c5b4] block">Lahore Viewing Salon</label>
              <input
                type="text"
                value={settings.salonAddressLahore}
                onChange={(e) => setSettings({ ...settings, salonAddressLahore: e.target.value })}
                className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] uppercase text-[#d1c5b4] block">Islamabad Viewing Salon</label>
              <input
                type="text"
                value={settings.salonAddressIslamabad}
                onChange={(e) => setSettings({ ...settings, salonAddressIslamabad: e.target.value })}
                className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#b89552] text-[#432e00] font-semibold rounded hover:bg-[#e8c179] transition-colors"
          >
            Save Directoire Settings
          </button>
        </div>
      </form>
    </div>
  );
}
