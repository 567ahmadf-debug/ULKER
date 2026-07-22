import { Product } from "@/data/products";

function getAbsoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const base = import.meta.env.BASE_URL || "/";
  return `${window.location.origin}${base}${path.replace(/^\//, "")}`;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function buildShareImage(product: Product): Promise<File | null> {
  try {
    const imageUrl = getAbsoluteUrl(product.imageUrl);
    const img = await loadImage(imageUrl);

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 750;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 600, 750);

    // Draw product image (centered, max 500x500 area)
    const maxImgW = 500;
    const maxImgH = 480;
    const scale = Math.min(maxImgW / img.width, maxImgH / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (600 - w) / 2;
    const y = 30;
    ctx.drawImage(img, x, y, w, h);

    // Draw product name
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 28px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(product.name, 300, 560);

    // Draw weight
    ctx.fillStyle = "#666666";
    ctx.font = "22px Arial, sans-serif";
    ctx.fillText(`Weight: ${product.packaging.weight}`, 300, 600);

    // Draw barcode
    ctx.fillText(`Barcode: ${product.barcode}`, 300, 635);

    // Draw ULKER branding
    ctx.fillStyle = "#cc0000";
    ctx.font = "bold 18px Arial, sans-serif";
    ctx.fillText("ULKER Product Catalog", 300, 700);

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png", 1)
    );
    return new File([blob], `${product.id}.png`, { type: "image/png" });
  } catch {
    return null;
  }
}

export async function shareProduct(product: Product): Promise<void> {
  const productUrl = getAbsoluteUrl(`products/${product.id}`);
  const imageUrl = getAbsoluteUrl(product.imageUrl);

  const text = [
    product.name,
    `Weight: ${product.packaging.weight}`,
    `Barcode: ${product.barcode}`,
    "",
    productUrl,
  ].join("\n");

  if (!navigator.share) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch {
      prompt("Copy this:", text);
    }
    return;
  }

  // Try share with generated image
  try {
    const file = await buildShareImage(product);
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: product.name,
        text,
        files: [file],
      });
      return;
    }
  } catch (err) {
    if ((err as Error).name === "AbortError") return;
  }

  // Fallback: text only
  try {
    await navigator.share({ title: product.name, text, url: productUrl });
  } catch (err) {
    if ((err as Error).name === "AbortError") return;
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch {
      prompt("Copy this:", text);
    }
  }
}
