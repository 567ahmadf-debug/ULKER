import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Cookie, Cake, Layers, Grid3x3, Flame } from "lucide-react";
import { categoryData } from "@/data/categories";

const icons = [Cookie, Cake, Layers, Grid3x3, Flame];

export default function FeaturedCategories() {
  return (
    <section className="max-w-7xl mx-auto w-full px-8 py-12 flex flex-col gap-6" data-testid="section-categories">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-heading text-primary">Popular Categories</h2>
        <Link href="/categories" data-testid="link-all-categories">
          <span className="text-sm font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer">
            <span>View All Categories</span>
            <ArrowRight size={14} />
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categoryData.slice(0, 5).map((cat, i) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link href={`/products?category=${cat.name}`} data-testid={`link-category-${cat.id}`}>
                <span className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center gap-4 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group h-full">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Icon size={28} className="text-primary" />
                  </div>
                  <span className="font-bold text-sm text-foreground">{cat.name}</span>
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
