import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronUp, Package, Info, Leaf, AlertTriangle } from "lucide-react";
import { getProductById, getRelatedProducts } from "@/data/products";
import ImageGallery from "@/components/products/ImageGallery";
import StockStatus from "@/components/products/StockStatus";
import ProductCard from "@/components/products/ProductCard";
import Footer from "@/components/layout/Footer";

function ExpandableCard({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        data-testid={`button-expand-${title.toLowerCase().replace(/\s+/g, "-")}`}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Icon size={16} className="text-primary" />
          <span className="text-sm font-bold text-foreground">{title}</span>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={16} className="text-muted-foreground" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border/50 pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const product = getProductById(params.id ?? "");
  const related = product ? getRelatedProducts(product) : [];

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/products">
          <span className="text-primary font-semibold cursor-pointer hover:underline">Back to Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20 lg:pb-0" data-testid="page-product-detail">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/products">
            <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
              <ArrowLeft size={14} />
              Products
            </span>
          </Link>
          <span>/</span>
          <span className="text-muted-foreground">{product.category}</span>
          <span>/</span>
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-[220px_1fr_360px] gap-8">
          {/* Left sidebar */}
          <aside className="hidden lg:block" data-testid="sidebar-product-detail">
            <div className="sticky top-24 space-y-6">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Category</p>
                <Link href={`/products?category=${product.category}`}>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline cursor-pointer">
                    {product.category}
                  </span>
                </Link>
              </div>

              {/* Related products */}
              {related.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Related</p>
                  <div className="space-y-2">
                    {related.slice(0, 4).map((rel) => (
                      <Link key={rel.id} href={`/products/${rel.id}`}>
                        <span
                          data-testid={`link-related-sidebar-${rel.id}`}
                          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer group"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                            <img src={rel.imageUrl} alt={rel.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">{rel.name}</p>
                            <p className="text-[10px] text-muted-foreground">{rel.category}</p>
                          </div>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main product area */}
          <main data-testid="main-product-area">
            <ImageGallery product={product} />
          </main>

          {/* Right info panel */}
          <aside className="space-y-4" data-testid="panel-product-info">
            {/* Name & description */}
            <div className="bg-card border border-card-border rounded-2xl p-5">
              {product.isNew && (
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider mb-3">
                  New Product
                </span>
              )}
              <h1 className="text-xl font-black text-foreground mb-2" data-testid="text-product-detail-name">
                {product.name}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.shortDescription}</p>
            </div>

            {/* Stock Status */}
            <div className="bg-card border border-card-border rounded-2xl p-5">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Availability</p>
              <StockStatus status={product.stockStatus} size="lg" showUpdated />
            </div>

            {/* Packaging Info */}
            <ExpandableCard title="Packaging Information" icon={Package} defaultOpen>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Weight", value: product.packaging.weight },
                  { label: "Pieces", value: product.packaging.pieces.toString() },
                  { label: "Carton Qty", value: product.packaging.cartonQty.toString() },
                  { label: "Package Type", value: product.packaging.packageType },
                  { label: "Dimensions", value: product.packaging.dimensions },
                  { label: "SKU", value: product.sku },
                  { label: "Barcode", value: product.barcode },
                  { label: "Country", value: product.country },
                  { label: "Shelf Life", value: product.shelfLife },
                ].map(({ label, value }) => (
                  <div key={label} className={label === "Dimensions" || label === "Barcode" ? "col-span-2" : ""}>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-foreground" data-testid={`text-packaging-${label.toLowerCase().replace(/\s+/g, "-")}`}>{value}</p>
                  </div>
                ))}
              </div>
            </ExpandableCard>

            {/* Nutrition */}
            <ExpandableCard title="Nutrition Facts" icon={Info}>
              <div className="space-y-1">
                <div className="flex justify-between items-center pb-2 mb-2 border-b border-border">
                  <p className="text-xs text-muted-foreground">Per serving ({product.nutrition.servingSize})</p>
                </div>
                {[
                  { label: "Calories", value: product.nutrition.calories, unit: "kcal" },
                  { label: "Protein", value: product.nutrition.protein, unit: "g" },
                  { label: "Total Fat", value: product.nutrition.fat, unit: "g" },
                  { label: "Saturated Fat", value: product.nutrition.saturatedFat, unit: "g" },
                  { label: "Carbohydrates", value: product.nutrition.carbs, unit: "g" },
                  { label: "Sugar", value: product.nutrition.sugar, unit: "g" },
                  { label: "Dietary Fiber", value: product.nutrition.fiber, unit: "g" },
                  { label: "Salt", value: product.nutrition.salt, unit: "g" },
                ].map(({ label, value, unit }, i) => (
                  <div
                    key={label}
                    className={`flex justify-between py-1.5 text-sm ${i < 2 ? "font-semibold" : ""} ${label === "Saturated Fat" || label === "Sugar" ? "pl-4 text-muted-foreground" : ""}`}
                    data-testid={`text-nutrition-${label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <span className={`${i < 2 ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                    <span className={`tabular-nums ${i < 2 ? "text-foreground" : "text-muted-foreground"}`}>
                      {value}{unit}
                    </span>
                  </div>
                ))}
              </div>
            </ExpandableCard>

            {/* Ingredients */}
            <ExpandableCard title="Ingredients" icon={Leaf}>
              <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-ingredients">
                {product.ingredients}
              </p>
            </ExpandableCard>

            {/* Allergens */}
            <ExpandableCard title="Allergen Information" icon={AlertTriangle} defaultOpen>
              {product.allergens.contains.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Contains</p>
                  <div className="flex flex-wrap gap-2">
                    {product.allergens.contains.map((a) => (
                      <span
                        key={a}
                        data-testid={`badge-allergen-contains-${a.toLowerCase()}`}
                        className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400 text-xs font-semibold border border-red-200 dark:border-red-800"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {product.allergens.mayContain.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">May Contain</p>
                  <div className="flex flex-wrap gap-2">
                    {product.allergens.mayContain.map((a) => (
                      <span
                        key={a}
                        data-testid={`badge-allergen-may-${a.toLowerCase()}`}
                        className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-800"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {product.allergens.contains.length === 0 && product.allergens.mayContain.length === 0 && (
                <p className="text-sm text-muted-foreground">No known allergens.</p>
              )}
            </ExpandableCard>

            {/* Product Description */}
            <div className="bg-card border border-card-border rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Info size={14} className="text-primary" />
                Product Description
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1">Taste</p>
                  <p className="leading-relaxed">{product.taste}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1">Texture</p>
                  <p className="leading-relaxed">{product.texture}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1">Storage</p>
                  <p className="leading-relaxed">{product.storageInstructions}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wide mb-1">Serving Suggestions</p>
                  <p className="leading-relaxed">{product.servingSuggestions}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16" data-testid="section-related-products">
            <h2 className="text-xl font-black text-foreground mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((rel, i) => (
                <ProductCard key={rel.id} product={rel} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
