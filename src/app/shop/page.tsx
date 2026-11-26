"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { getActiveProducts, addToCart, toggleWishlist, getWishlist } from "../../lib/store";
import { INITIAL_PRODUCTS, PRODUCT_CATEGORIES, ELEMENTAL_THEMES } from "../../lib/data";
import { Product } from "../../types";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(
    INITIAL_PRODUCTS.filter((p) => p.status === "active")
  );
  const [selectedCategory, setSelectedCategory] = useState("All Objects");
  const [selectedTheme, setSelectedTheme] = useState("All Themes");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [searchFilter, setSearchFilter] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const loadData = () => {
    setProducts(getActiveProducts());
    setWishlist(getWishlist());
  };

  useEffect(() => {
    loadData();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category");
      const theme = params.get("theme");
      if (cat) setSelectedCategory(cat);
      if (theme) setSelectedTheme(theme);
    }
    window.addEventListener("la_verno_storage_changed", loadData);
    return () => window.removeEventListener("la_verno_storage_changed", loadData);
  }, []);

  const handleWishlistToggle = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(toggleWishlist(id));
  };

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (p.stock <= 0) return;
    addToCart(p, 1);
    setAddedItem(p.name);
    setTimeout(() => setAddedItem(null), 3000);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "All Objects" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesTheme =
      selectedTheme === "All Themes"
        ? true
        : selectedTheme === "On Sale"
        ? typeof p.originalPrice === "number" && p.originalPrice > p.price
        : p.elementalTheme.toLowerCase() === selectedTheme.toLowerCase();

    const matchesSearch =
      !searchFilter.trim() ||
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.collectionName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.elementalTheme.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesCategory && matchesTheme && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="bg-obsidian min-h-screen flex flex-col text-warm-ivory font-jost">
      <Header />

      {addedItem && (
        <div className="fixed bottom-8 right-8 z-50 bg-obsidian-surface border border-antique-gold/60 px-6 py-4 shadow-2xl flex items-center space-x-3 text-sm animate-hero-reveal">
          <span className="w-2 h-2 rounded-full bg-antique-gold"></span>
          <span>
            Added to Bag: <strong className="text-antique-gold font-medium">{addedItem}</strong>
          </span>
          <Link href="/cart" className="underline text-antique-gold ml-2 text-xs uppercase">
            View Bag
          </Link>
        </div>
      )}

      <main className="w-full pt-32 pb-32 flex-1">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4 animate-hero-reveal">
            <div className="inline-flex items-center space-x-3 text-[10px] tracking-[0.34em] uppercase text-antique-gold font-light">
              <span className="w-6 h-px bg-antique-gold/40"></span>
              <span>CURATED ARCHIVE • DEMO CATALOGUE IN PKR</span>
              <span className="w-6 h-px bg-antique-gold/40"></span>
            </div>
            <h1 className="font-cormorant font-light text-4xl sm:text-6xl text-warm-ivory">
              The Complete Collection
            </h1>
            <p className="text-[14px] sm:text-[15px] text-ivory-muted font-light leading-relaxed max-w-xl mx-auto">
              Watches, Silk Ties, Cufflinks, and Signature Perfumes across our Obsidian Black, Royal Emerald, and Ruby Crimson visual worlds.
            </p>
          </div>

          {/* Filters */}
          <div className="border-y border-hairline py-6 mb-14 space-y-5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              {["All Objects", ...PRODUCT_CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] uppercase tracking-[0.2em] px-4 py-2 transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-obsidian-surface text-antique-gold border border-antique-gold/50"
                      : "text-ivory-muted hover:text-warm-ivory border border-hairline/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  className="bg-obsidian-surface border border-hairline text-ivory-muted text-[11px] uppercase tracking-[0.15em] px-3.5 py-2 focus:outline-none focus:border-antique-gold cursor-pointer"
                >
                  <option value="All Themes">Theme: All Worlds</option>
                  {ELEMENTAL_THEMES.map((t) => (
                    <option key={t} value={t}>
                      Theme: {t}
                    </option>
                  ))}
                  <option value="On Sale">Offers: On Sale</option>
                </select>

                <span className="text-xs text-ivory-muted font-mono">
                  {sortedProducts.length} Active {sortedProducts.length === 1 ? "Object" : "Objects"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 sm:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ivory-muted text-[17px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Filter watches, perfumes, themes..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full bg-obsidian-surface border border-hairline pl-9 pr-3 py-2 text-xs text-warm-ivory placeholder:text-ivory-muted/40 focus:outline-none focus:border-antique-gold"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-obsidian-surface border border-hairline text-ivory-muted text-[11px] uppercase tracking-[0.15em] px-3 py-2 focus:outline-none focus:border-antique-gold cursor-pointer"
                >
                  <option value="featured">Sort: Curated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid */}
          {sortedProducts.length === 0 ? (
            <div className="py-24 text-center space-y-4 border border-hairline bg-obsidian-surface/30">
              <span className="material-symbols-outlined text-4xl text-antique-gold">search_off</span>
              <h3 className="font-cormorant text-3xl text-warm-ivory">Zero Objects Found</h3>
              <p className="text-sm text-ivory-muted font-light max-w-md mx-auto">
                No pieces match your current theme or category filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All Objects");
                  setSelectedTheme("All Themes");
                  setSearchFilter("");
                }}
                className="mt-4 px-8 py-3 border border-antique-gold text-antique-gold text-[11px] tracking-[0.22em] uppercase hover:bg-antique-gold hover:text-obsidian transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  surfaceWorld="obsidian"
                  isWishlisted={wishlist.includes(p.id)}
                  onToggleWishlist={handleWishlistToggle}
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
