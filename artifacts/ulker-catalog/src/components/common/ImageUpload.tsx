import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadImageToCloud } from "@/data/cloud-store";
import { CLOUD_CONFIG } from "@/data/cloud-config";

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_WIDTH = 400;
const MAX_HEIGHT = 400;

interface ImageUploadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
}

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas error")); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL(file.type || "image/png"));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Load error")); };
    img.src = url;
  });
}

export default function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`Invalid type. Allowed: ${ALLOWED_TYPES.map((t) => t.split("/")[1]).join(", ")}`);
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError(`File too large. Maximum: ${MAX_SIZE_MB}MB`);
        return;
      }

      setLoading(true);
      try {
        // 1) Resize the image
        let dataUrl: string;
        if (file.type === "image/svg+xml") {
          dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        } else {
          dataUrl = await resizeImage(file);
        }

        // 2) Try cloud upload (imgbb) if configured
        if (CLOUD_CONFIG.IMGBB_API_KEY) {
          try {
            const url = await uploadImageToCloud(file);
            onChange(url);
            return;
          } catch (cloudErr) {
            console.warn("[ImageUpload] Cloud upload failed, trying local:", cloudErr);
          }
        }

        // 3) Fallback: try local dev server
        try {
          const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
          const res = await fetch("/api/upload-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: file.name, data: base64 }),
          });
          if (res.ok) {
            const { url } = await res.json();
            onChange(url);
            return;
          }
        } catch {}

        // 4) Final fallback: store as base64 data URL
        onChange(dataUrl);
      } catch (err) {
        console.error("[ImageUpload] Upload failed:", err);
        setError("Failed to process image. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = "";
    },
    [processFile]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange("");
      setError(null);
    },
    [onChange]
  );

  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
        {label}
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !loading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-primary bg-primary/5"
            : value
            ? "border-border bg-card"
            : "border-border hover:border-primary/40 bg-background"
        } ${loading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />
        {loading ? (
          <div className="py-2">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-2 animate-pulse">
              <Upload size={18} className="text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Uploading image...</p>
          </div>
        ) : value ? (
          <div className="flex items-center gap-4">
            <img
              src={value}
              alt="Upload preview"
              className="w-20 h-20 rounded-lg object-cover border border-border flex-shrink-0"
            />
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Image uploaded</p>
              <p className="text-xs text-muted-foreground mt-0.5">Click or drop to replace</p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
              title="Remove image"
            >
              <X size={16} className="text-red-500" />
            </button>
          </div>
        ) : (
          <div className="py-2">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-2">
              {dragOver ? (
                <Upload size={18} className="text-primary" />
              ) : (
                <ImageIcon size={18} className="text-muted-foreground" />
              )}
            </div>
            <p className="text-sm font-medium text-foreground">
              {dragOver ? "Drop image here" : "Click or drag image here"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPEG, PNG, WebP, GIF, SVG — Max {MAX_SIZE_MB}MB
            </p>
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1.5">{error}</p>
      )}
    </div>
  );
}
