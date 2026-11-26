"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";
import { getCollections, getActiveProducts } from "../../lib/store";
import { INITIAL_COLLECTIONS, INITIAL_PRODUCTS, AURA_WORLDS } from "../../lib/data";
import { CollectionRecord, Product } from "../../types";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionRecord[]>(INITIAL_COLLECTIONS);
  const [products, setProducts] = useState<Product[]>(
    INITIAL_PRODUCTS.filter((p) => p.status === "active")
  );

  const loadData = () => {
    setCollections(getCollections());
    setProducts(getActiveProducts());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("la_verno_storage_changed", loadData);
    return () => window.removeEventListener("la_verno_storage_changed", loadData);
  }, []);

  const countFor = (c: CollectionRecord) => {
    if (c.filterType === "category") {
      return products.filter((p) => p.category.toLowerCase() === c.filterValue.toLowerCase()).length;
    }
    if (c.filterType === "theme") {
      return products.filter((p) => p.elementalTheme.toLowerCase() === c.filterValue.toLowerCase()).length;
    }
    return products.filter((p) =>
      p.collections.some((col) => col.toLowerCase() === c.filterValue.toLowerCase())
    ).length;
  };

  const departmentCollections = collections.filter((c) => c.filterType === "category");
  const elementalCollections = collections.filter((c) => c.filterType === "theme");

  return (
    <div className="bg-obsidian min-h-screen flex flex-col text-warm-ivory font-jost">
      <Header />

      <main className="w-full pt-32 pb-32 flex-1">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 space-y-24">
          <div className="text-center max-w-2xl mx-auto space-y-4 animate-hero-reveal">
            <p className="text-[10px] tracking-[0.34em] uppercase text-antique-gold font-light">
              AURA WORLDS &amp; DISCIPLINES
            </p>
            <h1 className="font-cormorant font-light text-4xl sm:text-6xl text-warm-ivory">
              The House Collections
            </h1>
            <div className="w-12 h-px bg-antique-gold/40 mx-auto"></div>
            <p className="text-sm text-ivory-muted font-light leading-relaxed">
              Navigate our three atmospheric color worlds, four craft categories, and six elemental inspirations.
            </p>
          </div>

          {/* Three Aura Worlds */}
          <section className="space-y-8">
            <div className="border-b border-hairline pb-4 flex items-baseline justify-between">
              <h2 className="font-cormorant text-3xl text-warm-ivory font-light">Three Visual Worlds</h2>
              <span className="text-[10px] uppercase tracking-[0.22em] text-antique-gold">
                Obsidian • Emerald • Ruby
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { world: AURA_WORLDS.obsidian, slug: "obsidian-world" },
                { world: AURA_WORLDS.emerald, slug: "royal-emerald" },
                { world: AURA_WORLDS.ruby, slug: "ruby-crimson" },
              ].map(({ world, slug }, idx) => (
                <Reveal key={world.id} delayMs={idx * 90}>
                  <Link
                    href={`/collections/${slug}`}
                    className="group relative block border border-hairline overflow-hidden h-[420px] flex flex-col justify-end p-8 hover:border-antique-gold/60 transition-all"
                  >
                    <img
                      src={world.bgImage}
                      alt={world.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent"></div>
                    <div className="relative z-10 space-y-2">
                      <p className="text-[9px] uppercase tracking-[0.26em] text-antique-gold">
                        {world.subtitle}
                      </p>
                      <h3 className="font-cormorant text-3xl text-warm-ivory font-light group-hover:text-antique-gold transition-colors">
                        {world.name}
                      </h3>
                      <p className="text-xs text-ivory-muted font-light leading-relaxed line-clamp-2">
                        {world.description}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Four Categories */}
          <section className="space-y-8">
            <div className="border-b border-hairline pb-4 flex items-baseline justify-between">
              <h2 className="font-cormorant text-3xl text-warm-ivory font-light">Four Categories</h2>
              <span className="text-[10px] uppercase tracking-[0.22em] text-antique-gold">
                Watches · Ties · Cufflinks · Perfumes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {departmentCollections.map((c, idx) => (
                <Reveal key={c.id} delayMs={idx * 70}>
                  <Link
                    href={`/collections/${c.slug}`}
                    className="group border border-hairline bg-obsidian-surface overflow-hidden flex flex-col justify-between hover:border-antique-gold/50 transition-all h-full"
                  >
                    <div>
                      <div className="relative aspect-[4/5] overflow-hidden bg-obsidian">
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.2em] bg-obsidian/90 px-3 py-1 text-antique-gold border border-hairline font-mono">
                          {countFor(c)} Pieces
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <p className="text-[9px] uppercase tracking-[0.24em] text-antique-gold">{c.subtitle}</p>
                        <h3 className="font-cormorant text-2xl text-warm-ivory group-hover:text-antique-gold transition-colors font-light">
                          {c.name}
                        </h3>
                        <p className="text-xs text-ivory-muted font-light line-clamp-2">{c.description}</p>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Elemental Themes */}
          <section className="space-y-8">
            <div className="border-b border-hairline pb-4 flex items-baseline justify-between">
              <h2 className="font-cormorant text-3xl text-warm-ivory font-light">Elemental Inspirations</h2>
              <span className="text-[10px] uppercase tracking-[0.22em] text-antique-gold">
                Storytelling Series
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {elementalCollections.map((c, idx) => (
                <Reveal key={c.id} delayMs={idx * 70}>
                  <Link
                    href={`/collections/${c.slug}`}
                    className="group border border-hairline bg-obsidian-surface overflow-hidden flex flex-col justify-between hover:border-antique-gold/50 transition-all h-full"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-obsidian">
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.2em] bg-obsidian/90 px-3 py-1 text-antique-gold border border-hairline font-mono">
                          {countFor(c)} Objects
                        </span>
                      </div>
                      <div className="p-6 space-y-2">
                        <p className="text-[9px] uppercase tracking-[0.24em] text-antique-gold">{c.subtitle}</p>
                        <h3 className="font-cormorant text-2xl text-warm-ivory group-hover:text-antique-gold transition-colors font-light">
                          {c.name}
                        </h3>
                        <p className="text-xs text-ivory-muted font-light leading-relaxed">{c.description}</p>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
