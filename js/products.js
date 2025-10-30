document.addEventListener('DOMContentLoaded', function(){
    // ФИЛЬТР
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
    
    // КОРЗИНА
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(){
            const id = btn.dataset.id;
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            if (!cart.includes(id)) {
                cart.push(id);
                localStorage.setItem('cart', JSON.stringify(cart));
                btn.textContent = 'Добавлено в корзину';
                showToast('✅ Товар добавлен в корзину');
            } else {
                showToast('🛒 Товар уже в корзине');
            }
        });
    });

    // ИЗБРАННОЕ
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
    }
    document.querySelectorAll('.add-to-wishlist').forEach(btn => {
      btn.addEventListener('click', function(){
        const product = btn.closest('.product');
        const id = product ? product.getAttribute('data-id') : btn.getAttribute('data-id');
        let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const idx = wishlist.indexOf(id);
        if (idx === -1) {
          wishlist.push(id);
          btn.classList.add('added');
          // showToast('👍 Добавлено в избранное');
        } else {
          wishlist.splice(idx,1);
          btn.classList.remove('added');
          // showToast('Удалено из избранного');
        }
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistIcons();
      });
    });
    // Иконка в шапке ".fa-heart-o" — переход в избранное
    function bindWishlistHeaderIcon() {
      document.querySelectorAll('a, div, span, .qty, i').forEach(el => {
        if(!el) return; 
        // по id или по тексту внутри
        let matched = false;
        if ((el.id && el.id.includes('wishlist')) ||
            (el.innerText && el.innerText.trim().toLowerCase().includes('избранное')) ||
            (el.classList && (el.classList.contains('fa-heart')||el.classList.contains('fa-heart-o'))))
            { matched = true; }
        if (matched) {
          el.addEventListener('click', function(e) {
            // проверка — если внутри .header-ctn
            if (el.closest('.header-ctn')) {
              e.preventDefault();
              window.location.href = window.location.pathname.includes('pages') ? 'wishlist.html' : 'pages/wishlist.html';
            }
          });
        }
      });
    }
    document.addEventListener('DOMContentLoaded', function(){ bindWishlistHeaderIcon(); });

    function showToast(text) {
        const toast = document.createElement('div');
        toast.className = 'toast-mini';
        toast.textContent = text;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 1600);
    }
});
