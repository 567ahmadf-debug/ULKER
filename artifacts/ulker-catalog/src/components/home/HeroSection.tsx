import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Phone, Layers, Grid3x3, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getSettings } from "@/data/admin-store";

const stats = [
  { value: "200+", icon: Layers, labelKey: "hero.stat_products", subKey: "hero.stat_products_sub" },
  { value: "8", icon: Grid3x3, labelKey: "hero.stat_categories", subKey: "hero.stat_categories_sub" },
  { value: "80+", icon: Globe, labelKey: "hero.stat_countries", subKey: "hero.stat_countries_sub" },
];

export default function HeroSection() {
  const { t } = useTranslation();
  const settings = getSettings();
  const heroImg = settings.heroImageUrl || "https://uxmagic.blob.core.windows.net/public/agent-images/img-hero-1784801634223-ryt1g0ex7c9.png";

  return (
    <section data-testid="section-hero">
      {/* Hero content */}
      <div className="max-w-7xl mx-auto w-full px-5 lg:px-8 py-8 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-gradient-to-b from-secondary/30 to-transparent rounded-3xl mt-4 lg:mt-6">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-4 lg:gap-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 lg:px-4 py-1.5 bg-primary/10 text-primary text-xs lg:text-sm font-semibold tracking-wider uppercase rounded-full w-fit"
          >
            <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-primary rounded-full" />
            <span>{t("hero.badge")}</span>
          </motion.div>

          <h1 className="text-3xl lg:text-5xl xl:text-6xl font-extrabold font-heading tracking-tight text-primary leading-tight">
            {t("hero.headline_1")}
            <br />
            {t("hero.headline_2")}{" "}
            <span className="underline decoration-tertiary decoration-4">
              {t("hero.headline_3")}
            </span>
          </h1>

          <p className="text-sm lg:text-lg text-muted-foreground leading-relaxed max-w-xl">
            {t("hero.description")}
          </p>

          <div className="flex items-center gap-3 lg:gap-4 mt-2 lg:mt-4">
            <Link href="/products" data-testid="link-browse-products">
              <span className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-5 lg:px-8 py-3 lg:py-4 rounded-xl shadow-lg hover:opacity-95 transition-opacity text-sm lg:text-base cursor-pointer">
                <span>{t("hero.browse_products")}</span>
                <ArrowRight size={16} className="lg:hidden" />
                <ArrowRight size={18} className="hidden lg:block" />
              </span>
            </Link>
            <Link href="/contact" data-testid="link-contact">
              <span className="inline-flex items-center justify-center gap-2 border border-border bg-card text-foreground font-semibold px-5 lg:px-8 py-3 lg:py-4 rounded-xl hover:bg-secondary transition-colors text-sm lg:text-base cursor-pointer">
                <Phone size={16} className="text-muted-foreground" />
                <span>{t("hero.contact_us")}</span>
              </span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border border-border bg-card"
        >
          <img
            src={heroImg}
            alt={t("hero.alt_image")}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
        </motion.div>
      </div>

      {/* Statistics Banner - always 3-col grid */}
      <section className="max-w-7xl mx-auto w-full px-5 lg:px-8 py-4 lg:py-8">
        <div className="bg-card border border-border rounded-2xl lg:rounded-3xl p-4 lg:p-8 shadow-md grid grid-cols-3 text-center divide-x divide-border/60">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.labelKey} className="flex flex-col items-center gap-1 lg:gap-2 px-1 lg:px-2">
                <div className="p-2 lg:p-3 bg-primary/5 rounded-full text-primary">
                  <Icon size={20} className="lg:hidden" />
                  <Icon size={24} className="hidden lg:block" />
                </div>
                <span className="text-xl lg:text-3xl font-extrabold font-heading text-primary mt-1 lg:mt-2">{stat.value}</span>
                <span className="text-[10px] lg:text-sm font-semibold text-foreground truncate">{t(stat.labelKey)}</span>
                <span className="text-[9px] lg:text-xs text-muted-foreground truncate">{t(stat.subKey)}</span>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}
