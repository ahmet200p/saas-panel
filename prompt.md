# PROJE GÖREVİ: "Oto Servis & Usta" Sadakat Modülleri - Frontend Mimarisi

**GÖREV BİLDİRİMİ:**
Ustaların AFS Systems'a her gün girmesini sağlayacak "Garajım", "Birlikte Al" ve "İşçilik Süresi" UI/UX tasarımlarını B2B arayüzüne entegre edeceksin. Önceki hataları tekrarlamamak adına, tüm tasarımlar KESİNLİKLE "Mobile-First" (Mobil uyumlu, flex-col tabanlı) olacaktır.

Aşağıdaki 3 UI modülünü sisteme entegre et:

**1. AKILLI GARAJ (MY GARAGE) ARAYÜZÜ:**
- **Kayıt Butonu:** Şasi (VIN) numarası başarıyla sorgulandığında, araç bilgilerinin yanına "🚗 Garajıma Kaydet" şeklinde şık bir buton ekle. Tıklandığında ufak bir Modal açılsın ve ustadan "Müşteri Adı" ile "Plaka" isteyip Backend'e göndersin.
- **Hızlı Sorgulama:** Arama çubuğunun veya Şasi inputunun yanına bir "Garajımdan Seç" dropdown'u veya butonu koy. Usta eski bir müşterisini seçtiğinde, o aracın şasi numarası otomatik olarak input'a dolsun ve arama tetiklensin.

**2. ÇAPRAZ SATIŞ (BAKIM KİTİ) TASARIMI:**
- Bir parça (Örn: Triger) aratıldığında, Backend'den dönen `recommendedTogether` (Birlikte Alınanlar) dizisi doluysa, arama sonucunun hemen altına veya sağ panele dikkat çekici (açık mavi veya turuncu arka planlı) bir bölüm aç: *"💡 Usta Tavsiyesi: Bu parçayı alanlar genellikle şunları da değiştirdi"*
- Bu önerilen parçaları tek bir tuşla ("Tüm Seti Sepete Ekle") sepete atacak bir makro buton tasarla. Tıklama alanları mobilde kolay dokunulabilir (min-h-[44px]) olsun.

**3. TAHMİNİ İŞÇİLİK SÜRESİ ROZETİ (LABOR TIME BADGE):**
- Parça arama sonuçlarındaki "Teknik Özellikler" veya "Fiyat" bölümünün hemen yanına bir saat ikonu (clock icon) ile **"Tahmini İşçilik: 2 Saat"** yazan şık, gri/mavi tonlarında bir Tailwind rozeti (badge) ekle.
- Bu veri Backend'den `estimatedLaborTime` parametresi ile gelecektir. Eğer bu parametre boşsa (null/undefined), rozeti gizle (conditional rendering).
- Ustalar bu süreye bakarak müşterilerine anında işçilik fiyatı biçecekleri için bu rozet görünür ve okunaklı olmalıdır.

Tüm bu HTML/JS bloklarını ve API fetch entegrasyonlarını yap. Tasarımların mobilde asla taşmadığından (overflow-x-hidden) ve grid/flex yapılarının dar ekranlarda alt alta dizildiğinden emin ol.