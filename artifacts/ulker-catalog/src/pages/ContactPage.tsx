import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock, MessageSquare, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const { t } = useTranslation();

  const contacts = [
    { icon: MapPin, titleKey: "contact.headquarters", lines: ["Rif Dimashq - Arbeen", "Ahmad Alfarran"] },
    { icon: Phone, titleKey: "contact.phone", lines: ["+963 999999999"] },
    { icon: Mail, titleKey: "contact.email", lines: ["info@ulker.com.tr", "press@ulker.com.tr"] },
    { icon: Clock, titleKey: "contact.hours", lines: [t("contact.hours_mf"), t("contact.hours_sat")] },
  ];

  const departments = [
    { deptKey: "contact.consumer_services", email: "consumer@ulker.com.tr", icon: MessageSquare },
    { deptKey: "contact.trade_export", email: "export@ulker.com.tr", icon: Globe },
    { deptKey: "contact.press_media", email: "press@ulker.com.tr", icon: Mail },
  ];

  const faqs = [
    { qKey: "contact.faq_q1", aKey: "contact.faq_a1" },
    { qKey: "contact.faq_q2", aKey: "contact.faq_a2" },
    { qKey: "contact.faq_q3", aKey: "contact.faq_a3" },
    { qKey: "contact.faq_q4", aKey: "contact.faq_a4" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-0" data-testid="page-contact">
      {/* Hero — compressed */}
      <section className="pt-4 pb-2 bg-primary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1">{t("contact.get_in_touch")}</p>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">{t("contact.contact_us")}</h1>
            <p className="mt-1 text-xs text-muted-foreground max-w-md">{t("contact.contact_desc")}</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact info */}
          <div>
            <h2 className="text-base sm:text-xl font-black text-foreground mb-4">{t("contact.contact_info")}</h2>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {contacts.map((c, i) => (
                <motion.div
                  key={c.titleKey}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 p-3 bg-card border border-border rounded-xl"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                    <c.icon size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-0.5">{t(c.titleKey)}</p>
                    {c.lines.map((line) => (
                      <p key={line} className="text-xs text-foreground">{line}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Departments */}
            <h2 className="text-base sm:text-xl font-black text-foreground mb-3">{t("contact.department_contacts")}</h2>
            <div className="space-y-2.5">
              {departments.map((d, i) => (
                <motion.div
                  key={d.deptKey}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                    <d.icon size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{t(d.deptKey)}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{d.email}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-base sm:text-xl font-black text-foreground mb-4">{t("contact.faq")}</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="p-4 bg-card border border-border rounded-xl"
                >
                  <h3 className="text-xs sm:text-sm font-bold text-foreground mb-1.5">{t(faq.qKey)}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t(faq.aKey)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
