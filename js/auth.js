(function () {
  'use strict';

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem('electro_user')) || null;
    } catch (e) {
      return null;
    }
  }

  function setUser(user) {
    localStorage.setItem('electro_user', JSON.stringify(user));
  }

  function updateHeader() {
    var user = getUser();
    var linksRight = document.querySelector('#top-header .header-links.pull-right');
    if (!linksRight) return;
    var accountLink = linksRight.querySelector('a[href$="auth.html"], a[data-role="account"]');
    if (!accountLink) return;
    if (user && user.name) {
      accountLink.setAttribute('data-role', 'account');
      accountLink.textContent = 'Привет, ' + user.name;
    } else {
      accountLink.setAttribute('data-role', 'account');
      accountLink.textContent = 'Мой аккаунт';
    }
  }

  document.addEventListener('DOMContentLoaded', updateHeader);

  // Expose minimal API for auth.html
  window.ElectroAuth = {
    register: function (name, email, password) {
      var user = { name: name, email: email };
      setUser(user);
      // Очистим корзину/избранное при регистрации
      try { localStorage.removeItem('electro_cart'); } catch(e) {}
      try { localStorage.removeItem('electro_wishlist'); } catch(e) {}
      return true;
    },
    logout: function () {
      localStorage.removeItem('electro_user');
    }
  };
})();


