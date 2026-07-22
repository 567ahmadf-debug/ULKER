import { Product } from "@/data/products";
import { resolveImageUrl } from "@/lib/utils";

interface ImageGalleryProps {
  product: Product;
}

export default function ImageGallery({ product }: ImageGalleryProps) {
  return (
    <div data-testid="gallery-product">
      {/* Single flat front-view image */}
      <div
        className="relative rounded-3xl bg-[#FAFAFA] dark:bg-muted aspect-square flex items-center justify-center group/gallery"
        data-testid="img-main-product"
      >
        {/* Soft shadow beneath product — animated in sync with float */}
        <div
          className="absolute bottom-6 left-1/2 w-3/5 h-8 rounded-full bg-black/10 blur-xl z-0
            transition-all duration-300 ease-in-out
            group-hover/gallery:bg-black/20 group-hover/gallery:blur-2xl
            group-hover/gallery:[animation-play-state:paused]"
          style={{
            animation: "detail-shadow 7s ease-in-out infinite",
          }}
        />

        {/* Floating product image */}
        <img
          src={resolveImageUrl(product.imageUrl)}
          alt={product.name}
          className="w-3/4 h-3/4 object-contain relative z-10 will-change-transform
            transition-all duration-300 ease-in-out
            group-hover/gallery:scale-[1.06] group-hover/gallery:brightness-110
            group-hover/gallery:drop-shadow-[0_8px_24px_rgba(0,0,0,0.12)]
            group-hover/gallery:[animation-play-state:paused]"
          style={{
            animation: "detail-float 7s ease-in-out infinite",
          }}
        />

        {/* Category badge */}
        <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-20">
          <span className="px-3 py-1 bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-full text-xs font-semibold text-foreground border border-border/40">
            {product.category}
          </span>
        </div>

        {/* SKU */}
        <div className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4 z-20">
          <span className="px-2 py-1 bg-white/60 dark:bg-black/30 backdrop-blur-sm rounded-lg text-[10px] font-mono text-muted-foreground">
            {product.sku}
          </span>
        </div>
      </div>
    </div>
  );
}
