"Bayi portalında bir hesap Admin tarafından onaylansa bile, Bayi Dashboard sayfasında hala statik olarak 'Hesabınız Onay Aşamasındadır' uyarısı çıkıyor.

Sorun muhtemelen kullanıcının tarayıcısındaki Token/Oturum bilgisinin güncellenmemesinden kaynaklanıyor. Dashboard bileşeni (component) yüklendiğinde (mount olduğunda), kullanıcının ve firmanın en güncel durumunu backend'den çekecek (örneğin /api/auth/me veya /api/tenant/status) bir API isteği (fetch/axios) at.

Gelen yanıtta hesap onaylı (APPROVED veya isActive: true) ise, frontend'deki Redux/Context/State veya LocalStorage üzerindeki eski onay bekliyor durumunu ezerek güncelle ve uyarı banner'ını kaldır.

Uyarı banner'ını gösteren if/else koşulunun doğru değişkene (status mü, isActive mi) baktığından emin ol."