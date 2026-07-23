import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Heart, Share2 } from "lucide-react";
import { Product } from "@/data/products";
import { useTranslation } from "react-i18next";
import { getMyFavorites, toggleFavorite } from "@/data/admin-store";
import { resolveImageUrl } from "@/lib/utils";
import { shareProduct } from "@/lib/share";

interface ProductCardProps {
  product: Product;
  index?: number;
  compact?: boolean;
}

export default function ProductCard({ product, index = 0, compact = false }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const [isFav, setIsFav] = useState(() => getMyFavorites().includes(product.id));

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFavorite(product.id);
    setIsFav(next.includes(product.id));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    shareProduct(product);
  };

  const displayName = i18n.language === "ar" && product.nameAr ? product.nameAr : product.name;

  const stockDotClass =
    product.stockStatus === "in_stock"
      ? "bg-tertiary"
      : product.stockStatus === "limited"
        ? "bg-amber-500"
        : "bg-destructive";

  const stockLabel =
    product.stockStatus === "in_stock"
      ? t("stock.in_stock")
      : product.stockStatus === "limited"
        ? t("stock.limited")
        : t("stock.out_of_stock");

  /* ===== COMPACT MODE (horizontal scroll carousel) ===== */
  if (compact) {
    return (
      <Link href={`/products/${product.id}`} data-testid={`link-view-details-${product.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          data-testid={`card-product-${product.id}`}
          className="w-48 flex-shrink-0 bg-card border border-border rounded-2xl p-3 shadow-sm flex flex-col gap-2 relative group hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="absolute top-2.5 start-2.5 z-10 flex gap-1.5">
            {product.isNew && (
              <span className="bg-destructive text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                New
              </span>
            )}
            {product.isPopular && !product.isNew && (
              <span className="bg-amber-500 text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                Popular
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleFav}
            className="absolute top-2.5 end-2.5 z-10 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={13} className={isFav ? "text-destructive fill-destructive" : ""} />
          </button>

          <div className="w-full h-24 bg-muted/20 rounded-xl p-2 flex items-center justify-center">
            <img
              src={resolveImageUrl(product.imageUrl)}
              alt={displayName}
              loading="lazy"
              className="w-full h-full object-contain card-product-float hover:scale-105 transition duration-300"
              style={{ animationDelay: `${index * 0.4}s` }}
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <h3
              data-testid={`text-product-name-${product.id}`}
              className="font-bold text-xs text-primary font-heading truncate"
            >
              {displayName}
            </h3>
            <p className="text-[10px] text-muted-foreground truncate">{product.shortDescription}</p>
          </div>

          <div className="flex items-center justify-between w-full mt-1">
            <div className="flex items-center gap-1 text-[10px] text-tertiary font-semibold">
              <span className={`w-1.5 h-1.5 rounded-full ${stockDotClass}`} />
              <span>{stockLabel}</span>
            </div>
            <button
              type="button"
              onClick={handleShare}
              className="text-muted-foreground hover:text-primary p-1 hover:bg-muted rounded-full"
              aria-label="Share product"
            >
              <Share2 size={12} />
            </button>
          </div>
        </motion.div>
      </Link>
    );
  }

  /* ===== DEFAULT MODE (grid card for ProductsPage) ===== */
  return (
    <Link href={`/products/${product.id}`} data-testid={`link-view-details-${product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        data-testid={`card-product-${product.id}`}
        className="bg-card rounded-2xl p-4 shadow-sm border border-border flex flex-col justify-between min-h-[280px] lg:min-h-[320px] relative group hover:shadow-md transition-shadow w-full cursor-pointer"
      >
        {/* Badges */}
        <div className="absolute top-0 start-0 z-10 flex gap-1.5">
          {product.isNew && (
            <span className="bg-destructive text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              New
            </span>
          )}
          {product.isPopular && !product.isNew && (
            <span className="bg-amber-500 text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
              Popular
            </span>
          )}
        </div>

        {/* Heart button */}
        <button
          type="button"
          onClick={handleToggleFav}
          className="absolute top-0 end-0 z-10 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={13} className={isFav ? "text-destructive fill-destructive" : ""} />
        </button>

        {/* Image */}
        <div className="w-full h-28 bg-muted/20 rounded-xl p-2 flex items-center justify-center">
          <img
            src={resolveImageUrl(product.imageUrl)}
            alt={displayName}
            loading="lazy"
            className="w-full h-full object-contain card-product-float hover:scale-105 transition duration-300"
            style={{ animationDelay: `${index * 0.4}s` }}
          />
        </div>

        {/* Title & Description */}
        <div className="flex flex-col gap-0.5 mb-2">
          <h3
            data-testid={`text-product-name-${product.id}`}
            className="font-bold text-sm text-primary font-heading line-clamp-1"
          >
            {displayName}
          </h3>
          <p className="text-[11px] text-muted-foreground line-clamp-1">{product.shortDescription}</p>
        </div>

        {/* Stock + Share */}
        <div className="flex items-center justify-between w-full mt-1">
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${stockDotClass}`} />
            <span className="text-[10px] font-semibold text-muted-foreground">{stockLabel}</span>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="text-muted-foreground hover:text-primary p-1 hover:bg-muted rounded-full"
            aria-label="Share product"
          >
            <Share2 size={13} />
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
