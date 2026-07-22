import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { getAllProducts } from "@/data/admin-store";
import { resolveImageUrl } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const results = query.trim().length >= 2
    ? getAllProducts()
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.shortDescription.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const suggestions = ["Petibör", "Chocolate", "Wafer", "Albeni", "Biskrem", "Crackers"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex flex-col items-center"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-card shadow-2xl"
            style={{ borderRadius: "0 0 16px 16px" }}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <Search size={20} className="text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                data-testid="input-search"
                className="flex-1 bg-transparent text-base font-medium text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                onClick={onClose}
                data-testid="button-search-close"
                className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
              {query.length < 2 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {t("search.popular_searches")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        data-testid={`button-suggestion-${s.toLowerCase()}`}
                        className="px-3 py-1.5 rounded-full bg-muted text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {t("search.products_label")}
                  </p>
                  <div className="space-y-1">
                    {results.map((product) => (
                      <Link key={product.id} href={`/products/${product.id}`}>
                        <span
                          onClick={onClose}
                          data-testid={`link-search-result-${product.id}`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-[#FAFAFA] dark:bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                            <img
                              src={resolveImageUrl(product.imageUrl)}
                              alt={product.name}
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                          </div>
                          <ArrowRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0 rtl:rotate-180" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {query.length >= 2 && results.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">{t("products.no_results")} "{query}"</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
