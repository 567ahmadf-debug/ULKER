import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllProducts } from "@/data/admin-store";
import ProductCard from "@/components/products/ProductCard";

const featured = getAllProducts().filter((p) => p.isPopular).slice(0, 6);

export default function FeaturedProducts() {
  return (
    <section className="max-w-7xl mx-auto w-full px-8 py-12 flex flex-col gap-8" data-testid="section-featured-products">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-heading text-primary">Featured Products</h2>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
            <ArrowLeft size={18} />
          </button>
          <button className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
