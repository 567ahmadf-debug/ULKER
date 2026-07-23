import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Tag, Clock, CheckCircle, AlertCircle, Calendar, Package, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { getAllOffers, refreshOffersFromServer, type Offer } from "@/data/admin-store";
import { resolveImageUrl } from "@/lib/utils";
import { useState, useEffect } from "react";

type OfferStatus = "active" | "upcoming" | "expired";

function getOfferStatus(offer: Offer): OfferStatus {
  const now = new Date();
  const start = new Date(offer.startsAt);
  const end = new Date(offer.endsAt);
  if (now < start) return "upcoming";
  if (now > end) return "expired";
  return "active";
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function getOfferTitle(offer: Offer): string {
  return i18n.language === "ar" && offer.titleAr ? offer.titleAr : offer.title;
}

function getOfferDescription(offer: Offer): string {
  return i18n.language === "ar" && offer.descriptionAr ? offer.descriptionAr : offer.description;
}

function StatusBadge({ status }: { status: OfferStatus }) {
  const { t } = useTranslation();
  const config: Record<OfferStatus, { icon: typeof Tag; labelKey: string; color: string }> = {
    active: { icon: CheckCircle, labelKey: "stock.available_now", color: "bg-green-500 text-white" },
    upcoming: { icon: Clock, labelKey: "stock.coming_soon", color: "bg-blue-500 text-white" },
    expired: { icon: AlertCircle, labelKey: "stock.expired", color: "bg-gray-400 text-white" },
  };
  const { icon: Icon, labelKey, color } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${color} shadow-sm`}>
      <Icon size={10} /> {t(labelKey)}
    </span>
  );
}

export default function OfferDetailPage() {
  const params = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      let offers = getAllOffers();
      if (offers.length === 0) {
        offers = await refreshOffersFromServer();
      }
      setOffer(offers.find((o) => o.id === params.id) ?? null);
      setLoading(false);
    };
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h1 className="text-2xl font-bold mb-4">{t("offers.not_found")}</h1>
        <Link href="/offers">
          <span className="text-primary font-semibold cursor-pointer hover:underline">{t("offers.back_to_offers")}</span>
        </Link>
      </div>
    );
  }

  const status = getOfferStatus(offer);

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-0" data-testid="page-offer-detail">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/offers">
            <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
              <ArrowLeft size={14} />
              {t("offers.offers")}
            </span>
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">{getOfferTitle(offer)}</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Main image */}
          {offer.images.length > 0 && (
            <div className="relative rounded-3xl overflow-hidden bg-[#FAFAFA] dark:bg-muted aspect-video flex items-center justify-center mb-8">
              <img
                src={resolveImageUrl(offer.images[offer.coverIndex] || offer.images[0])}
                alt={getOfferTitle(offer)}
                className="w-full h-full object-contain"
              />
              {/* Badges */}
              <div className="absolute top-4 start-4 flex items-center gap-2">
                <StatusBadge status={status} />
                {offer.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <Sparkles size={10} /> {t("offers.featured")}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-card border border-card-border rounded-2xl p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-black text-foreground mb-2">{getOfferTitle(offer)}</h1>
              {offer.description && (
                <p className="text-muted-foreground leading-relaxed">{getOfferDescription(offer)}</p>
              )}
            </div>

            {/* Price */}
            <div className="border-t border-border pt-4">
              {offer.type === "discount" && offer.discountPercent && (
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-lg"
                    style={{ background: offer.badgeColor }}>
                    {offer.discountPercent}%
                  </div>
                  <div>
                    {offer.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">${offer.originalPrice}</p>
                    )}
                    {offer.offerPrice && (
                      <p className="text-2xl font-black text-foreground">${offer.offerPrice}</p>
                    )}
                  </div>
                </div>
              )}
              {offer.type === "bundle" && (
                <div>
                  {offer.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">${offer.originalPrice}</p>
                  )}
                  {offer.offerPrice && (
                    <p className="text-2xl font-black text-foreground">${offer.offerPrice} <span className="text-sm font-semibold text-muted-foreground">{t("offers.bundle_price")}</span></p>
                  )}
                </div>
              )}
            </div>

            {/* Bundle items */}
            {offer.type === "bundle" && offer.bundleItems.length > 0 && (
              <div className="border-t border-border pt-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">{t("offers.products_in_bundle")}</p>
                <div className="space-y-2">
                  {offer.bundleItems.filter((b) => b.productName).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-muted/40 rounded-xl px-4 py-2.5">
                      <Package size={14} className="text-primary flex-shrink-0" />
                      <span className="text-sm font-semibold text-foreground">{item.productName}</span>
                      <span className="text-xs text-muted-foreground ms-auto">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="border-t border-border pt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={14} className="flex-shrink-0" />
              <span>{formatDate(offer.startsAt)} — {formatDate(offer.endsAt)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
