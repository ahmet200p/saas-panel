# GÖREV: Bayi Paneli Ürün Yönetimi ve Yetkilendirme

`bayi.html` ve bağlı JS dosyasını incele. Bayinin sisteme kendi ürünlerini girdiği bu paneli merkezi API'ye bağla:

1. ÜRÜN EKLEME (POST): Bayi formdan ürün bilgilerini (OEM kodu, fiyat, marka vb.) doldurup kaydettiğinde, verileri topla ve `POST ${API_BASE_URL}/bayi/products` endpoint'ine gönder. 
2. TOKEN ZORUNLULUĞU: Bu `fetch` isteğinin headers kısmına kesinlikle `'Authorization': 'Bearer ' + localStorage.getItem('token')` ekle. (Backend bu token'dan kullanıcının 'BAYI' olduğunu doğrulayacak).
3. EKRAN GÜNCELLEME: Başarılı ürün ekleme veya stok güncelleme işlemlerinden sonra sayfayı yenilemeden (AJAX ile) bayinin ürün listesini DOM üzerinde anında güncelle ve "Ürün Başarıyla Eklendi" bildirimi ver.