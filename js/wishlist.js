(function(){
  'use strict';

  function read(){ try {return JSON.parse(localStorage.getItem('electro_wishlist'))||[];} catch(e){return [];} }
  function write(list){ localStorage.setItem('electro_wishlist', JSON.stringify(list)); }

  function updateBadge(){
    var qty = document.getElementById('wishlist-qty');
    if (!qty) return;
    qty.textContent = String(read().length);
  }

  function renderDropdown(){
    var list = read();
    var listEl = document.getElementById('wishlist-list');
    var cntEl = document.getElementById('wishlist-items-count');
    if (!listEl) return;
    listEl.innerHTML = '';
    var allProducts = document.querySelectorAll('.product');
    var map = {};
    allProducts.forEach(function(p){
      var id = p.getAttribute('data-id') || p.querySelector('.add-to-cart-btn')?.getAttribute('data-id');
      if (!id) return;
      var img = p.querySelector('.product-img img')?.getAttribute('src') || '';
      var name = p.querySelector('.product-name a')?.textContent.trim() || 'Товар';
      var priceTxt = p.querySelector('.product-price')?.textContent || '';
      map[id] = { id: id, image: img, name: name, priceTxt: priceTxt };
    });
    list.forEach(function(id){
      var it = map[id] || { id:id, image:'', name:'Товар', priceTxt:'' };
      var w = document.createElement('div');
      w.className = 'product-widget';
      w.innerHTML = '<div class="product-img"><img src="'+it.image+'" alt=""></div>'+
        '<div class="product-body">'+
        '<h3 class="product-name"><a href="#">'+it.name+'</a></h3>'+
        '<h4 class="product-price">'+it.priceTxt+'</h4>'+
        '</div>'+
        '<button class="delete" data-wish-remove="'+it.id+'"><i class="fa fa-close"></i></button>';
      listEl.appendChild(w);
    });
    if (cntEl) cntEl.textContent = list.length + ' товаров';
  }

  function toggleWishlist(item){
    var list = read();
    if (list.indexOf(item.id) === -1) list.push(item.id);
    else list = list.filter(function(x){return x!==item.id});
    write(list);
    updateBadge();
  }

  document.addEventListener('DOMContentLoaded', function(){
    updateBadge();
    renderDropdown();
    document.body.addEventListener('click', function(e){
      var btn = e.target.closest('.add-to-wishlist');
      if (!btn) return;
      // Гейт: только после регистрации
      try {
        var user = JSON.parse(localStorage.getItem('electro_user')||'null');
        if (!user){
          alert('Для добавления в избранное войдите или зарегистрируйтесь');
          window.location.href = 'pages/auth.html';
          return;
        }
      } catch(_) {}
      var product = btn.closest('.product');
      var id = (product && (product.getAttribute('data-id') || product.querySelector('.add-to-cart-btn')?.getAttribute('data-id'))) || 'p';
      toggleWishlist({ id: id });
      renderDropdown();
    });
    document.body.addEventListener('click', function(e){
      var del = e.target.closest('[data-wish-remove]');
      if (!del) return;
      var id = del.getAttribute('data-wish-remove');
      if (!id) return;
      var list = read().filter(function(x){return x!==id});
      write(list);
      updateBadge();
      renderDropdown();
    });
  });
})();


