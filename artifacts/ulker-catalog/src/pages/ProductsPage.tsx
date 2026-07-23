import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, Cookie, Image, Layers, Cake, Star, ShoppingCart } from "lucide-react";
import { categories } from "@/data/products";
import { getAllProducts } from "@/data/admin-store";
import ProductCard from "@/components/products/ProductCard";
import Footer from "@/components/layout/Footer";
import { useTranslation } from "react-i18next";
import { useSearch } from "wouter";

const weightFilters = ["All", "<100g", "100-250g", "250g+"];

const categoryIcons: Record<string, React.ReactNode> = {
  Biscuits: <Cookie size={14} />,
  Chocolate: <Image size={14} />,
  Wafer: <Layers size={14} />,
  Cookies: <Star size={14} />,
  Cake: <Cake size={14} />,
};

const categoryCounts: Record<string, number> = {};

function matchesWeight(w: string, filter: string): boolean {
  if (filter === "All") return true;
  const grams = parseFloat(w.replace(/[^0-9.]/g, "")) || 0;
  if (filter === "<100g") return grams < 100;
  if (filter === "100-250g") return grams >= 100 && grams <= 250;
  if (filter === "250g+") return grams > 250;
  return true;
}

export default function ProductsPage() {
  const { t } = useTranslation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialCategory = params.get("category");

  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedStock, setSelectedStock] = useState<string[]>([]);
  const [selectedWeight, setSelectedWeight] = useState("All");
  const [sort, setSort] = useState("Popular");
  const products = useMemo(() => getAllProducts(), []);

  // Compute category counts
  products.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  const sortOptions = [
    { value: "Popular", label: t("products.popular") },
    { value: "Newest", label: t("products.newest") },
    { value: "A-Z", label: t("products.az") },
    { value: "Z-A", label: t("products.za") },
  ];

  const stockLabels: Record<string, string> = {
    in_stock: t("stock.in_stock"),
    limited: t("stock.limited"),
    out_of_stock: t("stock.out_of_stock"),
  };

  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const toggleStock = (s: string) =>
    setSelectedStock((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const filtered = useMemo(() => {
    let result = [...products];
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    if (selectedStock.length > 0) {
      result = result.filter((p) => selectedStock.includes(p.stockStatus));
    }
    result = result.filter((p) => matchesWeight(p.packaging.weight, selectedWeight));

    if (sort === "A-Z") result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "Z-A") result.sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === "Popular") result.sort((a, b) => Number(b.isPopular) - Number(a.isPopular));
    else if (sort === "Newest") result.sort((a, b) => Number(b.isNew) - Number(a.isNew));

    return result;
  }, [query, selectedCategories, selectedStock, selectedWeight, sort]);

  return (
    <div className="min-h-screen flex flex-col" data-testid="page-products">
      {/* ===== MAIN LAYOUT ===== */}
      <main className="max-w-7xl mx-auto w-full px-8 py-10 flex flex-col lg:flex-row gap-8 flex-1">

        {/* ===== DESKTOP SIDEBAR ===== */}
        <aside className="w-full lg:w-64 flex-shrink-0 flex-col gap-6 hidden lg:flex">
          {/* Search */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <h3 className="font-bold text-sm text-primary font-heading uppercase tracking-wider">Search</h3>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search product name..."
                className="w-full pl-9 pr-3 py-2 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Categories filter */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-sm text-primary font-heading uppercase tracking-wider">Categories</h3>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => {
                const active = selectedCategories.includes(cat);
                const count = categoryCounts[cat] || 0;
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl text-left transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={active ? "text-primary-foreground" : "text-muted-foreground"}>
                        {categoryIcons[cat] || <Cookie size={14} />}
                      </span>
                      <span>{cat}</span>
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        active
                          ? "bg-primary-foreground/20"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-sm text-primary font-heading uppercase tracking-wider">Availability</h3>
            <div className="flex flex-col gap-3 text-xs font-semibold">
              {Object.entries(stockLabels).map(([key, label]) => {
                const dotColor =
                  key === "in_stock"
                    ? "bg-tertiary"
                    : key === "limited"
                      ? "bg-amber-500"
                      : "bg-destructive";
                return (
                  <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStock.includes(key)}
                      onChange={() => toggleStock(key)}
                      className="rounded border-border text-primary focus:ring-primary/20 w-4 h-4"
                    />
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Weight filter */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-sm text-primary font-heading uppercase tracking-wider">Package Weight</h3>
            <div className="grid grid-cols-2 gap-2">
              {weightFilters.map((w) => (
                <button
                  key={w}
                  onClick={() => setSelectedWeight(w)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl text-center transition-all ${
                    selectedWeight === w
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary border border-border text-foreground hover:bg-secondary-foreground hover:text-primary-foreground"
                  } ${w === "100-250g" ? "col-span-2" : ""}`}
                >
                  {w === "All" ? t("filters.all") : w}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ===== PRODUCTS CONTENT ===== */}
        <section className="flex-1 flex flex-col gap-6">

          {/* Mobile: Title + basket */}
          <div className="lg:hidden px-0 pt-2 pb-2 flex items-center justify-between gap-4 bg-gradient-to-b from-secondary/30 to-transparent rounded-2xl">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold font-heading text-primary">{t("products.all_products")}</h1>
              <p className="text-xs text-muted-foreground">Discover our delicious range of products.</p>
              <span className="text-xs font-semibold text-primary mt-1">{filtered.length} products found</span>
            </div>
            <div className="w-20 h-20 bg-secondary/80 rounded-2xl border border-border flex items-center justify-center relative overflow-hidden">
              <ShoppingCart size={28} className="text-primary/80" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-tertiary rounded-full flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                {filtered.length}
              </div>
            </div>
          </div>

          {/* Mobile: Search + Sort */}
          <div className="lg:hidden px-0 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2.5 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                <span>{sort === "Popular" ? "Popular" : sort}</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Mobile: Category chips */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  <span className={active ? "" : "text-muted-foreground"}>
                    {categoryIcons[cat] || <Cookie size={14} />}
                  </span>
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile: Stock legend */}
          <div className="lg:hidden bg-card border border-border rounded-xl py-2 px-3 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-tertiary rounded-full" />
              <span className="text-foreground">In Stock</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="text-foreground">Limited Stock</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-destructive rounded-full" />
              <span className="text-foreground">Out of Stock</span>
            </div>
          </div>

          {/* Mobile: Weight chips */}
          <div className="lg:hidden flex items-center gap-2 overflow-x-auto scrollbar-none">
            {weightFilters.map((w) => (
              <button
                key={w}
                onClick={() => setSelectedWeight(w)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-colors ${
                  selectedWeight === w
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:bg-secondary"
                }`}
              >
                {w === "All" ? t("filters.all") : w}
              </button>
            ))}
          </div>

          {/* Desktop: Title bar */}
          <div className="hidden lg:flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-secondary/40 to-transparent p-6 rounded-2xl border border-border">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold font-heading text-primary">{t("products.all_products")}</h1>
              <p className="text-sm text-muted-foreground">Discover our high-quality delicious snack catalog.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-primary">{filtered.length} products found</span>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Sort by:</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    data-testid="select-sort"
                    className="appearance-none px-4 py-2 pr-8 bg-card border border-border rounded-xl text-xs font-bold cursor-pointer hover:bg-secondary transition-colors"
                  >
                    {sortOptions.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Product grid */}
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
                data-testid="state-empty-products"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search size={24} className="text-muted-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{t("products.no_results")}</h3>
                <p className="text-sm text-muted-foreground">{t("products.no_results_sub")}</p>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
                data-testid="grid-products"
              >
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <Footer />
    </div>
  );
}
