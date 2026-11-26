"use client";

import {
  CartItem,
  Product,
  CollectionRecord,
  Order,
  InventoryItem,
  CustomerProfile,
  DiscountCode,
} from "../types";
import {
  INITIAL_PRODUCTS,
  INITIAL_COLLECTIONS,
  INITIAL_ORDERS,
  INITIAL_INVENTORY,
  INITIAL_CUSTOMERS,
  INITIAL_DISCOUNTS,
} from "./data";

const CATALOG_VERSION = "la_verno_v3_aura_luxury_19";
const VERSION_KEY = "la_verno_catalog_version";

const CART_KEY = "la_verno_cart";
const WISHLIST_KEY = "la_verno_wishlist";
const ORDERS_KEY = "la_verno_orders";
const PRODUCTS_KEY = "la_verno_products";
const COLLECTIONS_KEY = "la_verno_collections";
const INVENTORY_KEY = "la_verno_inventory";
const CUSTOMERS_KEY = "la_verno_customers";
const DISCOUNTS_KEY = "la_verno_discounts";
const USER_KEY = "la_verno_user";
const SETTINGS_KEY = "la_verno_settings";

function ensureSeededCatalog(): void {
  if (typeof window === "undefined") return;
  try {
    const existingVersion = localStorage.getItem(VERSION_KEY);
    if (existingVersion !== CATALOG_VERSION) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(INITIAL_COLLECTIONS));
      localStorage.setItem(INVENTORY_KEY, JSON.stringify(INITIAL_INVENTORY));
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      localStorage.setItem(DISCOUNTS_KEY, JSON.stringify(INITIAL_DISCOUNTS));
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(CART_KEY, JSON.stringify([]));
      localStorage.setItem(WISHLIST_KEY, JSON.stringify([]));
      localStorage.setItem(VERSION_KEY, CATALOG_VERSION);
    }
  } catch (e) {
    console.error("Error migrating catalog version:", e);
  }
}

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  ensureSeededCatalog();
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("la_verno_storage_changed"));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

// ---------------- Cart ---------------- //
export function getCart(): CartItem[] {
  return getStorage<CartItem[]>(CART_KEY, []);
}

export function addToCart(
  product: Product,
  quantity = 1,
  selectedVariants: Record<string, string> = {}
): CartItem[] {
  const defaultColor = product.variants?.[0]?.options?.[0] || product.colors[0] || "Standard";
  const defaultSize = product.variants?.[1]?.options?.[0] || product.sizes[0] || "Standard";
  const primaryKey = product.variants?.[0]?.name || "Edition";
  const secondaryKey = product.variants?.[1]?.name || "Format";

  const resolvedVariants: Record<string, string> =
    Object.keys(selectedVariants).length > 0
      ? selectedVariants
      : { [primaryKey]: defaultColor, [secondaryKey]: defaultSize };

  const current = getCart();
  const existingIdx = current.findIndex(
    (item) =>
      item.product.id === product.id &&
      JSON.stringify(item.selectedVariants) === JSON.stringify(resolvedVariants)
  );

  let updated: CartItem[];
  if (existingIdx > -1) {
    updated = [...current];
    updated[existingIdx].quantity = Math.min(
      Math.max(1, product.stock),
      updated[existingIdx].quantity + quantity
    );
  } else {
    updated = [...current, { product, quantity, selectedVariants: resolvedVariants }];
  }
  setStorage(CART_KEY, updated);
  return updated;
}

export function updateCartQuantity(
  productId: string,
  quantity: number,
  selectedVariants: Record<string, string> = {}
): CartItem[] {
  const current = getCart();
  if (quantity <= 0) {
    return removeFromCart(productId, selectedVariants);
  }
  const updated = current.map((item) => {
    if (
      item.product.id === productId &&
      JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
    ) {
      return { ...item, quantity };
    }
    return item;
  });
  setStorage(CART_KEY, updated);
  return updated;
}

export function removeFromCart(
  productId: string,
  selectedVariants: Record<string, string> = {}
): CartItem[] {
  const current = getCart();
  const updated = current.filter(
    (item) =>
      !(
        item.product.id === productId &&
        JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
      )
  );
  setStorage(CART_KEY, updated);
  return updated;
}

export function clearCart(): void {
  setStorage(CART_KEY, []);
}

// ---------------- Wishlist ---------------- //
export function getWishlist(): string[] {
  return getStorage<string[]>(WISHLIST_KEY, []);
}

export function toggleWishlist(productId: string): string[] {
  const current = getWishlist();
  const exists = current.includes(productId);
  const updated = exists ? current.filter((id) => id !== productId) : [...current, productId];
  setStorage(WISHLIST_KEY, updated);
  return updated;
}

// ---------------- Products ---------------- //
export function getProducts(): Product[] {
  return getStorage<Product[]>(PRODUCTS_KEY, INITIAL_PRODUCTS);
}

export function getActiveProducts(): Product[] {
  return getProducts().filter((p) => p.status === "active");
}

export function addProduct(product: Product): Product[] {
  const current = getProducts();
  const updated = [product, ...current];
  setStorage(PRODUCTS_KEY, updated);

  const inventory = getInventory();
  const newInvItem: InventoryItem = {
    id: `inv-${Date.now()}`,
    productId: product.id,
    name: product.name,
    sku: product.sku,
    category: product.category,
    location: "Karachi Clifton Vault",
    stock: product.stock,
    lowStockThreshold: 4,
    status: product.stock <= 0 ? "Out of Stock" : product.stock <= 4 ? "Low Stock" : "In Stock",
    lastAuditDate: new Date().toISOString().split("T")[0],
  };
  setStorage(INVENTORY_KEY, [newInvItem, ...inventory]);
  return updated;
}

export function updateProduct(product: Product): Product[] {
  const current = getProducts();
  const updated = current.map((p) => (p.id === product.id ? product : p));
  setStorage(PRODUCTS_KEY, updated);

  const inventory = getInventory();
  const updatedInv = inventory.map((inv) => {
    if (inv.productId === product.id) {
      const invStatus: "In Stock" | "Low Stock" | "Out of Stock" =
        product.stock <= 0 ? "Out of Stock" : product.stock <= inv.lowStockThreshold ? "Low Stock" : "In Stock";
      return {
        ...inv,
        name: product.name,
        sku: product.sku,
        category: product.category,
        stock: product.stock,
        status: invStatus,
        lastAuditDate: new Date().toISOString().split("T")[0],
      };
    }
    return inv;
  });
  setStorage(INVENTORY_KEY, updatedInv);
  return updated;
}

export function toggleProductStatus(productId: string): Product[] {
  const current = getProducts();
  const updated = current.map((p) =>
    p.id === productId
      ? { ...p, status: (p.status === "active" ? "draft" : "active") as Product["status"] }
      : p
  );
  setStorage(PRODUCTS_KEY, updated);
  return updated;
}

export function deleteProduct(productId: string): Product[] {
  const current = getProducts();
  const updated = current.filter((p) => p.id !== productId);
  setStorage(PRODUCTS_KEY, updated);

  const inventory = getInventory();
  setStorage(
    INVENTORY_KEY,
    inventory.filter((i) => i.productId !== productId)
  );
  return updated;
}

// ---------------- Collections ---------------- //
export function getCollections(): CollectionRecord[] {
  return getStorage<CollectionRecord[]>(COLLECTIONS_KEY, INITIAL_COLLECTIONS);
}

export function addCollection(collection: CollectionRecord): CollectionRecord[] {
  const current = getCollections();
  const updated = [...current, collection];
  setStorage(COLLECTIONS_KEY, updated);
  return updated;
}

// ---------------- Inventory ---------------- //
export function getInventory(): InventoryItem[] {
  return getStorage<InventoryItem[]>(INVENTORY_KEY, INITIAL_INVENTORY);
}

export function updateStock(invId: string, newStock: number): InventoryItem[] {
  const current = getInventory();
  let targetProductId: string | null = null;
  const updated = current.map((item) => {
    if (item.id === invId) {
      targetProductId = item.productId;
      const status: "In Stock" | "Low Stock" | "Out of Stock" =
        newStock <= 0 ? "Out of Stock" : newStock <= item.lowStockThreshold ? "Low Stock" : "In Stock";
      return {
        ...item,
        stock: newStock,
        status,
        lastAuditDate: new Date().toISOString().split("T")[0],
      };
    }
    return item;
  });
  setStorage(INVENTORY_KEY, updated);

  if (targetProductId) {
    const products = getProducts();
    const updatedProducts = products.map((p) =>
      p.id === targetProductId ? { ...p, stock: newStock } : p
    );
    setStorage(PRODUCTS_KEY, updatedProducts);
  }

  return updated;
}

// ---------------- Orders ---------------- //
export function getOrders(): Order[] {
  return getStorage<Order[]>(ORDERS_KEY, INITIAL_ORDERS);
}

export function addOrder(order: Order): Order[] {
  const current = getOrders();
  const updated = [order, ...current];
  setStorage(ORDERS_KEY, updated);

  const inventory = getInventory();
  order.items.forEach((orderItem) => {
    const inv = inventory.find((i) => i.productId === orderItem.productId);
    if (inv) {
      updateStock(inv.id, Math.max(0, inv.stock - orderItem.quantity));
    }
  });

  return updated;
}

export function updateOrderStatus(orderId: string, status: Order["status"]): Order[] {
  const current = getOrders();
  const updated = current.map((o) => (o.id === orderId ? { ...o, status } : o));
  setStorage(ORDERS_KEY, updated);
  return updated;
}

// ---------------- Customers ---------------- //
export function getCustomers(): CustomerProfile[] {
  return getStorage<CustomerProfile[]>(CUSTOMERS_KEY, INITIAL_CUSTOMERS);
}

export function addCustomer(customer: CustomerProfile): CustomerProfile[] {
  const current = getCustomers();
  const updated = [...current, customer];
  setStorage(CUSTOMERS_KEY, updated);
  return updated;
}

// ---------------- Discounts ---------------- //
export function getDiscounts(): DiscountCode[] {
  return getStorage<DiscountCode[]>(DISCOUNTS_KEY, INITIAL_DISCOUNTS);
}

export function validateDiscount(
  code: string,
  currentTotal: number
): { valid: boolean; discountAmount: number; message: string } {
  const discounts = getDiscounts();
  const match = discounts.find((d) => d.code.toUpperCase() === code.trim().toUpperCase());
  if (!match) {
    return { valid: false, discountAmount: 0, message: "Invalid or expired protocol code." };
  }
  if (currentTotal < match.minOrder) {
    return {
      valid: false,
      discountAmount: 0,
      message: `Minimum order for this code is PKR ${match.minOrder.toLocaleString()}.`,
    };
  }
  const discountAmount =
    match.type === "percentage" ? Math.round((currentTotal * match.value) / 100) : match.value;
  return { valid: true, discountAmount, message: `Protocol applied: ${match.code}` };
}

// ---------------- Demo User ---------------- //
export function getCurrentUser(): CustomerProfile | null {
  return getStorage<CustomerProfile | null>(USER_KEY, INITIAL_CUSTOMERS[0]);
}

export function setCurrentUser(user: CustomerProfile | null): void {
  setStorage(USER_KEY, user);
}

// ---------------- Store Settings ---------------- //
export interface StoreSettings {
  storeName: string;
  tagline: string;
  currency: string;
  supportPhone: string;
  supportEmail: string;
  salonAddressKarachi: string;
  salonAddressLahore: string;
  salonAddressIslamabad: string;
  escrowProvider: string;
  freeShippingThreshold: number;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "LA VER’nO",
  tagline: "WAYS OF MEN",
  currency: "PKR",
  supportPhone: "+92 21 3587 9000",
  supportEmail: "concierge@la-verno.pk",
  salonAddressKarachi: "Clifton Quarters, Karachi",
  salonAddressLahore: "Gulberg Conservatory, Lahore",
  salonAddressIslamabad: "Sector F-7 Diplomatic Lounge, Islamabad",
  escrowProvider: "SBP Escrow & PayFast Clearance",
  freeShippingThreshold: 25000,
};

export function getStoreSettings(): StoreSettings {
  return getStorage<StoreSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);
}

export function updateStoreSettings(settings: StoreSettings): StoreSettings {
  setStorage(SETTINGS_KEY, settings);
  return settings;
}
