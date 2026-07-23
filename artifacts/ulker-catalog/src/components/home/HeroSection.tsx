import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section data-testid="section-hero">
      {/* Hero content */}
      <div className="max-w-7xl mx-auto w-full px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gradient-to-b from-secondary/30 to-transparent rounded-3xl mt-6">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold tracking-wider uppercase rounded-full w-fit"
          >
            <span className="w-2 h-2 bg-primary rounded-full" />
            <span>{t("hero.badge")}</span>
          </motion.div>

          <h1 className="text-5xl lg:text-6xl font-extrabold font-heading tracking-tight text-primary leading-tight">
            {t("hero.headline_1")}
            <br />
            {t("hero.headline_2")}{" "}
            <span className="underline decoration-tertiary decoration-4">
              {t("hero.headline_3")}
            </span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            {t("hero.description")}
          </p>

          <div className="flex items-center gap-4 mt-4">
            <Link href="/products" data-testid="link-browse-products">
              <span className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl shadow-lg hover:opacity-95 transition-opacity text-base cursor-pointer">
                <span>{t("hero.browse_products")}</span>
                <ArrowRight size={18} />
              </span>
            </Link>
            <Link href="/contact" data-testid="link-contact">
              <span className="inline-flex items-center justify-center gap-2 border border-border bg-card text-foreground font-semibold px-8 py-4 rounded-xl hover:bg-secondary transition-colors text-base cursor-pointer">
                <Phone size={18} className="text-muted-foreground" />
                <span>Contact Us</span>
              </span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-border bg-card"
        >
          <img
            src="https://uxmagic.blob.core.windows.net/public/agent-images/img-hero-1784801634223-ryt1g0ex7c9.png"
            alt="Ülker Premium Chocolate Composition"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
        </motion.div>
      </div>

      {/* Statistics Banner */}
      <section className="max-w-7xl mx-auto w-full px-8 py-8">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-md grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            { value: "200+", icon: "lucide:layers", label: t("hero.stat_products"), sub: "Across all delicious categories" },
            { value: "8", icon: "lucide:grid-3x3", label: t("hero.stat_categories"), sub: "Specially crafted for every taste" },
            { value: "80+", icon: "lucide:globe", label: t("hero.stat_countries"), sub: "Trusted by millions worldwide" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2 pt-4 md:pt-0">
              <div className="p-3 bg-primary/5 rounded-full text-primary">
                <span className="text-2xl">●</span>
              </div>
              <span className="text-3xl font-extrabold font-heading text-primary mt-2">{stat.value}</span>
              <span className="text-sm font-semibold text-foreground">{stat.label}</span>
              <span className="text-xs text-muted-foreground">{stat.sub}</span>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
