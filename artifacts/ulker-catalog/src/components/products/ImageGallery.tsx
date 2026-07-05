import { Product } from "@/data/products";

interface ImageGalleryProps {
  product: Product;
}

export default function ImageGallery({ product }: ImageGalleryProps) {
  return (
    <div data-testid="gallery-product">
      {/* Single flat front-view image */}
      <div
        className="relative rounded-3xl overflow-hidden bg-[#FAFAFA] dark:bg-muted aspect-square flex items-center justify-center"
        data-testid="img-main-product"
      >
        {/* Soft shadow beneath product */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-3/5 h-8 rounded-full bg-black/8 blur-xl" />

        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-3/4 h-3/4 object-contain relative z-10"
        />

        {/* Category badge */}
        <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
          <span className="px-3 py-1 bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-full text-xs font-semibold text-foreground border border-border/40">
            {product.category}
          </span>
        </div>

        {/* SKU */}
        <div className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4">
          <span className="px-2 py-1 bg-white/60 dark:bg-black/30 backdrop-blur-sm rounded-lg text-[10px] font-mono text-muted-foreground">
            {product.sku}
          </span>
        </div>
      </div>
    </div>
  );
}
