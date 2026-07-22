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

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
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

    const maxImgW = 500;
    const maxImgH = 480;
    const scale = Math.min(maxImgW / img.width, maxImgH / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (600 - w) / 2;
    const y = 30;
    ctx.drawImage(img, x, y, w, h);

    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 28px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(product.name, 300, 560);

    ctx.fillStyle = "#666666";
    ctx.font = "22px Arial, sans-serif";
    ctx.fillText(`Weight: ${product.packaging.weight}`, 300, 600);
    ctx.fillText(`Barcode: ${product.barcode}`, 300, 635);

    ctx.fillStyle = "#cc0000";
    ctx.font = "bold 18px Arial, sans-serif";
    ctx.fillText("ULKER Product Catalog", 300, 700);

    // Use JPEG — smaller, better mobile support than PNG
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error("Canvas toBlob failed"));
      }, "image/jpeg", 0.85);
    });

    return new File([blob], "product-share.jpg", {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return null;
  }
}

function showImageSaveModal(dataUrl: string, text: string) {
  const existing = document.getElementById("share-modal-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "share-modal-overlay";
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;
    display:flex;align-items:center;justify-content:center;
    animation:toastIn 0.3s ease;
  `;

  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;max-width:360px;width:90vw;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.4);">
      <div style="padding:20px 20px 0;text-align:center;">
        <div style="font-weight:bold;font-size:18px;margin-bottom:8px;">Share this product</div>
        <div style="color:#666;font-size:14px;margin-bottom:16px;">
          Long-press the image below to save it, then share it with your friends.
        </div>
        <img src="${dataUrl}" style="width:100%;border-radius:8px;border:1px solid #eee;" />
      </div>
      <div style="padding:16px 20px 20px;">
        <div id="share-modal-text" style="background:#f5f5f5;padding:10px;border-radius:8px;font-size:13px;color:#333;white-space:pre-wrap;max-height:120px;overflow-y:auto;margin-bottom:12px;">${text}</div>
        <div style="display:flex;gap:8px;">
          <button id="share-modal-copy" style="flex:1;padding:10px;border:none;border-radius:8px;background:#cc0000;color:#fff;font-size:14px;font-weight:bold;cursor:pointer;">
            Copy Text
          </button>
          <button id="share-modal-close" style="flex:1;padding:10px;border:none;border-radius:8px;background:#333;color:#fff;font-size:14px;cursor:pointer;">
            Close
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector("#share-modal-close")!.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelector("#share-modal-copy")!.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(text);
      const btn = overlay.querySelector("#share-modal-copy")! as HTMLButtonElement;
      btn.textContent = "Copied!";
      btn.style.background = "#2e7d32";
    } catch {
      // ignore
    }
  });
}

function downloadFile(file: File) {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function showToast(message: string) {
  const existing = document.getElementById("share-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "share-toast";
  toast.innerHTML = message;
  toast.style.cssText = `
    position:fixed;bottom:20px;left:50%;transform:translateX(-50%);
    background:#1a1a1a;color:#fff;padding:16px 24px;border-radius:12px;
    font-size:14px;line-height:1.6;z-index:99999;max-width:90vw;
    text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.3);
    animation:toastIn 0.3s ease;
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "toastOut 0.3s ease forwards";
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

export async function shareProduct(product: Product): Promise<void> {
  const productUrl = getAbsoluteUrl(`products/${product.id}`);

  const shareText = [
    product.name,
    `Weight: ${product.packaging.weight}`,
    `Barcode: ${product.barcode}`,
    "",
    productUrl,
  ].join("\n");

  // No Web Share API — clipboard fallback
  if (!navigator.share) {
    try {
      await navigator.clipboard.writeText(shareText);
      alert("Copied to clipboard!");
    } catch {
      prompt("Copy this:", shareText);
    }
    return;
  }

  // Step 1: Build the canvas image
  const imageFile = await buildShareImage(product);

  if (!imageFile) {
    // Canvas failed — share text only
    try {
      await navigator.share({ title: product.name, text: shareText, url: productUrl });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(shareText);
        alert("Copied to clipboard!");
      } catch {
        prompt("Copy this:", shareText);
      }
    }
    return;
  }

  // Step 2: Try native share with file
  if (navigator.canShare && navigator.canShare({ files: [imageFile] })) {
    try {
      await navigator.share({
        title: product.name,
        text: shareText,
        files: [imageFile],
      });
      return;
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      // Fall through to fallback
    }
  }

  // Step 3: Fallback
  if (isIOS()) {
    // iOS: <a download> doesn't work — show modal with image + long-press instruction
    const dataUrl = await new Promise<string>((resolve) => {
      const canvas = document.createElement("canvas");
      // Re-render to get data URL — or just use FileReader
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(imageFile);
    });
    showImageSaveModal(dataUrl, shareText);
  } else {
    // Android: download works
    downloadFile(imageFile);
    try {
      await navigator.share({ title: product.name, text: shareText });
    } catch {
      try {
        await navigator.clipboard.writeText(shareText);
      } catch {
        // ignore
      }
    }
    showToast(`
      <div style="margin-bottom:8px;font-weight:bold;">Image saved to your gallery</div>
      <div>Open WhatsApp, attach the image, and paste the product details.</div>
    `);
  }
}
