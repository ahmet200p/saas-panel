Katalog sorgulamasında sahte/sabit görseller başarıyla kalktı ve boş durum (empty state) tasarımı doğru çalışıyor. Ancak, '7701208122' ve '410601241R' gibi birbiriyle eşdeğer olan parçalarda, katalog API'si görseli bazen sadece tek bir ana OE numarasına bağlamış olabiliyor. Lütfen katalog sorgu (fetch) mantığına şu 'Akıllı Görsel Eşleştirme' adımını ekle:

Kullanıcı bir OE numarası sorguladığında ve API'den dönen görsel (images/schemas) dizisi boşsa (uzunluğu 0 ise), işlemi hemen bitirip 'Görsel Yok' hatasını gösterme.

API'nin döndürdüğü yanıtın içindeki 'Eşdeğer & Muadil Parçalar' veya 'Çapraz Referanslar' (crossReferences / equivalentOEs) dizisini kontrol et.

Eğer eşdeğer OE numaraları veya referans kodları varsa, arka planda bu kodlardan ilk 1 veya 2 tanesi için sessiz bir 'ikincil görsel sorgusu' (fallback fetch) yap.

Eğer bu eşdeğer kodların birinde görsel bulunursa, sanki asıl aradığımız parça için bulunmuş gibi o görseli ekrana yansıt ve 'Bu görsel eşdeğer parçadan (Örn: 410601241R) alınmıştır' şeklinde ufak bir bilgi notu ekle.