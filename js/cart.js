(function(){
  'use strict';

  function readCart(){
    try { return JSON.parse(localStorage.getItem('electro_cart')) || []; } catch(e){ return []; }
  }
  function writeCart(cart){ localStorage.setItem('electro_cart', JSON.stringify(cart)); }
  function format(amount){ return '₽' + Number(amount).toFixed(2); }

  function addToCart(item){
    var cart = readCart();
    var existing = cart.find(function(x){return x.id === item.id;});
    if (existing){ existing.qty += item.qty; }
    else { cart.push(item); }
    writeCart(cart);
    renderHeaderCart();
  }

  function removeFromCart(id){
    var cart = readCart().filter(function(x){return x.id !== id;});
    writeCart(cart);
    renderHeaderCart();
  }

  function renderHeaderCart(){
    var cart = readCart();
    var qtyEl = document.getElementById('cart-qty');
    var listEl = document.getElementById('cart-list');
    var itemsCountEl = document.getElementById('cart-items-count');
    var totalEl = document.getElementById('cart-total');
    if (!qtyEl || !listEl) return; // Не на всех страницах есть шапка
    var totalQty = cart.reduce(function(s,i){return s + i.qty;}, 0);
    var total = cart.reduce(function(s,i){return s + i.qty * i.price;}, 0);
    qtyEl.textContent = String(totalQty);
    if (itemsCountEl) itemsCountEl.textContent = totalQty + ' товаров';
    if (totalEl) totalEl.textContent = format(total);
    listEl.innerHTML = '';
    cart.forEach(function(item){
      var w = document.createElement('div');
      w.className = 'product-widget';
      w.innerHTML = '<div class="product-img"><img src="'+item.image+'" alt=""></div>'+
        '<div class="product-body">'+
          '<h3 class="product-name"><a href="#">'+item.name+'</a></h3>'+
          '<h4 class="product-price"><span class="qty">'+item.qty+'x</span>'+format(item.price)+'</h4>'+
        '</div>'+
        '<button type="button" class="delete" data-remove="'+item.id+'"><i class="fa fa-close" data-remove="'+item.id+'"></i></button>';
      listEl.appendChild(w);
    });

    // Делегирование удаления прямо на выпадающем блоке
    var dropdown = document.querySelector('.cart-dropdown');
    if (dropdown && !dropdown._bindRemove) {
      dropdown.addEventListener('click', function(e){
        var del = e.target.closest('[data-remove]');
        if (!del) return;
        e.preventDefault();
        e.stopPropagation();
        var id = del.getAttribute('data-remove');
        if (!id) return;
        removeFromCart(id);
        showToast('товар удален');
      });
      dropdown._bindRemove = true;
    }
  }

  function showToast(text){
    try {
      var t = document.createElement('div');
      t.className = 'toast-mini';
      t.textContent = text;
      document.body.appendChild(t);
      setTimeout(function(){ if(t && t.parentNode) t.parentNode.removeChild(t); }, 1800);
    } catch(_){}
  }

  function bindAddToCartButtons(){
    // modern buttons
    document.body.addEventListener('click', function(e){
      var btn = e.target.closest('.add-to-cart-btn');
      if (!btn) return;
      var product = btn.closest('.product');
      var id = btn.getAttribute('data-id');
      var name = btn.getAttribute('data-name');
      var priceAttr = btn.getAttribute('data-price');
      var image = btn.getAttribute('data-image');
      if (!name && product){
        var nameA = product.querySelector('.product-name a');
        name = nameA ? nameA.textContent.trim() : 'Товар';
      }
      if (!image && product){
        var imgEl = product.querySelector('.product-img img');
        image = imgEl ? imgEl.getAttribute('src') : '';
      }
      var price = 0;
      if (priceAttr) price = parseFloat(priceAttr);
      else if (product){
        var priceEl = product.querySelector('.product-price');
        if (priceEl){
          var txt = priceEl.textContent.replace(/[^0-9.,]/g,'').replace(',', '.');
          price = parseFloat(txt) || 0;
        }
      }
      if (!id){
        id = (name || 'product') + '-' + Math.random().toString(36).slice(2,7);
      }
      addToCart({ id: id, name: name, price: price, image: image || '', qty: 1 });
      showToast('товар успешно добавлен');
      try { btn.textContent = 'Уже в корзине'; } catch(_){}
    });

    // legacy simple buttons
    document.body.addEventListener('click', function(e){
      var btn = e.target.closest('.add-to-cart');
      if (!btn) return;
      var product = btn.closest('.product');
      var id = btn.getAttribute('data-id');
      var name = (product && product.querySelector('.product-name a')) ? product.querySelector('.product-name a').textContent.trim() : (btn.getAttribute('data-name')||'Товар');
      var image = (product && product.querySelector('.product-img img')) ? product.querySelector('.product-img img').getAttribute('src') : (btn.getAttribute('data-image')||'');
      var price = 0;
      if (product){
        var priceEl = product.querySelector('.product-price');
        if (priceEl){
          var txt = priceEl.textContent.replace(/[^0-9.,]/g,'').replace(',', '.');
          price = parseFloat(txt) || 0;
        }
      }
      if (!id){ id = (name || 'product') + '-' + Math.random().toString(36).slice(2,7); }
      addToCart({ id: id, name: name, price: price, image: image || '', qty: 1 });
      showToast('товар успешно добавлен');
      try { btn.textContent = 'Уже в корзине'; } catch(_){}
    });

    // delete remains
    document.body.addEventListener('click', function(e){
      var delBtn = e.target.closest('.cart-dropdown .delete, [data-remove]');
      if (!delBtn) return;
      var id = delBtn.getAttribute('data-remove');
      if (!id) return;
      e.preventDefault();
      e.stopPropagation();
      removeFromCart(id);
      showToast('товар удален');
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    renderHeaderCart();
    bindAddToCartButtons();

    // Редирект на регистрацию при клике на cart, если не залогинен
    var cartToggle = document.querySelector('.header-ctn .dropdown > a.dropdown-toggle');
    if (cartToggle) {
      cartToggle.addEventListener('click', function(e){
        try {
          var user = JSON.parse(localStorage.getItem('electro_user')||'null');
          if (!user) {
            e.preventDefault();
            window.location.href = window.location.pathname.includes('/pages/') ? 'auth.html' : 'pages/auth.html';
          }
        } catch(_) {}
      });
    }
  });
})();


