"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCart, getWishlist } from "../lib/store";
import SearchModal from "./SearchModal";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const updateCounts = () => {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);

    const wishlist = getWishlist();
    setWishlistCount(wishlist.length);
  };

  useEffect(() => {
    updateCounts();
    const handleStorage = () => updateCounts();
    const handleScroll = () => setScrolled(window.scrollY > 36);

    window.addEventListener("la_verno_storage_changed", handleStorage);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("la_verno_storage_changed", handleStorage);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-obsidian/92 backdrop-blur-md border-b border-hairline/80 py-3.5"
            : "bg-gradient-to-b from-black/75 via-black/35 to-transparent py-6"
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-5 sm:px-10 lg:px-16 flex items-center justify-between">
          {/* Mobile Menu Trigger (< md) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="md:hidden text-warm-ivory/80 hover:text-antique-gold p-1 cursor-pointer"
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>

          {/* Left Minimal Navigation Integrated Seamlessly */}
          <nav className="hidden md:flex items-center space-x-8 text-[10px] uppercase tracking-[0.24em] text-warm-ivory/80 font-light">
            <Link href="/shop" className="hover:text-antique-gold transition-colors duration-300">
              Collection
            </Link>
            <Link href="/collections/watches" className="hover:text-antique-gold transition-colors duration-300">
              Watches
            </Link>
            <Link href="/collections/perfumes" className="hover:text-antique-gold transition-colors duration-300">
              Perfumes
            </Link>
            <Link href="/collections" className="hover:text-antique-gold transition-colors duration-300">
              Worlds
            </Link>
          </nav>

          {/* Centered Standalone V Monogram & LA VER’nO */}
          <Link href="/" className="flex flex-col items-center group py-0.5">
            <div className="flex items-center space-x-3">
              <span className="font-cormorant font-light text-2xl sm:text-3xl tracking-[0.06em] text-antique-gold group-hover:text-antique-gold-light transition-colors duration-300">
                V
              </span>
              <span className="w-px h-3.5 bg-antique-gold/30"></span>
              <span className="font-cormorant text-[18px] sm:text-[21px] tracking-[0.26em] font-normal uppercase text-warm-ivory group-hover:text-antique-gold transition-colors duration-300">
                LA VER’nO
              </span>
            </div>
            <span className="text-[7.5px] uppercase tracking-[0.42em] text-antique-gold/90 font-light mt-0.5">
              WAYS OF MEN
            </span>
          </Link>

          {/* Right Minimal Utilities */}
          <div className="flex items-center space-x-4 sm:space-x-7 text-[10px] uppercase tracking-[0.24em] text-warm-ivory/80 font-light">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search Archive"
              className="hover:text-antique-gold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="hidden lg:inline">Search</span>
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.1 5.1a7.5 7.5 0 0011.55 11.55z" />
              </svg>
            </button>

            <Link
              href="/wishlist"
              className="hidden sm:flex items-center gap-1 hover:text-antique-gold transition-colors"
            >
              <span className="hidden lg:inline">Wishlist</span>
              <span className="text-[10px] text-antique-gold font-mono">({wishlistCount})</span>
            </Link>

            <Link href="/account" className="hidden sm:inline-block hover:text-antique-gold transition-colors">
              Account
            </Link>

            <Link href="/cart" className="hover:text-antique-gold transition-colors flex items-center gap-1.5">
              <span>Bag</span>
              <span className="text-[10px] text-antique-gold font-mono font-medium">({cartCount})</span>
            </Link>

            <Link
              href="/admin"
              className="hidden xl:flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded border border-white/10 hover:border-antique-gold/50 text-ivory-muted hover:text-warm-ivory transition-colors"
              title="Directoire Admin"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-antique-gold"></span>
              <span>Directoire</span>
            </Link>
          </div>
        </div>

        {/* Mobile Responsive Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-hairline bg-obsidian/95 backdrop-blur-md px-6 py-6 space-y-4 text-[11px] uppercase tracking-[0.22em] text-ivory-muted">
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-antique-gold">
              Discover All Objects
            </Link>
            <Link href="/collections/watches" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-antique-gold">
              Watches
            </Link>
            <Link href="/collections/perfumes" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-antique-gold">
              Perfumes
            </Link>
            <Link href="/collections/ties" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-antique-gold">
              Ties
            </Link>
            <Link href="/collections/cufflinks" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-antique-gold">
              Cufflinks
            </Link>
            <Link href="/collections" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-antique-gold">
              Elemental Worlds
            </Link>
            <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-antique-gold">
              Wishlist ({wishlistCount})
            </Link>
            <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-antique-gold">
              Account
            </Link>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-antique-gold">
              Admin Portal
            </Link>
          </div>
        )}
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
