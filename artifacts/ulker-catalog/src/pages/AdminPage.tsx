import { useState, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Pencil,
  Save,
  X,
  Search,
  Package,
  LogOut,
  RotateCcw,
  Eye,
  EyeOff,
  Settings,
  Star,
  Tag,
  Calendar,
  GripVertical,
  Image as ImageIcon,
  Sparkles,
  Layers,
} from "lucide-react";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  resetAllData,
  getSettings,
  saveSettings,
  getFavorites,
  fetchServerFavorites,
  getAllOffers,
  refreshOffersFromServer,
  addOffer,
  updateOffer,
  deleteOffer,
  type SiteSettings,
  type Offer,
  type BundleItem,
} from "@/data/admin-store";
import type { Product } from "@/data/products";
import { categoryData } from "@/data/categories";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/common/ImageUpload";

const ADMIN_PASSWORD = "ahmad";
const AUTH_KEY = "ulker-admin-auth";

function makeId(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function emptyProduct(): Product {
  return {
    id: "",
    name: "",
    category: categoryData[0]?.name ?? "Biscuits",
    description: "",
    shortDescription: "",
    stockStatus: "in_stock",
    sku: "",
    barcode: "",
    country: "Türkiye",
    shelfLife: "",
    isNew: false,
    isPopular: false,
    packaging: {
      weight: "",
      pieces: 1,
      cartonQty: 1,
      packageType: "",
      dimensions: "",
    },
    nutrition: {
      servingSize: "",
      calories: 0,
      protein: 0,
      fat: 0,
      saturatedFat: 0,
      carbs: 0,
      sugar: 0,
      fiber: 0,
      salt: 0,
    },
    ingredients: "",
    allergens: { contains: [], mayContain: [] },
    taste: "",
    texture: "",
    storageInstructions: "",
    servingSuggestions: "",
    imageUrl: "https://placehold.co/600x600/FAFAFA/6B1A2A?text=New+Product&font=inter",
    thumbnails: [],
    relatedProductIds: [],
  };
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Issue 4: Wrap session storage in try-catch to handle private browsing / quota errors
  const safeSetSession = (key: string, value: string): boolean => {
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch (err) {
      console.error("[Admin] sessionStorage write failed:", err);
      setLoginError("Session storage unavailable. Check browser settings.");
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      if (pw === ADMIN_PASSWORD) {
        if (safeSetSession(AUTH_KEY, "1")) {
          onLogin();
        }
      } else {
        setError(true);
        setTimeout(() => setError(false), 1500);
      }
    } catch (err) {
      console.error("[Admin] Login error:", err);
      setLoginError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Package size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Product Management</p>
          </div>
        </div>

        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
          Password
        </label>
        <div className="relative mb-4">
          <input
            type={showPw ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Enter admin password"
            className={`w-full px-4 py-2.5 pr-10 rounded-xl border text-sm bg-background outline-none transition-all ${
              error ? "border-red-500" : "border-border focus:border-primary"
            }`}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-xs mb-3">Wrong password</p>
        )}

        {/* Issue 4: Show login-level errors (session storage, unexpected) */}
        {loginError && (
          <p className="text-red-500 text-xs mb-3">{loginError}</p>
        )}

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Login
        </button>
      </motion.form>
    </div>
  );
}

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product;
  onSave: (p: Product) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Product>({ ...product });

  const set = <K extends keyof Product>(key: K, val: Product[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setNested = (key: keyof Product, sub: string, val: unknown) =>
    setForm((f) => ({
      ...f,
      [key]: { ...(f[key] as Record<string, unknown>), [sub]: val },
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const final = { ...form };
    if (!final.id) final.id = makeId(final.name);
    onSave(final);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-2xl p-6 mb-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">
            {product.id ? "Edit Product" : "New Product"}
          </h3>
          <button type="button" onClick={onCancel} className="p-1 hover:bg-muted rounded-lg">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name" required>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="input-field"
              required
            />
          </Field>

          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="input-field"
            >
              {categoryData.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="SKU">
            <input
              value={form.sku}
              onChange={(e) => set("sku", e.target.value)}
              className="input-field"
            />
          </Field>

          <Field label="Barcode">
            <input
              value={form.barcode}
              onChange={(e) => set("barcode", e.target.value)}
              className="input-field"
            />
          </Field>

          <Field label="Country">
            <input
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              className="input-field"
            />
          </Field>

          <Field label="Shelf Life">
            <input
              value={form.shelfLife}
              onChange={(e) => set("shelfLife", e.target.value)}
              className="input-field"
              placeholder="e.g. 12 months"
            />
          </Field>

          <Field label="Stock Status">
            <select
              value={form.stockStatus}
              onChange={(e) => set("stockStatus", e.target.value as Product["stockStatus"])}
              className="input-field"
            >
              <option value="in_stock">In Stock</option>
              <option value="limited">Limited</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </Field>

          {/* Issue 3: Replaced URL text input with drag-and-drop ImageUpload */}
          <ImageUpload
            label="Product Image"
            value={form.imageUrl}
            onChange={(dataUrl) => set("imageUrl", dataUrl)}
          />
        </div>

        <Field label="Short Description">
          <input
            value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
            className="input-field"
          />
        </Field>

        <Field label="Full Description">
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="input-field min-h-[80px]"
            rows={3}
          />
        </Field>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Weight">
            <input
              value={form.packaging.weight}
              onChange={(e) => setNested("packaging", "weight", e.target.value)}
              className="input-field"
              placeholder="e.g. 172g"
            />
          </Field>
          <Field label="Pieces/Box">
            <input
              type="number"
              value={form.packaging.pieces}
              onChange={(e) => setNested("packaging", "pieces", Number(e.target.value))}
              className="input-field"
            />
          </Field>
          <Field label="Carton Qty">
            <input
              type="number"
              value={form.packaging.cartonQty}
              onChange={(e) => setNested("packaging", "cartonQty", Number(e.target.value))}
              className="input-field"
            />
          </Field>
          <Field label="Package Type">
            <input
              value={form.packaging.packageType}
              onChange={(e) => setNested("packaging", "packageType", e.target.value)}
              className="input-field"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Calories">
            <input
              type="number"
              value={form.nutrition.calories}
              onChange={(e) => setNested("nutrition", "calories", Number(e.target.value))}
              className="input-field"
            />
          </Field>
          <Field label="Protein (g)">
            <input
              type="number"
              step="0.1"
              value={form.nutrition.protein}
              onChange={(e) => setNested("nutrition", "protein", Number(e.target.value))}
              className="input-field"
            />
          </Field>
          <Field label="Fat (g)">
            <input
              type="number"
              step="0.1"
              value={form.nutrition.fat}
              onChange={(e) => setNested("nutrition", "fat", Number(e.target.value))}
              className="input-field"
            />
          </Field>
          <Field label="Carbs (g)">
            <input
              type="number"
              step="0.1"
              value={form.nutrition.carbs}
              onChange={(e) => setNested("nutrition", "carbs", Number(e.target.value))}
              className="input-field"
            />
          </Field>
        </div>

        <Field label="Ingredients">
          <textarea
            value={form.ingredients}
            onChange={(e) => set("ingredients", e.target.value)}
            className="input-field min-h-[60px]"
            rows={2}
          />
        </Field>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(e) => set("isNew", e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">New</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPopular}
              onChange={(e) => set("isPopular", e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">Popular</span>
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Save size={16} /> Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function StockBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    in_stock: "bg-green-100 text-green-700",
    limited: "bg-amber-100 text-amber-700",
    out_of_stock: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    in_stock: "In Stock",
    limited: "Limited",
    out_of_stock: "Out of Stock",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status] ?? ""}`}>
      {labels[status] ?? status}
    </span>
  );
}

function OfferForm({
  offer,
  onSave,
  onCancel,
}: {
  offer: Offer | null;
  onSave: (o: Offer) => void;
  onCancel: () => void;
}) {
  const defaults: Offer = {
    id: "",
    type: "discount",
    title: "",
    description: "",
    images: [],
    coverIndex: 0,
    bundleItems: [{ productName: "", quantity: 1 }],
    originalPrice: "",
    offerPrice: "",
    discountPercent: "",
    discountAmount: "",
    savingPercent: "",
    offerType: "",
    badgeColor: "#E31837",
    isFeatured: false,
    startsAt: new Date().toISOString().slice(0, 10),
    endsAt: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  };

  const [form, setForm] = useState<Offer>(() => {
    if (!offer) return defaults;
    return { ...defaults, ...offer, bundleItems: offer.bundleItems?.length ? offer.bundleItems : [{ productName: "", quantity: 1 }] };
  });

  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const set = <K extends keyof Offer>(key: K, val: Offer[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  // Auto-calc saving percent
  const computedSaving = useMemo(() => {
    if (form.type === "bundle") {
      const orig = parseFloat(form.originalPrice);
      const off = parseFloat(form.offerPrice);
      if (orig > 0 && off > 0 && orig > off) {
        return Math.round(((orig - off) / orig) * 100).toString();
      }
    } else {
      const pct = parseFloat(form.discountPercent);
      if (pct > 0 && pct <= 100) return Math.round(pct).toString();
      const orig = parseFloat(form.originalPrice);
      const fin = parseFloat(form.offerPrice);
      if (orig > 0 && fin > 0 && orig > fin) {
        return Math.round(((orig - fin) / orig) * 100).toString();
      }
    }
    return "";
  }, [form.type, form.originalPrice, form.offerPrice, form.discountPercent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const final = { ...form, savingPercent: computedSaving };
    if (!final.id) final.id = `offer-${Date.now()}`;
    onSave(final);
  };

  // Image drag reorder
  const onImageDragStart = (idx: number) => setDragIdx(idx);
  const onImageDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const imgs = [...form.images];
    const [moved] = imgs.splice(dragIdx, 1);
    imgs.splice(idx, 0, moved);
    let cover = form.coverIndex;
    if (cover === dragIdx) cover = idx;
    else if (dragIdx < cover && idx >= cover) cover--;
    else if (dragIdx > cover && idx <= cover) cover++;
    setForm((f) => ({ ...f, images: imgs, coverIndex: Math.min(cover, imgs.length - 1) }));
    setDragIdx(idx);
  };
  const onImageDragEnd = () => setDragIdx(null);

  // Bundle items helpers
  const addBundleItem = () => setForm((f) => ({ ...f, bundleItems: [...f.bundleItems, { productName: "", quantity: 1 }] }));
  const removeBundleItem = (idx: number) => setForm((f) => ({ ...f, bundleItems: f.bundleItems.filter((_, i) => i !== idx) }));
  const updateBundleItem = (idx: number, field: keyof BundleItem, val: string | number) =>
    setForm((f) => ({ ...f, bundleItems: f.bundleItems.map((item, i) => i === idx ? { ...item, [field]: val } : item) }));

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 mb-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground text-lg">{offer ? "Edit Offer" : "Create New Offer"}</h3>
          <button type="button" onClick={onCancel} className="p-1 hover:bg-muted rounded-lg"><X size={18} className="text-muted-foreground" /></button>
        </div>

        {/* Offer Type Selector */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Offer Type</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => set("type", "bundle")}
              className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                form.type === "bundle"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-border/80"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.type === "bundle" ? "bg-primary/10" : "bg-muted"}`}>
                <Layers size={20} className={form.type === "bundle" ? "text-primary" : "text-muted-foreground"} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Bundle Offer</p>
                <p className="text-xs text-muted-foreground">Multiple products, one price</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => set("type", "discount")}
              className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                form.type === "discount"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-border/80"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.type === "discount" ? "bg-primary/10" : "bg-muted"}`}>
                <Tag size={20} className={form.type === "discount" ? "text-primary" : "text-muted-foreground"} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Discount Offer</p>
                <p className="text-xs text-muted-foreground">Percentage or fixed discount</p>
              </div>
            </button>
          </div>
        </div>

        {/* Basic info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Offer Title" required>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} className="input-field" required
              placeholder={form.type === "bundle" ? "e.g. Albeni Duo Offer" : "e.g. Chocolate Special Discount"} />
          </Field>
          <Field label="Badge Label">
            <input value={form.offerType} onChange={(e) => set("offerType", e.target.value)} className="input-field"
              placeholder="e.g. Flash Sale, Seasonal, BOGO" />
          </Field>
        </div>

        {/* Bundle Items */}
        {form.type === "bundle" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Products in Bundle</label>
              <button type="button" onClick={addBundleItem}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors">
                <Plus size={12} /> Add Product
              </button>
            </div>
            <div className="space-y-2">
              {form.bundleItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-muted/40 rounded-xl p-2.5">
                  <span className="text-xs font-bold text-muted-foreground w-6 text-center">#{idx + 1}</span>
                  <select
                    value={item.productName}
                    onChange={(e) => updateBundleItem(idx, "productName", e.target.value)}
                    className="input-field flex-1"
                    required
                  >
                    <option value="">-- Select Product --</option>
                    {getAllProducts().map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateBundleItem(idx, "quantity", Math.max(1, Number(e.target.value)))}
                    className="input-field w-20 text-center"
                    required
                  />
                  <span className="text-[10px] text-muted-foreground font-medium">qty</span>
                  {form.bundleItems.length > 1 && (
                    <button type="button" onClick={() => removeBundleItem(idx)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discount fields */}
        {form.type === "discount" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Discount %">
              <input value={form.discountPercent} onChange={(e) => set("discountPercent", e.target.value)} className="input-field"
                placeholder="e.g. 25" type="number" min="0" max="100" />
            </Field>
            <Field label="Discount Amount ($)">
              <input value={form.discountAmount} onChange={(e) => set("discountAmount", e.target.value)} className="input-field"
                placeholder="e.g. 5.00" />
            </Field>
            <div />
          </div>
        )}

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Original Price ($)" required>
            <input value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} className="input-field"
              placeholder="e.g. 35.00" required />
          </Field>
          <Field label={form.type === "bundle" ? "Bundle Price ($)" : "Final Price ($)"} required>
            <input value={form.offerPrice} onChange={(e) => set("offerPrice", e.target.value)} className="input-field"
              placeholder="e.g. 25.00" required />
          </Field>
          <div className="flex items-end">
            {computedSaving && (
              <div className="w-full px-4 py-2.5 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  SAVE {computedSaving}%
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Multi-image upload with drag reorder */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
            Product Images ({form.images.length})
          </label>
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {form.images.map((url, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={() => onImageDragStart(idx)}
                  onDragOver={(e) => onImageDragOver(e, idx)}
                  onDragEnd={onImageDragEnd}
                  className={`relative group w-24 h-24 rounded-xl border-2 overflow-hidden bg-white flex-shrink-0 shadow-sm transition-all ${
                    dragIdx === idx ? "opacity-50 scale-95" : ""
                  } ${form.coverIndex === idx ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
                >
                  <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-contain p-1.5" />
                  {/* Drag handle */}
                  <div className="absolute top-1 left-1 p-0.5 rounded bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                    <GripVertical size={12} />
                  </div>
                  {/* Set as cover */}
                  <button
                    type="button"
                    onClick={() => set("coverIndex", idx)}
                    className={`absolute top-1 right-1 p-0.5 rounded text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity ${
                      form.coverIndex === idx ? "bg-primary text-primary-foreground" : "bg-background/80 text-muted-foreground"
                    }`}
                    title="Set as cover"
                  >
                    {form.coverIndex === idx ? "COVER" : "SET"}
                  </button>
                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => {
                      const imgs = form.images.filter((_, i) => i !== idx);
                      let cover = form.coverIndex;
                      if (idx < cover) cover--;
                      else if (idx === cover) cover = 0;
                      setForm((f) => ({ ...f, images: imgs, coverIndex: Math.min(cover, Math.max(0, imgs.length - 1)) }));
                    }}
                    className="absolute bottom-1 right-1 p-0.5 rounded-md bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                  <span className="absolute bottom-1 left-1 px-1 py-0.5 rounded bg-background/80 text-[8px] font-medium text-muted-foreground">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
          <ImageUpload label="" value="" onChange={(url) => { if (url) setForm((f) => ({ ...f, images: [...f.images, url] })); }} />
          <p className="text-[10px] text-muted-foreground mt-1">Drag thumbnails to reorder. First image is the cover. Use transparent PNGs.</p>
        </div>

        {/* Description */}
        <Field label="Description">
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="input-field min-h-[80px]" rows={3}
            placeholder="Describe the offer..." />
        </Field>

        {/* Dates + Options row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Field label="Start Date" required>
            <input type="date" value={form.startsAt.slice(0, 10)} onChange={(e) => set("startsAt", e.target.value)} className="input-field" required />
          </Field>
          <Field label="End Date" required>
            <input type="date" value={form.endsAt.slice(0, 10)} onChange={(e) => set("endsAt", e.target.value)} className="input-field" required />
          </Field>
          <Field label="Badge Color">
            <div className="flex items-center gap-2">
              <input type="color" value={form.badgeColor} onChange={(e) => set("badgeColor", e.target.value)}
                className="w-9 h-9 rounded-lg border border-border cursor-pointer flex-shrink-0" />
              <input value={form.badgeColor} onChange={(e) => set("badgeColor", e.target.value)} className="input-field text-xs" />
            </div>
          </Field>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div className="relative">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="sr-only peer" />
                <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
              </div>
              <span className="text-sm font-medium text-foreground">Featured</span>
              <Sparkles size={14} className="text-amber-400" />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-border">
          <button type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            <Save size={16} /> {offer ? "Update Offer" : "Create Offer"}
          </button>
          <button type="button" onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === "1";
    } catch {
      console.warn("[Admin] sessionStorage read failed (private browsing?)");
      return false;
    }
  });
  const [products, setProducts] = useState<Product[]>(getAllProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "settings" | "favorites" | "offers">("products");
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => getSettings());
  const [favoriteStats, setFavoriteStats] = useState<Record<string, number>>(() => getFavorites());
  const [offers, setOffers] = useState<Offer[]>(() => getAllOffers());
  const [offerForm, setOfferForm] = useState<Offer | null>(null);
  const [addingOffer, setAddingOffer] = useState(false);
  const [confirmDeleteOffer, setConfirmDeleteOffer] = useState<string | null>(null);
  const [refreshingFavorites, setRefreshingFavorites] = useState(false);
  const [refreshingOffers, setRefreshingOffers] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const refresh = useCallback(() => {
    try {
      setProducts(getAllProducts());
    } catch (err) {
      console.error("[Admin] Failed to refresh products:", err);
    }
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }, [products, search]);

  const sortedFavorites = useMemo(() => {
    return Object.entries(favoriteStats)
      .map(([id, count]) => {
        const product = products.find((p) => p.id === id);
        return { id, count, name: product?.name ?? id, category: product?.category ?? "" };
      })
      .sort((a, b) => b.count - a.count);
  }, [favoriteStats, products]);

  const handleRefreshFavorites = useCallback(async () => {
    setRefreshingFavorites(true);
    try {
      const serverData = await fetchServerFavorites();
      setFavoriteStats(serverData);
      toast({ title: "Refreshed", description: "Favorites data updated." });
    } catch (err) {
      console.error("[Admin] Failed to refresh favorites:", err);
      toast({ title: "Refresh failed", description: "Could not load favorites. Please try again.", variant: "destructive" });
    } finally {
      setRefreshingFavorites(false);
    }
  }, [toast]);

  const refreshOffers = useCallback(async () => {
    setRefreshingOffers(true);
    try {
      const data = await refreshOffersFromServer();
      setOffers(data);
      toast({ title: "Refreshed", description: "Offers data updated." });
    } catch (err) {
      console.error("[Admin] Failed to refresh offers:", err);
      toast({ title: "Refresh failed", description: "Could not load offers. Please try again.", variant: "destructive" });
    } finally {
      setRefreshingOffers(false);
    }
  }, [toast]);

  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />;

  const handleSave = (product: Product) => {
    try {
      let ok = false;
      if (editing?.id) {
        ok = updateProduct(product.id, product);
      } else {
        ok = addProduct(product);
      }
      if (ok) {
        toast({ title: editing?.id ? "Updated" : "Added", description: `"${product.name}" has been ${editing?.id ? "updated" : "added"}.` });
        setEditing(null);
        setAdding(false);
        refresh();
      } else {
        toast({ title: "Storage full", description: "Image is too large. Try a smaller image (under 1MB)." });
      }
    } catch (err) {
      console.error("[Admin] Save failed:", err);
      toast({ title: "Error", description: "Failed to save product." });
    }
  };

  const handleDelete = (id: string) => {
    try {
      deleteProduct(id);
      toast({ title: "Deleted", description: "Product removed." });
      setConfirmDelete(null);
      refresh();
    } catch (err) {
      console.error("[Admin] Delete failed:", err);
      toast({ title: "Error", description: "Failed to delete product." });
    }
  };

  const handleReset = () => {
    try {
      resetAllData();
      setSiteSettings(getSettings()); // Reset settings state too
      toast({ title: "Reset", description: "All changes have been reverted." });
      refresh();
    } catch (err) {
      console.error("[Admin] Reset failed:", err);
    }
  };

  // Issue 5: Save site settings
  const handleSaveSettings = () => {
    try {
      saveSettings(siteSettings);
      toast({ title: "Settings saved", description: "Homepage settings updated." });
    } catch (err) {
      console.error("[Admin] Settings save failed:", err);
      toast({ title: "Error", description: "Failed to save settings." });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <style>{`.input-field{width:100%;padding:0.5rem 0.75rem;border-radius:0.75rem;border:1px solid var(--border);background:var(--background);font-size:0.875rem;color:var(--foreground);outline:none;transition:border-color 0.15s;}.input-field:focus{border-color:var(--primary);}`}</style>

      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">{products.length} products</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Issue 5: Tab buttons for Products/Settings */}
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === "products" ? "bg-primary/10 text-primary" : "hover:bg-muted"
              }`}
            >
              <Package size={14} /> Products
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === "settings" ? "bg-primary/10 text-primary" : "hover:bg-muted"
              }`}
            >
              <Settings size={14} /> Settings
            </button>
            <button
              onClick={() => { setActiveTab("favorites"); handleRefreshFavorites(); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === "favorites" ? "bg-primary/10 text-primary" : "hover:bg-muted"
              }`}
            >
              <Star size={14} /> Favorites
            </button>
            <button
              onClick={() => { setActiveTab("offers"); refreshOffers(); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === "offers" ? "bg-primary/10 text-primary" : "hover:bg-muted"
              }`}
            >
              <Tag size={14} /> Offers
            </button>
            
            
            <button
              onClick={() => {
                try { sessionStorage.removeItem(AUTH_KEY); } catch { /* ignore */ }
                setAuthed(false);
                navigate("/");
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Issue 5: Only show product toolbar on Products tab */}
        {activeTab === "products" && (
          <>
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
              <button
                onClick={() => {
                  setAdding(true);
                  setEditing(null);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            {/* Add form */}
            <AnimatePresence>
              {adding && (
                <ProductForm
                  product={emptyProduct()}
                  onSave={handleSave}
                  onCancel={() => setAdding(false)}
                />
              )}
            </AnimatePresence>

            {/* Edit form */}
            <AnimatePresence>
              {editing && (
                <ProductForm
                  product={editing}
                  onSave={handleSave}
                  onCancel={() => setEditing(null)}
                />
              )}
            </AnimatePresence>

            {/* Product list */}
            <div className="space-y-3">
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-14 h-14 rounded-xl object-cover bg-muted flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm text-foreground truncate">{product.name}</h3>
                      <StockBadge status={product.stockStatus} />
                      {product.isNew && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                          NEW
                        </span>
                      )}
                      {product.isPopular && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {product.category} &middot; {product.sku} &middot; {product.packaging.weight}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditing(product);
                        setAdding(false);
                      }}
                      className="p-2 rounded-xl hover:bg-muted transition-colors"
                      title="Edit"
                    >
                      <Pencil size={16} className="text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(product.id)}
                      className="p-2 rounded-xl hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <Package size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">No products found</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Settings tab content */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-1">Homepage Settings</h2>
              <p className="text-sm text-muted-foreground">
                Manage the floating biscuit images in the hero section.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
              <h3 className="font-semibold text-sm text-foreground">Floating Hero Biscuits</h3>
              <p className="text-xs text-muted-foreground">
                Upload transparent PNG biscuit images. They will appear as floating, scattered elements in the hero section. Leave empty to show the default illustration.
              </p>

              {/* Current images list */}
              {siteSettings.floatingImageUrls.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Uploaded ({siteSettings.floatingImageUrls.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {siteSettings.floatingImageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative group bg-[#f0f0f0] dark:bg-muted rounded-xl border border-border overflow-hidden aspect-square"
                      >
                        <img
                          src={url}
                          alt={`Biscuit ${idx + 1}`}
                          className="w-full h-full object-contain p-2"
                        />
                        <button
                          onClick={() => {
                            setSiteSettings((s) => ({
                              ...s,
                              floatingImageUrls: s.floatingImageUrls.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          title="Remove image"
                        >
                          <Trash2 size={12} />
                        </button>
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-background/80 text-[9px] font-medium text-muted-foreground">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload new image */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {siteSettings.floatingImageUrls.length > 0 ? "Add Another Image" : "Upload Biscuit Images"}
                </p>
                <ImageUpload
                  label=""
                  value=""
                  onChange={(url) => {
                    if (url) {
                      setSiteSettings((s) => ({
                        ...s,
                        floatingImageUrls: [...s.floatingImageUrls, url],
                      }));
                    }
                  }}
                />
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Supports transparent PNGs. Each image uploads one at a time.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <Save size={16} /> Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Favorites statistics tab */}
        {activeTab === "favorites" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-1">Favorites Statistics</h2>
                <p className="text-sm text-muted-foreground">
                  Track which products visitors are favoriting the most.
                </p>
              </div>
              <button
                onClick={handleRefreshFavorites}
                disabled={refreshingFavorites}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50"
              >
                <RotateCcw size={14} className={refreshingFavorites ? "animate-spin" : ""} /> {refreshingFavorites ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-4 p-6 border-b border-border">
                <div className="text-center">
                  <p className="text-2xl font-black text-foreground">
                    {sortedFavorites.reduce((sum, f) => sum + f.count, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">Total Favorites</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-foreground">{sortedFavorites.length}</p>
                  <p className="text-xs text-muted-foreground font-medium">Favorited Products</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-foreground">
                    {sortedFavorites.length > 0 ? sortedFavorites[0].count : 0}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">Most Favorites</p>
                </div>
              </div>

              {/* Per-product breakdown */}
              <div className="divide-y divide-border">
                {sortedFavorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Star size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">No favorites recorded yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Favorites appear when visitors click the star on product cards.</p>
                  </div>
                ) : (
                  sortedFavorites.map((fav, i) => (
                    <div key={fav.id} className="flex items-center gap-4 px-6 py-3">
                      <span className="text-xs font-bold text-muted-foreground w-6 text-center">#{i + 1}</span>
                      <Star size={14} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{fav.name}</p>
                        <p className="text-xs text-muted-foreground">{fav.category}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-foreground">{fav.count}</p>
                        <p className="text-[10px] text-muted-foreground">favorites</p>
                      </div>
                      {/* Bar visualization */}
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden flex-shrink-0">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{
                            width: `${sortedFavorites[0].count > 0 ? (fav.count / sortedFavorites[0].count) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Offers management tab */}
        {activeTab === "offers" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-1">Manage Offers</h2>
                <p className="text-sm text-muted-foreground">
                  Create, edit, or remove date-based offers visible on the /offers page.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshOffers}
                  disabled={refreshingOffers}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <RotateCcw size={14} className={refreshingOffers ? "animate-spin" : ""} /> {refreshingOffers ? "Refreshing..." : "Refresh"}
                </button>
                <button
                  onClick={() => {
                    setAddingOffer(true);
                    setOfferForm(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  <Plus size={16} /> New Offer
                </button>
              </div>
            </div>

            {/* Add/Edit offer form */}
            {(addingOffer || offerForm) && (
              <OfferForm
                offer={offerForm}
                onSave={(offer) => {
                  if (offerForm) {
                    updateOffer(offerForm.id, offer);
                    toast({ title: "Updated", description: `"${offer.title}" updated.` });
                  } else {
                    addOffer(offer);
                    toast({ title: "Created", description: `"${offer.title}" created.` });
                  }
                  setAddingOffer(false);
                  setOfferForm(null);
                  refreshOffers();
                }}
                onCancel={() => {
                  setAddingOffer(false);
                  setOfferForm(null);
                }}
              />
            )}

            {/* Offers list */}
            <div className="space-y-3">
              {offers.length === 0 ? (
                <div className="text-center py-16">
                  <Tag size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">No offers yet. Create one to get started.</p>
                </div>
              ) : (
                offers.map((offer) => {
                  const now = new Date();
                  const start = new Date(offer.startsAt);
                  const end = new Date(offer.endsAt);
                  let status = "active";
                  if (now < start) status = "upcoming";
                  else if (now > end) status = "expired";

                  return (
                    <motion.div
                      key={offer.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4"
                    >
                      <img
                        src={offer.images[offer.coverIndex] ?? offer.images[0] ?? "https://placehold.co/100x100/FAFAFA/6B1A2A?text=No+Image&font=inter"}
                        alt={offer.title}
                        className="w-16 h-16 rounded-xl object-cover bg-muted flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm text-foreground truncate">{offer.title}</h3>
                          {offer.isFeatured && (
                            <Sparkles size={12} className="text-amber-400 flex-shrink-0" />
                          )}
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: offer.badgeColor + "18", color: offer.badgeColor }}>
                            {offer.type === "bundle" ? "BUNDLE" : "DISCOUNT"}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            status === "active" ? "bg-green-100 text-green-700" :
                            status === "upcoming" ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-500"
                          }`}>
                            {status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{offer.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Calendar size={10} />
                            {new Date(offer.startsAt).toLocaleDateString()} — {new Date(offer.endsAt).toLocaleDateString()}
                          </div>
                          {offer.originalPrice && offer.offerPrice && (
                            <span className="text-[10px] font-semibold">
                              <span className="line-through text-muted-foreground">${offer.originalPrice}</span>
                              <span className="text-[#E31837] ml-1">${offer.offerPrice}</span>
                            </span>
                          )}
                          {offer.type === "bundle" && offer.bundleItems.length > 0 && (
                            <span className="text-[10px] text-muted-foreground">{offer.bundleItems.length} items</span>
                          )}
                          {offer.images.length > 1 && (
                            <span className="text-[10px] text-muted-foreground">{offer.images.length} imgs</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => { setOfferForm(offer); setAddingOffer(false); }}
                          className="p-2 rounded-xl hover:bg-muted transition-colors" title="Edit"
                        >
                          <Pencil size={16} className="text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteOffer(offer.id)}
                          className="p-2 rounded-xl hover:bg-red-50 transition-colors" title="Delete"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <h3 className="font-bold text-foreground mb-2">Delete Product?</h3>
              <p className="text-sm text-muted-foreground mb-5">
                This product will be removed from the catalog. You can reset all changes from the header.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete offer confirmation modal */}
      <AnimatePresence>
        {confirmDeleteOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={() => setConfirmDeleteOffer(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <h3 className="font-bold text-foreground mb-2">Delete Offer?</h3>
              <p className="text-sm text-muted-foreground mb-5">
                This offer will be removed from the site.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDeleteOffer(null)}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteOffer(confirmDeleteOffer);
                    toast({ title: "Deleted", description: "Offer removed." });
                    setConfirmDeleteOffer(null);
                    refreshOffers();
                  }}
                  className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
