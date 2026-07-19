import { CLOUD_CONFIG } from "./cloud-config";

// ============================================================
// رفع الصور إلى imgbb.com (مجاني — بدون حزمة إضافية)
// ============================================================
export async function uploadImageToCloud(file: File): Promise<string> {
  if (!CLOUD_CONFIG.IMGBB_API_KEY) {
    throw new Error("imgbb API key not configured");
  }

  // تحويل الملف إلى base64
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // إزالة البادئة "data:image/...;base64,"
      const data = result.includes(",") ? result.split(",")[1] : result;
      resolve(data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const formData = new FormData();
  formData.append("key", CLOUD_CONFIG.IMGBB_API_KEY);
  formData.append("image", base64);

  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(`imgbb upload failed: ${res.status}`);

  const data = await res.json();
  if (!data.data?.url) throw new Error("No URL returned from imgbb");

  return data.data.url;
}

// ============================================================
// Firebase Realtime Database REST API (مجاني — بدون حزمة إضافية)
// ============================================================

function dbUrl(path: string): string {
  return `${CLOUD_CONFIG.FIREBASE_DB_URL}/${path}.json`;
}

export async function cloudGet<T>(path: string): Promise<T | null> {
  if (!CLOUD_CONFIG.FIREBASE_DB_URL) return null;
  try {
    const res = await fetch(dbUrl(path));
    if (!res.ok) return null;
    const data = await res.json();
    return data as T;
  } catch {
    return null;
  }
}

export async function cloudSet(path: string, data: unknown): Promise<boolean> {
  if (!CLOUD_CONFIG.FIREBASE_DB_URL) return false;
  try {
    const res = await fetch(dbUrl(path), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function cloudPush(path: string, data: unknown): Promise<boolean> {
  if (!CLOUD_CONFIG.FIREBASE_DB_URL) return false;
  try {
    const res = await fetch(dbUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}
