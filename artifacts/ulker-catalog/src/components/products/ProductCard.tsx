import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Star, Share2 } from "lucide-react";
import { Product } from "@/data/products";
import StockStatus from "./StockStatus";
import { useTranslation } from "react-i18next";
import { getMyFavorites, toggleFavorite } from "@/data/admin-store";
import { resolveImageUrl } from "@/lib/utils";
import { shareProduct } from "@/lib/share";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t } = useTranslation();
  const [isFav, setIsFav] = useState(() => getMyFavorites().includes(product.id));

  const floatDuration = 5 + (((index * 7 + 3) % 20) / 10);
  const floatDelay = ((index * 1.3) % 3).toFixed(1);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      data-testid={`card-product-${product.id}`}
      className="group bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#FAFAFA] dark:bg-muted overflow-hidden">
        <img
          src={resolveImageUrl(product.imageUrl)}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 m-auto w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-contain z-[1]
            transition-all duration-300 ease-in-out will-change-transform
            group-hover:scale-[1.06] group-hover:brightness-110
            group-hover:[animation-play-state:paused]"
          style={{
            animation: `product-float ${floatDuration}s ease-in-out ${floatDelay}s infinite`,
          }}
        />

        <div
          className="absolute bottom-6 left-1/2 w-[55%] h-[8px] rounded-[50%] bg-black/10
            blur-[6px] z-0
            transition-all duration-300 ease-in-out
            group-hover:bg-black/18 group-hover:blur-[10px]
            group-hover:[animation-play-state:paused]"
          style={{
            animation: `product-shadow ${floatDuration}s ease-in-out ${floatDelay}s infinite`,
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
              {t("products.new_badge")}
            </span>
          )}
          {product.isPopular && !product.isNew && (
            <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider">
              {t("products.popular_badge")}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Action buttons row */}
        <div className="flex items-center justify-end gap-1 mb-2 -mt-1">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-lg hover:bg-muted active:bg-muted transition-colors"
            aria-label="Share product"
          >
            <Share2 size={15} className="text-muted-foreground" />
          </button>
          <button
            type="button"
            onClick={handleToggleFav}
            className="p-2 rounded-lg hover:bg-muted active:bg-muted transition-colors"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              size={15}
              className={isFav ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}
            />
          </button>
        </div>

        <div className="mb-2">
          <p className="text-xs font-medium text-muted-foreground mb-1">{product.category}</p>
          <h3
            data-testid={`text-product-name-${product.id}`}
            className="text-sm font-bold text-foreground leading-tight line-clamp-2"
          >
            {product.name}
          </h3>
        </div>

        <div className="mt-3 mb-4">
          <StockStatus status={product.stockStatus} size="sm" />
        </div>

        <Link href={`/products/${product.id}`} data-testid={`link-view-details-${product.id}`}>
          <span className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-primary/8 hover:bg-primary hover:text-primary-foreground text-primary text-sm font-semibold transition-all duration-200 cursor-pointer group/btn">
            <span>{t("products.view_details")}</span>
            <ArrowRight size={14} className="transition-transform duration-200 group-hover/btn:translate-x-1 rtl:rotate-180 rtl:group-hover/btn:-translate-x-1 rtl:group-hover/btn:translate-x-0" />
          </span>
        </Link>
      </div>
    </motion.div>
  );
}
