"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { getActiveProducts, addToCart, toggleWishlist, getWishlist } from "../../lib/store";
import { Product } from "../../types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const loadData = () => {
    setProducts(getActiveProducts());
    setWishlist(getWishlist());
  };

  useEffect(() => {
    loadData();
    if (typeof window !== "undefined") {
      const qParam = new URLSearchParams(window.location.search).get("q");
      if (qParam) setQuery(qParam);
    }
    window.addEventListener("la_verno_storage_changed", loadData);
    return () => window.removeEventListener("la_verno_storage_changed", loadData);
  }, []);

  const hasSearched = query.trim().length > 0;
  const q = query.trim().toLowerCase();

  const results = hasSearched
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.collectionName.toLowerCase().includes(q) ||
          p.elementalTheme.toLowerCase().includes(q) ||
          p.aura.toLowerCase().includes(q) ||
          p.collections.some((c) => c.toLowerCase().includes(q)) ||
          p.colors.some((c) => c.toLowerCase().includes(q)) ||
          p.material.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q)
      )
    : [];

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (p.stock <= 0) return;
    addToCart(p, 1);
    setAddedItem(p.name);
    setTimeout(() => setAddedItem(null), 3000);
  };

  const handleWishlistToggle = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(toggleWishlist(id));
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
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <p className="text-[10px] tracking-[0.32em] uppercase text-antique-gold font-light">
              CATALOGUE SEARCH
            </p>
            <h1 className="font-cormorant font-light text-4xl sm:text-5xl text-warm-ivory">
              Archive Query
            </h1>
            <div className="w-12 h-px bg-antique-gold/40 mx-auto"></div>

            {/* Search Input */}
            <div className="pt-4 max-w-xl mx-auto relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-antique-gold text-2xl">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search obsidian watch, emerald veil, cedar tie, frost cufflinks..."
                className="w-full bg-obsidian-surface border border-hairline pl-14 pr-6 py-4 text-warm-ivory text-sm placeholder:text-ivory-muted/40 focus:outline-none focus:border-antique-gold"
                autoFocus
              />
            </div>

            {!hasSearched && (
              <div className="flex flex-wrap justify-center gap-2 pt-3">
                {[
                  "Obsidian Watch",
                  "Emerald Veil",
                  "Crimson Ember",
                  "Frostline",
                  "Silk Tie",
                  "Cigar & Cedar",
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-[11px] px-3.5 py-1.5 border border-hairline bg-obsidian-surface text-ivory-muted hover:text-antique-gold hover:border-antique-gold transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zero Results State */}
          {hasSearched && results.length === 0 && (
            <div className="max-w-xl mx-auto text-center py-20 px-8 border border-hairline bg-obsidian-surface/60 space-y-5">
              <span className="material-symbols-outlined text-4xl text-antique-gold">manage_search</span>
              <h2 className="font-cormorant text-3xl text-warm-ivory">Zero Results in Archive</h2>
              <p className="text-sm text-ivory-muted font-light leading-relaxed">
                The query “{query}” yielded no matching objects in our active watches, ties, cufflinks, or perfumes archive.
              </p>
              <div className="pt-3 flex justify-center gap-4">
                <button
                  onClick={() => setQuery("")}
                  className="px-8 py-3 border border-antique-gold text-antique-gold text-[11px] tracking-[0.2em] uppercase hover:bg-antique-gold hover:text-obsidian transition-colors cursor-pointer"
                >
                  Clear Query
                </button>
                <Link
                  href="/shop"
                  className="px-8 py-3 bg-antique-gold text-obsidian text-[11px] tracking-[0.2em] uppercase font-medium"
                >
                  Browse Full Catalogue
                </Link>
              </div>
            </div>
          )}

          {/* Results Grid */}
          {results.length > 0 && (
            <div className="space-y-6">
              <p className="text-xs text-ivory-muted font-mono">
                Found {results.length} matching {results.length === 1 ? "piece" : "pieces"} for “{query}”
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {results.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isWishlisted={wishlist.includes(p.id)}
                    onToggleWishlist={handleWishlistToggle}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
