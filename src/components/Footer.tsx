import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-obsidian border-t border-hairline text-ivory-muted pt-20 pb-12" id="concierge">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
        {/* Newsletter Dispatch */}
        <div className="pb-16 mb-16 border-b border-hairline grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-2">
            <p className="text-[10px] tracking-[0.3em] uppercase text-antique-gold font-light">
              PRIVATE CORRESPONDENCE
            </p>
            <h3 className="font-cormorant text-3xl sm:text-4xl text-warm-ivory font-light">
              The Gentleman’s Dispatch
            </h3>
            <p className="text-[14px] text-ivory-muted font-light leading-relaxed">
              Receive private invitations to seasonal perfume releases, watch commissions, and private viewing dates in Pakistan.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Your correspondence address has been registered in the private archive.");
            }}
            className="lg:col-span-6 flex flex-col sm:flex-row gap-3"
          >
            <input
              aria-label="Formal correspondence email"
              className="flex-1 bg-obsidian-surface border border-hairline px-5 py-3.5 text-warm-ivory placeholder:text-ivory-muted/40 focus:outline-none focus:border-antique-gold text-[13px] font-light"
              placeholder="Your formal email address"
              type="email"
              required
            />
            <button
              className="px-8 py-3.5 border border-antique-gold text-antique-gold hover:bg-antique-gold hover:text-obsidian text-[11px] tracking-[0.22em] uppercase font-normal transition-all cursor-pointer"
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16 pb-16 border-b border-hairline text-[12px] font-light">
          <div className="space-y-4">
            <h4 className="text-[10px] tracking-[0.28em] uppercase text-warm-ivory font-normal">
              PAKISTAN SALONS
            </h4>
            <ul className="space-y-2.5 text-ivory-muted">
              <li>Karachi — Clifton Quarters</li>
              <li>Lahore — Gulberg Conservatory</li>
              <li>Islamabad — Sector F-7 Lounge</li>
              <li className="pt-2 text-antique-gold text-[11px] tracking-[0.15em] font-mono">
                +92 (21) 3587 9000
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] tracking-[0.28em] uppercase text-warm-ivory font-normal">
              FOUR CATEGORIES
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link className="hover:text-antique-gold transition-colors" href="/collections/watches">
                  Watches
                </Link>
              </li>
              <li>
                <Link className="hover:text-antique-gold transition-colors" href="/collections/ties">
                  Ties
                </Link>
              </li>
              <li>
                <Link className="hover:text-antique-gold transition-colors" href="/collections/cufflinks">
                  Cufflinks
                </Link>
              </li>
              <li>
                <Link className="hover:text-antique-gold transition-colors" href="/collections/perfumes">
                  Perfumes
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] tracking-[0.28em] uppercase text-warm-ivory font-normal">
              ELEMENTAL WORLDS
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link className="hover:text-antique-gold transition-colors" href="/collections/vine">
                  VINE (Botanical Emerald)
                </Link>
              </li>
              <li>
                <Link className="hover:text-antique-gold transition-colors" href="/collections/cigar-and-cedar">
                  CIGAR &amp; CEDAR
                </Link>
              </li>
              <li>
                <Link className="hover:text-antique-gold transition-colors" href="/collections/frost">
                  FROST &amp; SNOW
                </Link>
              </li>
              <li>
                <Link className="hover:text-antique-gold transition-colors" href="/collections/fire">
                  FIRE (Ruby Crimson)
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] tracking-[0.28em] uppercase text-warm-ivory font-normal">
              CLIENT SERVICES
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link className="hover:text-antique-gold transition-colors" href="/account">
                  Patron Account
                </Link>
              </li>
              <li>
                <Link className="hover:text-antique-gold transition-colors" href="/wishlist">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link className="hover:text-antique-gold transition-colors" href="/cart">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link className="hover:text-antique-gold transition-colors" href="/admin">
                  Directoire Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Signature */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between text-[10px] tracking-[0.24em] uppercase text-ivory-muted/70 gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-cormorant text-lg text-antique-gold">V</span>
            <span>© 2026 LA VER’nO • WAYS OF MEN</span>
          </div>
          <div className="flex items-center space-x-6">
            <span>Demo Storefront &amp; Creative Stories</span>
            <span>•</span>
            <span>PKR Concierge Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
