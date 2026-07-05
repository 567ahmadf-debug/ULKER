import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

function ProductShowcase() {
  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto">
      {/* Outer glow ring */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/10 via-accent/15 to-primary/5 blur-2xl" />

      {/* Main product card */}
      <div className="absolute inset-8 rounded-3xl bg-gradient-to-br from-primary to-primary/80 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-24 h-24 rounded-full border-4 border-white" />
          <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full border-4 border-white" />
          <div className="absolute top-1/2 -translate-y-1/2 left-2 w-12 h-12 rounded-full border-2 border-white" />
        </div>

        {/* Gold band */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent/60 via-accent to-accent/60" />
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent/60 via-accent to-accent/60" />

        {/* Product visual */}
        <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <span className="text-2xl font-black text-white tracking-tight">Ü</span>
          </div>
          <div>
            <p className="text-white/60 text-[10px] font-bold tracking-widest uppercase mb-1">Since 1944</p>
            <h3 className="text-white font-black text-xl tracking-tight leading-none">ÜLKER</h3>
            <p className="text-white/70 text-[11px] font-medium mt-1.5 tracking-wide">PETIBÖR</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-accent/90 text-[10px] font-bold text-white tracking-wide">
            Classic Biscuit · 172g
          </div>
        </div>

        {/* Biscuit circles decoration */}
        <div className="absolute bottom-12 left-6 w-8 h-8 rounded-full bg-white/10 border border-white/20" />
        <div className="absolute bottom-8 left-10 w-5 h-5 rounded-full bg-white/10 border border-white/20" />
        <div className="absolute top-10 right-5 w-6 h-6 rounded-full bg-white/10 border border-white/20" />
      </div>

      {/* Podium shadow */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/5 h-6 rounded-full bg-primary/20 blur-xl" />
    </div>
  );
}

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" data-testid="section-hero">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-primary/5 to-transparent" />
      <div className="absolute top-24 right-16 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-24 right-48 w-64 h-64 rounded-full bg-accent/10 blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text side */}
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
                {t("hero.badge")}
              </span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-black leading-[0.95] tracking-tight text-foreground mb-6">
              {t("hero.headline_1")}
              <br />
              <span className="text-primary">{t("hero.headline_2")}</span>
              {t("hero.headline_3") && (
                <>
                  <br />
                  {t("hero.headline_3")}
                </>
              )}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              {t("hero.description")}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/products" data-testid="link-browse-products">
                <span className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 cursor-pointer">
                  {t("hero.browse_products")}
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </span>
              </Link>
              <Link href="/quality" data-testid="link-view-quality">
                <span className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-border bg-card/60 backdrop-blur-sm text-foreground font-semibold text-sm hover:border-primary/40 hover:bg-card transition-all duration-200 cursor-pointer">
                  {t("hero.view_categories")}
                </span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-border/50">
              {[
                { value: "200+", key: "hero.stat_products" },
                { value: "8", key: "hero.stat_categories" },
                { value: "80+", key: "hero.stat_countries" },
              ].map((stat) => (
                <div key={stat.key}>
                  <p className="text-2xl font-black text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{t(stat.key)}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product visual side */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md" data-testid="img-hero-product">
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ProductShowcase />
              </motion.div>

              {/* Floating badge – 200+ products */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-6 -left-4 rtl:left-auto rtl:-right-4 bg-card shadow-xl rounded-2xl p-3 border border-border"
              >
                <p className="text-xs font-bold text-foreground">{t("hero.badge_200")}</p>
                <p className="text-[10px] text-muted-foreground">{t("hero.badge_in_catalog")}</p>
              </motion.div>

              {/* Floating badge – In Stock */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-12 -right-4 rtl:right-auto rtl:-left-4 bg-card shadow-xl rounded-2xl p-3 border border-border"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-xs font-bold text-foreground">{t("hero.badge_in_stock")}</p>
                </div>
                <p className="text-[10px] text-muted-foreground">{t("hero.badge_updated_live")}</p>
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
        <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
          {t("hero.scroll")}
        </span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown size={16} className="text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
