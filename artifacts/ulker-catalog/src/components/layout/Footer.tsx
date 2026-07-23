import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("products.all_products"), href: "/products" },
    { label: t("nav.categories"), href: "/categories" },
    { label: t("footer.special_offers"), href: "/offers" },
  ];

  const categoryLinks = [
    { label: t("footer.chocolates"), href: "/products?category=Chocolate" },
    { label: t("footer.biscuits"), href: "/products?category=Biscuits" },
    { label: t("footer.wafers"), href: "/products?category=Wafer" },
    { label: t("footer.crackers"), href: "/products?category=Cookies" },
  ];

  return (
    <footer className="bg-[#7A1C28] text-white mt-8 border-t border-border">
      <div className="py-6 sm:py-8 px-6 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto text-start items-start">
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-bold tracking-wider font-heading">Ülker</span>
            <p className="text-sm text-red-100/80 leading-relaxed max-w-xs">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-red-200">{t("footer.quick_links")}</h4>
            <ul className="flex flex-col">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="block py-1.5 text-sm text-white/80 hover:text-white transition-colors duration-200 cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-red-200">{t("footer.categories_title")}</h4>
            <ul className="flex flex-col">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="block py-1.5 text-sm text-white/80 hover:text-white transition-colors duration-200 cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-red-200">{t("footer.contact_title")}</h4>
            <p className="text-sm text-white/80 leading-relaxed opacity-90 mb-2">
              {t("footer.contact_question")}
            </p>
            <a
              href="mailto:info@ulker.com"
              className="block py-1.5 text-sm text-white/80 hover:text-white transition-colors duration-200"
            >
              info@ulker.com
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 px-6 sm:px-8 text-center text-xs text-white/50">
        &copy; 2026 Ülker Official Product Catalog. All rights reserved.
      </div>
    </footer>
  );
}
