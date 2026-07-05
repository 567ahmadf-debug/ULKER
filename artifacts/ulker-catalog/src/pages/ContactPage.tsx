import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock, MessageSquare, Globe } from "lucide-react";
import Footer from "@/components/layout/Footer";

const contacts = [
  { icon: MapPin, title: "Headquarters", lines: ["Kısıklı Mah., Ferah Cad. No:1", "Üsküdar, İstanbul, Türkiye"] },
  { icon: Phone, title: "Phone", lines: ["+90 (216) 524 24 24", "+90 (216) 524 24 25 (Fax)"] },
  { icon: Mail, title: "Email", lines: ["info@ulker.com.tr", "press@ulker.com.tr"] },
  { icon: Clock, title: "Hours", lines: ["Monday–Friday: 08:30–18:00", "Saturday: 09:00–13:00"] },
];

const faqs = [
  { q: "How can I find nutritional information for a product?", a: "Detailed nutritional information is available on every product page in this catalog, including per-serving and per-100g values." },
  { q: "Where can I find allergen information?", a: "Each product page includes a dedicated allergen section listing all declared allergens and potential cross-contamination risks." },
  { q: "Are Ülker products available outside Turkey?", a: "Yes — Ülker products are distributed in over 80 countries. Contact our export team for regional distributor information." },
  { q: "How do I report a quality concern?", a: "Please contact our consumer services team by phone or email with the product barcode and batch number. We respond within 24 hours." },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-20 pb-20 lg:pb-0" data-testid="page-contact">
      {/* Hero */}
      <section className="py-20 bg-primary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-3">Get in Touch</p>
            <h1 className="text-4xl font-black text-foreground">Contact Us</h1>
            <p className="mt-3 text-muted-foreground max-w-lg">Our team is available to answer product enquiries, trade questions, and media requests.</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="text-xl font-black text-foreground mb-6">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {contacts.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="p-4 bg-card border border-border rounded-2xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <c.icon size={16} className="text-primary" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{c.title}</p>
                  </div>
                  {c.lines.map((line) => (
                    <p key={line} className="text-sm text-foreground">{line}</p>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Departments */}
            <h2 className="text-xl font-black text-foreground mb-4">Department Contacts</h2>
            <div className="space-y-3">
              {[
                { dept: "Consumer Services", email: "consumer@ulker.com.tr", icon: MessageSquare },
                { dept: "Trade & Export", email: "export@ulker.com.tr", icon: Globe },
                { dept: "Press & Media", email: "press@ulker.com.tr", icon: Mail },
              ].map((d) => (
                <div key={d.dept} className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                    <d.icon size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{d.dept}</p>
                    <p className="text-xs text-muted-foreground">{d.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-black text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="p-5 bg-card border border-border rounded-2xl"
                >
                  <h3 className="text-sm font-bold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
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
