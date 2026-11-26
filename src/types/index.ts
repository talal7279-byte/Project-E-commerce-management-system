export type ProductCategory = 'Watches' | 'Ties' | 'Cufflinks' | 'Perfumes';

export type AuraWorld = 'obsidian' | 'emerald' | 'ruby';

export type ElementalTheme =
  | 'VINE'
  | 'CIGAR & CEDAR'
  | 'FROST'
  | 'SNOW'
  | 'FIRE'
  | 'WOOD'
  | 'OBSIDIAN';

export type ProductStatus = 'active' | 'draft';

export interface ProductStory {
  inspiration: string;
  narrative: string;
  materials: string;
  character: string;
  quote?: string;
}

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: ProductCategory;
  collectionName: string;
  collections: string[];
  aura: AuraWorld;
  elementalTheme: ElementalTheme;
  tagline: string;
  edition: string;
  price: number;
  originalPrice?: number;
  images: string[];
  shortDesc: string;
  details: string[];
  material: string;
  careInstructions: string;
  colors: string[];
  sizes: string[];
  story: ProductStory;
  specifications: Record<string, string>;
  stock: number;
  status: ProductStatus;
  featured: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  commissionLimit: string;
  variants: ProductVariant[];
}

export interface CollectionRecord {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  aura: AuraWorld;
  filterType: 'category' | 'collection' | 'theme';
  filterValue: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
}

export interface Order {
  id: string;
  date: string;
  items: {
    productId: string;
    name: string;
    sku?: string;
    price: number;
    quantity: number;
    image: string;
    variants?: Record<string, string>;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'In Transit' | 'Settled' | 'Verification Required' | 'Dispatched' | 'Delivered' | 'Pending Escrow';
  paymentMethod: 'Direct Escrow (Meezan)' | 'Online Card (PayFast)' | 'Concierge COD' | 'Bank Transfer (HBL)';
  shippingAddress: {
    fullName: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    postalCode: string;
  };
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  tier: 'Patron' | 'Tier 1 Privileged' | 'Salon Privé Member';
  registeredDate: string;
  kycVerified: boolean;
}

export interface InventoryItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  category: string;
  location: string;
  stock: number;
  lowStockThreshold: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastAuditDate: string;
}

export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  expiryDate: string;
}
