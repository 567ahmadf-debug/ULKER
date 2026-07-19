import { Link, useLocation } from "wouter";
import { Home, Package, Phone, MoreHorizontal, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";

const items = [
  { href: "/", labelKey: "mobile.home", icon: Home },
  { href: "/products", labelKey: "mobile.products", icon: Package },
  { href: "/offers", labelKey: "mobile.offers", icon: Tag },
  { href: "/contact", labelKey: "mobile.contact", icon: Phone },
  { href: "/about", labelKey: "mobile.more", icon: MoreHorizontal },
];

export default function MobileBottomNav() {
  const [location] = useLocation();
  const { t } = useTranslation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border"
      aria-label="Mobile navigation"
    >
      {/* px-1 on very small screens, px-2 on wider phones to fit all 5 tabs */}
      <div className="flex items-center justify-around h-14 sm:h-16 px-1 sm:px-2">
        {items.map(({ href, labelKey, icon: Icon }) => {
          const active = location === href;
          return (
            <Link key={href} href={href} data-testid={`link-mobile-bottom-${labelKey.split(".")[1]}`}>
              {/* flex-1 ensures each tab gets equal share of available width; min-w-0 prevents overflow */}
              <span className="flex flex-1 flex-col items-center gap-0.5 sm:gap-1 py-1.5 cursor-pointer min-w-0">
                <Icon
                  size={18}
                  className={active ? "text-primary" : "text-muted-foreground"}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span className={`text-[9px] sm:text-[10px] font-medium leading-tight truncate ${active ? "text-primary" : "text-muted-foreground"}`}>
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
