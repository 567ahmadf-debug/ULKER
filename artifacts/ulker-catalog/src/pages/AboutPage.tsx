import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  const { t } = useTranslation();

  const milestones = [
    { year: "1944", titleKey: "about.founded", descKey: "about.founded_desc" },
    { year: "1960s", titleKey: "about.national_expansion", descKey: "about.national_expansion_desc" },
    { year: "1980s", titleKey: "about.first_exports", descKey: "about.first_exports_desc" },
    { year: "1996", titleKey: "about.public_listing", descKey: "about.public_listing_desc" },
    { year: "2007", titleKey: "about.global_acquisitions", descKey: "about.global_acquisitions_desc" },
    { year: "2012", titleKey: "about.pladis_family", descKey: "about.pladis_family_desc" },
    { year: "Today", titleKey: "about.today", descKey: "about.today_desc" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-0" data-testid="page-about">
      {/* Hero */}
      <section className="py-20 bg-primary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-3">{t("about.our_story")}</p>
            <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-6">{t("about.since_1944")}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {t("about.story_p1")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("about.story_p2")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: "1944", labelKey: "about.stats_founded" },
              { value: "200+", labelKey: "about.stats_products" },
              { value: "80+", labelKey: "about.stats_countries" },
              { value: "10,000+", labelKey: "about.stats_employees" },
            ].map((stat) => (
              <div key={stat.labelKey} className="bg-card border border-border rounded-2xl p-6 text-center">
                <p className="text-3xl font-black text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{t(stat.labelKey)}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-foreground mb-12 text-center">{t("about.our_journey")}</h2>
          <div className="relative">
            <div className="absolute left-16 sm:left-20 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-16 sm:w-20 shrink-0 text-right">
                    <span className="text-sm font-black text-primary">{m.year}</span>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                    <h3 className="font-bold text-foreground mb-1">{t(m.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(m.descKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
