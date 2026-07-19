import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getSettings } from "@/data/admin-store";

const ADMIN_POSITIONS = [
  { x: "5%", y: "5%", size: "w-28 h-28 lg:w-40 lg:h-40", rotate: -10 },
  { x: "50%", y: "0%", size: "w-24 h-24 lg:w-32 lg:h-32", rotate: 15 },
  { x: "25%", y: "35%", size: "w-32 h-32 lg:w-48 lg:h-48", rotate: -5 },
  { x: "60%", y: "30%", size: "w-20 h-20 lg:w-28 lg:h-28", rotate: 22 },
  { x: "0%", y: "60%", size: "w-20 h-20 lg:w-28 lg:h-28", rotate: -18 },
  { x: "45%", y: "60%", size: "w-24 h-24 lg:w-36 lg:h-36", rotate: 8 },
  { x: "15%", y: "75%", size: "w-16 h-16 lg:w-24 lg:h-24", rotate: -25 },
  { x: "70%", y: "65%", size: "w-18 h-18 lg:w-24 lg:h-24", rotate: 12 },
];

const DEFAULT_BISCUITS = [
  { x: "10%", y: "8%", size: "w-28 h-28 lg:w-36 lg:h-36", rotate: -12, delay: 0 },
  { x: "55%", y: "5%", size: "w-20 h-20 lg:w-28 lg:h-28", rotate: 18, delay: 0.4 },
  { x: "30%", y: "40%", size: "w-32 h-32 lg:w-44 lg:h-44", rotate: -5, delay: 0.2 },
  { x: "65%", y: "35%", size: "w-24 h-24 lg:w-32 lg:h-32", rotate: 25, delay: 0.6 },
  { x: "5%", y: "60%", size: "w-16 h-16 lg:w-24 lg:h-24", rotate: -20, delay: 0.8 },
  { x: "50%", y: "65%", size: "w-20 h-20 lg:w-28 lg:h-28", rotate: 10, delay: 1.0 },
];

function FloatingBiscuits() {
  const settings = getSettings();
  const hasAdminImages = settings.floatingImageUrls.length > 0;

  if (hasAdminImages) {
    return (
      <div className="relative w-full h-[350px] lg:h-[520px]">
        {settings.floatingImageUrls.map((url, i) => {
          const pos = ADMIN_POSITIONS[i % ADMIN_POSITIONS.length];
          return (
            <motion.div
              key={`admin-${i}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [-8, 8, -8] }}
              transition={{
                opacity: { duration: 0.5, delay: i * 0.1 },
                scale: { duration: 0.5, delay: i * 0.1 },
                y: { duration: 3.5 + (i % 3) * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
              }}
              className="absolute"
              style={{ left: pos.x, top: pos.y, transform: `rotate(${pos.rotate}deg)` }}
            >
              <img
                src={url}
                alt={`Biscuit ${i + 1}`}
                className={`${pos.size} object-contain drop-shadow-lg`}
                style={{ background: "transparent" }}
              />
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[350px] lg:h-[520px]">
      {DEFAULT_BISCUITS.map((b, i) => (
        <motion.div
          key={`default-${i}`}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1, y: [-6, 6, -6] }}
          transition={{
            opacity: { duration: 0.6, delay: b.delay },
            scale: { duration: 0.6, delay: b.delay },
            y: { duration: 3 + (i % 3) * 0.5, repeat: Infinity, ease: "easeInOut", delay: b.delay },
          }}
          className="absolute"
          style={{ left: b.x, top: b.y }}
        >
          <div
            className={`${b.size} rounded-full bg-gradient-to-br from-primary/15 via-primary/8 to-accent/10 border border-primary/10 backdrop-blur-sm shadow-lg`}
            style={{ transform: `rotate(${b.rotate}deg)` }}
          >
            <div className="w-full h-full rounded-full flex items-center justify-center">
              <div className="w-[55%] h-[55%] rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/8" />
            </div>
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-36 h-36 lg:w-52 lg:h-52 rounded-full bg-gradient-to-br from-primary/12 via-accent/8 to-primary/6 border-2 border-primary/10 shadow-xl flex items-center justify-center"
        >
          <div className="text-center">
            <p className="text-primary/30 text-[10px] font-bold tracking-widest uppercase">Since</p>
            <p className="text-primary/25 text-4xl lg:text-5xl font-black">1944</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" data-testid="section-hero">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-primary/5 to-transparent" />
      <div className="absolute top-24 right-16 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-24 right-48 w-64 h-64 rounded-full bg-accent/10 blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
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
              <Link href="/contact" data-testid="link-view-categories">
                <span className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-border bg-card/60 backdrop-blur-sm text-foreground font-semibold text-sm hover:border-primary/40 hover:bg-card transition-all duration-200 cursor-pointer">
                  Contact Us
                </span>
              </Link>
            </div>

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

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md" data-testid="img-hero-product">
              <FloatingBiscuits />
            </div>
          </motion.div>
        </div>
      </div>

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
