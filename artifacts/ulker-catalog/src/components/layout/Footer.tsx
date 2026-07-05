import { Link } from "wouter";
import { Mail, MapPin, Phone } from "lucide-react";

const columns = [
  {
    title: "Products",
    links: [
      { label: "Biscuits", href: "/products?category=Biscuits" },
      { label: "Chocolate", href: "/products?category=Chocolate" },
      { label: "Wafer", href: "/products?category=Wafer" },
      { label: "Cookies", href: "/products?category=Cookies" },
      { label: "Cakes & Snacks", href: "/products?category=Cake" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Ülker", href: "/about" },
      { label: "Quality Standards", href: "/quality" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Innovation", href: "/about" },
      { label: "Awards", href: "/about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Product Information", href: "/products" },
      { label: "Allergen Guide", href: "/quality" },
      { label: "Storage Guidelines", href: "/quality" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/">
              <span className="text-2xl font-black tracking-tight text-primary cursor-pointer">ÜLKER</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Turkey's most trusted confectionery brand since 1944. Bringing joy to every table, every day.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={14} className="text-primary shrink-0" />
                <span>Kısıklı Mah., Ferah Cad. No:1, Üsküdar, İstanbul</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={14} className="text-primary shrink-0" />
                <span>+90 (216) 524 24 24</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={14} className="text-primary shrink-0" />
                <span>info@ulker.com.tr</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold tracking-widest uppercase text-foreground mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Ülker Bisküvi Sanayi A.S. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Cookie Policy
            </span>
            <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Terms of Use
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
