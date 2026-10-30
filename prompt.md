# PROJE GÖREVİ: Global Mobil Uyumluluk (Responsive Design) Revizyonu

## BAĞLAM VE KRİTİK HATA TESPİTİ
Kullanıcı giriş sayfasından (Login), Admin paneline ve B2B Vitrin sayfalarına kadar tüm projenin mobil görünümü tamamen çökmüş durumdadır. Masaüstündeki iki veya çok sütunlu yapılar (`flex-row` veya `grid-cols-x`), mobil cihazlarda alt alta geçmediği için içerikler birbiri üzerine binmekte, taşmakta ve platformu kullanılamaz kılmaktadır. 

Derhal projedeki TÜM HTML/React/Arayüz dosyalarını (Login, Admin, Bayi, Store vb.) tarayacak ve aşağıdaki 5 MİMARİ KURALA göre yeniden yapılandıracaksın.

---

## ZORUNLU TAILWIND CSS KURALLARI (MOBILE-FIRST ARCHITECTURE)

**KURAL 1: FLEXBOX SÜTUN YAPILANDIRMASI (YIĞINLAMA)**
- Ekranda yan yana duran (sol afiş, sağ form veya yan yana iki panel) ne kadar `flex` container varsa hepsini varsayılan olarak `flex-col` (alt alta) yapacaksın.
- Masaüstü görünümü için ise Tailwind'in `md:` veya `lg:` breakpointlerini kullanarak bunları yan yana dizeceksin. 
- *Örnek Hatalı Kod:* `className="flex w-full"`
- *Olması Gereken:* `className="flex flex-col md:flex-row w-full"`

**KURAL 2: GRID YAPILARININ MOBİLİZASYONU**
- Vitrindeki ürün kartları veya dashboard istatistikleri gibi Grid yapıları mobilde asla 3-4 sütun olmayacak. 
- *Örnek Hatalı Kod:* `className="grid grid-cols-4 gap-4"`
- *Olması Gereken:* `className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"`

**KURAL 3: X EKSENİNDE TAŞMA (HORIZONTAL SCROLL) YASAĞI**
- Kullanıcı telefonda sayfayı sağa sola kaydıramaz (x-axis overflow yasaktır). 
- En dış `body` veya `main` wrapper'larına mutlaka `overflow-x-hidden` ve `w-full` ekle.
- Sadece tabloların (veri listesi, siparişler) olduğu div'leri `overflow-x-auto` ile sararak, sadece tablonun kendi içinde sağa sola kaydırılabilmesine izin ver.

**KURAL 4: DİNAMİK BOŞLUKLAR (PADDING & MARGIN)**
- Mobilde ekran küçük olduğu için devasa `p-12` veya `m-8` gibi boşluklar ekranı boğar. Tüm padding ve margin değerlerini responsive yap.
- *Kural:* Mobilde dar boşluk (`p-4`), masaüstünde geniş boşluk (`md:p-8`).

**KURAL 5: TİPOGRAFİ VE BUTON ÖLÇEKLENDİRME**
- Mobilde devasa başlıklar veya dokunulamayacak kadar küçük butonlar istemiyorum. 
- Başlıkları `text-2xl md:text-4xl` şeklinde kademelendir.
- Tüm tıklanabilir alanların (butonlar, inputlar) `min-h-[44px]` gibi Apple/Android UX standartlarına uygun dokunma alanına sahip olduğundan ve formların `%100` genişlikte (`w-full`) olduğundan emin ol.

**GÖREV:** Tüm arayüz kodunu analiz et ve bu kuralları eksiksiz uygula. Sadece Login sayfasını değil, Admin ve Bayi (Store) panellerinin iskeletlerini de bu `flex-col md:flex-row` mimarisine geçir.