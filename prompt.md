# KRİTİK GÖREV: Vitrin (Store) ve Admin/Bayi Panellerinin Monolitik Birleşimi

**GÖREV BİLDİRİMİ:**
Şu an bağımsız çalışan Vitrin (`store.html`, `index.html`, `store.css` ve `assets` klasörü) dosyalarını, ana Admin ve Bayi projesinin root klasörüne taşıyoruz. Bu birleşme sırasında yaşanacak muhtemel kod tekrarlarını, CSS çakışmalarını ve JavaScript scope (kapsam) zehirlenmelerini engellemek için aşağıdaki **4 MİMARİ KURALI** harfiyen uygulayacaksın. 

Klasörleri birleştirirken şu önlemleri al:

### 1. KURAL: JAVASCRIPT SCOPE VE ID İZOLASYONU (Çakışma Önleme)
- `store.html` ve `bayi.html` sayfalarında muhtemelen aynı ID'lere (Örn: `#search-input`, `#product-list`) veya aynı global değişken/fonksiyon isimlerine (Örn: `loadProducts()`, `products` array'i) sahip kodlar var. 
- Eğer bu dosyalar ortak bir `api.js` veya `app.js` kullanacaksa, fonksiyon isimlerini sayfaya özel (Örn: `loadStoreProducts()`, `loadAdminProducts()`) olarak refactor et veya ES6 Modules (`import/export`) yapısına geçerek değişkenleri global scope'tan (window nesnesinden) izole et.
- Sayfalara özgü scriptleri, sadece o sayfa yüklendiğinde çalışacak şekilde (DOM id kontrolleriyle) sınırla. (Örn: `if(document.getElementById('store-page')) { ... }`)

### 2. KURAL: CSS ZEHİRLENMESİNİ ENGELLEME
- Taşıyacağımız `store.css` dosyasında `body`, `div`, `h1` gibi genel (global) HTML etiketlerine doğrudan stil verilmişse, bu durum Admin sayfasının da tasarımını bozacaktır.
- `store.css` içindeki tüm kuralları sadece `.store-wrapper` veya `.store-page` gibi kapsayıcı bir class'ın altına al. Vitrin kodlarını `store.html` içinde `<div class="store-page">...</div>` içine alarak CSS'in dışarı sızmasını (Admini bozmasını) kesinlikle engelle. (Tailwind kullanılıyorsa gereksiz özel CSS'leri Tailwind sınıflarına çevir).

### 3. KURAL: ASSET (MEDYA) BİRLEŞTİRME VE PATH GÜNCELLEMESİ
- Vitrin'den gelen `assets` klasörü ile ana projedeki mevcut `assets` klasörünü birleştirirken, aynı isimli dosyaların (Örn: `logo.png`) birbirini ezmesini (overwrite) engelle. Gerekirse Vitrin medya dosyalarını `assets/store/` alt klasörüne taşı.
- `store.html` ve `index.html` içindeki tüm `<link>`, `<script>` ve `<img>` yollarını (path) yeni monolitik klasör hiyerarşisine göre uyarla. Yolların (404 Not Found) kırılmasını engelle.

### 4. KURAL: ORTAK KODLARIN TEKİLLEŞTİRİLMESİ (DRY Prensibi)
- Hem `bayi.html` hem de `store.html` API'ye istek atarken aynı Base URL'i, aynı Token (localStorage) alma mantığını kullanıyor. Bu "fetch" veya yetkilendirme (Auth) kodlarını her dosyaya tekrar tekrar yazmak yerine, paylaşımlı tek bir yapıya (Örn: `utils.js` veya `auth.js`) çıkar. Her iki sayfa da bu ortak dosyadan beslensin.

**EMİR:** Bu 4 kuralı analiz etmeden hiçbir taşıma, kopyalama veya refactor işlemi yapma. Kuralları anladığını onayla ve ilk olarak hangi ortak dosyaları (api/utils) birleştireceğinle işe başla.