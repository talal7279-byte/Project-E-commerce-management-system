"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ProductCard from "../../../components/ProductCard";
import { getProducts, getActiveProducts, addToCart, toggleWishlist, getWishlist } from "../../../lib/store";
import { INITIAL_PRODUCTS, AURA_WORLDS } from "../../../lib/data";
import { formatPKR } from "../../../lib/utils";
import { Product } from "../../../types";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const initialFound = INITIAL_PRODUCTS.find((p) => p.slug === params.slug) || null;
  const [product, setProduct] = useState<Product | null>(initialFound);
  const [allActive, setAllActive] = useState<Product[]>(
    INITIAL_PRODUCTS.filter((p) => p.status === "active")
  );
  const [loaded, setLoaded] = useState(false);

  const [activeImage, setActiveImage] = useState<string>(initialFound?.images[0] || "");
  const [selectedPrimary, setSelectedPrimary] = useState<string>(
    initialFound?.variants?.[0]?.options?.[0] || initialFound?.colors?.[0] || ""
  );
  const [selectedSecondary, setSelectedSecondary] = useState<string>(
    initialFound?.variants?.[1]?.options?.[0] || initialFound?.sizes?.[0] || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>("story");

  const syncState = () => {
    const allProds = getProducts();
    const activeProds = getActiveProducts();
    setAllActive(activeProds);

    const found = allProds.find((p) => p.slug === params.slug) || null;
    setProduct(found);
    if (found) {
      setActiveImage((prev) => (found.images.includes(prev) ? prev : found.images[0] || ""));
      const pOpts = found.variants?.[0]?.options || found.colors;
      const sOpts = found.variants?.[1]?.options || found.sizes;
      setSelectedPrimary((prev) => (pOpts.includes(prev) ? prev : pOpts[0] || ""));
      setSelectedSecondary((prev) => (sOpts.includes(prev) ? prev : sOpts[0] || ""));
    }
    setWishlist(getWishlist());
    setLoaded(true);
  };

  useEffect(() => {
    syncState();
    window.addEventListener("la_verno_storage_changed", syncState);
    return () => window.removeEventListener("la_verno_storage_changed", syncState);
  }, [params.slug]);

  if (loaded && !product) {
    return (
      <div className="bg-obsidian min-h-screen flex flex-col text-warm-ivory font-jost">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center space-y-5">
          <span className="material-symbols-outlined text-5xl text-antique-gold">inventory_2</span>
          <h1 className="font-cormorant text-4xl text-warm-ivory font-light">Object Unavailable</h1>
          <Link
            href="/shop"
            className="px-8 py-3 bg-antique-gold text-obsidian text-[11px] uppercase tracking-[0.22em] font-medium"
          >
            Return to Collection
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-obsidian min-h-screen text-warm-ivory flex items-center justify-center font-jost">
        <p className="font-cormorant text-2xl text-antique-gold">Opening Archive Folio...</p>
      </div>
    );
  }

  const primaryLabel = product.variants?.[0]?.name || "Edition";
  const primaryOptions = product.variants?.[0]?.options || product.colors;
  const secondaryLabel = product.variants?.[1]?.name || "Format";
  const secondaryOptions = product.variants?.[1]?.options || product.sizes;

  const isWishlisted = wishlist.includes(product.id);
  const isOnSale = typeof product.originalPrice === "number" && product.originalPrice > product.price;
  const discountPct = isOnSale
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;
  const isOutOfStock = product.stock <= 0;

  const bgClass =
    product.aura === "emerald"
      ? "bg-emerald-deep"
      : product.aura === "ruby"
      ? "bg-ruby-deep"
      : "bg-obsidian";
  const auraAsset = AURA_WORLDS[product.aura].bgImage;

  const categorySlug = product.category.toLowerCase();

  const handleAddToBag = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, {
      [primaryLabel]: selectedPrimary || primaryOptions[0] || "Standard",
      [secondaryLabel]: selectedSecondary || secondaryOptions[0] || "Standard",
    });
    setAddedItem(product.name);
    setTimeout(() => setAddedItem(null), 3500);
  };

  const handleWishlistToggle = (targetId = product.id, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setWishlist(toggleWishlist(targetId));
  };

  const handleQuickAddRelated = (rel: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (rel.stock <= 0) return;
    addToCart(rel, 1);
    setAddedItem(rel.name);
    setTimeout(() => setAddedItem(null), 3000);
  };

  const relatedProducts = allActive
    .filter((p) => p.id !== product.id)
    .sort((a, b) => {
      const aMatch = (a.aura === product.aura ? 2 : 0) + (a.category === product.category ? 1 : 0);
      const bMatch = (b.aura === product.aura ? 2 : 0) + (b.category === product.category ? 1 : 0);
      return bMatch - aMatch;
    })
    .slice(0, 4);

  return (
    <div className={`${bgClass} min-h-screen flex flex-col text-warm-ivory font-jost relative`}>
      <Header />

      {/* Subtle Aura Background */}
      <div className="fixed inset-x-0 top-0 h-[62vh] z-0 pointer-events-none overflow-hidden opacity-30">
        <img src={auraAsset} alt="" className="w-full h-full object-cover animate-aura-drift" />
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/60 via-transparent ${
            product.aura === "emerald"
              ? "to-[#041F17]"
              : product.aura === "ruby"
              ? "to-[#1B050B]"
              : "to-[#090909]"
          }`}
        ></div>
      </div>

      {addedItem && (
        <div className="fixed bottom-8 right-8 z-50 bg-obsidian-surface border border-antique-gold/60 px-6 py-4 shadow-2xl flex items-center space-x-3 text-sm animate-hero-reveal">
          <span className="w-2.5 h-2.5 rounded-full bg-antique-gold"></span>
          <span>
            Added to Bag: <strong className="text-antique-gold">{addedItem}</strong>
          </span>
          <Link href="/cart" className="underline text-antique-gold ml-3 text-xs uppercase">
            View Bag
          </Link>
        </div>
      )}

      <main className="relative z-10 w-full pt-32 pb-32 flex-1">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-warm-ivory/65 mb-10">
            <Link href="/" className="hover:text-antique-gold transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-antique-gold transition-colors">
              Collection
            </Link>
            <span>/</span>
            <Link href={`/collections/${categorySlug}`} className="hover:text-antique-gold transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-antique-gold">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Gallery */}
            <div className="lg:col-span-7 space-y-5">
              <div className="relative aspect-[4/5] max-h-[760px] w-full bg-black/50 border border-white/15 overflow-hidden group">
                <img
                  src={activeImage || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-1000"
                />

                <div className="absolute top-4 left-4 flex gap-2">
                  {isOutOfStock ? (
                    <span className="text-[10px] tracking-[0.22em] uppercase bg-ruby-crimson text-warm-ivory px-3 py-1.5">
                      Out of Stock
                    </span>
                  ) : isOnSale ? (
                    <span className="text-[10px] tracking-[0.22em] uppercase bg-ruby-crimson text-warm-ivory px-3 py-1.5">
                      Private Offer • -{discountPct}%
                    </span>
                  ) : (
                    <span className="text-[10px] tracking-[0.24em] uppercase bg-black/80 px-3 py-1.5 text-antique-gold border border-white/15">
                      {product.elementalTheme}
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => handleWishlistToggle(product.id, e)}
                  aria-label="Toggle Wishlist"
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/75 border border-white/15 flex items-center justify-center hover:border-antique-gold transition-colors cursor-pointer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-[19px] h-[19px] ${
                      isWishlisted ? "text-antique-gold fill-antique-gold" : "text-ivory-muted fill-none"
                    }`}
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
              </div>

              {product.images.length > 1 && (
                <div className="flex flex-wrap items-center gap-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-24 bg-black/40 border overflow-hidden transition-all cursor-pointer ${
                        activeImage === img
                          ? "border-antique-gold"
                          : "border-white/15 hover:border-antique-gold/40 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Narrative & Selection Panel */}
            <div className="lg:col-span-5 space-y-7">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] tracking-[0.28em] uppercase text-antique-gold font-light">
                  <span>
                    {product.category} • {product.collectionName}
                  </span>
                  <span className="font-mono text-warm-ivory/60">{product.sku}</span>
                </div>

                <h1 className="font-cormorant font-light text-3xl sm:text-5xl text-warm-ivory leading-[1.12]">
                  {product.name}
                </h1>

                <p className="text-xs uppercase tracking-[0.2em] text-warm-ivory/75 font-light">
                  {product.tagline}
                </p>

                <div className="pt-2 space-y-1">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-2xl text-antique-gold">
                      {formatPKR(product.price)}
                    </span>
                    {isOnSale && (
                      <span className="font-mono text-base text-warm-ivory/50 line-through">
                        {formatPKR(product.originalPrice!)}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-warm-ivory/55 tracking-wide">
                    Demonstration retail pricing in PKR — fictional demo catalog specification
                  </p>
                </div>

                <div className="pt-1 flex items-center gap-2 text-xs">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOutOfStock
                        ? "bg-ruby-crimson"
                        : product.stock <= 4
                        ? "bg-antique-gold"
                        : "bg-emerald-500"
                    }`}
                  ></span>
                  <span className="text-warm-ivory/90 font-light">
                    {isOutOfStock
                      ? "Out of Stock"
                      : product.stock <= 4
                      ? `Low Stock — Only ${product.stock} remaining`
                      : `Available (${product.stock} pieces ready)`}
                  </span>
                </div>

                <p className="text-[14px] text-warm-ivory/85 font-light leading-relaxed pt-2">
                  {product.shortDesc}
                </p>
              </div>

              {/* Variants */}
              {primaryOptions.length > 0 && (
                <div className="space-y-2.5 pt-4 border-t border-white/15">
                  <label className="text-[10px] uppercase tracking-[0.24em] text-warm-ivory/70 block">
                    {primaryLabel}: <span className="text-warm-ivory font-medium">{selectedPrimary}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {primaryOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedPrimary(opt)}
                        className={`text-[11px] px-3.5 py-2 border transition-all cursor-pointer ${
                          selectedPrimary === opt
                            ? "border-antique-gold text-antique-gold bg-black/50"
                            : "border-white/15 text-warm-ivory/70 hover:border-antique-gold/40"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {secondaryOptions.length > 0 && (
                <div className="space-y-2.5 pt-4 border-t border-white/15">
                  <label className="text-[10px] uppercase tracking-[0.24em] text-warm-ivory/70 block">
                    {secondaryLabel}: <span className="text-warm-ivory font-medium">{selectedSecondary}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {secondaryOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedSecondary(opt)}
                        className={`text-[11px] px-3.5 py-2 border font-mono transition-all cursor-pointer ${
                          selectedSecondary === opt
                            ? "border-antique-gold text-antique-gold bg-black/50"
                            : "border-white/15 text-warm-ivory/70 hover:border-antique-gold/40"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Bag */}
              <div className="space-y-4 pt-4 border-t border-white/15">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-white/20 bg-black/40 px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock}
                      className="text-warm-ivory/70 hover:text-antique-gold px-2 py-1 text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm px-4">{isOutOfStock ? 0 : quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(Math.max(1, product.stock), quantity + 1))}
                      disabled={isOutOfStock || quantity >= product.stock}
                      className="text-warm-ivory/70 hover:text-antique-gold px-2 py-1 text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToBag}
                    disabled={isOutOfStock}
                    className="flex-1 py-4 bg-antique-gold text-obsidian text-[11px] tracking-[0.24em] uppercase font-medium hover:bg-antique-gold-light transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {isOutOfStock ? "Archive Exhausted" : "Add to Bag"}
                  </button>
                </div>
              </div>

              {/* Individual Story & Material Specification Accordions */}
              <div className="pt-4 border-t border-white/15 divide-y divide-white/15">
                <div>
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(openAccordion === "story" ? null : "story")}
                    className="w-full py-4 flex items-center justify-between text-left text-xs uppercase tracking-[0.2em] text-warm-ivory hover:text-antique-gold transition-colors cursor-pointer"
                  >
                    <span>Design Inspiration &amp; Product Story</span>
                    <span className="material-symbols-outlined text-sm">
                      {openAccordion === "story" ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                  {openAccordion === "story" && (
                    <div className="pb-6 space-y-3 text-[13px] text-warm-ivory/80 font-light leading-relaxed">
                      <p>
                        <strong className="text-antique-gold font-normal">Inspiration:</strong>{" "}
                        {product.story.inspiration}
                      </p>
                      <p>{product.story.narrative}</p>
                      <p>
                        <strong className="text-antique-gold font-normal">Character:</strong>{" "}
                        {product.story.character}
                      </p>
                      {product.story.quote && (
                        <blockquote className="border-l border-antique-gold/50 pl-4 italic font-cormorant text-lg text-warm-ivory">
                          “{product.story.quote}”
                        </blockquote>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(openAccordion === "materials" ? null : "materials")}
                    className="w-full py-4 flex items-center justify-between text-left text-xs uppercase tracking-[0.2em] text-warm-ivory hover:text-antique-gold transition-colors cursor-pointer"
                  >
                    <span>Material Details (Demo Info) &amp; Care</span>
                    <span className="material-symbols-outlined text-sm">
                      {openAccordion === "materials" ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                  {openAccordion === "materials" && (
                    <div className="pb-6 space-y-3 text-[12px] text-warm-ivory/80 font-light leading-relaxed">
                      <ul className="list-disc pl-4 space-y-1">
                        {product.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                      <p>
                        <strong className="text-warm-ivory font-normal">Material (Demo Specification):</strong>{" "}
                        {product.material}
                      </p>
                      <p>
                        <strong className="text-warm-ivory font-normal">Care:</strong>{" "}
                        {product.careInstructions}
                      </p>
                      <div className="pt-2 space-y-1">
                        {Object.entries(product.specifications).map(([k, v]) => (
                          <div key={k} className="flex justify-between py-1 border-b border-white/10">
                            <span className="text-warm-ivory/60">{k}</span>
                            <span className="text-warm-ivory font-mono text-right">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Objects */}
          {relatedProducts.length > 0 && (
            <section className="mt-28 pt-16 border-t border-white/15">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-light mb-2">
                    COMPLEMENTARY OBJECTS
                  </p>
                  <h2 className="font-cormorant font-light text-3xl sm:text-4xl text-warm-ivory">
                    Related in This World
                  </h2>
                </div>
                <Link
                  href="/shop"
                  className="text-[11px] tracking-[0.2em] uppercase text-antique-gold border-b border-antique-gold/40 pb-1"
                >
                  Explore Full Catalogue →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((rel) => (
                  <ProductCard
                    key={rel.id}
                    product={rel}
                    surfaceWorld={product.aura}
                    isWishlisted={wishlist.includes(rel.id)}
                    onToggleWishlist={(id, e) => handleWishlistToggle(id, e)}
                    onQuickAdd={handleQuickAddRelated}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
