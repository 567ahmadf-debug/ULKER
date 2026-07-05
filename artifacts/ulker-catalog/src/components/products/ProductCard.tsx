import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Product } from "@/data/products";
import StockStatus from "./StockStatus";
import { useTranslation } from "react-i18next";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      data-testid={`card-product-${product.id}`}
      className="group bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#FAFAFA] dark:bg-muted">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-col gap-1.5">
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
