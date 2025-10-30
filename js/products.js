document.addEventListener('DOMContentLoaded', function(){
    // normalize wishlist buttons
    (function normalizeWishlistButtons(){
      document.querySelectorAll('.add-to-wishlist').forEach(function(b){
        try{ b.setAttribute('type','button'); b.setAttribute('role','button'); } catch(_){}
      });
    })();

    // ФИЛЬТР (legacy minimal)
    var filter = document.getElementById('filter-category');
    if (filter) {
        filter.addEventListener('change', function(){
            filterProducts(this.value);
        });
    }
    function filterProducts(category) {
        var items = document.querySelectorAll('.product-card');
        items.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'inline-block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function isHomepage(){
      var p = window.location.pathname;
      return /(?:^|\/)index\.html$/.test(p) || (/^\/?$/.test(p) && !p.includes('/pages/'));
    }

    function resolveProductIdFrom(el){
      var product = el.closest ? el.closest('.product') : null;
      var id = product && product.getAttribute('data-id');
      if (!id && product){
        var cartBtn = product.querySelector('.add-to-cart-btn');
        if (cartBtn) id = cartBtn.getAttribute('data-id');
      }
      if (!id){
        var nameEl = product ? product.querySelector('.product-name a') : null;
        var imgEl = product ? product.querySelector('.product-img img') : null;
        var key = (nameEl ? nameEl.textContent.trim() : '') + '|' + (imgEl ? imgEl.getAttribute('src') : '');
        if (key) id = 'pid:' + btoa(unescape(encodeURIComponent(key))).slice(0,12);
      }
      return id || null;
    }

    function collectProductMeta(el){
      var product = el.closest ? el.closest('.product') : null;
      var nameEl = product ? product.querySelector('.product-name a') : null;
      var imgEl = product ? product.querySelector('.product-img img') : null;
      var priceEl = product ? product.querySelector('.product-price') : null;
      return {
        name: nameEl ? nameEl.textContent.trim() : 'Товар',
        img: imgEl ? imgEl.getAttribute('src') : '',
        priceText: priceEl ? priceEl.textContent.trim() : ''
      };
    }

    // КОРЗИНА (legacy demo)
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(){
            const id = btn.dataset.id;
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            if (!cart.includes(id)) {
                cart.push(id);
                localStorage.setItem('cart', JSON.stringify(cart));
                btn.textContent = 'Добавлено в корзину';
                showToast('товар успешно добавлен');
            } else {
                showToast('товар уже в корзине');
            }
        });
    });

    // ИЗБРАННОЕ (делегирование)
    function updateWishlistIcons() {
      let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      document.querySelectorAll('.add-to-wishlist').forEach(btn => {
        var id = resolveProductIdFrom(btn);
        var icon = btn.querySelector('i');
        if(id && icon) {
          if (wishlist.includes(id)) {
            icon.classList.remove('fa-heart-o');
            icon.classList.add('fa-heart');
            btn.classList.add('added');
          } else {
            icon.classList.remove('fa-heart');
            icon.classList.add('fa-heart-o');
            btn.classList.remove('added');
          }
        }
      });
      var qty = document.getElementById('wishlist-qty');
      if (qty) qty.textContent = String(wishlist.length);
    }
    window.updateWishlistIcons = updateWishlistIcons;

    if (!document.body._wishlistBound){
      document.body.addEventListener('click', function(e){
        var btn = e.target.closest && e.target.closest('.add-to-wishlist');
        if (!btn) return;
        if (isHomepage()) return; // disable wishlist on homepage
        e.preventDefault();
        e.stopPropagation();
        var id = resolveProductIdFrom(btn);
        if (!id) return;
        let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        let meta = {};
        try { meta = JSON.parse(localStorage.getItem('wishlist_meta')||'{}'); } catch(_){}
        const idx = wishlist.indexOf(id);
        if (idx === -1) {
          wishlist.push(id);
          meta[id] = collectProductMeta(btn);
        } else {
          wishlist.splice(idx,1);
          delete meta[id];
        }
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        localStorage.setItem('wishlist_meta', JSON.stringify(meta));
        updateWishlistIcons();
      }, false);
      document.body._wishlistBound = true;
    }

    function bindWishlistHeaderIcon() {
      var headerLinks = document.querySelectorAll('.header-ctn a');
      headerLinks.forEach(function(a){
        var isWishlist = !!a.querySelector('.fa-heart, .fa-heart-o') || (a.textContent||'').toLowerCase().includes('избранное');
        if (isWishlist && !a._wishBound){
          a.addEventListener('click', function(e){
            e.preventDefault();
            var dest = window.location.pathname.includes('pages') ? 'wishlist.html' : 'pages/wishlist.html';
            window.location.href = dest;
          });
          a._wishBound = true;
        }
      });
    }
    bindWishlistHeaderIcon();

    function showToast(text) {
      const toast = document.createElement('div');
      toast.className = 'toast-mini';
      toast.textContent = text;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 1600);
    }

    // начальная синхронизация
    updateWishlistIcons();
});
