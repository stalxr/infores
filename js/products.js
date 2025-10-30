document.addEventListener('DOMContentLoaded', function(){
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
        const product = btn.closest('.product');
        const id = product ? product.getAttribute('data-id') : btn.getAttribute('data-id');
        const icon = btn.querySelector('i');
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
    document.body.addEventListener('click', function(e){
      var btn = e.target.closest('.add-to-wishlist');
      if (!btn) return;
      const product = btn.closest('.product');
      const id = product ? product.getAttribute('data-id') : btn.getAttribute('data-id');
      if (!id) return;
      let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const idx = wishlist.indexOf(id);
      if (idx === -1) wishlist.push(id); else wishlist.splice(idx,1);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      updateWishlistIcons();
    });

    function bindWishlistHeaderIcon() {
      document.querySelectorAll('a, div, span, .qty, i').forEach(el => {
        if(!el) return; 
        let matched = false;
        if ((el.id && el.id.includes('wishlist')) ||
            (el.innerText && el.innerText.trim().toLowerCase().includes('избранное')) ||
            (el.classList && (el.classList.contains('fa-heart')||el.classList.contains('fa-heart-o'))))
            { matched = true; }
        if (matched) {
          el.addEventListener('click', function(e) {
            if (el.closest('.header-ctn')) {
              e.preventDefault();
              window.location.href = window.location.pathname.includes('pages') ? 'wishlist.html' : 'pages/wishlist.html';
            }
          });
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
