import { Link, useLocation } from "wouter";
import { Home, Layers, Tag, Phone, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";

const items = [
  { href: "/", labelKey: "mobile.home", icon: Home },
  { href: "/products", labelKey: "mobile.products", icon: Layers },
  { href: "/offers", labelKey: "mobile.offers", icon: Tag },
  { href: "/contact", labelKey: "mobile.contact", icon: Phone },
  { href: "/about", labelKey: "mobile.more", icon: Menu },
];

export default function MobileBottomNav() {
  const [location] = useLocation();
  const { t } = useTranslation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border py-2 px-4"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-between">
        {items.map(({ href, labelKey, icon: Icon }) => {
          const active = href === "/" ? location === "/" : location.startsWith(href);
          return (
            <Link key={href} href={href} data-testid={`link-mobile-bottom-${labelKey.split(".")[1]}`}>
              <span className={`flex flex-col items-center gap-1 cursor-pointer ${active ? "text-primary" : "text-muted-foreground hover:text-primary transition-colors"}`}>
                <Icon size={20} />
                <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>
                  {t(labelKey)}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
