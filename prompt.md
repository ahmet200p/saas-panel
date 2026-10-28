Yeni Ürün Ekle sayfasındaki OE numarası sorgulamasında, metin verileri (uyumlu araçlar, muadiller) API'den doğru şekilde eşleşip gelirken, 'Katalog Görselleri & Teknik Şemalar' alanında aranan parçadan bağımsız olarak sürekli sabit test görselleri (Oil sump, Valve timing, Oil filter) render ediliyor. Lütfen görsel galerisinin kod bloğunu şu şekilde düzelt:

Kodun içinde Oil sump, Valve timing gibi isimlerle tanımlanmış statik (hardcoded) test görsel dizisini (array) ve fallback objelerini tamamen sil.

Galeri arayüzünü SADECE arama API'sinin yanıtındaki images veya schemas verisiyle (dinamik olarak) eşleştir.

API başarılı çalışsa bile o parçaya ait bir çizim/şema veritabanında yoksa (görsel array'i boş dönüyorsa), ekrana alakasız parçalar basma; bunun yerine 'Bu parça için teknik şema bulunmamaktadır.' uyarısı göster.

Şema bulunsun veya bulunmasın, kullanıcının kendi fotoğrafını ekleyebildiği 'Manuel Görsel Yükle' alanını her zaman aktif bırak.