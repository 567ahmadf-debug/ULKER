import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Cookie, Candy, Layers, Coffee, Cake, Wheat, Star, Package } from "lucide-react";
import { categoryData } from "@/data/categories";

const icons = [Cookie, Layers, Wheat, Coffee, Cake, Layers, Candy, Package];

export default function FeaturedCategories() {
  return (
    <section className="py-24 bg-background" data-testid="section-categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-bold tracking-widest uppercase text-primary mb-3"
            >
              Browse by Category
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl lg:text-4xl font-black text-foreground"
            >
              Our Full Range
            </motion.h2>
          </div>
          <Link href="/categories" data-testid="link-all-categories">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all cursor-pointer">
              View all categories <ArrowRight size={14} />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoryData.map((cat, i) => {
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
                  <span
                    className="block p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: cat.bgColor }}
                    >
                      <Icon size={20} style={{ color: cat.color }} />
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-1">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{cat.description}</p>
                    <p className="text-xs font-semibold text-primary">{cat.productCount} products</p>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
