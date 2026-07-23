import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Tag, Clock, CheckCircle, AlertCircle, Calendar, Sparkles, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { getAllOffers, refreshOffersFromServer, type Offer } from "@/data/admin-store";
import { resolveImageUrl } from "@/lib/utils";

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
  const config: Record<OfferStatus, { icon: typeof Tag; label: string; color: string }> = {
    active: { icon: CheckCircle, label: "Available Now", color: "bg-green-500 text-white" },
    upcoming: { icon: Clock, label: "Coming Soon", color: "bg-blue-500 text-white" },
    expired: { icon: AlertCircle, label: "Expired", color: "bg-gray-400 text-white" },
  };
  const { icon: Icon, label, color } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${color} shadow-sm`}>
      <Icon size={9} /> {label}
    </span>
  );
}

/* ─── Smart Image Grid (compact) ─── */
function ImageGrid({ images, title }: { images: string[]; title: string }) {
  const count = images.length;
  const floatDelays = ["", "offer-float-d1", "offer-float-d2", "offer-float-d3"];

  if (count === 0) return null;

  const imgClass = "w-full h-full object-contain offer-float";

  if (count === 1) {
    return (
      <div className="flex items-center justify-center p-3">
        <div className="w-full max-w-[120px] h-20 flex items-center justify-center">
          <img src={resolveImageUrl(images[0])} alt={title}
            className={`max-w-full max-h-full object-contain ${imgClass} ${floatDelays[0]}`} />
        </div>
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="flex items-center justify-center gap-2 p-3">
        {images.map((url, i) => (
          <div key={i} className="flex-1 max-w-[48%] h-20 flex items-center justify-center">
            <img src={resolveImageUrl(url)} alt={`${title} ${i + 1}`}
              className={`max-w-full max-h-full object-contain ${imgClass} ${floatDelays[i % 4]}`} />
          </div>
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="grid grid-cols-3 gap-2 p-3">
        {images.map((url, i) => (
          <div key={i} className="h-20 flex items-center justify-center">
            <img src={resolveImageUrl(url)} alt={`${title} ${i + 1}`}
              className={`max-w-full max-h-full object-contain ${imgClass} ${floatDelays[i % 4]}`} />
          </div>
        ))}
      </div>
    );
  }

  if (count === 4) {
    return (
      <div className="grid grid-cols-2 gap-2 p-3">
        {images.map((url, i) => (
          <div key={i} className="h-20 flex items-center justify-center">
            <img src={resolveImageUrl(url)} alt={`${title} ${i + 1}`}
              className={`max-w-full max-h-full object-contain ${imgClass} ${floatDelays[i % 4]}`} />
          </div>
        ))}
      </div>
    );
  }

  // 4+ images: first 4 in 2x2 + overflow badge
  return (
    <div className="relative grid grid-cols-2 gap-2 p-3">
      {images.slice(0, 4).map((url, i) => (
        <div key={i} className="h-20 flex items-center justify-center">
          <img src={resolveImageUrl(url)} alt={`${title} ${i + 1}`}
            className={`max-w-full max-h-full object-contain ${imgClass} ${floatDelays[i % 4]}`} />
        </div>
      ))}
      <div className="absolute bottom-5 right-5 w-[calc(50%-0.5rem)] h-20 rounded-xl bg-foreground/80 backdrop-blur-sm flex items-center justify-center z-10">
        <span className="text-white text-lg font-black">+{count - 4}</span>
      </div>
    </div>
  );
}

/* ─── Bundle Product Chips (compact) ─── */
function BundleChip({ name, qty }: { name: string; qty: number }) {
  return (
    <div className="flex items-center gap-1.5 bg-muted/40 rounded-full px-2 py-1 border border-border/40">
      <Package size={11} className="text-primary flex-shrink-0" />
      <span className="text-[10px] font-semibold text-foreground truncate">{name}</span>
      <span className="text-[9px] font-bold text-muted-foreground bg-muted rounded-full px-1.5 py-0.5">×{qty}</span>
    </div>
  );
}

/* ─── Premium Price Section (compact) ─── */
function PriceSection({ offer }: { offer: Offer }) {
  const saving = offer.savingPercent || (
    parseFloat(offer.originalPrice) > 0 && parseFloat(offer.offerPrice) > 0
      ? Math.round(((parseFloat(offer.originalPrice) - parseFloat(offer.offerPrice)) / parseFloat(offer.originalPrice)) * 100).toString()
      : ""
  );

  if (offer.type === "discount" && offer.discountPercent) {
    return (
      <div className="flex items-center gap-3 py-3">
        <div className="relative flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center offer-shimmer"
          style={{ background: `linear-gradient(135deg, ${offer.badgeColor}, ${offer.badgeColor}dd)` }}>
          <div className="offer-glass absolute inset-0 rounded-full" />
          <span className="relative text-white text-base font-black leading-none">{offer.discountPercent}%<span className="text-[8px] font-bold block -mt-0.5">OFF</span></span>
        </div>
        <div className="flex-1 min-w-0">
          {offer.originalPrice && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground line-through decoration-1">${offer.originalPrice}</span>
            </div>
          )}
          {offer.offerPrice && (
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-foreground tracking-tight">${offer.offerPrice}</span>
              <span className="text-[10px] font-semibold text-muted-foreground">USD</span>
            </div>
          )}
          {saving && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[9px] font-bold mt-0.5">
              SAVE {saving}%
            </span>
          )}
        </div>
      </div>
    );
  }

  // Bundle / fallback pricing
  return (
    <div className="py-3 space-y-1.5">
      {offer.originalPrice && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground line-through decoration-1">${offer.originalPrice}</span>
        </div>
      )}
      <div className="flex items-baseline gap-1.5">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Special Price</span>
        <span className="text-xl font-black text-foreground tracking-tight">${offer.offerPrice}</span>
        <span className="text-[10px] font-semibold text-muted-foreground">USD</span>
      </div>
      {saving && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-white text-[10px] font-bold shadow-sm"
          style={{ background: `linear-gradient(135deg, ${offer.badgeColor}, ${offer.badgeColor}cc)` }}>
          SAVE {saving}%
        </span>
      )}
    </div>
  );
}

export default function OffersPage() {
  const { t } = useTranslation();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await refreshOffersFromServer();
      setOffers(data);
      setLoading(false);
    };
    load();
  }, []);

  const sorted = useMemo(() => {
    const order: Record<OfferStatus, number> = { active: 0, upcoming: 1, expired: 2 };
    return [...offers].sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      const sa = order[getOfferStatus(a)];
      const sb = order[getOfferStatus(b)];
      if (sa !== sb) return sa - sb;
      return new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();
    });
  }, [offers]);

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      {/* Hero banner — compressed */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold mb-2">
              <Tag size={12} />
              {t("offers.badge", "Offers & Discounts")}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mb-1">
              {t("offers.title", "Special Offers")}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              {t("offers.subtitle", "Discover our latest deals and seasonal discounts on Ülker products.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Offers grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 -mt-2">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-sm text-muted-foreground mt-4">{t("offers.loading", "Loading offers...")}</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <Tag size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-lg font-semibold text-foreground">{t("offers.empty", "No Offers Available")}</p>
            <p className="text-sm text-muted-foreground mt-1">{t("offers.empty_sub", "Check back soon for exciting deals and discounts.")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sorted.map((offer, i) => {
              const status = getOfferStatus(offer);
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className={`offer-card-premium bg-card rounded-2xl overflow-hidden flex flex-col border border-border/60 ${
                    status === "expired" ? "opacity-50 grayscale-[30%]" : ""
                  }`}
                  style={{ boxShadow: "0 2px 12px -2px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)" }}
                >
                  {/* ─── TOP: Badges ─── */}
                  <div className="px-3 sm:px-4 pt-3 pb-1.5 flex items-center gap-1.5 flex-wrap">
                    <StatusBadge status={status} />
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">
                      {offer.type === "bundle" ? "Bundle" : "Discount"}
                    </span>
                    {offer.isFeatured && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <Sparkles size={9} /> Featured
                      </span>
                    )}
                  </div>

                  {/* ─── CENTER: Images ─── */}
                  <div className="bg-gradient-to-b from-muted/20 to-muted/40 mx-3 rounded-xl">
                    <ImageGrid images={offer.images} title={getOfferTitle(offer)} />
                  </div>

                  {/* ─── Bundle Items ─── */}
                  {offer.type === "bundle" && offer.bundleItems.length > 0 && (
                    <div className="px-3 sm:px-4 py-2">
                      <div className="flex flex-wrap gap-1.5">
                        {offer.bundleItems.filter((b) => b.productName).map((item, idx) => (
                          <BundleChip key={idx} name={item.productName} qty={item.quantity} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ─── PROMOTION INFO ─── */}
                  <div className="px-3 sm:px-4 pt-1.5 pb-0.5 flex-1">
                    {offer.offerType && (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider mb-1"
                        style={{ backgroundColor: offer.badgeColor + "15", color: offer.badgeColor }}>
                        {offer.offerType}
                      </span>
                    )}
                    <h3 className="font-bold text-foreground text-sm sm:text-base leading-tight mb-0.5">{getOfferTitle(offer)}</h3>
                    {offer.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{getOfferDescription(offer)}</p>
                    )}
                  </div>

                  {/* ─── PRICE SECTION ─── */}
                  <div className="px-3 sm:px-4">
                    <div className="border-t border-border/60">
                      <PriceSection offer={offer} />
                    </div>
                  </div>

                  {/* ─── BOTTOM: Date range ─── */}
                  <div className="px-3 sm:px-4 pb-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Calendar size={11} className="flex-shrink-0" />
                      <span>{formatDate(offer.startsAt)} — {formatDate(offer.endsAt)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
