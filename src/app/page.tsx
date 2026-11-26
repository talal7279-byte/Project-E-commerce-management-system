"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import ProductCard from "../components/ProductCard";
import { getActiveProducts, addToCart, toggleWishlist, getWishlist } from "../lib/store";
import { INITIAL_PRODUCTS, AURA_WORLDS } from "../lib/data";
import { formatPKR } from "../lib/utils";
import { Product } from "../types";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(
    INITIAL_PRODUCTS.filter((p) => p.status === "active")
  );
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const loadData = () => {
    setProducts(getActiveProducts());
    setWishlist(getWishlist());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("la_verno_storage_changed", loadData);
    return () => window.removeEventListener("la_verno_storage_changed", loadData);
  }, []);

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

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const obsidianWorldProducts = products.filter((p) => p.aura === "obsidian").slice(0, 3);
  const emeraldWorldProducts = products.filter((p) => p.aura === "emerald").slice(0, 3);
  const rubyWorldProducts = products.filter((p) => p.aura === "ruby").slice(0, 3);

  const obsidianWatch = products.find((p) => p.id === "prod-watch-obsidian") || products[0];
  const cedarPerfume = products.find((p) => p.id === "prod-perfume-cedar") || products[0];

  const categories = [
    {
      name: "Watches",
      slug: "watches",
      subtitle: "Obsidian & Metal Precision",
      image: "/images/products/watch-obsidian.jpg",
    },
    {
      name: "Ties",
      slug: "ties",
      subtitle: "Woven Silk Textures",
      image: "/images/products/tie-cedar-noir.jpg",
    },
    {
      name: "Cufflinks",
      slug: "cufflinks",
      subtitle: "Onyx, Rhodium & Garnet",
      image: "/images/products/cufflinks-obsidian-gold.jpg",
    },
    {
      name: "Perfumes",
      slug: "perfumes",
      subtitle: "Sculptural Extraits",
      image: "/images/products/perfume-emerald-veil.jpg",
    },
  ];

  const elementalThemes = [
    {
      code: "VINE",
      slug: "vine",
      desc: "Botanical green depths, crushed leaves & emerald satin luminescence.",
      image: "/images/products/tie-emerald-vine.jpg",
    },
    {
      code: "CIGAR & CEDAR",
      slug: "cigar-and-cedar",
      desc: "Dark cedar wood grain, aged saddle leather & warm antique brass.",
      image: "/images/products/watch-cigar-cedar.jpg",
    },
    {
      code: "FROST",
      slug: "frost",
      desc: "Cold winter light, brushed silver bevels & icy slate reflections.",
      image: "/images/products/cufflinks-frostline.jpg",
    },
    {
      code: "SNOW",
      slug: "snow",
      desc: "Hushed winter air, soft porcelain ivory & restrained minimalism.",
      image: "/images/products/perfume-snow-mist.jpg",
    },
    {
      code: "FIRE",
      slug: "fire",
      desc: "Burnished amber heat, faceted ruby garnet & liquid crimson glow.",
      image: "/images/products/perfume-ruby-ember.jpg",
    },
    {
      code: "WOOD",
      slug: "cigar-and-cedar",
      desc: "Natural walnut grain, timeless tactile surfaces & warm chiaroscuro.",
      image: "/images/products/perfume-atelier.jpg",
    },
  ];

  return (
    <div className="bg-obsidian min-h-screen flex flex-col text-warm-ivory font-jost">
      <Header />

      {/* Acquisition Toast */}
      {addedItem && (
        <div className="fixed bottom-8 right-8 z-50 bg-obsidian-surface/95 backdrop-blur-md border border-antique-gold/60 px-6 py-4 shadow-2xl flex items-center space-x-3 text-sm animate-hero-reveal">
          <span className="w-2 h-2 rounded-full bg-antique-gold"></span>
          <span>
            Added to Bag: <strong className="text-antique-gold font-medium">{addedItem}</strong>
          </span>
          <Link
            href="/cart"
            className="underline text-antique-gold hover:text-antique-gold-light ml-2 text-xs uppercase tracking-wider"
          >
            View Bag
          </Link>
        </div>
      )}

      <main className="w-full">
        {/* 1. CINEMATIC HERO — THEME A: OBSIDIAN BLACK */}
        <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-obsidian px-6 sm:px-12 lg:px-20 pt-32 pb-12">
          {/* Drifting Flowing Black Silk Reference Layer */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              alt="Obsidian black flowing silk atmosphere"
              src={AURA_WORLDS.obsidian.bgImage}
              className="w-full h-full object-cover object-center opacity-70 filter brightness-75 contrast-110 animate-aura-drift"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-[#090909]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,149,82,0.06)_0%,rgba(9,9,9,0.75)_72%)]"></div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto py-12">
            {/* Standalone V Monogram */}
            <div className="animate-hero-reveal mb-6">
              <div className="w-16 h-16 mx-auto rounded-full border border-antique-gold/35 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <span className="font-cormorant text-4xl font-light text-antique-gold translate-y-[-1px]">
                  V
                </span>
              </div>
            </div>

            <p className="animate-hero-reveal-delay-1 text-[10px] sm:text-[11px] tracking-[0.44em] uppercase text-antique-gold font-light mb-5">
              LA VER’nO • WAYS OF MEN
            </p>

            <h1 className="animate-hero-reveal-delay-1 font-cormorant font-light text-4xl sm:text-6xl md:text-7xl lg:text-[84px] leading-[1.06] tracking-[0.05em] uppercase text-warm-ivory mb-6">
              Objects Carved in <br className="hidden sm:inline" />
              <span className="italic font-light text-antique-gold-light lowercase text-5xl sm:text-7xl md:text-8xl">
                shadow
              </span>{" "}
              &amp; Atmosphere
            </h1>

            <p className="animate-hero-reveal-delay-2 text-[14px] sm:text-[16px] text-ivory-muted font-light max-w-xl mx-auto leading-[1.85] mb-10">
              An intimate house of mechanical watches, woven silk ties, sculpted cufflinks, and luminous perfumes composed across Obsidian Black, Royal Emerald, and Ruby Crimson.
            </p>

            <div className="animate-hero-reveal-delay-3 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/shop"
                className="px-11 py-4 border border-antique-gold bg-black/40 text-antique-gold hover:bg-antique-gold hover:text-obsidian text-[11px] tracking-[0.26em] uppercase font-normal transition-all duration-500"
              >
                Discover the Collection
              </Link>
              <Link
                href="#worlds"
                className="text-[11px] tracking-[0.24em] uppercase text-warm-ivory/75 hover:text-antique-gold border-b border-white/20 hover:border-antique-gold pb-1 transition-all duration-300"
              >
                Enter the Elemental Worlds
              </Link>
            </div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full pt-8 flex flex-col sm:flex-row items-center justify-between text-[9px] uppercase tracking-[0.28em] text-ivory-muted/65 border-t border-white/10 gap-3">
            <span>WATCHES • TIES • CUFFLINKS • PERFUMES</span>
            <span className="font-cormorant italic text-antique-gold text-sm tracking-widest lowercase">
              quiet authority in silk, metal &amp; scent
            </span>
            <span>KARACHI • LAHORE • ISLAMABAD</span>
          </div>
        </section>

        {/* 2. BRAND PHILOSOPHY — OBSIDIAN MANIFESTO */}
        <section className="w-full py-28 md:py-36 bg-obsidian border-t border-hairline">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20">
            <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="lg:col-span-6 space-y-7">
                <p className="text-[10px] tracking-[0.34em] uppercase text-antique-gold font-light">
                  HOUSE PHILOSOPHY • THE AURA CODE
                </p>
                <h2 className="font-cormorant font-light text-3xl sm:text-5xl leading-[1.15] text-warm-ivory">
                  Not Mere Objects, <br />
                  <span className="italic text-antique-gold-light">Atmospheres Worn Close</span>
                </h2>
                <div className="w-12 h-px bg-antique-gold/40"></div>
                <p className="text-[15px] text-ivory-muted font-light leading-[1.85]">
                  Every creation within LA VER’nO originates in mood before form. Whether the silent steel discipline of Obsidian Black, the luminous satin depth of Royal Emerald, or the ember-lit warmth of Ruby Crimson, each piece anchors the gentleman’s presence without noise.
                </p>
                <blockquote className="border-l border-antique-gold/50 pl-6 py-1 italic font-cormorant text-xl text-warm-ivory/90">
                  “Luxury is the calm dialogue between shadow, texture, and restraint.”
                </blockquote>
              </div>

              {obsidianWatch && (
                <div className="lg:col-span-6 relative group overflow-hidden border border-hairline bg-obsidian-surface">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={obsidianWatch.images[0]}
                      alt={obsidianWatch.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                  </div>
                  <div className="p-6 border-t border-hairline flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.26em] text-antique-gold">
                        WATCHES • {obsidianWatch.elementalTheme}
                      </p>
                      <h3 className="font-cormorant text-2xl text-warm-ivory">{obsidianWatch.name}</h3>
                    </div>
                    <Link
                      href={`/products/${obsidianWatch.slug}`}
                      className="text-[10px] uppercase tracking-[0.22em] text-antique-gold border-b border-antique-gold/40 pb-1 hover:border-antique-gold whitespace-nowrap"
                    >
                      Read Story →
                    </Link>
                  </div>
                </div>
              )}
            </Reveal>
          </div>
        </section>

        {/* 3. FOUR SIGNATURE CATEGORIES */}
        <section className="w-full py-24 md:py-32 bg-obsidian-surface border-t border-hairline">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
            <Reveal className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <p className="text-[10px] tracking-[0.34em] uppercase text-antique-gold font-light">
                FOUR DISCIPLINES
              </p>
              <h2 className="font-cormorant font-light text-4xl sm:text-5xl text-warm-ivory">
                The House Pillars
              </h2>
              <div className="w-12 h-px bg-antique-gold/40 mx-auto"></div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((cat, idx) => (
                <Reveal key={cat.slug} delayMs={idx * 90}>
                  <Link
                    href={`/collections/${cat.slug}`}
                    className="group block border border-hairline bg-obsidian overflow-hidden hover:border-antique-gold/50 transition-all duration-500"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6 space-y-1">
                        <p className="text-[9px] uppercase tracking-[0.26em] text-antique-gold font-light">
                          {cat.subtitle}
                        </p>
                        <h3 className="font-cormorant text-3xl text-warm-ivory font-light group-hover:text-antique-gold transition-colors">
                          {cat.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 4. FEATURED COLLECTION GRID */}
        <section className="w-full py-24 md:py-32 bg-obsidian border-t border-hairline">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
            <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 pb-6 border-b border-hairline">
              <div>
                <p className="text-[10px] tracking-[0.34em] uppercase text-antique-gold font-light mb-2">
                  SIGNATURE SELECTION
                </p>
                <h2 className="font-cormorant font-light text-3xl sm:text-5xl text-warm-ivory">
                  Featured Collection
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-[11px] tracking-[0.24em] uppercase text-antique-gold border-b border-antique-gold/40 hover:border-antique-gold pb-1 transition-all self-start sm:self-auto"
              >
                Explore All Objects →
              </Link>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((p, idx) => (
                <Reveal key={p.id} delayMs={idx * 70}>
                  <ProductCard
                    product={p}
                    surfaceWorld="obsidian"
                    isWishlisted={wishlist.includes(p.id)}
                    onToggleWishlist={handleWishlistToggle}
                    onQuickAdd={handleQuickAdd}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 5. THREE ELEMENTAL WORLDS — STRICTLY SEPARATE VISUAL ENVIRONMENTS */}
        <div id="worlds">
          {/* WORLD A: OBSIDIAN BLACK */}
          <section className="relative w-full py-28 md:py-36 bg-obsidian overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-35 overflow-hidden pointer-events-none">
              <img
                src={AURA_WORLDS.obsidian.bgImage}
                alt="Obsidian black silk environment"
                className="w-full h-full object-cover animate-aura-drift"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#090909] via-transparent to-[#090909]"></div>
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 space-y-14">
              <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
                <div className="space-y-3 max-w-xl">
                  <p className="text-[10px] tracking-[0.34em] uppercase text-antique-gold">
                    WORLD I • OBSIDIAN BLACK
                  </p>
                  <h2 className="font-cormorant font-light text-4xl sm:text-5xl text-warm-ivory">
                    Shadow, Stone &amp; Steel Discipline
                  </h2>
                  <p className="text-sm text-ivory-muted font-light leading-relaxed">
                    {AURA_WORLDS.obsidian.description}
                  </p>
                </div>
                <Link
                  href="/collections/obsidian-world"
                  className="text-[11px] uppercase tracking-[0.24em] text-antique-gold border border-antique-gold/50 px-6 py-3 hover:bg-antique-gold hover:text-obsidian transition-all self-start lg:self-auto"
                >
                  Enter Obsidian World
                </Link>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {obsidianWorldProducts.map((p, idx) => (
                  <Reveal key={p.id} delayMs={idx * 80}>
                    <ProductCard
                      product={p}
                      surfaceWorld="obsidian"
                      isWishlisted={wishlist.includes(p.id)}
                      onToggleWishlist={handleWishlistToggle}
                      onQuickAdd={handleQuickAdd}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Subtle Transition Seam: Obsidian -> Royal Emerald */}
          <div className="w-full h-24 bg-gradient-to-b from-[#090909] to-[#041F17]"></div>

          {/* WORLD B: ROYAL EMERALD */}
          <section className="relative w-full py-28 md:py-36 bg-emerald-deep overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-45 overflow-hidden pointer-events-none">
              <img
                src={AURA_WORLDS.emerald.bgImage}
                alt="Royal emerald flowing satin environment"
                className="w-full h-full object-cover animate-aura-drift"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#041F17] via-transparent to-[#041F17]"></div>
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 space-y-14">
              <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-emerald-jade/30 pb-8">
                <div className="space-y-3 max-w-xl">
                  <p className="text-[10px] tracking-[0.34em] uppercase text-antique-gold">
                    WORLD II • ROYAL EMERALD
                  </p>
                  <h2 className="font-cormorant font-light text-4xl sm:text-5xl text-warm-ivory">
                    Flowing Satin &amp; Botanical VINE Depth
                  </h2>
                  <p className="text-sm text-warm-ivory/80 font-light leading-relaxed">
                    {AURA_WORLDS.emerald.description}
                  </p>
                </div>
                <Link
                  href="/collections/royal-emerald"
                  className="text-[11px] uppercase tracking-[0.24em] text-antique-gold border border-antique-gold/60 bg-emerald-deep/70 px-6 py-3 hover:bg-antique-gold hover:text-obsidian transition-all self-start lg:self-auto"
                >
                  Enter Emerald World
                </Link>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {emeraldWorldProducts.map((p, idx) => (
                  <Reveal key={p.id} delayMs={idx * 80}>
                    <ProductCard
                      product={p}
                      surfaceWorld="emerald"
                      isWishlisted={wishlist.includes(p.id)}
                      onToggleWishlist={handleWishlistToggle}
                      onQuickAdd={handleQuickAdd}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Subtle Transition Seam: Royal Emerald -> Ruby Crimson */}
          <div className="w-full h-24 bg-gradient-to-b from-[#041F17] to-[#1B050B]"></div>

          {/* WORLD C: RUBY CRIMSON */}
          <section className="relative w-full py-28 md:py-36 bg-ruby-deep overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-45 overflow-hidden pointer-events-none">
              <img
                src={AURA_WORLDS.ruby.bgImage}
                alt="Ruby crimson liquid light environment"
                className="w-full h-full object-cover animate-aura-drift"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#1B050B] via-transparent to-[#1B050B]"></div>
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 space-y-14">
              <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-ruby-crimson/40 pb-8">
                <div className="space-y-3 max-w-xl">
                  <p className="text-[10px] tracking-[0.34em] uppercase text-antique-gold">
                    WORLD III • RUBY CRIMSON
                  </p>
                  <h2 className="font-cormorant font-light text-4xl sm:text-5xl text-warm-ivory">
                    Ember Warmth &amp; Liquid Reflections
                  </h2>
                  <p className="text-sm text-warm-ivory/80 font-light leading-relaxed">
                    {AURA_WORLDS.ruby.description}
                  </p>
                </div>
                <Link
                  href="/collections/ruby-crimson"
                  className="text-[11px] uppercase tracking-[0.24em] text-antique-gold border border-antique-gold/60 bg-ruby-deep/70 px-6 py-3 hover:bg-antique-gold hover:text-obsidian transition-all self-start lg:self-auto"
                >
                  Enter Ruby World
                </Link>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {rubyWorldProducts.map((p, idx) => (
                  <Reveal key={p.id} delayMs={idx * 80}>
                    <ProductCard
                      product={p}
                      surfaceWorld="ruby"
                      isWishlisted={wishlist.includes(p.id)}
                      onToggleWishlist={handleWishlistToggle}
                      onQuickAdd={handleQuickAdd}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Subtle Transition Seam: Ruby Crimson -> Obsidian */}
          <div className="w-full h-24 bg-gradient-to-b from-[#1B050B] to-[#090909]"></div>
        </div>

        {/* 6. ELEMENTAL STORYTELLING THEMES */}
        <section className="w-full py-24 md:py-32 bg-obsidian border-b border-hairline">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
            <Reveal className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <p className="text-[10px] tracking-[0.34em] uppercase text-antique-gold font-light">
                ELEMENTAL INSPIRATION
              </p>
              <h2 className="font-cormorant font-light text-4xl sm:text-5xl text-warm-ivory">
                Stories in Material &amp; Atmosphere
              </h2>
              <div className="w-12 h-px bg-antique-gold/40 mx-auto"></div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {elementalThemes.map((t, idx) => (
                <Reveal key={t.code} delayMs={idx * 70}>
                  <Link
                    href={`/collections/${t.slug}`}
                    className="group border border-hairline bg-obsidian-surface overflow-hidden flex flex-col justify-between hover:border-antique-gold/50 transition-all duration-500 h-full"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={t.image}
                        alt={t.code}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      <span className="absolute bottom-4 left-5 font-cormorant text-2xl tracking-[0.14em] text-antique-gold">
                        {t.code}
                      </span>
                    </div>
                    <div className="p-6 space-y-2">
                      <p className="text-[13px] text-ivory-muted font-light leading-relaxed">{t.desc}</p>
                      <span className="inline-block text-[10px] uppercase tracking-[0.22em] text-antique-gold pt-2">
                        Explore {t.code} →
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 7. SIGNATURE NARRATIVE CAMPAIGN SPOTLIGHT */}
        {cedarPerfume && (
          <section className="w-full py-28 md:py-36 bg-obsidian-surface border-b border-hairline">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20">
              <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                <div className="lg:col-span-7 relative overflow-hidden border border-hairline bg-obsidian">
                  <div className="aspect-[16/11] overflow-hidden">
                    <img
                      src={cedarPerfume.images[0]}
                      alt={cedarPerfume.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                    />
                  </div>
                </div>
                <div className="lg:col-span-5 space-y-7">
                  <div className="space-y-2">
                    <p className="text-[10px] tracking-[0.34em] uppercase text-antique-gold font-light">
                      CIGAR &amp; CEDAR • CAMPAIGN DOSSIER
                    </p>
                    <h2 className="font-cormorant font-light text-4xl sm:text-5xl text-warm-ivory leading-[1.12]">
                      {cedarPerfume.name}
                    </h2>
                  </div>
                  <p className="text-[15px] text-ivory-muted font-light leading-[1.85]">
                    {cedarPerfume.story.narrative}
                  </p>
                  <div className="pt-4 border-t border-hairline flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-ivory-muted">
                      Demo Allocation
                    </span>
                    <span className="font-mono text-base text-antique-gold">
                      {formatPKR(cedarPerfume.price)}
                    </span>
                  </div>
                  <div>
                    <Link
                      href={`/products/${cedarPerfume.slug}`}
                      className="inline-block px-9 py-3.5 bg-antique-gold text-obsidian text-[11px] tracking-[0.24em] uppercase font-medium hover:bg-antique-gold-light transition-colors"
                    >
                      Read Scent Story
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* 8. CLOSING BRAND STATEMENT & SALON PRIVÉ */}
        <section className="w-full py-28 md:py-36 bg-obsidian text-center px-6" id="salon-prive">
          <Reveal className="max-w-3xl mx-auto space-y-8">
            <span className="font-cormorant text-5xl text-antique-gold font-light block">V</span>
            <p className="text-[10px] tracking-[0.38em] uppercase text-antique-gold font-light">
              LA VER’nO • WAYS OF MEN
            </p>
            <h2 className="font-cormorant font-light text-3xl sm:text-5xl text-warm-ivory leading-[1.2]">
              A Private World of Watches, Silks, Metalwork &amp; Extraits
            </h2>
            <p className="text-[14px] text-ivory-muted font-light leading-[1.85] max-w-xl mx-auto">
              Visit our appointment suites across Karachi, Lahore, and Islamabad for private fragrance discovery and wristwatch viewings.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
              <Link
                href="/shop"
                className="px-10 py-3.5 border border-antique-gold text-antique-gold hover:bg-antique-gold hover:text-obsidian text-[11px] tracking-[0.24em] uppercase transition-all"
              >
                Explore Complete Archive
              </Link>
              <Link
                href="/account"
                className="px-10 py-3.5 bg-antique-gold text-obsidian hover:bg-antique-gold-light text-[11px] tracking-[0.24em] uppercase font-medium transition-all"
              >
                Request Salon Viewing
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
