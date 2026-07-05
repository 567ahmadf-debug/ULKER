import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";
import Footer from "@/components/layout/Footer";
import { useTranslation } from "react-i18next";

const weightFilters = ["All", "<100g", "100–250g", "250g+"];

function matchesWeight(w: string, filter: string): boolean {
  if (filter === "All") return true;
  const grams = parseFloat(w.replace(/[^0-9.]/g, "")) || 0;
  if (filter === "<100g") return grams < 100;
  if (filter === "100–250g") return grams >= 100 && grams <= 250;
  if (filter === "250g+") return grams > 250;
  return true;
}

export default function ProductsPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStock, setSelectedStock] = useState<string[]>([]);
  const [selectedWeight, setSelectedWeight] = useState("All");
  const [sort, setSort] = useState("Popular");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sortOptions = [
    { value: "Popular", label: t("products.popular") },
    { value: "Newest", label: t("products.newest") },
    { value: "A–Z", label: t("products.az") },
    { value: "Z–A", label: t("products.za") },
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

    if (sort === "A–Z") result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "Z–A") result.sort((a, b) => b.name.localeCompare(a.name));
    else if (sort === "Popular") result.sort((a, b) => Number(b.isPopular) - Number(a.isPopular));
    else if (sort === "Newest") result.sort((a, b) => Number(b.isNew) - Number(a.isNew));

    return result;
  }, [query, selectedCategories, selectedStock, selectedWeight, sort]);

  const hasFilters = selectedCategories.length > 0 || selectedStock.length > 0 || selectedWeight !== "All" || query.trim();

  const FilterContent = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 block">
          {t("filters.categories")}
        </label>
        <div className="space-y-1">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2.5 py-1.5 cursor-pointer group"
              data-testid={`checkbox-category-${cat.toLowerCase()}`}
            >
              <div
                onClick={() => toggleCategory(cat)}
                className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                  selectedCategories.includes(cat)
                    ? "bg-primary border-primary"
                    : "border-border group-hover:border-primary/50"
                }`}
              >
                {selectedCategories.includes(cat) && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                onClick={() => toggleCategory(cat)}
                className={`text-sm transition-colors flex-1 ${
                  selectedCategories.includes(cat)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {cat}
              </span>
              <span className="text-xs text-muted-foreground">
                {products.filter((p) => p.category === cat).length}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 block">
          {t("filters.availability")}
        </label>
        <div className="space-y-1">
          {Object.entries(stockLabels).map(([key, label]) => {
            const colors: Record<string, string> = {
              in_stock: "bg-green-500",
              limited: "bg-amber-500",
              out_of_stock: "bg-red-500",
            };
            return (
              <label
                key={key}
                className="flex items-center gap-2.5 py-1.5 cursor-pointer group"
                data-testid={`checkbox-stock-${key}`}
              >
                <div
                  onClick={() => toggleStock(key)}
                  className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                    selectedStock.includes(key)
                      ? "bg-primary border-primary"
                      : "border-border group-hover:border-primary/50"
                  }`}
                >
                  {selectedStock.includes(key) && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={`w-2 h-2 rounded-full ${colors[key]} flex-shrink-0`} />
                <span
                  onClick={() => toggleStock(key)}
                  className={`text-sm transition-colors ${
                    selectedStock.includes(key)
                      ? "text-foreground font-medium"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Weight */}
      <div>
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 block">
          {t("filters.weight")}
        </label>
        <div className="flex flex-wrap gap-2">
          {weightFilters.map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWeight(w)}
              data-testid={`button-weight-${w.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                selectedWeight === w
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {w === "All" ? t("filters.all") : w}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={() => {
            setQuery("");
            setSelectedCategories([]);
            setSelectedStock([]);
            setSelectedWeight("All");
          }}
          data-testid="button-clear-filters"
          className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 font-medium transition-colors"
        >
          <X size={14} />
          {t("filters.clear_all")}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-20 lg:pb-0" data-testid="page-products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-foreground">{t("products.all_products")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} {filtered.length === 1 ? t("products.products_found_one", { count: filtered.length }).split(" ").slice(1).join(" ") : t("products.products_found_other", { count: filtered.length }).split(" ").slice(1).join(" ")}
          </p>
        </div>

        {/* Inline search bar — full width, below header */}
        <div className="relative mb-5">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rtl:left-auto rtl:right-4"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("products.search_placeholder")}
            data-testid="input-products-search"
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all rtl:pl-4 rtl:pr-10"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rtl:right-auto rtl:left-4"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Toolbar: mobile filter toggle + sort */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            data-testid="button-filter-toggle"
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-medium"
          >
            <SlidersHorizontal size={14} />
            {t("filters.title")}
            {hasFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
          </button>
          <div className="hidden lg:block" />

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              data-testid="select-sort"
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground outline-none cursor-pointer"
            >
              {sortOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none rtl:right-auto rtl:left-2.5"
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-60 shrink-0" data-testid="sidebar-filters">
            <div className="sticky top-24 bg-card border border-border rounded-2xl p-5">
              {FilterContent}
            </div>
          </aside>

          {/* Mobile sidebar drawer */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg:hidden fixed inset-0 z-40 bg-black/40"
                  onClick={() => setSidebarOpen(false)}
                />
                <motion.aside
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-card border-r border-border overflow-y-auto rtl:left-auto rtl:right-0 rtl:border-r-0 rtl:border-l"
                >
                  <div className="p-5 pt-16">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-foreground">{t("filters.title")}</h2>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        data-testid="button-close-sidebar"
                        className="p-1"
                      >
                        <X size={18} className="text-muted-foreground" />
                      </button>
                    </div>
                    {FilterContent}
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Product grid */}
          <main className="flex-1 min-w-0">
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
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  data-testid="grid-products"
                >
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
