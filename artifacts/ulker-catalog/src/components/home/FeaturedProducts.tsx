import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getAllProducts } from "@/data/admin-store";
import ProductCard from "@/components/products/ProductCard";

export default function FeaturedProducts() {
  const { t } = useTranslation();
  const featured = getAllProducts().filter((p) => p.isPopular).slice(0, 6);

  return (
    <section className="py-6 lg:py-12 flex flex-col gap-4 lg:gap-8" data-testid="section-featured-products">
      <div className="px-5 lg:px-8 flex items-center justify-between">
        <h2 className="text-lg lg:text-2xl font-bold font-heading text-primary">{t("home.featured_products")}</h2>
        <div className="hidden md:flex gap-2">
          <button className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
            <ArrowLeft size={18} />
          </button>
          <button className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="flex gap-1 md:hidden">
          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
          <span className="w-1.5 h-1.5 bg-muted rounded-full" />
          <span className="w-1.5 h-1.5 bg-muted rounded-full" />
        </div>
      </div>

      {/* Mobile: horizontal scroll carousel */}
      <div className="flex flex-nowrap overflow-x-auto gap-4 px-5 pb-3 md:hidden scrollbar-none">
        {featured.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} compact />
        ))}
      </div>

      {/* Desktop/tablet: responsive grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 px-5 lg:px-8">
        {featured.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
