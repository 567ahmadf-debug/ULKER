import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Cookie, Cake, Layers, Grid3x3, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";
import { categoryData } from "@/data/categories";

const icons = [Cookie, Cake, Layers, Grid3x3, Flame];

export default function FeaturedCategories() {
  const { t } = useTranslation();

  return (
    <section className="py-6 lg:py-12 flex flex-col gap-4 lg:gap-6" data-testid="section-categories">
      <div className="px-5 lg:px-8 flex items-center justify-between">
        <h2 className="text-lg lg:text-2xl font-bold font-heading text-primary">{t("home.popular_categories")}</h2>
        <Link href="/categories" data-testid="link-all-categories">
          <span className="text-xs lg:text-sm font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer">
            <span>{t("home.view_all")}</span>
            <ArrowRight size={14} />
          </span>
        </Link>
      </div>

      {/* Mobile: horizontal scroll carousel */}
      <div className="flex flex-nowrap overflow-x-auto gap-3 lg:hidden px-5 pb-2 scrollbar-none">
        {categoryData.slice(0, 5).map((cat, i) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="w-20 flex-shrink-0"
            >
              <Link href={`/products?category=${cat.name}`} data-testid={`link-category-${cat.id}`}>
                <span className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className="h-20 w-20 rounded-2xl bg-secondary/80 border border-border flex items-center justify-center p-3 hover:border-primary/30 group-hover:scale-105 transition-all duration-300">
                    <Icon size={32} className="text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-foreground truncate w-full text-center">{cat.name}</span>
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop: grid layout */}
      <div className="hidden lg:grid grid-cols-5 gap-6 px-8">
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
