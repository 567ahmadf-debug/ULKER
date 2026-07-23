import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Globe, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

const NAV_KEYS = [
  { href: "/", key: "nav.home", label: "Home" },
  { href: "/products", key: "nav.products", label: "Products" },
  { href: "/offers", key: "nav.offers", label: "Categories" },
  { href: "/about", key: "nav.about", label: "Offers" },
  { href: "/contact", key: "nav.contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const { t } = useTranslation();
  const [lang, setLang] = useState<"EN" | "AR">(i18n.language === "ar" ? "AR" : "EN");

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const toggleLanguage = () => {
    const next = lang === "EN" ? "AR" : "EN";
    setLang(next);
    i18n.changeLanguage(next === "AR" ? "ar" : "en");
    const html = document.documentElement;
    if (next === "AR") {
      html.setAttribute("dir", "rtl");
      html.setAttribute("lang", "ar");
      html.style.fontFamily = "'Tajawal', sans-serif";
    } else {
      html.setAttribute("dir", "ltr");
      html.setAttribute("lang", "en");
      html.style.fontFamily = "'Inter', sans-serif";
    }
  };

  return (
    <>
      {/* Desktop header */}
      <header className="hidden lg:flex sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border px-8 py-4 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" data-testid="link-logo">
            <span className="text-3xl font-bold tracking-wider text-primary font-heading uppercase cursor-pointer">Ülker</span>
          </Link>
          <nav className="flex items-center gap-6" aria-label="Main navigation">
            {NAV_KEYS.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`link-nav-${link.key.split(".")[1]}`}>
                <span
                  className={`text-sm font-medium transition-colors cursor-pointer pb-1 ${
                    location === link.href
                      ? "text-primary font-semibold border-b-2 border-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            data-testid="button-language-toggle"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-secondary transition-colors"
            aria-label="Toggle language"
          >
            <Globe size={16} className="text-muted-foreground" />
            <span>{lang === "EN" ? "English (EN)" : "العربية (AR)"}</span>
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            data-testid="button-theme-toggle"
            className="p-2.5 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link href="/contact" data-testid="link-contact-sales">
            <span className="bg-primary text-primary-foreground font-semibold px-5 py-2 rounded-full text-sm hover:opacity-90 transition-opacity cursor-pointer">
              Contact Sales
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/" data-testid="link-logo-mobile">
          <span className="text-2xl font-bold tracking-wider text-primary font-heading uppercase cursor-pointer">Ülker</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            data-testid="button-language-toggle-mobile"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-border text-sm font-medium hover:bg-secondary transition-colors"
            aria-label="Toggle language"
          >
            <Globe size={16} className="text-muted-foreground" />
            <span>{lang === "EN" ? "EN" : "AR"}</span>
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            data-testid="button-theme-toggle-mobile"
            className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            data-testid="button-mobile-menu"
            className="p-2 rounded-full hover:bg-secondary text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden overflow-hidden bg-background border-b border-border"
          >
            <div className="px-4 pb-4 pt-2 flex flex-col gap-1">
              {NAV_KEYS.map((link) => (
                <Link key={link.href} href={link.href} data-testid={`link-mobile-nav-${link.key.split(".")[1]}`}>
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
    </>
  );
}
