import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sun, Moon, Globe, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import SearchOverlay from "@/components/common/SearchOverlay";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/quality", label: "Quality" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "TR">("EN");
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          backgroundColor: scrolled ? "hsl(var(--background))" : "transparent",
          boxShadow: scrolled ? "0 1px 0 0 hsl(var(--border))" : "none",
        }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" data-testid="link-logo">
              <span className="flex items-center gap-2 cursor-pointer">
                <span className="text-2xl font-black tracking-tight text-primary">ÜLKER</span>
                <span className="hidden sm:block text-xs font-medium text-muted-foreground tracking-widest uppercase mt-1">
                  Product Catalog
                </span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} data-testid={`link-nav-${link.label.toLowerCase()}`}>
                  <span
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                      location === link.href
                        ? "text-primary bg-primary/8"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                data-testid="button-search-open"
                className="p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Open search"
              >
                <Search size={18} />
              </button>

              <button
                onClick={() => setLang((l) => (l === "EN" ? "TR" : "EN"))}
                data-testid="button-language-toggle"
                className="hidden sm:flex items-center gap-1 px-2 py-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted transition-colors text-xs font-semibold"
                aria-label="Toggle language"
              >
                <Globe size={14} />
                {lang}
              </button>

              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                data-testid="button-theme-toggle"
                className="p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => setMobileOpen((o) => !o)}
                data-testid="button-mobile-menu"
                className="lg:hidden p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="lg:hidden overflow-hidden bg-background border-b border-border"
            >
              <div className="max-w-7xl mx-auto px-4 pb-4 pt-2 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} data-testid={`link-mobile-nav-${link.label.toLowerCase()}`}>
                    <span
                      className={`block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                        location === link.href
                          ? "text-primary bg-primary/8"
                          : "text-foreground/70 hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
