/**
 * ============================================================================
 * B2B Multi-Tenant SaaS - Dinamik Login & Rol Bazlı Yönlendirme (Routing) Motoru
 * Dosya: login.js (Kök Dizin Aliası)
 * prompt.md ADIM 1 & ADIM 2 Tam Uyumluluk
 * ============================================================================
 */

(function () {
  'use strict';

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

  function determineRedirectUrl(role, serverRedirectUrl) {
    const rawRole = String(role || '').toUpperCase().trim();
    let target = '';

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
          target = '/store.html';
        }
        break;
    }

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

        let userRole = res.role || (res.user && res.user.role) || (res.data && (res.data.role || (res.data.user && res.data.user.role))) || '';
        if (!userRole && res.token) {
          const decoded = decodeTokenPayload(res.token);
          if (decoded && (decoded.role || decoded.rawRole)) {
            userRole = decoded.role || decoded.rawRole;
          }
        }

        const targetUrl = determineRedirectUrl(userRole, res.redirectUrl);
        console.log(`[AUTH_ROUTING] Giriş başarılı. Rol: "${userRole}" -> Hedef: "${targetUrl}"`);

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

  if (typeof window !== 'undefined') {
    window.handleLoginSubmit = handleLoginSubmit;
    window.determineRedirectUrl = determineRedirectUrl;
    window.decodeTokenPayload = decodeTokenPayload;
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      const loginForm = document.getElementById('login-form');
      if (loginForm && !loginForm.__loginRoutingAttached) {
        loginForm.__loginRoutingAttached = true;
        loginForm.addEventListener('submit', handleLoginSubmit);
      }
    });
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      determineRedirectUrl,
      decodeTokenPayload,
      handleLoginSubmit
    };
  }
})();
