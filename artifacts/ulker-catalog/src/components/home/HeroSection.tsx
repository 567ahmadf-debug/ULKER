import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" data-testid="section-hero">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-primary/5 to-transparent" />

      {/* Decorative circles */}
      <div className="absolute top-24 right-16 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-24 right-48 w-64 h-64 rounded-full bg-accent/10 blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/20 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                Official Product Catalog
              </span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-black leading-[0.95] tracking-tight text-foreground mb-6">
              Explore Every
              <br />
              <span className="text-primary">Ülker</span>
              <br />
              Product
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Discover complete product information, ingredients, nutritional values, packaging details, and real-time availability across our full range.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/products" data-testid="link-browse-products">
                <span className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 cursor-pointer">
                  Browse Products
                  <ArrowRight size={16} />
                </span>
              </Link>
              <Link href="/categories" data-testid="link-view-categories">
                <span className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-border bg-card/60 backdrop-blur-sm text-foreground font-semibold text-sm hover:border-primary/40 hover:bg-card transition-all duration-200 cursor-pointer">
                  View Categories
                </span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-border/50">
              {[
                { value: "200+", label: "Products" },
                { value: "8", label: "Categories" },
                { value: "80+", label: "Countries" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-black text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product image */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md">
              {/* Podium */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-20 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 h-12 rounded-full bg-gradient-to-r from-primary/20 via-primary/30 to-accent/20 blur-xl" />

              {/* Floating image */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
                data-testid="img-hero-product"
              >
                <img
                  src="https://placehold.co/480x480/F5E6D3/6B1A2A?text=%C3%9CLKER&font=inter"
                  alt="Ülker featured product"
                  className="w-full aspect-square object-contain rounded-full"
                />
              </motion.div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-8 -left-6 bg-card shadow-xl rounded-2xl p-3 border border-border"
              >
                <p className="text-xs font-bold text-foreground">200+ Products</p>
                <p className="text-[10px] text-muted-foreground">In catalog</p>
              </motion.div>

              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-16 -right-6 bg-card shadow-xl rounded-2xl p-3 border border-border"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-xs font-bold text-foreground">In Stock</p>
                </div>
                <p className="text-[10px] text-muted-foreground">Updated live</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={16} className="text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
