"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCollections, addCollection, getProducts } from "../../../lib/store";
import { INITIAL_COLLECTIONS, INITIAL_PRODUCTS } from "../../../lib/data";
import { AuraWorld, CollectionRecord, Product } from "../../../types";

const AURA_IMAGES: Record<AuraWorld, string> = {
  obsidian: "/images/aura/obsidian-fabric.jpg",
  emerald: "/images/aura/royal-emerald.jpg",
  ruby: "/images/aura/ruby-crimson.jpg",
};

export default function AdminCategoriesPage() {
  const [collections, setCollections] = useState<CollectionRecord[]>(INITIAL_COLLECTIONS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCat, setNewCat] = useState<{
    name: string;
    subtitle: string;
    description: string;
    aura: AuraWorld;
    filterType: CollectionRecord["filterType"];
  }>({
    name: "",
    subtitle: "",
    description: "",
    aura: "obsidian",
    filterType: "collection",
  });

  const loadData = () => {
    setCollections(getCollections());
    setProducts(getProducts());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("la_verno_storage_changed", loadData);
    return () => window.removeEventListener("la_verno_storage_changed", loadData);
  }, []);

  const getCounts = (c: CollectionRecord) => {
    const val = c.filterValue.toLowerCase();
    const matched = products.filter((p) => {
      if (c.filterType === "category") {
        return p.category.toLowerCase() === val;
      }
      if (c.filterType === "theme") {
        return p.elementalTheme.toLowerCase() === val;
      }
      return (
        p.collections.some((col) => col.toLowerCase() === val) ||
        p.collectionName.toLowerCase() === val
      );
    });
    return {
      total: matched.length,
      active: matched.filter((p) => p.status === "active").length,
    };
  };

  const handleAddCollection = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newCat.name
      .toLowerCase()
      .replace(/ & /g, "-and-")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const created: CollectionRecord = {
      id: `col-${Date.now()}`,
      slug,
      name: newCat.name,
      subtitle: newCat.subtitle || "Curated Seasonal Edit",
      description: newCat.description,
      image: AURA_IMAGES[newCat.aura],
      aura: newCat.aura,
      filterType: newCat.filterType,
      filterValue: newCat.name,
    };
    addCollection(created);
    setNewCat({
      name: "",
      subtitle: "",
      description: "",
      aura: "obsidian",
      filterType: "collection",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#201f1f]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#d1c5b4] uppercase tracking-wider">
            <span>Directoire Back-Office</span>
            <span>/</span>
            <span className="text-[#b89552] font-semibold">Categories & Collections</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#e5e2e1] mt-1">
            Categories, Aura Worlds & Elemental Themes
          </h1>
          <p className="text-xs text-[#d1c5b4]/80 mt-0.5">
            Live object allocations across 4 categories (Watches, Ties, Cufflinks, Perfumes), aura worlds, and elemental themes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#b89552] text-[#432e00] hover:bg-[#e8c179] transition-colors rounded text-xs font-semibold self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px]">add</span>
          <span>Create Collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {collections.map((c) => {
          const counts = getCounts(c);
          return (
            <div
              key={c.id}
              className="p-5 bg-[#1c1b1b] border border-[#2a2a2a] rounded flex flex-col justify-between space-y-4 hover:border-[#b89552]/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-12 h-12 rounded object-cover border border-[#2a2a2a]"
                    />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#b89552] font-mono">
                        {c.filterType === "category"
                          ? "Category"
                          : c.filterType === "theme"
                          ? "Elemental Theme"
                          : "World / Edit"}{" "}
                        · {c.aura}
                      </span>
                      <h3 className="text-base font-semibold text-[#e5e2e1]">{c.name}</h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-[#201f1f] text-[#e8c179] text-xs font-mono rounded whitespace-nowrap">
                    {counts.active} Active / {counts.total} Total
                  </span>
                </div>

                <p className="text-xs text-[#d1c5b4] leading-relaxed font-light">{c.description}</p>
              </div>

              <div className="pt-3 border-t border-[#201f1f] flex justify-between items-center text-xs">
                <Link
                  href={`/collections/${c.slug}`}
                  target="_blank"
                  className="text-[#e8c179] hover:underline flex items-center gap-1"
                >
                  <span>View Storefront Collection</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </Link>
                <Link href="/admin/products" className="text-[#d1c5b4] hover:text-[#e5e2e1]">
                  Assign Products →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded p-6 max-w-md w-full space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-[#e5e2e1]">Create Collection</h3>
            <form onSubmit={handleAddCollection} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase text-[#d1c5b4] block mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Capsule"
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-[#d1c5b4] block mb-1">Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Curated Seasonal Edit"
                  value={newCat.subtitle}
                  onChange={(e) => setNewCat({ ...newCat, subtitle: e.target.value })}
                  className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase text-[#d1c5b4] block mb-1">
                    Aura World
                  </label>
                  <select
                    value={newCat.aura}
                    onChange={(e) => setNewCat({ ...newCat, aura: e.target.value as AuraWorld })}
                    className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
                  >
                    <option value="obsidian">Obsidian Black</option>
                    <option value="emerald">Royal Emerald</option>
                    <option value="ruby">Ruby Crimson</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase text-[#d1c5b4] block mb-1">
                    Grouping Type
                  </label>
                  <select
                    value={newCat.filterType}
                    onChange={(e) =>
                      setNewCat({
                        ...newCat,
                        filterType: e.target.value as CollectionRecord["filterType"],
                      })
                    }
                    className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
                  >
                    <option value="collection">Curated World / Edit</option>
                    <option value="theme">Elemental Theme</option>
                    <option value="category">Category</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase text-[#d1c5b4] block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newCat.description}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#201f1f] text-[#d1c5b4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#b89552] text-[#432e00] font-semibold cursor-pointer"
                >
                  Save Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
