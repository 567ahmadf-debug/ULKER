import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";
import { Product } from "@/data/products";

interface ImageGalleryProps {
  product: Product;
}

export default function ImageGallery({ product }: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const currentThumb = product.thumbnails[active];
  const mainUrl = active === 0 ? product.imageUrl : currentThumb?.url ?? product.imageUrl;

  return (
    <div className="space-y-4" data-testid="gallery-product">
      {/* Main image */}
      <div
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-muted/60 to-muted/30 aspect-square flex items-center justify-center cursor-zoom-in group"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        data-testid="img-main-product"
      >
        {/* Podium effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-12 rounded-full bg-black/10 blur-xl" />

        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={mainUrl}
            alt={`${product.name} — ${currentThumb?.label ?? "Front"}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: zoomed ? 1.08 : 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="w-3/4 h-3/4 object-contain relative z-10 transition-transform duration-300"
          />
        </AnimatePresence>

        {/* Zoom hint */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/30 backdrop-blur-sm rounded-full p-2">
            <ZoomIn size={16} className="text-white" />
          </div>
        </div>

        {/* Label */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
            {currentThumb?.label ?? "Front"}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-6 gap-2">
        {product.thumbnails.map((thumb, i) => (
          <button
            key={thumb.label}
            onClick={() => setActive(i)}
            data-testid={`button-thumbnail-${i}`}
            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
              active === i
                ? "border-primary shadow-md scale-105"
                : "border-transparent hover:border-border"
            }`}
            title={thumb.label}
          >
            <img
              src={thumb.url}
              alt={thumb.label}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Thumbnail labels */}
      <div className="grid grid-cols-6 gap-2">
        {product.thumbnails.map((thumb, i) => (
          <p
            key={thumb.label}
            className={`text-center text-[10px] font-medium transition-colors ${
              active === i ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {thumb.label}
          </p>
        ))}
      </div>
    </div>
  );
}
