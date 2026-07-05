import { Link, useLocation } from "wouter";
import { Home, Package, MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

const items = [
  { href: "/", labelKey: "mobile.home", icon: Home },
  { href: "/products", labelKey: "mobile.products", icon: Package },
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
      <div className="flex items-center justify-around h-16 px-6">
        {items.map(({ href, labelKey, icon: Icon }) => {
          const active = location === href;
          return (
            <Link key={href} href={href} data-testid={`link-mobile-bottom-${labelKey.split(".")[1]}`}>
              <span className="flex flex-col items-center gap-1 px-6 cursor-pointer">
                <Icon
                  size={20}
                  className={active ? "text-primary" : "text-muted-foreground"}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
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
