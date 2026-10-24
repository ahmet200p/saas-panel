1. Kritik Güvenlik Güncellemesi: Şasi sorgulama işlemi sırasında Parts Catalogs API key'imiz client-side'da ifşa oluyor.

Frontend kodundaki (varsa frontend .env dosyasındaki) tüm parts-catalogs API key referanslarını tamamen sil.

Şasi sorgulama için yapılan API isteğini (fetch/axios) doğrudan dış API'ye (api.parts-catalogs.com) atmak yerine, kendi backend'imizdeki /api/catalog/search-vin/{sasi_numarasi} endpoint'ine yapacak şekilde değiştir. Backend bizim yerimize bu işlemi güvenli yapıp sonucu bize dönecek.