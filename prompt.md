3. Frontend (UI) Kilit ve Render Mantığı:

Frontend tarafında, Şasi (VIN) Numarası aratıldığında, backend'den o devasa array TAMAMEN gelene kadar parça listesini ASLA render etme.

Veri toplanırken ekranda kullanıcıyı bilgilendiren şık bir loading state göster: "Kataloğa bağlanılıyor, tüm araç parçaları toplanıyor (Bu işlem birkaç saniye sürebilir)..."

State veya Array'i her yeni sorguda önce kesinlikle [] (boş dizi) olarak sıfırla ki önceki sorgunun verileriyle yenileri birbirine karışıp saçma sayılar üretmesin.

Gelen eksiksiz veri (Örn: data.length === 4835), arayüzde performans sorunu (UI donması) yaratmaması için Sanal Kaydırma (Virtual Scrolling / Windowing) tekniği ile render edilecek. Bütün HTML DOM elemanlarını tek seferde basıp tarayıcıyı çökertme; React-Window veya benzeri bir mantıkla sadece ekranda görünenleri render et.

Sonuç Beklentisi: Bir şaside 4835 parça varsa, her sorguda istisnasız 4835 parça dönecek ve bu sayı asla stabil olmayan bir şekilde değişmeyecek. Kodu buna göre güncelle.