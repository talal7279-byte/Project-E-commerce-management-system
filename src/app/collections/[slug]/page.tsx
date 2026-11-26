"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ProductCard from "../../../components/ProductCard";
import { getCollections, getActiveProducts, addToCart, toggleWishlist, getWishlist } from "../../../lib/store";
import { INITIAL_COLLECTIONS, INITIAL_PRODUCTS, AURA_WORLDS } from "../../../lib/data";
import { AuraWorld, CollectionRecord, Product } from "../../../types";

function resolveCollection(slug: string, collections: CollectionRecord[]) {
  const clean = decodeURIComponent(slug).toLowerCase();

  if (clean === "obsidian-world") {
    return {
      title: AURA_WORLDS.obsidian.name,
      subtitle: AURA_WORLDS.obsidian.subtitle,
      description: AURA_WORLDS.obsidian.description,
      aura: "obsidian" as AuraWorld,
      matcher: (p: Product) => p.aura === "obsidian",
    };
  }
  if (clean === "royal-emerald") {
    return {
      title: AURA_WORLDS.emerald.name,
      subtitle: AURA_WORLDS.emerald.subtitle,
      description: AURA_WORLDS.emerald.description,
      aura: "emerald" as AuraWorld,
      matcher: (p: Product) => p.aura === "emerald",
    };
  }
  if (clean === "ruby-crimson") {
    return {
      title: AURA_WORLDS.ruby.name,
      subtitle: AURA_WORLDS.ruby.subtitle,
      description: AURA_WORLDS.ruby.description,
      aura: "ruby" as AuraWorld,
      matcher: (p: Product) => p.aura === "ruby",
    };
  }

  const found = collections.find((c) => c.slug.toLowerCase() === clean);
  if (found) {
    return {
      title: found.name,
      subtitle: found.subtitle,
      description: found.description,
      aura: found.aura,
      matcher: (p: Product) =>
        found.filterType === "category"
          ? p.category.toLowerCase() === found.filterValue.toLowerCase()
          : found.filterType === "theme"
          ? p.elementalTheme.toLowerCase() === found.filterValue.toLowerCase()
          : p.collections.some((col) => col.toLowerCase() === found.filterValue.toLowerCase()),
    };
  }

  const label = clean.replace(/-and-/g, " & ").replace(/-/g, " ").toUpperCase();
  return {
    title: label,
    subtitle: "Elemental Curated Edit",
    description: `Curated objects belonging to ${label}.`,
    aura: "obsidian" as AuraWorld,
    matcher: (p: Product) =>
      p.collections.some((c) => c.toLowerCase() === label.toLowerCase()) ||
      p.elementalTheme.toLowerCase() === label.toLowerCase(),
  };
}

export default function CollectionDetailPage({ params }: { params: { slug: string } }) {
  const [collections, setCollections] = useState<CollectionRecord[]>(INITIAL_COLLECTIONS);
  const [products, setProducts] = useState<Product[]>(
    INITIAL_PRODUCTS.filter((p) => p.status === "active")
  );
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const loadData = () => {
    setCollections(getCollections());
    setProducts(getActiveProducts());
    setWishlist(getWishlist());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("la_verno_storage_changed", loadData);
    return () => window.removeEventListener("la_verno_storage_changed", loadData);
  }, []);

  const info = resolveCollection(params.slug, collections);
  const matched = products.filter(info.matcher);
  const sorted = [...matched].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const bgClass =
    info.aura === "emerald"
      ? "bg-emerald-deep"
      : info.aura === "ruby"
      ? "bg-ruby-deep"
      : "bg-obsidian";
  const auraAsset = AURA_WORLDS[info.aura].bgImage;

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
    <div className={`${bgClass} min-h-screen flex flex-col text-warm-ivory font-jost relative`}>
      <Header />

      {/* Atmospheric World Banner Layer */}
      <div className="fixed inset-x-0 top-0 h-[52vh] z-0 pointer-events-none overflow-hidden opacity-45">
        <img src={auraAsset} alt="" className="w-full h-full object-cover animate-aura-drift" />
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/60 via-transparent ${
            info.aura === "emerald"
              ? "to-[#041F17]"
              : info.aura === "ruby"
              ? "to-[#1B050B]"
              : "to-[#090909]"
          }`}
        ></div>
      </div>

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

      <main className="relative z-10 w-full pt-32 pb-32 flex-1">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
          <div className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.25em] text-warm-ivory/65 mb-10">
            <Link href="/" className="hover:text-antique-gold transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-antique-gold transition-colors">
              Collections
            </Link>
            <span>/</span>
            <span className="text-antique-gold">{info.title}</span>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4 animate-hero-reveal">
            <p className="text-[10px] tracking-[0.34em] uppercase text-antique-gold font-light">
              {info.subtitle}
            </p>
            <h1 className="font-cormorant font-light text-4xl sm:text-6xl text-warm-ivory">
              {info.title}
            </h1>
            <div className="w-12 h-px bg-antique-gold/40 mx-auto"></div>
            <p className="text-sm text-warm-ivory/80 font-light leading-relaxed">{info.description}</p>
          </div>

          <div className="border-y border-white/15 py-4 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-warm-ivory/75 font-mono">
              {sorted.length} Active {sorted.length === 1 ? "Object" : "Objects"}
            </span>
            <div className="flex items-center gap-4">
              <Link href="/shop" className="text-[11px] uppercase tracking-[0.2em] hover:text-antique-gold">
                Browse All Objects
              </Link>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-black/50 border border-white/15 text-warm-ivory text-[11px] uppercase tracking-[0.15em] px-3 py-2 focus:outline-none focus:border-antique-gold cursor-pointer"
              >
                <option value="featured" className="bg-obsidian">Sort: Curated</option>
                <option value="price-asc" className="bg-obsidian">Price: Low to High</option>
                <option value="price-desc" className="bg-obsidian">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sorted.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                surfaceWorld={info.aura}
                isWishlisted={wishlist.includes(p.id)}
                onToggleWishlist={handleWishlistToggle}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
