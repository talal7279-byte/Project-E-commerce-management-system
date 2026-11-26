"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getCurrentUser, setCurrentUser, getOrders } from "../../lib/store";
import { formatPKR, formatDate } from "../../lib/utils";
import { CustomerProfile, Order } from "../../types";

export default function AccountPage() {
  const [user, setUser] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [salonBooked, setSalonBooked] = useState(false);
  const [salonForm, setSalonForm] = useState({
    city: "Lahore",
    date: "2026-12-10",
    time: "15:00",
    interest: "Private Timepiece & Fragrance Viewing",
  });

  const [loginForm, setLoginForm] = useState({
    email: "jahangir.tareen@estate.pk",
    name: "Nawabzada Jahangir Tareen"
  });

  useEffect(() => {
    setUser(getCurrentUser());
    setOrders(getOrders());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: CustomerProfile = {
      id: "cust-demo",
      fullName: loginForm.name,
      email: loginForm.email,
      phone: "+92 321 455 7788",
      city: "Lahore",
      tier: "Salon Privé Member",
      registeredDate: new Date().toISOString().split("T")[0],
      kycVerified: true
    };
    setCurrentUser(newUser);
    setUser(newUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
  };

  const handleBookSalon = (e: React.FormEvent) => {
    e.preventDefault();
    setSalonBooked(true);
    setTimeout(() => setSalonBooked(false), 5000);
  };

  return (
    <div className="bg-obsidian min-h-screen flex flex-col text-warm-ivory font-jost">
      <Header />

      <main className="w-full pt-28 pb-32 flex-1">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16">
          {!user ? (
            /* Patron Login / Verification State */
            <div className="max-w-md mx-auto border border-hairline bg-obsidian-surface p-8 sm:p-10 space-y-6">
              <div className="text-center space-y-2">
                <span className="font-cormorant text-4xl text-antique-gold font-light">V</span>
                <h1 className="font-cormorant text-2xl uppercase tracking-[0.15em] text-warm-ivory">
                  Salon Privé Access
                </h1>
                <p className="text-xs text-ivory-muted font-light leading-relaxed">
                  Enter your formal correspondence credentials to view your personal acquisition dossier and salon privileges.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-ivory-muted block">
                    Patron Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={loginForm.name}
                    onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                    className="w-full bg-obsidian border border-hairline px-4 py-2.5 text-xs text-warm-ivory focus:outline-none focus:border-antique-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-ivory-muted block">
                    Registered Formal Email
                  </label>
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full bg-obsidian border border-hairline px-4 py-2.5 text-xs text-warm-ivory focus:outline-none focus:border-antique-gold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-antique-gold text-obsidian text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-antique-gold-light transition-all"
                >
                  Enter Patron Dossier
                </button>
              </form>

              <div className="pt-2 text-center text-[10px] text-ivory-muted/60 uppercase tracking-[0.15em]">
                Demostration Access • Local Verified Session
              </div>
            </div>
          ) : (
            /* LOGGED IN PATRON DOSSIER (Stitch Step 110) */
            <div className="space-y-12">
              {/* Dossier Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-hairline pb-8 gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.25em] text-antique-gold">
                    <span className="w-2 h-2 rounded-full bg-antique-gold"></span>
                    <span>CONFIDENTIAL PATRON DOSSIER</span>
                  </div>
                  <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-warm-ivory">
                    {user.fullName}
                  </h1>
                  <p className="text-xs text-ivory-muted font-light">
                    {user.email} • {user.city}, Pakistan • Member since {formatDate(user.registeredDate)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[11px] uppercase tracking-[0.2em] px-3.5 py-1.5 border border-antique-gold text-antique-gold font-light">
                    {user.tier}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs uppercase tracking-[0.15em] text-ivory-muted hover:text-warm-ivory border border-hairline px-3.5 py-1.5 transition-colors"
                  >
                    Exit Dossier
                  </button>
                </div>
              </div>

              {/* Grid: 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Left: Acquisition Folios & History (8 Cols) */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="border border-hairline bg-obsidian-surface p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-hairline">
                      <h3 className="font-cormorant text-2xl text-warm-ivory font-light">
                        Historical Consignments & Orders
                      </h3>
                      <span className="text-xs text-ivory-muted font-mono">
                        {orders.length} Folios Recorded
                      </span>
                    </div>

                    <div className="space-y-4 divide-y divide-hairline">
                      {orders.map((o) => (
                        <div key={o.id} className="pt-4 first:pt-0 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-mono text-sm text-antique-gold font-medium">
                                #{o.id}
                              </span>
                              <span className="text-xs text-ivory-muted font-light ml-3">
                                {formatDate(o.date)}
                              </span>
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.15em] px-2.5 py-0.5 rounded bg-surface-tint/20 text-surface-tint self-start sm:self-auto font-mono">
                              {o.status}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {o.items.map((item, idx) => (
                              <p key={idx} className="text-xs text-warm-ivory font-light">
                                • {item.name} (x{item.quantity})
                                {item.variants && Object.keys(item.variants).length > 0 && (
                                  <span className="text-ivory-muted ml-2">
                                    [{Object.values(item.variants).join(" · ")}]
                                  </span>
                                )}
                              </p>
                            ))}
                          </div>

                          <div className="flex justify-between items-center text-xs pt-1">
                            <span className="text-ivory-muted">{o.paymentMethod}</span>
                            <span className="font-mono text-antique-gold font-medium">
                              {formatPKR(o.total)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Book Salon & Privileges (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Private Salon Booking Card */}
                  <div className="border border-hairline bg-obsidian-surface p-6 sm:p-8 space-y-5">
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-[0.25em] text-antique-gold">
                        SALON PRIVÉ CONCIERGE
                      </p>
                      <h3 className="font-cormorant text-2xl text-warm-ivory font-light">
                        Request Private Salon Appointment
                      </h3>
                    </div>

                    <p className="text-xs text-ivory-muted font-light leading-relaxed">
                      Reserve a confidential session with a house representative in Karachi, Lahore, or Islamabad.
                    </p>

                    {salonBooked ? (
                      <div className="p-4 border border-antique-gold/60 bg-obsidian text-center space-y-2">
                        <span className="material-symbols-outlined text-2xl text-antique-gold">event_available</span>
                        <p className="text-xs text-warm-ivory">Viewing Appointment Requested</p>
                        <p className="text-[11px] text-ivory-muted font-light">
                          Our concierge desk will confirm your appointment via private call.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleBookSalon} className="space-y-3 pt-2 text-xs font-light">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-ivory-muted block">
                            Preferred Viewing Salon
                          </label>
                          <select
                            value={salonForm.city}
                            onChange={(e) => setSalonForm({ ...salonForm, city: e.target.value })}
                            className="w-full bg-obsidian border border-hairline px-3 py-2 text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
                          >
                            <option value="Karachi">Karachi — Clifton Quarters</option>
                            <option value="Lahore">Lahore — Gulberg Conservatory</option>
                            <option value="Islamabad">Islamabad — Sector F-7 Lounge</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-[0.2em] text-ivory-muted block">
                            Preferred Date
                          </label>
                          <input
                            type="date"
                            value={salonForm.date}
                            onChange={(e) => setSalonForm({ ...salonForm, date: e.target.value })}
                            className="w-full bg-obsidian border border-hairline px-3 py-2 text-warm-ivory focus:outline-none focus:border-antique-gold font-mono"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-antique-gold text-obsidian text-[10px] tracking-[0.22em] uppercase font-medium hover:bg-antique-gold-light transition-all"
                        >
                          Request Viewing Session
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Registered Delivery Residence */}
                  <div className="border border-hairline bg-obsidian-surface/60 p-6 space-y-3 text-xs font-light text-ivory-muted">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-antique-gold font-normal">
                      Verified Armored Delivery Profile
                    </p>
                    <p className="text-warm-ivory font-medium">{user.fullName}</p>
                    <p>Phone: {user.phone}</p>
                    <p>Destination: {user.city}, Pakistan</p>
                    <p className="text-[11px] text-antique-gold">✓ State Bank Escrow Verified</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
