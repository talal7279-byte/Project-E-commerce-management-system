"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from "../../../lib/store";
import {
  INITIAL_PRODUCTS,
  PRODUCT_CATEGORIES,
  AVAILABLE_COLLECTIONS,
  ELEMENTAL_THEMES,
} from "../../../lib/data";
import { formatPKR } from "../../../lib/utils";
import {
  AuraWorld,
  ElementalTheme,
  Product,
  ProductCategory,
  ProductStatus,
} from "../../../types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "Watches" as ProductCategory,
    collectionName: "OBSIDIAN",
    aura: "obsidian" as AuraWorld,
    elementalTheme: "OBSIDIAN" as ElementalTheme,
    status: "active" as ProductStatus,
    collections: ["Obsidian World", "New Arrivals"] as string[],
    tagline: "",
    edition: "SIGNATURE EDITION",
    price: 45000,
    originalPrice: "" as string | number,
    stock: 10,
    colorsText: "Obsidian Black, Champagne Gold",
    sizesText: "40mm Case",
    material: "316L PVD stainless steel & sapphire crystal (Demo specification)",
    careInstructions: "Wipe gently with microfiber cloth; store in velvet-lined case.",
    shortDesc: "",
    storyInspiration: "",
    storyNarrative: "",
    storyMaterials: "",
    storyCharacter: "",
    image: "/images/products/watch-obsidian.jpg",
    galleryImagesText: "",
  });

  const loadData = () => {
    setProducts(getProducts());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("la_verno_storage_changed", loadData);
    return () => window.removeEventListener("la_verno_storage_changed", loadData);
  }, []);

  const filtered = products.filter((p) => {
    const matchCat =
      categoryFilter === "all" || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchStatus =
      statusFilter === "all" || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchCol =
      collectionFilter === "all" ||
      p.collections.some((c) => c.toLowerCase() === collectionFilter.toLowerCase()) ||
      p.elementalTheme.toLowerCase() === collectionFilter.toLowerCase();
    const matchSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.collectionName.toLowerCase().includes(search.toLowerCase()) ||
      p.elementalTheme.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchCol && matchSearch;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      sku: `LV-NEW-${Math.floor(100 + Math.random() * 900)}`,
      category: "Watches",
      collectionName: "OBSIDIAN",
      aura: "obsidian",
      elementalTheme: "OBSIDIAN",
      status: "active",
      collections: ["Obsidian World", "New Arrivals"],
      tagline: "Shadow, Precision & Stillness",
      edition: "NEW RELEASE",
      price: 45000,
      originalPrice: "",
      stock: 10,
      colorsText: "Obsidian Black, Antique Gold",
      sizesText: "40mm Case",
      material: "316L brushed stainless steel (Demo specification)",
      careInstructions: "Wipe with clean dry cloth after wear; store in protective case.",
      shortDesc: "",
      storyInspiration: "Born from quiet nocturnal ritual and sculptural restraint.",
      storyNarrative:
        "Crafted to move effortlessly between dusk gatherings and solitary study, balancing weight, texture, and shadow.",
      storyMaterials: "Demonstration material specification tailored for the LA VER’nO catalogue.",
      storyCharacter: "Composed, enduring, and unmistakably nocturnal.",
      image: "/images/products/watch-obsidian.jpg",
      galleryImagesText: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      sku: p.sku,
      category: p.category,
      collectionName: p.collectionName,
      aura: p.aura,
      elementalTheme: p.elementalTheme,
      status: p.status,
      collections: p.collections || [],
      tagline: p.tagline,
      edition: p.edition,
      price: p.price,
      originalPrice: p.originalPrice ?? "",
      stock: p.stock,
      colorsText: p.colors.join(", "),
      sizesText: p.sizes.join(", "),
      material: p.material,
      careInstructions: p.careInstructions,
      shortDesc: p.shortDesc,
      storyInspiration: p.story.inspiration,
      storyNarrative: p.story.narrative,
      storyMaterials: p.story.materials,
      storyCharacter: p.story.character,
      image: p.images[0] || "/images/products/watch-obsidian.jpg",
      galleryImagesText: p.images.slice(1).join(", "),
    });
    setIsModalOpen(true);
  };

  const handleCollectionToggle = (col: string) => {
    setForm((prev) => {
      const exists = prev.collections.includes(col);
      return {
        ...prev,
        collections: exists
          ? prev.collections.filter((c) => c !== col)
          : [...prev.collections, col],
      };
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you certain you wish to remove this product from the catalogue?")) {
      deleteProduct(id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const colors = form.colorsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const sizes = form.sizesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const extraImgs = form.galleryImagesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const allImages = [form.image.trim(), ...extraImgs].filter(Boolean);
    const parsedOriginal =
      form.originalPrice !== "" && Number(form.originalPrice) > 0
        ? Number(form.originalPrice)
        : undefined;

    if (editingProduct) {
      const primaryVariantName = editingProduct.variants?.[0]?.name || "Finish";
      const secondaryVariantName = editingProduct.variants?.[1]?.name || "Format";
      updateProduct({
        ...editingProduct,
        name: form.name,
        sku: form.sku,
        category: form.category,
        collectionName: form.collectionName || form.elementalTheme,
        aura: form.aura,
        elementalTheme: form.elementalTheme,
        status: form.status,
        collections: form.collections,
        featured: form.collections.includes("Featured"),
        newArrival: form.collections.includes("New Arrivals"),
        bestSeller: form.collections.includes("Best Sellers"),
        tagline: form.tagline,
        edition: form.edition,
        price: Number(form.price),
        originalPrice: parsedOriginal,
        stock: Number(form.stock),
        colors: colors.length ? colors : ["Obsidian Black"],
        sizes: sizes.length ? sizes : ["Standard"],
        material: form.material,
        careInstructions: form.careInstructions,
        shortDesc: form.shortDesc,
        story: {
          ...editingProduct.story,
          inspiration: form.storyInspiration || editingProduct.story.inspiration,
          narrative: form.storyNarrative || editingProduct.story.narrative,
          materials: form.storyMaterials || form.material,
          character: form.storyCharacter || editingProduct.story.character,
        },
        images: allImages.length ? allImages : editingProduct.images,
        variants: [
          { name: primaryVariantName, options: colors.length ? colors : ["Obsidian Black"] },
          { name: secondaryVariantName, options: sizes.length ? sizes : ["Standard"] },
        ],
        specifications: {
          ...editingProduct.specifications,
          SKU: form.sku,
          Category: form.category,
          Collection: form.collectionName || form.elementalTheme,
          Theme: form.elementalTheme,
          Material: form.material,
        },
      });
    } else {
      const newSlug = form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        slug: `${newSlug}-${Date.now().toString().slice(-4)}`,
        sku: form.sku,
        name: form.name,
        category: form.category,
        collectionName: form.collectionName || form.elementalTheme,
        aura: form.aura,
        elementalTheme: form.elementalTheme,
        status: form.status,
        collections: form.collections,
        featured: form.collections.includes("Featured"),
        newArrival: form.collections.includes("New Arrivals"),
        bestSeller: form.collections.includes("Best Sellers"),
        tagline: form.tagline,
        edition: form.edition,
        price: Number(form.price),
        originalPrice: parsedOriginal,
        stock: Number(form.stock),
        colors: colors.length ? colors : ["Obsidian Black"],
        sizes: sizes.length ? sizes : ["Standard"],
        material: form.material,
        careInstructions: form.careInstructions,
        shortDesc: form.shortDesc,
        details: [form.shortDesc, `Material (Demo info): ${form.material}`],
        commissionLimit: "Numbered House Release",
        images: allImages.length ? allImages : ["/images/products/watch-obsidian.jpg"],
        story: {
          inspiration:
            form.storyInspiration ||
            "Conceived within the LA VER’nO elemental studio.",
          narrative:
            form.storyNarrative ||
            "Created as a study in atmosphere, sculptural proportion, and quiet presence.",
          materials: form.storyMaterials || form.material,
          character: form.storyCharacter || "Restrained, atmospheric, and enduring.",
        },
        specifications: {
          SKU: form.sku,
          Category: form.category,
          Collection: form.collectionName || form.elementalTheme,
          Theme: form.elementalTheme,
          Material: form.material,
          PricingNote: "Demonstration retail price in PKR",
        },
        variants: [
          { name: "Finish", options: colors.length ? colors : ["Obsidian Black"] },
          { name: "Format", options: sizes.length ? sizes : ["Standard"] },
        ],
      };
      addProduct(newProd);
    }
    setIsModalOpen(false);
  };

  const activeCount = products.filter((p) => p.status === "active").length;
  const draftCount = products.filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#201f1f]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#d1c5b4] uppercase tracking-wider">
            <span>Directoire Back-Office</span>
            <span>/</span>
            <span className="text-[#b89552] font-semibold">Products & Catalogue</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#e5e2e1] mt-1">
            Product Catalogue Management
          </h1>
          <p className="text-xs text-[#d1c5b4]/80 mt-0.5">
            Manage all {products.length} luxury SKUs across Watches, Ties, Cufflinks & Perfumes ({activeCount} active, {draftCount} draft). Edits reflect live on the customer storefront.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#b89552] text-[#432e00] hover:bg-[#e8c179] transition-colors rounded text-xs font-semibold self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[17px]">add</span>
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] p-4 rounded flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 w-full lg:w-72">
          <span className="material-symbols-outlined text-[#d1c5b4] text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#131313] border border-[#2a2a2a] px-3 py-1.5 rounded text-[#e5e2e1] placeholder:text-[#9a8f80] focus:outline-none focus:border-[#b89552]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#131313] border border-[#2a2a2a] text-[#e5e2e1] px-3 py-1.5 rounded cursor-pointer"
          >
            <option value="all">All Categories</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={collectionFilter}
            onChange={(e) => setCollectionFilter(e.target.value)}
            className="bg-[#131313] border border-[#2a2a2a] text-[#e5e2e1] px-3 py-1.5 rounded cursor-pointer"
          >
            <option value="all">All Collections</option>
            {AVAILABLE_COLLECTIONS.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#131313] border border-[#2a2a2a] text-[#e5e2e1] px-3 py-1.5 rounded cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="draft">Draft Only</option>
          </select>

          <span className="text-[#d1c5b4] font-mono">{filtered.length} Shown</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto rounded border border-[#201f1f] bg-[#1c1b1b]">
        <table className="w-full text-left text-xs border-collapse min-w-[920px]">
          <thead>
            <tr className="bg-[#201f1f] text-[#d1c5b4] uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Collections</th>
              <th className="py-3 px-4 text-right">Price / Sale (PKR)</th>
              <th className="py-3 px-4 text-center">Stock</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#201f1f] text-[#e5e2e1]">
            {filtered.map((p) => {
              const isOnSale = typeof p.originalPrice === "number" && p.originalPrice > p.price;
              return (
                <tr key={p.id} className="hover:bg-[#201f1f]/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-12 rounded bg-[#131313] border border-[#2a2a2a] overflow-hidden flex-shrink-0">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-medium text-[#e5e2e1] block">{p.name}</span>
                        <span className="text-[11px] text-[#d1c5b4]/70 line-clamp-1 max-w-[230px]">
                          {p.elementalTheme} · {p.aura} world · {p.collectionName}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#d1c5b4] whitespace-nowrap">{p.sku}</td>
                  <td className="py-3 px-4 text-[#d1c5b4] whitespace-nowrap">{p.category}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {p.collections.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-[#2a2a2a] text-[#d1c5b4] whitespace-nowrap"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono whitespace-nowrap">
                    <span className="font-medium text-[#e8c179] block">{formatPKR(p.price)}</span>
                    {isOnSale && (
                      <span className="text-[10px] text-[#9a8f80] line-through block">
                        {formatPKR(p.originalPrice!)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center font-mono whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] inline-block whitespace-nowrap ${
                        p.stock <= 0
                          ? "bg-[#93000a]/30 text-[#ffb4ab]"
                          : p.stock <= 5
                          ? "bg-[#e9c349]/20 text-[#e9c349]"
                          : "bg-[#2a2a2a] text-[#e5e2e1]"
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleProductStatus(p.id)}
                      title="Click to toggle between Active and Draft"
                      className={`px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-mono cursor-pointer transition-colors ${
                        p.status === "active"
                          ? "bg-[#07513C]/40 text-[#a5f3d0] border border-[#07513C]"
                          : "bg-[#2a2a2a] text-[#d1c5b4] border border-[#3a3939]"
                      }`}
                    >
                      {p.status}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="p-1.5 text-[#d1c5b4] hover:text-[#e8c179] transition-colors"
                        title="Preview on Storefront"
                      >
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-[#d1c5b4] hover:text-[#b89552] transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-[#d1c5b4] hover:text-[#ffb4ab] transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Spacious Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#201f1f]">
              <div>
                <h3 className="text-lg font-semibold text-[#e5e2e1]">
                  {editingProduct ? `Edit Product — ${editingProduct.sku}` : "Create New Product"}
                </h3>
                <p className="text-xs text-[#d1c5b4]/80 mt-0.5">
                  Configure product specifications, pricing, collection assignment, and availability.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#d1c5b4] hover:text-[#e5e2e1] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 text-xs">
              {/* Section 1: Core Identity */}
              <div className="space-y-4 p-4 rounded bg-[#131313] border border-[#2a2a2a]">
                <h4 className="text-[11px] uppercase tracking-wider text-[#b89552] font-semibold">
                  1. Product Identity & Visibility
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Product Title
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] focus:outline-none focus:border-[#b89552]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      required
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] font-mono focus:outline-none focus:border-[#b89552]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Publish Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] focus:outline-none focus:border-[#b89552]"
                    >
                      <option value="active">Active (Visible on Storefront)</option>
                      <option value="draft">Draft (Hidden from Storefront)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] focus:outline-none focus:border-[#b89552]"
                    >
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Card Badge / Edition
                    </label>
                    <input
                      type="text"
                      value={form.edition}
                      onChange={(e) => setForm({ ...form, edition: e.target.value })}
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] focus:outline-none focus:border-[#b89552]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Aura Visual World
                    </label>
                    <select
                      value={form.aura}
                      onChange={(e) => setForm({ ...form, aura: e.target.value as AuraWorld })}
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] focus:outline-none focus:border-[#b89552]"
                    >
                      <option value="obsidian">Obsidian Black</option>
                      <option value="emerald">Royal Emerald</option>
                      <option value="ruby">Ruby Crimson</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Elemental Theme
                    </label>
                    <select
                      value={form.elementalTheme}
                      onChange={(e) =>
                        setForm({ ...form, elementalTheme: e.target.value as ElementalTheme })
                      }
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] focus:outline-none focus:border-[#b89552]"
                    >
                      {ELEMENTAL_THEMES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Signature Collection Label
                    </label>
                    <input
                      type="text"
                      value={form.collectionName}
                      onChange={(e) => setForm({ ...form, collectionName: e.target.value })}
                      placeholder="e.g. VINE, CIGAR & CEDAR, FROST"
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] focus:outline-none focus:border-[#b89552]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing & Inventory */}
              <div className="space-y-4 p-4 rounded bg-[#131313] border border-[#2a2a2a]">
                <h4 className="text-[11px] uppercase tracking-wider text-[#b89552] font-semibold">
                  2. Pricing (PKR) & Vault Inventory
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Selling Price (PKR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] font-mono focus:outline-none focus:border-[#b89552]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Original Price (Optional Sale)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Leave empty if no sale"
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] font-mono focus:outline-none focus:border-[#b89552]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] font-mono focus:outline-none focus:border-[#b89552]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Collection Assignment */}
              <div className="space-y-3 p-4 rounded bg-[#131313] border border-[#2a2a2a]">
                <h4 className="text-[11px] uppercase tracking-wider text-[#b89552] font-semibold">
                  3. Collection Assignment
                </h4>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_COLLECTIONS.map((col) => {
                    const checked = form.collections.includes(col);
                    return (
                      <label
                        key={col}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded border cursor-pointer transition-colors ${
                          checked
                            ? "border-[#b89552] bg-[#b89552]/20 text-[#e5e2e1]"
                            : "border-[#2a2a2a] bg-[#1c1b1b] text-[#d1c5b4]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleCollectionToggle(col)}
                          className="accent-[#b89552]"
                        />
                        <span>{col}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Variants, Details & Imagery */}
              <div className="space-y-4 p-4 rounded bg-[#131313] border border-[#2a2a2a]">
                <h4 className="text-[11px] uppercase tracking-wider text-[#b89552] font-semibold">
                  4. Specifications, Sizes, Colours & Media
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Finishes / Tones (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={form.colorsText}
                      onChange={(e) => setForm({ ...form, colorsText: e.target.value })}
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Formats / Sizes (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={form.sizesText}
                      onChange={(e) => setForm({ ...form, sizesText: e.target.value })}
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] font-mono"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Material Specification (Demo Note)
                    </label>
                    <input
                      type="text"
                      value={form.material}
                      onChange={(e) => setForm({ ...form, material: e.target.value })}
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Care Instructions
                    </label>
                    <input
                      type="text"
                      value={form.careInstructions}
                      onChange={(e) => setForm({ ...form, careInstructions: e.target.value })}
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Short Editorial Description
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={form.shortDesc}
                      onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Object Story Narrative
                    </label>
                    <textarea
                      rows={2}
                      value={form.storyNarrative}
                      onChange={(e) => setForm({ ...form, storyNarrative: e.target.value })}
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1]"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-[#d1c5b4] block">
                      Primary Image Path or URL
                    </label>
                    <input
                      type="text"
                      required
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className="w-full bg-[#1c1b1b] border border-[#2a2a2a] px-3 py-2 rounded text-[#e5e2e1] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[#201f1f]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#201f1f] text-[#d1c5b4] hover:text-[#e5e2e1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#b89552] text-[#432e00] font-semibold hover:bg-[#e8c179] cursor-pointer"
                >
                  {editingProduct ? "Save Product Changes" : "Publish to Catalogue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
