import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Cookie, Layers, Coffee, Cake, Wheat, Star, Package, Candy } from "lucide-react";
import { categoryData } from "@/data/categories";
import { getAllProducts, getProductsByCategory } from "@/data/admin-store";
import { resolveImageUrl } from "@/lib/utils";
import Footer from "@/components/layout/Footer";

const icons = [Cookie, Layers, Wheat, Coffee, Cake, Layers, Candy, Package];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen pt-20 pb-20 lg:pb-0" data-testid="page-categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-xs font-bold tracking-widest uppercase text-primary mb-3">Our Range</p>
          <h1 className="text-4xl font-black text-foreground">Product Categories</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Browse our complete range of confectionery products — from classic biscuits to premium chocolates.
          </p>
        </motion.div>

        <div className="space-y-12">
          {categoryData.map((cat, i) => {
            const Icon = icons[i % icons.length];
            const catProducts = getProductsByCategory(cat.name).slice(0, 4);
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 }}
                data-testid={`section-category-${cat.id}`}
              >
                {/* Category header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: cat.bgColor }}
                    >
                      <Icon size={20} style={{ color: cat.color }} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-foreground">{cat.name}</h2>
                      <p className="text-xs text-muted-foreground">{cat.description}</p>
                    </div>
                  </div>
                  <Link href={`/products?category=${cat.name}`} data-testid={`link-category-all-${cat.id}`}>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all cursor-pointer">
                      View all <ArrowRight size={14} />
                    </span>
                  </Link>
                </div>

                {/* Product row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {catProducts.map((product, j) => (
                    <Link key={product.id} href={`/products/${product.id}`} data-testid={`link-category-product-${product.id}`}>
                      <motion.span
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: j * 0.05 }}
                        className="block bg-card border border-card-border rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="aspect-square bg-muted overflow-hidden">
                          <img
                            src={resolveImageUrl(product.imageUrl)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{product.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{product.packaging.weight}</p>
                        </div>
                      </motion.span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
