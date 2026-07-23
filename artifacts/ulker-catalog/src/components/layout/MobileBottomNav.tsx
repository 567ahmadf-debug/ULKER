import { Link, useLocation } from "wouter";
import { Home, Layers, Tag, Phone, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";

const items = [
  { href: "/", labelKey: "mobile.home", label: "Home", icon: Home },
  { href: "/products", labelKey: "mobile.products", label: "Products", icon: Layers },
  { href: "/offers", labelKey: "mobile.offers", label: "Offers", icon: Tag },
  { href: "/contact", labelKey: "mobile.contact", label: "Contact", icon: Phone },
  { href: "/about", labelKey: "mobile.more", label: "More", icon: Menu },
];

export default function MobileBottomNav() {
  const [location] = useLocation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border py-2 px-4"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-between">
        {items.map(({ href, label, icon: Icon }) => {
          const active = location === href;
          return (
            <Link key={href} href={href} data-testid={`link-mobile-bottom-${label.toLowerCase()}`}>
              <span className={`flex flex-col items-center gap-1 cursor-pointer ${active ? "text-primary" : "text-muted-foreground hover:text-primary transition-colors"}`}>
                <Icon size={20} />
                <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>
                  {label}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
