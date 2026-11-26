"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { getActiveProducts, getWishlist, toggleWishlist, addToCart } from "../../lib/store";
import { Product } from "../../types";

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const refreshWishlist = () => {
    const ids = getWishlist();
    setWishlistIds(ids);
    const all = getActiveProducts();
    setWishlistProducts(all.filter((p) => ids.includes(p.id)));
  };

  useEffect(() => {
    refreshWishlist();
    window.addEventListener("la_verno_storage_changed", refreshWishlist);
    return () => window.removeEventListener("la_verno_storage_changed", refreshWishlist);
  }, []);

  const handleToggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
    refreshWishlist();
  };

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (p.stock <= 0) return;
    addToCart(p, 1);
    setAddedItem(p.name);
    setTimeout(() => setAddedItem(null), 3000);
  };

  return (
    <div className="bg-obsidian min-h-screen flex flex-col text-warm-ivory font-jost">
      <Header />

      {addedItem && (
        <div className="fixed bottom-8 right-8 z-50 bg-obsidian-surface border border-antique-gold/60 px-6 py-4 shadow-2xl flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-bottom-4">
          <span className="w-2 h-2 rounded-full bg-antique-gold"></span>
          <span>
            Added to Bag: <strong className="text-antique-gold">{addedItem}</strong>
          </span>
          <Link href="/cart" className="underline text-antique-gold ml-2 text-xs uppercase">
            View Bag
          </Link>
        </div>
      )}

      <main className="w-full pt-28 pb-32 flex-1">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <p className="text-[10px] tracking-[0.32em] uppercase text-antique-gold font-light">
              SAVED SELECTIONS
            </p>
            <h1 className="font-cormorant font-light text-4xl sm:text-5xl text-warm-ivory">
              Patron Wishlist
            </h1>
            <div className="w-12 h-px bg-antique-gold/40 mx-auto"></div>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-20 px-8 border border-hairline bg-obsidian-surface/60 space-y-5">
              <span className="material-symbols-outlined text-4xl text-antique-gold">favorite_border</span>
              <h2 className="font-cormorant text-2xl text-warm-ivory">No Saved Pieces Yet</h2>
              <p className="text-xs text-ivory-muted font-light leading-relaxed">
                Save watches, silk ties, sculpted cufflinks, or signature perfumes to your confidential wishlist while exploring our worlds.
              </p>
              <Link
                href="/shop"
                className="inline-block px-8 py-3 bg-antique-gold text-obsidian text-[10px] uppercase tracking-[0.2em] font-medium"
              >
                Explore Catalogue
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {wishlistProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isWishlisted={wishlistIds.includes(p.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
