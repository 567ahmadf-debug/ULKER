import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Tag, Clock, CheckCircle, AlertCircle, Calendar, Sparkles, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { getAllOffers, refreshOffersFromServer, type Offer } from "@/data/admin-store";

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

function StatusBadge({ status }: { status: OfferStatus }) {
  const config: Record<OfferStatus, { icon: typeof Tag; label: string; color: string }> = {
    active: { icon: CheckCircle, label: "Available Now", color: "bg-green-500 text-white" },
    upcoming: { icon: Clock, label: "Coming Soon", color: "bg-blue-500 text-white" },
    expired: { icon: AlertCircle, label: "Expired", color: "bg-gray-400 text-white" },
  };
  const { icon: Icon, label, color } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${color} shadow-sm`}>
      <Icon size={10} /> {label}
    </span>
  );
}

/* ─── Smart Image Grid ─── */
function ImageGrid({ images, title }: { images: string[]; title: string }) {
  const count = images.length;
  const floatDelays = ["", "offer-float-d1", "offer-float-d2", "offer-float-d3"];

  if (count === 0) return null;

  // Each image gets its own uniform box with transparent background + object-contain
  const imgClass = "w-full h-full object-contain offer-float";

  if (count === 1) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[240px]">
        <div className="w-full max-w-[200px] aspect-square flex items-center justify-center">
          <img src={images[0]} alt={title}
            className={`max-w-full max-h-full object-contain ${imgClass} ${floatDelays[0]}`} />
        </div>
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="flex items-center justify-center gap-3 p-6 min-h-[220px]">
        {images.map((url, i) => (
          <div key={i} className="flex-1 max-w-[48%] aspect-square flex items-center justify-center">
            <img src={url} alt={`${title} ${i + 1}`}
              className={`max-w-full max-h-full object-contain ${imgClass} ${floatDelays[i % 4]}`} />
          </div>
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="flex items-stretch gap-3 p-6 min-h-[260px]">
        <div className="flex-[1.1] max-w-[48%] aspect-square flex items-center justify-center">
          <img src={images[0]} alt={title}
            className={`max-w-full max-h-full object-contain ${imgClass} ${floatDelays[0]}`} />
        </div>
        <div className="flex-1 flex flex-col gap-3 justify-center">
          {images.slice(1).map((url, i) => (
            <div key={i} className="flex-1 aspect-square flex items-center justify-center">
              <img src={url} alt={`${title} ${i + 2}`}
                className={`max-w-full max-h-full object-contain ${imgClass} ${floatDelays[(i + 1) % 4]}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (count === 4) {
    return (
      <div className="grid grid-cols-2 gap-3 p-6 min-h-[260px]">
        {images.map((url, i) => (
          <div key={i} className="aspect-square flex items-center justify-center">
            <img src={url} alt={`${title} ${i + 1}`}
              className={`max-w-full max-h-full object-contain ${imgClass} ${floatDelays[i % 4]}`} />
          </div>
        ))}
      </div>
    );
  }

  // 4+ images: first 4 in 2x2 + overflow badge
  return (
    <div className="relative grid grid-cols-2 gap-3 p-6 min-h-[260px]">
      {images.slice(0, 4).map((url, i) => (
        <div key={i} className="aspect-square flex items-center justify-center">
          <img src={url} alt={`${title} ${i + 1}`}
            className={`max-w-full max-h-full object-contain ${imgClass} ${floatDelays[i % 4]}`} />
        </div>
      ))}
      <div className="absolute bottom-8 right-8 w-[calc(50%-0.75rem)] aspect-square rounded-2xl bg-foreground/80 backdrop-blur-sm flex items-center justify-center z-10">
        <span className="text-white text-2xl font-black">+{count - 4}</span>
      </div>
    </div>
  );
}

/* ─── Bundle Product Chips ─── */
function BundleChip({ name, qty }: { name: string; qty: number }) {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-card rounded-xl px-3 py-2 shadow-sm border border-border/50">
      <Package size={14} className="text-primary flex-shrink-0" />
      <span className="text-xs font-semibold text-foreground truncate">{name}</span>
      <span className="text-[10px] font-bold text-muted-foreground bg-muted rounded-md px-1.5 py-0.5">×{qty}</span>
    </div>
  );
}

/* ─── Premium Price Section ─── */
function PriceSection({ offer }: { offer: Offer }) {
  const saving = offer.savingPercent || (
    parseFloat(offer.originalPrice) > 0 && parseFloat(offer.offerPrice) > 0
      ? Math.round(((parseFloat(offer.originalPrice) - parseFloat(offer.offerPrice)) / parseFloat(offer.originalPrice)) * 100).toString()
      : ""
  );

  if (offer.type === "discount" && offer.discountPercent) {
    return (
      <div className="flex items-center gap-4 py-5">
        {/* Large circular discount badge */}
        <div className="relative flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center offer-shimmer"
          style={{ background: `linear-gradient(135deg, ${offer.badgeColor}, ${offer.badgeColor}dd)` }}>
          <div className="offer-glass absolute inset-0 rounded-full" />
          <span className="relative text-white text-xl font-black leading-none">{offer.discountPercent}%<span className="text-[10px] font-bold block -mt-0.5">OFF</span></span>
        </div>
        <div className="flex-1">
          {offer.originalPrice && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground line-through decoration-2">${offer.originalPrice}</span>
              <span className="text-[10px] font-bold text-muted-foreground">USD</span>
            </div>
          )}
          {offer.offerPrice && (
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-foreground tracking-tight">${offer.offerPrice}</span>
              <span className="text-xs font-semibold text-muted-foreground">USD</span>
            </div>
          )}
          {saving && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold mt-1">
              SAVE {saving}%
            </span>
          )}
        </div>
      </div>
    );
  }

  // Bundle / fallback pricing
  return (
    <div className="py-5 space-y-2">
      {offer.originalPrice && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground line-through decoration-2">${offer.originalPrice}</span>
          <span className="text-[10px] font-semibold text-muted-foreground">USD</span>
        </div>
      )}
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Special Price</span>
        <span className="text-3xl font-black text-foreground tracking-tight">${offer.offerPrice}</span>
        <span className="text-xs font-semibold text-muted-foreground">USD</span>
      </div>
      {saving && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-white text-xs font-bold shadow-sm"
            style={{ background: `linear-gradient(135deg, ${offer.badgeColor}, ${offer.badgeColor}cc)` }}>
            SAVE {saving}%
          </span>
        </div>
      )}
    </div>
  );
}

export default function OffersPage() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
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
      // Featured first within same status
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      const sa = order[getOfferStatus(a)];
      const sb = order[getOfferStatus(b)];
      if (sa !== sb) return sa - sb;
      return new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();
    });
  }, [offers]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner — unchanged */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Tag size={16} />
              {t("offers.badge", "Offers & Discounts")}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-4">
              {t("offers.title", "Special Offers")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("offers.subtitle", "Discover our latest deals and seasonal discounts on Ülker products.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Offers grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {sorted.map((offer, i) => {
              const status = getOfferStatus(offer);
              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => navigate(`/offers/${offer.id}`)}
                  className={`offer-card-premium bg-card rounded-[24px] overflow-hidden flex flex-col border border-border/60 cursor-pointer ${
                    status === "expired" ? "opacity-50 grayscale-[30%]" : ""
                  }`}
                  style={{ boxShadow: "0 4px 24px -4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.03)" }}
                >
                  {/* ─── TOP: Badges ─── */}
                  <div className="px-6 pt-5 pb-2 flex items-center gap-2 flex-wrap">
                    <StatusBadge status={status} />
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">
                      {offer.type === "bundle" ? "Bundle" : "Discount"}
                    </span>
                    {offer.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <Sparkles size={10} /> Featured
                      </span>
                    )}
                  </div>

                  {/* ─── CENTER: Images ─── */}
                  <div className="bg-gradient-to-b from-muted/20 to-muted/40 mx-4 rounded-2xl">
                    <ImageGrid images={offer.images} title={offer.title} />
                  </div>

                  {/* ─── Bundle Items ─── */}
                  {offer.type === "bundle" && offer.bundleItems.length > 0 && (
                    <div className="px-6 py-3">
                      <div className="flex flex-wrap gap-2">
                        {offer.bundleItems.filter((b) => b.productName).map((item, idx) => (
                          <BundleChip key={idx} name={item.productName} qty={item.quantity} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ─── PROMOTION INFO ─── */}
                  <div className="px-6 pt-2 pb-1 flex-1">
                    {offer.offerType && (
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2"
                        style={{ backgroundColor: offer.badgeColor + "15", color: offer.badgeColor }}>
                        {offer.offerType}
                      </span>
                    )}
                    <h3 className="font-bold text-foreground text-xl leading-tight mb-1">{offer.title}</h3>
                    {offer.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{offer.description}</p>
                    )}
                  </div>

                  {/* ─── PRICE SECTION ─── */}
                  <div className="px-6">
                    <div className="border-t border-border/60">
                      <PriceSection offer={offer} />
                    </div>
                  </div>

                  {/* ─── BOTTOM: Date range ─── */}
                  <div className="px-6 pb-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar size={13} className="flex-shrink-0" />
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
