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

  function showToast(text){
    try {
      var t = document.createElement('div');
      t.className = 'toast-mini';
      t.textContent = text;
      document.body.appendChild(t);
      setTimeout(function(){ if(t && t.parentNode) t.parentNode.removeChild(t); }, 1600);
    } catch(_){}
  }

  function updateHeader() {
    var user = getUser();
    var linksRight = document.querySelector('#top-header .header-links.pull-right');
    if (!linksRight) return;
    var accountLink = linksRight.querySelector('a[href$="auth.html"], a[data-role="account"]');
    if (!accountLink) return;
    accountLink.setAttribute('data-role', 'account');
    if (user && user.name) {
      accountLink.textContent = 'Привет, ' + user.name;
      // добавить кнопку выхода рядом
      var logout = document.getElementById('logout-btn');
      if (!logout) {
        logout = document.createElement('a');
        logout.id = 'logout-btn';
        logout.href = '#';
        logout.style.marginLeft = '10px';
        logout.title = 'Выйти';
        logout.textContent = 'Выйти';
        linksRight.appendChild(logout);
      } else {
        logout.textContent = 'Выйти';
      }
    } else {
      accountLink.textContent = 'Мой аккаунт';
      var existing = document.getElementById('logout-btn');
      if (existing) existing.remove();
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    updateHeader();
    // Выход по клику
    document.body.addEventListener('click', function(e){
      if (e.target && e.target.id === 'logout-btn'){
        e.preventDefault();
        localStorage.removeItem('electro_user');
        updateHeader();
        showToast('Вы вышли из аккаунта');
      }
    });
  });

  // Expose minimal API for auth.html
  window.ElectroAuth = {
    register: function (name, email, password) {
      var user = { name: name, email: email };
      setUser(user);
      try { localStorage.removeItem('electro_cart'); } catch(e) {}
      try { localStorage.removeItem('electro_wishlist'); } catch(e) {}
      return true;
    },
    logout: function () {
      localStorage.removeItem('electro_user');
    }
  };
})();


