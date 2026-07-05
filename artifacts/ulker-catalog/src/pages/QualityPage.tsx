import { motion } from "framer-motion";
import { ShieldCheck, FlaskConical, FileCheck, Microscope, Award, Thermometer } from "lucide-react";
import Footer from "@/components/layout/Footer";

const standards = [
  { icon: ShieldCheck, title: "ISO 22000", description: "Food Safety Management System certified across all production facilities." },
  { icon: Award, title: "FSSC 22000", description: "Food Safety System Certification covering the entire supply chain." },
  { icon: FileCheck, title: "HACCP", description: "Hazard Analysis Critical Control Points protocols implemented at every stage." },
  { icon: Microscope, title: "Microbiological Testing", description: "Rigorous lab testing at intake, in-process, and final product stages." },
  { icon: FlaskConical, title: "Chemical Analysis", description: "Comprehensive chemical profiling to ensure product integrity and safety." },
  { icon: Thermometer, title: "Cold Chain Management", description: "Temperature-controlled logistics for sensitive product categories." },
];

const stages = [
  { step: "01", title: "Raw Material Sourcing", description: "We partner with certified suppliers who meet our strict quality, sustainability, and traceability standards." },
  { step: "02", title: "Incoming Inspection", description: "Every batch of raw ingredients undergoes rigorous physical, chemical, and microbiological inspection before entering production." },
  { step: "03", title: "In-Process Control", description: "Continuous monitoring at every critical control point throughout the manufacturing process." },
  { step: "04", title: "Finished Product Testing", description: "Comprehensive testing of finished products — sensory, nutritional, microbiological, and shelf-life validation." },
  { step: "05", title: "Traceability", description: "Full batch traceability from farm to shelf, enabling rapid response to any quality concerns." },
  { step: "06", title: "Consumer Feedback", description: "Structured consumer feedback loops that continuously inform product improvement." },
];

export default function QualityPage() {
  return (
    <div className="min-h-screen pt-20 pb-20 lg:pb-0" data-testid="page-quality">
      {/* Hero */}
      <section className="py-20 bg-primary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-3">Our Commitment</p>
            <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-4">Quality Without Compromise</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Ülker, quality is not a department — it is a culture. Every product that bears our name reflects 80 years of accumulated expertise, continuous improvement, and an unwavering commitment to consumer trust.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Standards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-foreground mb-2">Certifications & Standards</h2>
          <p className="text-muted-foreground mb-10">Internationally recognised frameworks that govern our quality systems.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {standards.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-5 bg-card border border-border rounded-2xl"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-3">
                  <s.icon size={18} className="text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-foreground mb-2">Our Quality Process</h2>
          <p className="text-muted-foreground mb-10">A six-stage system that ensures every product is perfect before it reaches you.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-5 bg-card border border-border rounded-2xl"
              >
                <span className="text-3xl font-black text-primary/20">{stage.step}</span>
                <h3 className="font-bold text-foreground mt-2 mb-1">{stage.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{stage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Allergen */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-2xl font-black text-foreground mb-4">Allergen Management</h2>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
            <p>Ülker follows the EU's allergen labelling regulations (EU 1169/2011) and equivalent international standards. All 14 major allergens are clearly identified on product packaging using bold text within the ingredients list.</p>
            <p>Our facilities have strict protocols for allergen segregation, cleaning validation, and cross-contamination prevention. Where cross-contact risk exists, this is explicitly communicated as "May contain" statements.</p>
            <p>Consumers with specific allergen concerns are encouraged to always read the product label carefully and to contact our consumer services team for detailed information.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
