"use client";

import React from "react";
import Link from "next/link";
import { AuraWorld, Product } from "../types";
import { formatPKR } from "../lib/utils";

interface ProductCardProps {
  product: Product;
  surfaceWorld?: AuraWorld;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string, e: React.MouseEvent) => void;
  onQuickAdd?: (product: Product, e: React.MouseEvent) => void;
}

const SURFACE_STYLES: Record<AuraWorld, string> = {
  obsidian: "border-hairline bg-obsidian-surface/85 hover:border-antique-gold/50",
  emerald: "border-emerald-luxury/50 bg-emerald-surface/85 hover:border-antique-gold/50",
  ruby: "border-ruby-crimson/55 bg-ruby-surface/85 hover:border-antique-gold/50",
};

export default function ProductCard({
  product,
  surfaceWorld = "obsidian",
  isWishlisted = false,
  onToggleWishlist,
  onQuickAdd,
}: ProductCardProps) {
  const isOnSale =
    typeof product.originalPrice === "number" && product.originalPrice > product.price;
  const discountPct = isOnSale
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className={`group flex flex-col justify-between border p-5 transition-all duration-500 ${SURFACE_STYLES[surfaceWorld]}`}
    >
      <div>
        {/* Square/4:5 Cinematic Image Frame */}
        <div className="relative aspect-[4/5] overflow-hidden bg-black/50 mb-5">
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <img
              alt={product.name}
              src={product.images[0]}
              className={`w-full h-full object-cover object-center transition-transform duration-[900ms] ease-out ${
                isOutOfStock ? "opacity-50 grayscale-[35%]" : "group-hover:scale-[1.05]"
              }`}
            />
          </Link>

          {/* Top Left Elemental Theme / Sale Label */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            {isOutOfStock ? (
              <span className="text-[9px] tracking-[0.22em] uppercase bg-ruby-crimson text-warm-ivory px-2.5 py-1">
                Archive Exhausted
              </span>
            ) : isOnSale ? (
              <span className="text-[9px] tracking-[0.22em] uppercase bg-ruby-crimson text-warm-ivory px-2.5 py-1">
                Private Offer • -{discountPct}%
              </span>
            ) : (
              <span className="text-[9px] tracking-[0.24em] uppercase bg-black/75 backdrop-blur-sm px-2.5 py-1 text-antique-gold border border-white/10">
                {product.elementalTheme}
              </span>
            )}
          </div>

          {/* Wishlist Toggle */}
          {onToggleWishlist && (
            <button
              onClick={(e) => onToggleWishlist(product.id, e)}
              aria-label={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm border border-white/15 flex items-center justify-center text-warm-ivory/75 hover:text-antique-gold hover:border-antique-gold/50 transition-colors cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-4 h-4 ${isWishlisted ? "text-antique-gold fill-antique-gold" : "text-warm-ivory/80 fill-none"}`}
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Title & Collection / Inspiration */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[9px] tracking-[0.24em] uppercase text-antique-gold/85">
            <span>{product.category}</span>
            <span className="text-warm-ivory/50 truncate max-w-[140px]">{product.collectionName}</span>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-cormorant text-[22px] leading-snug text-warm-ivory group-hover:text-antique-gold transition-colors duration-300 font-light">
              {product.name}
            </h3>
          </Link>

          <p className="text-[12px] text-ivory-muted/85 font-light line-clamp-2 leading-relaxed">
            {product.shortDesc}
          </p>
        </div>
      </div>

      {/* Pricing & Interaction */}
      <div className="pt-4 mt-5 border-t border-white/10 flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <span className="font-mono text-[14px] text-antique-gold font-normal tracking-wide">
              {formatPKR(product.price)}
            </span>
            {isOnSale && (
              <span className="font-mono text-[11px] text-ivory-muted/55 line-through">
                {formatPKR(product.originalPrice!)}
              </span>
            )}
          </div>
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-[9px] uppercase tracking-[0.16em] text-antique-gold/80 font-mono">
              {product.stock} Left
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 text-center py-2.5 border border-white/15 text-[10px] tracking-[0.22em] uppercase text-warm-ivory hover:border-antique-gold hover:text-antique-gold transition-all duration-300"
          >
            Read Story
          </Link>
          {onQuickAdd && (
            <button
              onClick={(e) => onQuickAdd(product, e)}
              disabled={isOutOfStock}
              className="px-3.5 py-2.5 bg-antique-gold text-obsidian text-[10px] tracking-[0.22em] uppercase font-medium hover:bg-antique-gold-light transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isOutOfStock ? "Exhausted" : "Add to Bag"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
