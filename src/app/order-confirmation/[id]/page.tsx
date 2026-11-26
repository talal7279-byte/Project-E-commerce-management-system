"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getOrders } from "@/lib/store";
import { formatPKR, formatDate } from "@/lib/utils";
import { Order } from "@/types";

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orders = getOrders();
    const found = orders.find((o) => o.id === params.id) || orders[0];
    setOrder(found);
  }, [params.id]);

  if (!order) {
    return (
      <div className="bg-obsidian min-h-screen text-warm-ivory flex items-center justify-center font-jost">
        <p className="font-cormorant text-2xl text-antique-gold">Retrieving Vault Folio...</p>
      </div>
    );
  }

  return (
    <div className="bg-obsidian min-h-screen flex flex-col text-warm-ivory font-jost">
      <Header />

      <main className="w-full pt-28 pb-32 flex-1">
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          {/* Success Banner */}
          <div className="text-center space-y-4 mb-12">
            <div className="w-16 h-16 rounded-full border border-antique-gold/60 mx-auto flex items-center justify-center text-antique-gold bg-obsidian-surface">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <p className="text-[10px] tracking-[0.32em] uppercase text-antique-gold font-light">
              ACQUISITION CONFIRMED • FOLIO REGISTERED
            </p>
            <h1 className="font-cormorant font-light text-4xl sm:text-5xl text-warm-ivory">
              Dossier Successfully Logged
            </h1>
            <p className="text-sm text-ivory-muted font-light max-w-lg mx-auto leading-relaxed">
              Your commission is recorded in the directoire registry under folio reference{" "}
              <strong className="text-antique-gold font-mono font-medium">{order.id}</strong>.
            </p>
          </div>

          {/* Folio Details Card */}
          <div className="border border-hairline bg-obsidian-surface p-6 sm:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-hairline gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-ivory-muted">Folio Identifier</p>
                <p className="font-mono text-xl text-antique-gold font-medium">{order.id}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-ivory-muted">Date of Registration</p>
                <p className="text-xs text-warm-ivory font-mono">{formatDate(order.date)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-ivory-muted">Settlement Status</p>
                <span className="inline-block mt-1 text-[11px] px-2.5 py-0.5 rounded bg-surface-tint/20 text-surface-tint font-mono">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] text-warm-ivory font-medium">
                Conveyed Masterworks
              </h3>
              <div className="divide-y divide-hairline">
                {order.items.map((i, idx) => (
                  <div key={idx} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-obsidian border border-hairline overflow-hidden flex-shrink-0">
                        <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-cormorant text-lg text-warm-ivory">{i.name}</h4>
                        <p className="text-[11px] text-ivory-muted font-light">
                          {i.variants && Object.keys(i.variants).length > 0
                            ? `${Object.entries(i.variants)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" · ")} · `
                            : ""}
                          Quantity: {i.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-sm text-antique-gold">
                      {formatPKR(i.price * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-hairline flex justify-between items-center text-sm">
              <span className="uppercase text-xs tracking-wider text-ivory-muted">Settlement Valuation</span>
              <span className="font-mono text-xl text-antique-gold font-medium">{formatPKR(order.total)}</span>
            </div>

            {/* Destination & Delivery Protocol */}
            <div className="p-4 border border-hairline bg-obsidian/60 space-y-2 text-xs font-light text-ivory-muted">
              <p className="uppercase text-[10px] tracking-[0.2em] text-antique-gold font-normal">
                Destination & Handover Protocol
              </p>
              <p className="text-warm-ivory font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}</p>
              <p>Contact: {order.shippingAddress.phone}</p>
              <p>Channel: {order.paymentMethod}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/account"
              className="px-8 py-3.5 bg-antique-gold text-obsidian text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-antique-gold-light transition-all"
            >
              View in Patron Dossier
            </Link>
            <Link
              href="/shop"
              className="px-8 py-3.5 border border-hairline text-warm-ivory text-[11px] tracking-[0.22em] uppercase hover:border-antique-gold transition-all"
            >
              Explore Additional Masterworks
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
