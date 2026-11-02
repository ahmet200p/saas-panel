/**
 * ============================================================================
 * B2B Multi-Tenant SaaS - Canlı Backend Köprüsü & API Yapılandırması
 * Dosya: api.js (ve config.js)
 * ============================================================================
 * Bu dosya Vitrin (store.html), Bayi (bayi.html) ve Admin (admin.html)
 * frontend sayfalarının canlı Express backend servisine (Render.com)
 * sorunsuz ve kesintisiz bağlanmasını sağlayan merkezi köprüdür.
 */

const API_BASE_URL = "https://saas-g-ncel-10-10-2026simdi-main.onrender.com/api";

// 1. Tarayıcı (Browser) Genel Kapsam Tanımlamaları (window & globalThis)
if (typeof window !== "undefined") {
  window.API_BASE_URL = API_BASE_URL;
  window.API_BASE = API_BASE_URL;
}

if (typeof globalThis !== "undefined") {
  globalThis.API_BASE_URL = API_BASE_URL;
  globalThis.API_BASE = API_BASE_URL;
}

// 2. Node.js & CommonJS Modül Uyumluluğu
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    API_BASE_URL,
    default: API_BASE_URL
  };
}

