import { products as staticProducts, type Product } from "@/data/products";

const STORAGE_KEY = "ulker-admin-products";
const DELETED_KEY = "ulker-admin-deleted";
const SETTINGS_KEY = "ulker-admin-settings";

export interface SiteSettings {
  floatingImageUrls: string[];
}

const defaultSettings: SiteSettings = {
  floatingImageUrls: [],
};

// --- Server-backed persistence (via Vite upload plugin) ---

async function fetchAdminData(): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch("/api/admin-data");
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

async function pushAdminData(data: Record<string, unknown>) {
  try {
    await fetch("/api/admin-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // Server not available — localStorage still has the data as fallback
  }
}

// --- localStorage helpers (used as fallback / synchronous cache) ---

function loadOverrides(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOverrides(overrides: Product[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    pushAdminData({
      overrides,
      deletedIds: loadDeletedIds(),
      settings: getSettings(),
    });
    return true;
  } catch (err) {
    console.error("[AdminStore] Failed to save products to localStorage:", err);
    return false;
  }
}

function loadDeletedIds(): string[] {
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDeletedIds(ids: string[]) {
  try {
    localStorage.setItem(DELETED_KEY, JSON.stringify(ids));
  } catch {}
}

export function getSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    // Backward compat: migrate old single-URL format to array
    if (parsed.floatingImageUrl && !parsed.floatingImageUrls) {
      parsed.floatingImageUrls = [parsed.floatingImageUrl];
      delete parsed.floatingImageUrl;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
    }
    return { ...defaultSettings, ...parsed };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: SiteSettings): boolean {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    pushAdminData({
      overrides: loadOverrides(),
      deletedIds: loadDeletedIds(),
      settings,
    });
    return true;
  } catch (err) {
    console.error("[AdminStore] Failed to save settings to localStorage:", err);
    return false;
  }
}

// --- Initialize: pull latest from server on startup ---

let initialized = false;

async function initFromServer() {
  if (initialized) return;
  initialized = true;

  const serverData = await fetchAdminData();
  if (!serverData) return;

  // Server has data — sync into localStorage so all components read consistently
  if (serverData.overrides) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData.overrides));
  }
  if (serverData.deletedIds) {
    localStorage.setItem(DELETED_KEY, JSON.stringify(serverData.deletedIds));
  }
  if (serverData.settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(serverData.settings));
  }
}

// Kick off async init (non-blocking)
initFromServer();

export function getAllProducts(): Product[] {
  const overrides = loadOverrides();
  const deletedIds = loadDeletedIds();
  const overrideMap = new Map(overrides.map((p) => [p.id, p]));

  const merged = staticProducts
    .filter((p) => !deletedIds.includes(p.id))
    .map((p) => overrideMap.get(p.id) ?? p);

  const customProducts = overrides.filter(
    (p) => !staticProducts.some((sp) => sp.id === p.id) && !deletedIds.includes(p.id)
  );

  return [...merged, ...customProducts];
}

export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}

export function addProduct(product: Product): boolean {
  const overrides = loadOverrides();
  overrides.push(product);
  return saveOverrides(overrides);
}

export function updateProduct(id: string, updates: Partial<Product>): boolean {
  const overrides = loadOverrides();
  const existing = overrides.find((p) => p.id === id);
  const staticProd = staticProducts.find((p) => p.id === id);
  const base = existing ?? staticProd;

  if (!base) return false;

  const merged = { ...base, ...updates, id: base.id };
  const idx = overrides.findIndex((p) => p.id === id);
  if (idx >= 0) {
    overrides[idx] = merged;
  } else {
    overrides.push(merged);
  }
  return saveOverrides(overrides);
}

export function deleteProduct(id: string) {
  const deletedIds = loadDeletedIds();
  if (!deletedIds.includes(id)) {
    deletedIds.push(id);
    saveDeletedIds(deletedIds);
  }
  const overrides = loadOverrides();
  const filtered = overrides.filter((p) => p.id !== id);
  saveOverrides(filtered);
}

export function resetAllData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DELETED_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  // Also clear server-side data
  pushAdminData({ overrides: [], deletedIds: [], settings: defaultSettings });
}

export function getRelatedProducts(product: Product): Product[] {
  const all = getAllProducts();
  return product.relatedProductIds
    .map((id) => all.find((p) => p.id === id))
    .filter(Boolean) as Product[];
}

export function getProductsByCategory(cat: string): Product[] {
  return getAllProducts().filter((p) => p.category === cat);
}

// --- Offers ---

export interface BundleItem {
  productName: string;
  quantity: number;
}

export interface Offer {
  id: string;
  type: "bundle" | "discount";
  title: string;
  description: string;
  images: string[];
  coverIndex: number;
  // Bundle fields
  bundleItems: BundleItem[];
  // Pricing
  originalPrice: string;
  offerPrice: string;
  // Discount fields
  discountPercent: string;
  discountAmount: string;
  // Computed
  savingPercent: string;
  // Meta
  offerType: string;
  badgeColor: string;
  isFeatured: boolean;
  startsAt: string;
  endsAt: string;
}

function migrateOffer(o: any): Offer {
  const images: string[] = o.images ?? (o.imageUrl ? [o.imageUrl] : []);
  return {
    id: o.id ?? "",
    type: o.type ?? "discount",
    title: o.title ?? "",
    description: o.description ?? "",
    images,
    coverIndex: o.coverIndex ?? 0,
    bundleItems: o.bundleItems ?? [],
    originalPrice: o.originalPrice ?? "",
    offerPrice: o.offerPrice ?? "",
    discountPercent: o.discountPercent ?? o.discount?.replace(/[^0-9.]/g, "") ?? "",
    discountAmount: o.discountAmount ?? "",
    offerType: o.offerType ?? "",
    badgeColor: o.badgeColor ?? "#E31837",
    isFeatured: o.isFeatured ?? false,
    savingPercent: o.savingPercent ?? "",
    startsAt: o.startsAt ?? "",
    endsAt: o.endsAt ?? "",
  };
}

const OFFERS_KEY = "ulker-admin-offers";

let offersCache: Offer[] | null = null;

async function fetchOffersFromServer(): Promise<Offer[]> {
  try {
    const res = await fetch("/api/offers");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const migrated = data.map(migrateOffer);
        offersCache = migrated;
        localStorage.setItem(OFFERS_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
  } catch {}
  return loadOffersLocal();
}

function loadOffersLocal(): Offer[] {
  if (offersCache) return offersCache;
  try {
    const raw = localStorage.getItem(OFFERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      offersCache = Array.isArray(parsed) ? parsed.map(migrateOffer) : [];
    } else {
      offersCache = [];
    }
  } catch {
    offersCache = [];
  }
  return offersCache!;
}

function persistOffers(offers: Offer[]) {
  offersCache = offers;
  try {
    localStorage.setItem(OFFERS_KEY, JSON.stringify(offers));
  } catch {}
  fetch("/api/offers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(offers),
  }).catch(() => {});
}

export function getAllOffers(): Offer[] {
  return loadOffersLocal();
}

export async function refreshOffersFromServer(): Promise<Offer[]> {
  return fetchOffersFromServer();
}

export function addOffer(offer: Offer): boolean {
  const offers = loadOffersLocal();
  offers.push(offer);
  persistOffers(offers);
  return true;
}

export function updateOffer(id: string, updates: Partial<Offer>): boolean {
  const offers = loadOffersLocal();
  const idx = offers.findIndex((o) => o.id === id);
  if (idx < 0) return false;
  offers[idx] = { ...offers[idx], ...updates, id: offers[idx].id };
  persistOffers(offers);
  return true;
}

export function deleteOffer(id: string) {
  const offers = loadOffersLocal().filter((o) => o.id !== id);
  persistOffers(offers);
}

// Init: pull offers from server on startup
fetchOffersFromServer();

// --- Favorites ---

const FAVORITES_KEY = "ulker-favorites";

export function getFavorites(): Record<string, number> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function fetchServerFavorites(): Promise<Record<string, number>> {
  try {
    const res = await fetch("/api/favorites");
    if (res.ok) {
      const data = await res.json();
      // Sync to localStorage cache
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(data));
      return data;
    }
  } catch {}
  return getFavorites();
}

export function getMyFavorites(): string[] {
  try {
    const raw = localStorage.getItem("ulker-my-favorites");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(productId: string): string[] {
  const mine = getMyFavorites();
  const isRemoving = mine.includes(productId);
  const next = isRemoving
    ? mine.filter((id) => id !== productId)
    : [...mine, productId];
  try {
    localStorage.setItem("ulker-my-favorites", JSON.stringify(next));
  } catch {}

  // Only increment server count when adding a favorite, not removing
  if (!isRemoving) {
    try {
      fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      }).catch(() => {});
    } catch {}

    // Also update localStorage cache for immediate display
    const stats = getFavorites();
    stats[productId] = (stats[productId] || 0) + 1;
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(stats));
    } catch {}
  }
  return next;
}
