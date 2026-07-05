import { motion } from "framer-motion";
import Footer from "@/components/layout/Footer";

const milestones = [
  { year: "1944", title: "Founded", description: "Sabri Ülker establishes Ülker in İstanbul with a single biscuit product." },
  { year: "1960s", title: "National Expansion", description: "Rapid growth across Turkey as Petibör and Halley become household names." },
  { year: "1980s", title: "First Exports", description: "Ülker products begin reaching international markets across the Middle East and Europe." },
  { year: "1996", title: "Public Listing", description: "Ülker Bisküvi is listed on the Istanbul Stock Exchange." },
  { year: "2007", title: "Global Acquisitions", description: "Strategic acquisition of international biscuit and chocolate brands across Europe and Asia." },
  { year: "2012", title: "pladis Family", description: "Ülker joins the pladis global biscuit and confectionery company alongside McVitie's and Godiva." },
  { year: "Today", title: "80+ Countries", description: "Ülker products are enjoyed in over 80 countries, with a portfolio of 200+ products." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-20 lg:pb-0" data-testid="page-about">
      {/* Hero */}
      <section className="py-20 bg-primary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-3">Our Story</p>
            <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-6">Since 1944,<br />Bringing Joy</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Ülker was founded in İstanbul in 1944 by Sabri Ülker with a simple belief: that good food brings people together. Starting with a single biscuit, we have grown into one of Turkey's most beloved and internationally recognised food companies.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, as part of the pladis family, Ülker products are enjoyed in over 80 countries. Our portfolio spans biscuits, chocolate, wafers, cakes, crackers, and snacks — all made with the same dedication to quality that has defined us for eight decades.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: "1944", label: "Founded" },
              { value: "200+", label: "Products" },
              { value: "80+", label: "Countries" },
              { value: "20K+", label: "Employees" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-2xl p-6 text-center">
                <p className="text-3xl font-black text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-foreground mb-12 text-center">Our Journey</h2>
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
                    <h3 className="font-bold text-foreground mb-1">{m.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{m.description}</p>
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
