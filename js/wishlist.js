(function(){
  'use strict';

  function read(){ try {return JSON.parse(localStorage.getItem('electro_wishlist'))||[];} catch(e){return [];} }
  function write(list){ localStorage.setItem('electro_wishlist', JSON.stringify(list)); }

  function updateBadge(){
    var qty = document.getElementById('wishlist-qty');
    if (!qty) return;
    qty.textContent = String(read().length);
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
    document.body.addEventListener('click', function(e){
      var btn = e.target.closest('.add-to-wishlist');
      if (!btn) return;
      var product = btn.closest('.product');
      var id = (product && (product.getAttribute('data-id') || product.querySelector('.add-to-cart-btn')?.getAttribute('data-id'))) || 'p';
      toggleWishlist({ id: id });
    });
  });
})();


