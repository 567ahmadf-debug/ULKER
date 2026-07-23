import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Heart } from "lucide-react";
import { Product } from "@/data/products";
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

  const stockDotClass =
    product.stockStatus === "in_stock"
      ? "bg-tertiary"
      : product.stockStatus === "limited"
        ? "bg-amber-500"
        : "bg-destructive";

  const stockLabel =
    product.stockStatus === "in_stock"
      ? "In Stock"
      : product.stockStatus === "limited"
        ? "Limited Stock"
        : "Out of Stock";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      data-testid={`card-product-${product.id}`}
      className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-4 relative group hover:shadow-md transition-shadow"
    >
      {/* Badges */}
      <div className="absolute top-5 left-5 z-10 flex gap-1.5">
        {product.isNew && (
          <span className="bg-destructive text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            New
          </span>
        )}
        {product.isPopular && !product.isNew && (
          <span className="bg-amber-500 text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Popular
          </span>
        )}
      </div>

      {/* Favorite button */}
      <button
        type="button"
        onClick={handleToggleFav}
        className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart size={16} className={isFav ? "text-destructive fill-destructive" : ""} />
      </button>

      {/* Image */}
      <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-secondary/30">
        <img
          src={resolveImageUrl(product.imageUrl)}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <h3
          data-testid={`text-product-name-${product.id}`}
          className="font-bold text-lg text-primary font-heading"
        >
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{product.shortDescription}</p>
      </div>

      {/* Stock status + actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border/60">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-tertiary">
          <span className={`w-2.5 h-2.5 rounded-full ${stockDotClass}`} />
          <span>{stockLabel}</span>
        </div>
        <Link href={`/products/${product.id}`} data-testid={`link-view-details-${product.id}`}>
          <span className="text-sm font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer">
            <span>View Details</span>
            <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </motion.div>
  );
}
