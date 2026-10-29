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

Bu sayede kullanıcı sadece şasi numarasını girip listeden parçaya tıkladığında; ekranın alt kısmı bir önceki adımda kurduğumuz o devasa muadil marka kodları, teknik özellik tabloları ve fallback görselleriyle otomatik olarak dolmalıdır. Kodu bu kusursuz zincirleme akışa göre yaz ve entegre et.