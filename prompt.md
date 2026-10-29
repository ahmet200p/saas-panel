SİSTEM MİMARİSİ VE GÖREV BİLDİRİMİ (CRITICAL FRONTEND TASK)
Bu görev, AFS Systems B2B Bayi Portalı'nın (bayii.html ve ilgili JavaScript dosyaları) Katalog Arama arayüzünü profesyonel endüstri standartlarına (İsmailOto vb. B2B seviyesine) taşımak içindir. Backend artık "Deep Cross-Reference (Derin Çapraz Referans)" mantığıyla devasa ve kusursuz bir JSON payload dönüyor. Senin görevin, bu zengin veriyi kullanıcıya (otoservis ustalarına) sıfır hatayla, en ince ayrıntısına kadar ve şık bir UI ile sunmaktır.

Aşağıdaki 4 temel mimari kuralı harfiyen uygulayacaksın. HTML veya JS dosyasının içinde unutulmuş tek bir statik (hardcoded) test verisi dahi kabul etmiyorum!

KURAL 1: STATİK VERİ ÇÖPLÜĞÜNÜ YOK ET (ZERO MOCK DATA TOLERANCE)

Eski kodda kalmış olan Oil sump, Valve timing, Oil filter gibi tüm statik görsel dizilerini (array), yer tutucu (placeholder) resimlerini ve fallback objelerini KESİNLİKLE SİL.

"12 Ay / 20.000 KM Garanti", "TSE / CE Standartı" gibi her parçada aynı çıkan basmakalıp, sahte HTML bloklarını DERHAL KALDIR.

Arayüz sadece ve SADECE API'den gelen canlı JSON verisini render edecektir. Veri yoksa o HTML bloğu gizlenecektir (display: none / conditional rendering).

KURAL 2: DEVASA ÇAPRAZ REFERANS AĞI İÇİN UI TASARIMI (UI/UX REVAMP)
Kullanıcı bir kod arattığında (OEM veya Referans fark etmez), backend bize tüm dünyadaki eşdeğerlerini yollayacak. Sonuç ekranını (Tailwind CSS kullanarak) şu kırılımlarla yeniden inşa et:

Kısım A - Orijinal (OEM) Kodları Havuzu: En üstte "Orijinal Ekipman (OEM) Numaraları" başlığı aç. Backend'den gelen originalOEMs dizisindeki TÜM numaraları net, dikkat çekici etiketler (badge) halinde diz.

Kısım B - Yan Sanayi (Referans) Muadilleri: Hemen altına "Eşdeğer & Muadil Marka Referansları" başlığı aç. Backend'den gelen referenceCodes dizisini (TRW: GDB1552, Bosch: 0986424794 vb.) markaları kalın (bold), kodları belirgin olacak şekilde yan yana veya şık bir grid (ızgara) yapısında listele. Usta ekrana baktığında o parçanın piyasadaki tüm şeceresini tek saniyede görmelidir.

KURAL 3: AKILLI GÖRSEL GALERİSİ VE ŞEMA SUNUMU (SMART IMAGE RENDERER)
Görsel sunumu B2B'nin en kritik yeridir. Backend'den gelen images dizisini işlerken şu kurallara uyacaksın:

Görsel dizisi tamamen boşsa (length === 0), kesinlikle sahte parça resmi gösterme. Onun yerine ortalanmış şık bir ikon ile "Bu parça veya muadilleri için teknik şema bulunmamaktadır." uyarısı bas.

Eğer gelen görselin içinde backend tarafından isFallback: true ve sourceCode: '410601241R' gibi bir meta veri eklenmişse; görselin köşesine ufak, bilgi verici bir Tailwind rozeti (tooltip/badge) ekle: "Görsel eşdeğer parçadan (410601241R) alınmıştır". Böylece usta, resmin asıl arattığı koda değil, kardeş koda ait olduğunu açıkça bilsin.

KURAL 4: DİNAMİK MÜHENDİSLİK TABLOSU (SPECIFICATIONS TABLE)

Sağ panele veya ürün detayına bir "Teknik Özellikler" tablosu (veya listesi) ekle.

Bu tablo, API'den gelen technicalSpecs objesini dinamik olarak dönmelidir (Object.entries vb. ile).

Örneğin parça fren balatası ise sadece (Kalınlık: 18mm, Aşınma İkazı: Var), Vantilatör kayışı ise sadece (Diş: 124, Uzunluk: 1420) çıkmalıdır. Anahtar-Değer (Key-Value) eşleşmesini UI'da şık bir tabloya oturt.

Bu gereksinimleri bayii.html (ve render işlemlerini yapan JS fonksiyonu) içerisine eksiksiz yedir. İşlemi tamamla ve arayüzde yaptığın bu devasa veri sergileme mantığını bana açıkla.