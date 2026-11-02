/**
 * ============================================================================
 * B2B Multi-Tenant SaaS - Dinamik Login & Rol Bazlı Yönlendirme (Routing) Motoru
 * Dosya: assets/js/login.js
 * prompt.md ADIM 1 & ADIM 2 Tam Uyumluluk
 * ============================================================================
 */

(function () {
  'use strict';

  /**
   * JWT Token'dan payload çözümleme (Güvenli Base64 Decode)
   * @param {string} token - JWT Bearer Token
   * @returns {object|null}
   */
  function decodeTokenPayload(token) {
    if (!token || typeof token !== 'string') return null;
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonStr = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonStr);
    } catch (e) {
      console.warn('[JWT_DECODE_ERR]:', e);
      return null;
    }
  }

  /**
   * Rol bazlı dinamik yönlendirme hedefi belirler (prompt.md ADIM 1)
   * - SUPER_ADMIN -> /admin.html (veya admin.html)
   * - BAYI -> /bayi.html (veya bayi.html)
   * - MUSTERI -> /store.html (veya store.html)
   * @param {string} role - Kullanıcı rolü (SUPER_ADMIN, BAYI, MUSTERI, vb.)
   * @param {string} [serverRedirectUrl] - Backend'den dönen opsiyonel redirectUrl
   * @returns {string}
   */
  function determineRedirectUrl(role, serverRedirectUrl) {
    const rawRole = String(role || '').toUpperCase().trim();
    let target = '';

    // prompt.md Kuralı: if/else veya switch bloğu ile rol bazlı yönlendirme:
    switch (rawRole) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        target = '/admin.html';
        break;
      case 'BAYI':
      case 'TENANT_ADMIN':
        target = '/bayi.html';
        break;
      case 'MUSTERI':
      case 'CUSTOMER':
        target = '/store.html';
        break;
      default:
        if (serverRedirectUrl) {
          target = serverRedirectUrl;
        } else {
          target = '/store.html'; // Güvenli varsayılan vitrin (Admin paneline asla yetkisiz yönlendirme yapılmaz)
        }
        break;
    }

    // Dosya protokolü (file://) veya göreceli yol ortamlarında göreceli dosya adına çevir
    if (typeof window !== 'undefined' && window.location) {
      const isFileProto = window.location.protocol === 'file:';
      const isSubPath = window.location.pathname.includes('/saas-panel');
      if (isFileProto || isSubPath) {
        if (target === '/admin.html') return 'admin.html';
        if (target === '/bayi.html') return 'bayi.html';
        if (target === '/store.html') return 'store.html';
      }
    }

    return target;
  }

  /**
   * Ortak Login Formu Submit İşleyicisi
   * @param {Event} e - Form Submit Olayı
   */
  async function handleLoginSubmit(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    const emailInput = document.getElementById('email') || document.querySelector('input[type="email"]');
    const passwordInput = document.getElementById('password') || document.querySelector('input[type="password"]');
    const errorMsg = document.getElementById('error-msg') || document.getElementById('errorMessage') || document.querySelector('.error-msg');
    const btnLogin = document.getElementById('btn-login') || document.querySelector('button[type="submit"]');

    if (errorMsg) {
      errorMsg.classList.add('hidden');
      errorMsg.style.display = 'none';
      errorMsg.textContent = '';
    }

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!email || !password) {
      if (errorMsg) {
        errorMsg.textContent = 'Lütfen e-posta ve şifrenizi eksiksiz giriniz.';
        errorMsg.classList.remove('hidden');
        errorMsg.style.display = 'block';
      }
      return;
    }

    const originalBtnText = btnLogin ? btnLogin.innerHTML : 'Giriş Yap';
    if (btnLogin) {
      btnLogin.disabled = true;
      btnLogin.textContent = 'Giriş Yapılıyor...';
    }

    try {
      let res;
      if (typeof window.apiFetch === 'function') {
        res = await window.apiFetch('/auth/login', {
          method: 'POST',
          body: { email, password }
        });
      } else {
        const base = (typeof window.API_BASE_URL === 'string' && window.API_BASE_URL)
          ? window.API_BASE_URL
          : (typeof window.API_BASE === 'string' && window.API_BASE ? window.API_BASE : 'https://saas-g-ncel-10-10-2026simdi-main.onrender.com/api');

        const rawResponse = await fetch(`${base}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        res = await rawResponse.json();
      }

      const isSuccess = res && (res.success === true || !!res.token);
      if (isSuccess && res.token) {
        // Token ve Kullanıcı Bilgilerini localStorage'a kaydet
        localStorage.setItem('token', res.token);
        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
          if (res.user.tenantId || (res.user.tenant && res.user.tenant.id)) {
            localStorage.setItem('tenantId', res.user.tenantId || res.user.tenant.id);
          }
          if (res.user.tenant && (res.user.tenant.subdomain || res.user.tenant.slug)) {
            localStorage.setItem('tenantSlug', res.user.tenant.subdomain || res.user.tenant.slug);
          }
        }

        // ADIM 1: FRONTEND DİNAMİK YÖNLENDİRME (ROUTING)
        // Backend yanıtından veya JWT token payload'ından role bilgisini al
        let userRole = res.role || (res.user && res.user.role) || (res.data && (res.data.role || (res.data.user && res.data.user.role))) || '';
        if (!userRole && res.token) {
          const decoded = decodeTokenPayload(res.token);
          if (decoded && (decoded.role || decoded.rawRole)) {
            userRole = decoded.role || decoded.rawRole;
          }
        }

        // Rol bazlı dinamik hedef URL'yi hesapla
        const targetUrl = determineRedirectUrl(userRole, res.redirectUrl);
        console.log(`[AUTH_ROUTING] Giriş başarılı. Kullanıcı Rolü: "${userRole}" -> Yönlendirilen Sayfa: "${targetUrl}"`);

        window.location.href = targetUrl;
        return;
      } else {
        const errorText = (res && (res.message || res.error)) || 'Hatalı e-posta veya şifre!';
        if (errorMsg) {
          errorMsg.textContent = errorText;
          errorMsg.classList.remove('hidden');
          errorMsg.style.display = 'block';
        }
        if (btnLogin) {
          btnLogin.classList.add('animate-bounce');
          setTimeout(() => btnLogin.classList.remove('animate-bounce'), 600);
        }
      }
    } catch (err) {
      console.error('[AUTH_LOGIN_ERROR]:', err);
      if (errorMsg) {
        errorMsg.textContent = (err && err.message) || 'Giriş işlemi sırasında bağlantı hatası oluştu.';
        errorMsg.classList.remove('hidden');
        errorMsg.style.display = 'block';
      }
    } finally {
      if (btnLogin) {
        btnLogin.disabled = false;
        btnLogin.innerHTML = originalBtnText;
      }
    }
  }

  // Global namespace'e bağla
  if (typeof window !== 'undefined') {
    window.handleLoginSubmit = handleLoginSubmit;
    window.determineRedirectUrl = determineRedirectUrl;
    window.decodeTokenPayload = decodeTokenPayload;
  }

  // DOM Yüklendiğinde Form submit olayını otomatik dinle
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      const loginForm = document.getElementById('login-form');
      if (loginForm && !loginForm.__loginRoutingAttached) {
        loginForm.__loginRoutingAttached = true;
        loginForm.addEventListener('submit', handleLoginSubmit);
      }
    });
  }

  // CommonJS ortamı desteği
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      determineRedirectUrl,
      decodeTokenPayload,
      handleLoginSubmit
    };
  }
})();
