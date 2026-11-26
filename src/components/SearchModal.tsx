"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getActiveProducts } from "../lib/store";
import { formatPKR } from "../lib/utils";
import { Product } from "../types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const products = getActiveProducts();
    const q = query.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.collectionName.toLowerCase().includes(q) ||
        p.elementalTheme.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 px-4 bg-obsidian/92 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-obsidian-surface border border-hairline shadow-2xl p-6 sm:p-8 animate-hero-reveal">
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <div className="flex items-center space-x-3 text-antique-gold">
            <span className="material-symbols-outlined text-2xl">search</span>
            <span className="text-[11px] uppercase tracking-[0.25em] font-medium text-warm-ivory">
              Search Objects &amp; Worlds
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-ivory-muted hover:text-warm-ivory p-1 cursor-pointer"
            aria-label="Close search"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onClose();
            router.push(`/search${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
          }}
          className="my-6 flex gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Obsidian watch, Emerald Veil, Cedar tie, Frostline..."
            className="flex-1 bg-obsidian border border-hairline px-5 py-3.5 text-warm-ivory text-sm placeholder:text-ivory-muted/40 focus:outline-none focus:border-antique-gold font-light"
            autoFocus
          />
          <button
            type="submit"
            className="px-5 py-3.5 bg-antique-gold text-obsidian text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-antique-gold-light transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="max-h-96 overflow-y-auto space-y-3">
          {query.trim() && results.length === 0 && (
            <div className="text-center py-10 space-y-2">
              <p className="font-cormorant text-2xl text-warm-ivory">No Objects Found</p>
              <p className="text-[13px] text-ivory-muted font-light">
                No pieces match “{query}”. Try “OBSIDIAN”, “EMERALD”, “FIRE”, “CEDAR”, or “FROSTLINE”.
              </p>
            </div>
          )}

          {results.slice(0, 8).map((product) => (
            <div
              key={product.id}
              onClick={() => {
                onClose();
                router.push(`/products/${product.slug}`);
              }}
              className="flex items-center gap-4 p-3 border border-hairline bg-obsidian hover:border-antique-gold/40 cursor-pointer transition-colors group"
            >
              <div className="w-12 h-14 bg-obsidian-surface flex-shrink-0 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-[0.2em] text-antique-gold">
                  {product.category} • {product.elementalTheme}
                </p>
                <h4 className="font-cormorant text-lg text-warm-ivory group-hover:text-antique-gold truncate">
                  {product.name}
                </h4>
                <p className="text-[11px] text-ivory-muted truncate font-light">
                  {product.shortDesc}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-mono text-sm text-antique-gold font-medium block">
                  {formatPKR(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="font-mono text-[10px] text-ivory-muted/60 line-through">
                    {formatPKR(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          ))}

          {!query.trim() && (
            <div className="py-6 text-center space-y-3 text-ivory-muted">
              <p className="text-[10px] uppercase tracking-[0.25em] text-antique-gold">
                Explore by Theme &amp; Category
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["OBSIDIAN", "EMERALD VEIL", "CRIMSON EMBER", "CEDAR NOIR", "FROSTLINE"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-[11px] px-3 py-1 bg-obsidian border border-hairline hover:border-antique-gold text-warm-ivory transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
