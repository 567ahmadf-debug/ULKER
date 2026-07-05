import { Link, useLocation } from "wouter";
import { Home, Grid3X3, Search, Package, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import SearchOverlay from "@/components/common/SearchOverlay";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/categories", label: "Categories", icon: Grid3X3 },
  { href: "/products", label: "Products", icon: Package },
];

export default function MobileBottomNav() {
  const [location] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border" aria-label="Mobile navigation">
        <div className="flex items-center justify-around h-16 px-2">
          {items.map(({ href, label, icon: Icon }) => {
            const active = location === href;
            return (
              <Link key={href} href={href} data-testid={`link-mobile-bottom-${label.toLowerCase()}`}>
                <span className="flex flex-col items-center gap-1 px-4 cursor-pointer">
                  <Icon
                    size={20}
                    className={active ? "text-primary" : "text-muted-foreground"}
                    strokeWidth={active ? 2.5 : 1.8}
                  />
                  <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setSearchOpen(true)}
            data-testid="button-mobile-bottom-search"
            className="flex flex-col items-center gap-1 px-4"
            aria-label="Search"
          >
            <Search size={20} className="text-muted-foreground" strokeWidth={1.8} />
            <span className="text-[10px] font-medium text-muted-foreground">Search</span>
          </button>

          <Link href="/about" data-testid="link-mobile-bottom-more">
            <span className="flex flex-col items-center gap-1 px-4 cursor-pointer">
              <MoreHorizontal size={20} className="text-muted-foreground" strokeWidth={1.8} />
              <span className="text-[10px] font-medium text-muted-foreground">More</span>
            </span>
          </Link>
        </div>
      </nav>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
