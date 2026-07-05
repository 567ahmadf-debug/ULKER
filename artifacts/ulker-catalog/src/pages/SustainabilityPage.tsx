import { motion } from "framer-motion";
import { Leaf, Recycle, Droplets, Sun, TreePine, Factory } from "lucide-react";
import Footer from "@/components/layout/Footer";

const pillars = [
  { icon: Leaf, title: "Responsible Sourcing", stat: "95%", statLabel: "Certified Suppliers", description: "We source cocoa, palm oil, and agricultural ingredients from certified sustainable sources, working towards full traceability across our supply chain." },
  { icon: Recycle, title: "Packaging Innovation", stat: "40%", statLabel: "Recycled Content", description: "We are actively reducing virgin plastic use and transitioning to recyclable, compostable, and reduced-weight packaging formats across our portfolio." },
  { icon: Droplets, title: "Water Stewardship", stat: "25%", statLabel: "Water Reduction", description: "Continuous investment in water-efficient equipment and closed-loop water systems has reduced water intensity per tonne of production by 25% since 2018." },
  { icon: Sun, title: "Renewable Energy", stat: "60%", statLabel: "Renewable Power", description: "Six of our production facilities are now powered by renewable energy sources, with a target of 100% by 2030." },
  { icon: TreePine, title: "Carbon Reduction", stat: "30%", statLabel: "CO₂ Reduction", description: "A 30% reduction in Scope 1 and 2 carbon emissions since our 2018 baseline, on track to meet our 2030 Science-Based Target." },
  { icon: Factory, title: "Zero Waste Facilities", stat: "4", statLabel: "Zero-Waste Sites", description: "Four facilities have achieved Zero Waste to Landfill certification, with the remaining sites targeting certification by 2026." },
];

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen pt-20 pb-20 lg:pb-0" data-testid="page-sustainability">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-background dark:from-green-950/20 dark:to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <p className="text-xs font-bold tracking-widest uppercase text-green-600 dark:text-green-400 mb-3">Our Planet Commitment</p>
            <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-4">Sustainability at Ülker</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe that building a responsible business and protecting the planet are not competing goals — they are the same goal. Our sustainability strategy is built on six interlocking pillars.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-6 bg-card border border-border rounded-2xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950 flex items-center justify-center">
                    <p.icon size={18} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-foreground">{p.stat}</p>
                    <p className="text-xs text-muted-foreground">{p.statLabel}</p>
                  </div>
                </div>
                <h3 className="font-bold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Report CTA */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black text-foreground mb-3">Annual Sustainability Report</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Full disclosure of our environmental, social, and governance performance — independently verified to GRI Standards.</p>
          <button className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
            Download Report 2024
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
