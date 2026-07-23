import { Link } from "wouter";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Special Offers", href: "/offers" },
];

const categoryLinks = [
  { label: "Chocolates", href: "/products?category=Chocolate" },
  { label: "Biscuits & Cookies", href: "/products?category=Biscuits" },
  { label: "Wafers & Snacks", href: "/products?category=Wafer" },
  { label: "Salty Crackers", href: "/products?category=Cookies" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <span className="text-2xl font-bold tracking-wider font-heading uppercase">Ülker</span>
          <p className="text-sm text-primary-foreground/70">
            Bringing sweet moments of happiness to families and homes all around the globe.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="flex flex-col gap-2 text-sm text-primary-foreground/70">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>
                  <span className="hover:text-primary-foreground cursor-pointer">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Categories</h4>
          <ul className="flex flex-col gap-2 text-sm text-primary-foreground/70">
            {categoryLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>
                  <span className="hover:text-primary-foreground cursor-pointer">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Contact Info</h4>
          <p className="text-sm text-primary-foreground/70 mb-2">
            Have questions about our products or distribution?
          </p>
          <a href="mailto:info@ulker.com" className="text-sm font-semibold underline hover:text-primary-foreground">
            info@ulker.com
          </a>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 py-6 text-center text-xs text-primary-foreground/50">
        &copy; 2026 Ülker Official Product Catalog. All rights reserved.
      </div>
    </footer>
  );
}
