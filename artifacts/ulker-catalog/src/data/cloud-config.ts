// ============================================================
// Cloud Config — ضع بياناتك هنا بعد إنشاء الحسابات المجانية
// ============================================================
// 1. imgbb.com → أنشئ حساب مجاني → احصل على API Key
//    https://api.imgbb.com/
// 2. Firebase → أنشئ مشروع مجاني → فعّل Realtime Database
//    https://console.firebase.google.com/

export const CLOUD_CONFIG = {
  // imgbb API Key — للرفع المجاني للصور
  IMGBB_API_KEY: "",

  // Firebase Realtime Database URL — لمشاركة البيانات بين الجميع
  FIREBASE_DB_URL: "",
};

// فحص: هل الإعدادات جاهزة؟
export function isCloudReady(): boolean {
  return !!(CLOUD_CONFIG.IMGBB_API_KEY && CLOUD_CONFIG.FIREBASE_DB_URL);
}
