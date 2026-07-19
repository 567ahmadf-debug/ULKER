import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ShieldCheck, Leaf, Award, Globe } from "lucide-react";
import { Link } from "wouter";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    description: "Every product undergoes rigorous quality checks at every stage of production, meeting the highest international food safety standards.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "We are committed to reducing our environmental footprint through responsible sourcing, packaging innovation, and energy efficiency.",
  },
  {
    icon: Award,
    title: "Award-Winning",
    description: "Recognized globally for product excellence, innovation, and brand trust across more than 80 countries worldwide.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "From our roots in İstanbul to shelves around the world — Ülker products bring delight to millions of families every day.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" data-testid="page-home">
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />

      {/* Brand Pillars */}
      <section className="py-24 bg-background" data-testid="section-pillars">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-bold tracking-widest uppercase text-primary mb-3"
            >
              Why Ülker
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl lg:text-4xl font-black text-foreground"
            >
              Trusted Since 1944
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-4 group-hover:bg-primary/12 transition-colors">
                  <p.icon size={22} className="text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-primary" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-black text-primary-foreground mb-4"
          >
            Explore the Full Catalog
          </motion.h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Detailed specifications, nutritional information, and availability for every product.
          </p>
          <Link href="/products" data-testid="link-browse-all-products">
            <span className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary font-bold text-sm hover:bg-primary-foreground/90 transition-colors cursor-pointer">
              Browse All Products
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
