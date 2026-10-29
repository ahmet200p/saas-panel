[FRONTEND - KESİN GÖREV: İNTERAKTİF ŞASİ KATALOĞU VE OTOMATİK OEM TETİKLEME]

Görev Bildirimi: Şasi (VIN) numarası girilip 'Sorgula' butonuna tıklandığında, backend'den gelen compatibleParts parça listesi ekrana etkileşimli bir menü olarak basılacak. Kullanıcı bu listeden bir parçaya tıkladığında, sistem bunu otomatik olarak 'OE Numarası' arama çubuğuna taşıyıp "Derin Çapraz Referans" araması başlatacaktır.

KATI KURALLAR VE UI MİMARİSİ:

Parça Ağacı Listesi (UI): Şasi sorgusu başarılı olduğunda, VIN inputunun hemen altında (veya uygun bir alanda) kaydırılabilir (max-h-64, overflow-y-auto), şık bir liste (veya grid) açılacaktır.

Liste Formatı: Backend'den gelen her bir parça, listede tam olarak şu formatta gösterilecektir: Parça Adı (OEM KODU). Örnek: Ön Fren Balata Takımı (410601241R).

Etkileşim (On-Click Event): Bu liste elemanları tıklanabilir (cursor-pointer, hover efektli) olacaktır.

ZİNCİRLEME REAKSİYON (EN KRİTİK KISIM): Kullanıcı bu listeden örneğin Ön Fren Balata Takımı (410601241R) satırına tıkladığı ANDA sistem şu 3 işlemi milisaniyeler içinde SIRAYLA yapacaktır:

A) Tıklanan metnin içinden parantez içindeki OE numarasını (410601241R) JS match veya Regex metotlarıyla ayıkla.

B) Ayıklanan bu OEM numarasını, formdaki 'OE Numarası' (Parts Catalogs Entegre) input alanına otomatik olarak yazdır (input.value = "410601241R").

C) Kullanıcının butona basmasını beklemeden, OE Numarası arama fonksiyonunu (fetchOEMData() veya ilgili arama fonksiyonu) programatik olarak derhal TETİKLE.

Bu sayede kullanıcı sadece şasi numarasını girip listeden parçaya tıkladığında; ekranın alt kısmı bir önceki adımda kurduğumuz o devasa muadil marka kodları, teknik özellik tabloları ve fallback görselleriyle otomatik olarak dolmalıdır. Kodu bu kusursuz zincirleme akışa göre yaz ve entegre et.# PROJE GÖREVİ: AFS Systems B2B Portalı - Eksiksiz Katalog ve Çapraz Eşleştirme Motoru

## BAĞLAM VE SORUN TESPİTİ
Sistemimizde Şasi (VIN) sorgusu yapıldığında parça ağacı başarıyla dökülmekte ve 133 adet parça listelenmektedir (Örn: Triger Kayışı, Eksantrik, Izgara vb.). Ancak listeden herhangi bir parçaya tıklandığında:
1. Sadece ham OEM numarasıyla arama yapıldığı için Parts Catalog API'si muadil (cross-reference) kodlarını ve marka eşleşmelerini getirememektedir.
2. Mekanik parçalar (triger, kayış vb.) dahil olmak üzere hiçbir parçada teknik şema/görsel çıkmamaktadır.
Sistem yükü kaldırmalı ve İsmailOto kalitesinde eksiksiz bir B2B deneyimi sunmalıdır. Aşağıdaki mimariyi eksiksiz yazmanızı emrediyorum.

---

## BÖLÜM 1: BACKEND (API & SERVICE) MİMARİSİ

1. **VIN Parça Ağacı Genişletme:** 
   - Şasi (VIN) endpoint'i çağrıldığında, dönen parça listesindeki her bir eleman sadece parça adı ve ham OE kodundan ibaret olmamalıdır.
   - API, gelen her bir OE numarasını arkaplanda Parts Catalog servisinin beklediği formata (boşluksuz, tireleri arındırılmış `sanitize()`) çevirmelidir.

2. **Çift Yönlü Derin Çapraz Eşleşme (Deep Cross-Reference):**
   - Kullanıcı ister arama çubuğuna bir OE numarası yazsın, ister şasi listesinden bir parçaya tıksın; backend şu döngüyü çalıştırmak ZORUNDADIR:
     a) Girilen koddan yola çıkarak ana "Kök OEM" numarasını bul.
     b) Bu kök numaraya bağlı olan DİĞER tüm üretici OEM revizyonlarını ve BÜTÜN yan sanayi referans kodlarını (Bosch, TRW, Valeo, AYD vb.) marka isimleriyle birlikte eksiksiz bir dizi (array) halinde topla.

3. **Agresif Görsel ve Şema Taraması (Fallback Image Engine):**
   - Aranan spesifik kodda görsel yoksa işlem kesilmeyecek; bulunan eşdeğer/muadil kodlar sırayla taranacak, görseli olan ilk kardeş kodun şeması ana görsel olarak "ödünç alınacaktır" (`isFallback: true`, `sourceCode: '...'`).
   - Statik, sahte veya alakasız (karter, yağ filtresi vb.) hiçbir mock görsel asla dönülmeyecektir. Görsel yoksa boş dizi `[]` dönülmelidir.

4. **JSON Yanıt Formatı (Strict Payload):**
   Controller şu kesin yapıda JSON dönmelidir:
   {
     "success": true,
     "searchedCode": "...",
     "originalOEMs": ["...", "..."],
     "referenceCodes": [{ "brand": "TRW", "code": "..." }],
     "technicalSpecs": { "kalinlik": "18mm", ... },
     "images": [{ "url": "...", "isFallback": false }]
   }

---

## BÖLÜM 2: FRONTEND (UI & INTERACTION) MİMARİSİ

1. **Şasi Listesinden Otomatik ve Temiz Tetikleme:**
   - Şasi parça ağacından (133 parçalık listeden) bir satıra tıklandığında, parantez içindeki OE numarası RegEx ile hassasiyetle ayıklanacak.
   - Ayıklanan kod özel bir `sanitize()` fonksiyonundan geçirilerek (tüm boşluk ve özel karakterler silinerek) formdaki "OE Numarası" inputuna yazılacak ve arama fonksiyonu otomatik olarak tetiklenecektir.

2. **Muadil ve Referans Kodları UI Gösterimi:**
   - Arayüzde "Orijinal Ekipman (OEM) Numaraları" ve "Muadil / Referans Kodları (Marka Bazlı)" olmak üzere iki ayrı net alan (Tailwind badge gridleri) açılacak. Usta ekrana baktığında o parçanın dünyadaki tüm alternatiflerini görecek.

3. **Dürüst Empty State ve Bilgi Rozetleri:**
   - API'den görsel dönmezse ekrana asla rastgele parça resmi basılmayacak; ortalanmış şık bir ikonla *"Bu parça için teknik şema bulunmamaktadır"* uyarısı verilecek.
   - Eğer gelen görsel bir muadilden ödünç alınmışsa (`isFallback: true`), görselin köşesinde *"Görsel eşdeğer parçadan (XYZ) alınmıştır"* rozeti gösterilecek.
   - Dinamik teknik özellikler (varsa) sadece anahtar-değer tablosu şeklinde render edilecek. Sahte veya basmakalıp garanti/sertifika metinleri tamamen temizlenecek.
   