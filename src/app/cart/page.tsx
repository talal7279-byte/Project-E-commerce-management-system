"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  validateDiscount,
  getStoreSettings,
} from "../../lib/store";
import { formatPKR } from "../../lib/utils";
import { CartItem } from "../../types";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountMsg, setDiscountMsg] = useState("");
  const [freeShipThreshold, setFreeShipThreshold] = useState(25000);

  const refreshCart = () => {
    setItems(getCart());
    setFreeShipThreshold(getStoreSettings().freeShippingThreshold || 25000);
  };

  useEffect(() => {
    refreshCart();
    window.addEventListener("la_verno_storage_changed", refreshCart);
    return () => window.removeEventListener("la_verno_storage_changed", refreshCart);
  }, []);

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal >= freeShipThreshold || subtotal === 0 ? 0 : 500;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateDiscount(discountCode, subtotal);
    if (res.valid) {
      setDiscountAmount(res.discountAmount);
      setDiscountMsg(res.message);
    } else {
      setDiscountAmount(0);
      setDiscountMsg(res.message);
    }
  };

  return (
    <div className="bg-obsidian min-h-screen flex flex-col text-warm-ivory font-jost">
      <Header />

      <main className="w-full pt-28 pb-32 flex-1">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-[10px] tracking-[0.32em] uppercase text-antique-gold font-light">
              PRIVATE SELECTION
            </p>
            <h1 className="font-cormorant font-light text-4xl sm:text-5xl text-warm-ivory">
              Shopping Bag & Summary
            </h1>
            <div className="w-12 h-px bg-antique-gold/40 mx-auto my-3"></div>
          </div>

          {items.length === 0 ? (
            <div className="max-w-xl mx-auto text-center py-20 px-8 border border-hairline bg-obsidian-surface/60 space-y-6">
              <div className="w-16 h-16 rounded-full border border-hairline mx-auto flex items-center justify-center text-antique-gold">
                <span className="material-symbols-outlined text-2xl">work_outline</span>
              </div>
              <h2 className="font-cormorant text-3xl text-warm-ivory">Your Shopping Bag is Empty</h2>
              <p className="text-[14px] text-ivory-muted font-light leading-relaxed">
                Explore our mechanical watches, Italian-style silk ties, sculpted cufflinks, and elemental extraits de parfum.
              </p>
              <div className="pt-4">
                <Link
                  href="/shop"
                  className="inline-block px-10 py-3.5 bg-antique-gold text-obsidian text-[11px] tracking-[0.24em] uppercase font-medium hover:bg-antique-gold-light transition-all"
                >
                  Explore Full Catalogue
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Item List */}
              <div className="lg:col-span-8 space-y-6">
                <div className="border border-hairline bg-obsidian-surface/40 divide-y divide-hairline">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
                    >
                      <div className="flex gap-5 items-center">
                        <div className="w-20 h-24 bg-obsidian flex-shrink-0 border border-hairline overflow-hidden">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-antique-gold">
                            {item.product.category} • {item.product.sku}
                          </p>
                          <Link href={`/products/${item.product.slug}`}>
                            <h3 className="font-cormorant text-xl text-warm-ivory hover:text-antique-gold transition-colors font-light">
                              {item.product.name}
                            </h3>
                          </Link>
                          {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                            <p className="text-[11px] text-ivory-muted font-light">
                              {Object.entries(item.selectedVariants)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" • ")}
                            </p>
                          )}
                          <p className="font-mono text-sm text-antique-gold">
                            {formatPKR(item.product.price)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity & Line Total */}
                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center border border-hairline bg-obsidian px-2.5 py-1">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity - 1, item.selectedVariants)
                            }
                            className="text-ivory-muted hover:text-antique-gold px-2 text-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs px-3">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity + 1, item.selectedVariants)
                            }
                            className="text-ivory-muted hover:text-antique-gold px-2 text-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-mono text-sm text-warm-ivory font-medium min-w-[100px] text-right">
                          {formatPKR(item.product.price * item.quantity)}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariants)}
                          aria-label="Remove item"
                          className="text-ivory-muted hover:text-error transition-colors p-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs tracking-wider">
                  <Link
                    href="/shop"
                    className="text-antique-gold hover:underline uppercase text-[11px] tracking-[0.2em]"
                  >
                    ← Continue Browsing Catalogue
                  </Link>
                </div>
              </div>

              {/* Settlement Summary */}
              <div className="lg:col-span-4 border border-hairline bg-obsidian-surface p-6 sm:p-8 space-y-6">
                <h3 className="font-cormorant text-2xl text-warm-ivory pb-4 border-b border-hairline font-light">
                  Order Summary
                </h3>

                <div className="space-y-3 text-[13px] text-ivory-muted font-light">
                  <div className="flex justify-between">
                    <span>Subtotal (Demo Retail)</span>
                    <span className="font-mono text-warm-ivory">{formatPKR(subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Insured Pakistan Delivery</span>
                    <span className="font-mono text-warm-ivory">
                      {shipping === 0 ? "Complimentary" : formatPKR(shipping)}
                    </span>
                  </div>

                  {subtotal > 0 && subtotal < freeShipThreshold && (
                    <p className="text-[11px] text-ivory-muted/75">
                      Add {formatPKR(freeShipThreshold - subtotal)} more for complimentary courier delivery.
                    </p>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-antique-gold">
                      <span>Privilege Concession</span>
                      <span className="font-mono">-{formatPKR(discountAmount)}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-hairline flex justify-between text-base text-warm-ivory font-normal">
                    <span className="uppercase text-xs tracking-[0.2em]">Estimated Total</span>
                    <span className="font-mono text-antique-gold text-lg font-medium">
                      {formatPKR(total)}
                    </span>
                  </div>
                </div>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyDiscount} className="space-y-2 pt-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-ivory-muted block">
                    Privilege Code (Demo: PRIVILEGE10 · SALON5K)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. PRIVILEGE10"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 bg-obsidian border border-hairline px-3 py-2 text-xs text-warm-ivory uppercase focus:outline-none focus:border-antique-gold"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 border border-hairline text-xs uppercase tracking-wider text-warm-ivory hover:border-antique-gold hover:text-antique-gold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {discountMsg && (
                    <p className={`text-[11px] ${discountAmount > 0 ? "text-antique-gold" : "text-error"}`}>
                      {discountMsg}
                    </p>
                  )}
                </form>

                {/* Checkout CTA */}
                <div className="pt-4">
                  <Link
                    href="/checkout"
                    className="block w-full py-4 text-center bg-antique-gold text-obsidian text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-antique-gold-light transition-all duration-200"
                  >
                    Proceed to Checkout
                  </Link>
                  <p className="text-[10px] text-center text-ivory-muted/60 uppercase tracking-[0.15em] mt-3">
                    Simulated Demo Checkout • Local Persistence
                  </p>
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
