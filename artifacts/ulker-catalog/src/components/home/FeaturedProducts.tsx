import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";

const featured = products.filter((p) => p.isPopular).slice(0, 6);

export default function FeaturedProducts() {
  return (
    <section className="py-24 bg-muted/30" data-testid="section-featured-products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-bold tracking-widest uppercase text-primary mb-3"
            >
              Featured
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl lg:text-4xl font-black text-foreground"
            >
              Popular Products
            </motion.h2>
          </div>
          <Link href="/products" data-testid="link-all-products">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all cursor-pointer">
              View all products <ArrowRight size={14} />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
