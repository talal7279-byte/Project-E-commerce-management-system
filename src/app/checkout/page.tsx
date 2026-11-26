"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  getCart,
  clearCart,
  addOrder,
  validateDiscount,
  getStoreSettings,
} from "../../lib/store";
import { formatPKR } from "../../lib/utils";
import { PAKISTANI_CITIES } from "../../lib/data";
import { CartItem, Order } from "../../types";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [freeShipThreshold, setFreeShipThreshold] = useState(15000);
  const [formData, setFormData] = useState({
    fullName: "Nawabzada Jahangir Tareen",
    email: "jahangir.tareen@estate.pk",
    phone: "+92 321 455 7788",
    city: "Lahore",
    address: "18-A, Zafar Ali Road, Gulberg V",
    postalCode: "54000",
    paymentMethod: "Concierge COD" as Order["paymentMethod"],
    protocolCode: "",
  });

  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountMsg, setDiscountMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setItems(getCart());
    setFreeShipThreshold(getStoreSettings().freeShippingThreshold || 15000);
  }, []);

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal >= freeShipThreshold || subtotal === 0 ? 0 : 500;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyPromo = () => {
    const res = validateDiscount(formData.protocolCode, subtotal);
    setDiscountAmount(res.valid ? res.discountAmount : 0);
    setDiscountMsg(res.message);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your shopping bag is empty.");
      return;
    }

    setIsSubmitting(true);

    const newOrder: Order = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        sku: i.product.sku,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images[0],
        variants: i.selectedVariants,
      })),
      subtotal,
      shipping,
      discount: discountAmount,
      total,
      status: formData.paymentMethod.includes("COD") ? "Dispatched" : "Settled",
      paymentMethod: formData.paymentMethod,
      shippingAddress: {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        address: formData.address,
        postalCode: formData.postalCode,
      },
    };

    setTimeout(() => {
      addOrder(newOrder);
      clearCart();
      router.push(`/order-confirmation/${newOrder.id}`);
    }, 900);
  };

  return (
    <div className="bg-obsidian min-h-screen flex flex-col text-warm-ivory font-jost">
      <Header />

      <main className="w-full pt-28 pb-32 flex-1">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-12 lg:px-16">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
            <p className="text-[10px] tracking-[0.32em] uppercase text-antique-gold font-light">
              DEMO ORDER CHECKOUT
            </p>
            <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-warm-ivory">
              Dispatch & Settlement
            </h1>
            <div className="w-12 h-px bg-antique-gold/40 mx-auto"></div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Form (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Section 1: Contact */}
              <div className="border border-hairline bg-obsidian-surface/60 p-6 sm:p-8 space-y-5">
                <div className="flex items-center space-x-3 pb-3 border-b border-hairline">
                  <span className="font-cormorant text-xl text-antique-gold font-light">01</span>
                  <h3 className="font-cormorant text-2xl text-warm-ivory font-light">
                    Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-ivory-muted block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-obsidian border border-hairline px-4 py-2.5 text-warm-ivory focus:outline-none focus:border-antique-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-ivory-muted block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-obsidian border border-hairline px-4 py-2.5 text-warm-ivory focus:outline-none focus:border-antique-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-ivory-muted block">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-obsidian border border-hairline px-4 py-2.5 text-warm-ivory focus:outline-none focus:border-antique-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pakistan Delivery Address */}
              <div className="border border-hairline bg-obsidian-surface/60 p-6 sm:p-8 space-y-5">
                <div className="flex items-center space-x-3 pb-3 border-b border-hairline">
                  <span className="font-cormorant text-xl text-antique-gold font-light">02</span>
                  <h3 className="font-cormorant text-2xl text-warm-ivory font-light">
                    Pakistan Delivery Address
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-ivory-muted block">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-obsidian border border-hairline px-4 py-2.5 text-warm-ivory focus:outline-none focus:border-antique-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-ivory-muted block">
                      City (Pakistan)
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-obsidian border border-hairline px-4 py-2.5 text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
                    >
                      {PAKISTANI_CITIES.map((c) => (
                        <option key={c} value={c} className="bg-obsidian text-warm-ivory">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-ivory-muted block">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full bg-obsidian border border-hairline px-4 py-2.5 text-warm-ivory focus:outline-none focus:border-antique-gold font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Simulated Payment Selection */}
              <div className="border border-hairline bg-obsidian-surface/60 p-6 sm:p-8 space-y-5">
                <div className="flex items-center space-x-3 pb-3 border-b border-hairline">
                  <span className="font-cormorant text-xl text-antique-gold font-light">03</span>
                  <h3 className="font-cormorant text-2xl text-warm-ivory font-light">
                    Simulated Payment Option
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: "Concierge COD",
                      title: "Cash on Delivery (Pakistan Courier)",
                      desc: "Simulated cash settlement on parcel handover across major Pakistani cities.",
                    },
                    {
                      id: "Online Card (PayFast)",
                      title: "Card Payment Demo (PayFast / Visa / Mastercard)",
                      desc: "Simulated card authorization without external live billing.",
                    },
                    {
                      id: "Bank Transfer (HBL)",
                      title: "Bank Wire / Raast Transfer Demo (HBL)",
                      desc: "Simulated local bank transfer invoice confirmation.",
                    },
                  ].map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                        formData.paymentMethod === p.id
                          ? "border-antique-gold bg-obsidian"
                          : "border-hairline bg-obsidian/40 hover:border-antique-gold/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={p.id}
                        checked={formData.paymentMethod === p.id}
                        onChange={(e) =>
                          setFormData({ ...formData, paymentMethod: e.target.value as any })
                        }
                        className="mt-1 accent-[#B89552]"
                      />
                      <div className="space-y-1">
                        <span className="text-xs uppercase tracking-[0.15em] text-warm-ivory font-medium block">
                          {p.title}
                        </span>
                        <p className="text-[12px] text-ivory-muted font-light leading-relaxed">
                          {p.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Summary (5 Cols) */}
            <div className="lg:col-span-5 border border-hairline bg-obsidian-surface p-6 sm:p-8 space-y-6 sticky top-28">
              <h3 className="font-cormorant text-2xl text-warm-ivory pb-4 border-b border-hairline font-light">
                Order Summary
              </h3>

              <div className="space-y-4 max-h-72 overflow-y-auto divide-y divide-hairline/60">
                {items.map((i, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-obsidian flex-shrink-0 border border-hairline overflow-hidden">
                        <img src={i.product.images[0]} alt={i.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs text-warm-ivory font-light leading-snug">{i.product.name}</p>
                        {i.selectedVariants && (
                          <p className="text-[10px] text-ivory-muted">
                            {Object.values(i.selectedVariants).join(" • ")} • Qty: {i.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-xs text-antique-gold font-medium">
                      {formatPKR(i.product.price * i.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-3 border-t border-hairline space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. PRIVILEGE10)"
                    value={formData.protocolCode}
                    onChange={(e) => setFormData({ ...formData, protocolCode: e.target.value })}
                    className="flex-1 bg-obsidian border border-hairline px-3 py-2 text-xs text-warm-ivory uppercase focus:outline-none focus:border-antique-gold"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 border border-hairline text-xs uppercase tracking-wider text-warm-ivory hover:border-antique-gold cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {discountMsg && (
                  <p className={`text-[11px] ${discountAmount > 0 ? "text-antique-gold" : "text-error"}`}>
                    {discountMsg}
                  </p>
                )}
              </div>

              {/* Calculations */}
              <div className="pt-4 border-t border-hairline space-y-2 text-xs text-ivory-muted font-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-warm-ivory">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Pakistan Courier</span>
                  <span className="font-mono text-warm-ivory">
                    {shipping === 0 ? "Complimentary" : formatPKR(shipping)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-antique-gold">
                    <span>Discount</span>
                    <span className="font-mono">-{formatPKR(discountAmount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-hairline flex justify-between text-sm text-warm-ivory font-normal">
                  <span className="uppercase text-xs tracking-wider">Total Settlement</span>
                  <span className="font-mono text-antique-gold text-lg font-medium">
                    {formatPKR(total)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full py-4 text-center bg-antique-gold text-obsidian text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-antique-gold-light transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Confirming Demo Order..." : "Confirm Demo Order"}
              </button>

              <p className="text-[10px] text-center text-ivory-muted/70">
                Front-end demonstration order saved locally in your browser. No real payment is processed.
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
