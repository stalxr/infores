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
    document.querySelectorAll('.add-to-wishlist').forEach(btn => {
        btn.addEventListener('click', function(){
            const id = btn.dataset.id;
            let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            const idx = wishlist.indexOf(id);
            if (idx === -1) {
                wishlist.push(id);
                btn.textContent = '❤';
                btn.classList.add('added');
                showToast('👍 Добавлено в избранное');
            } else {
                wishlist.splice(idx,1);
                btn.textContent = '❤';
                btn.classList.remove('added');
                showToast('Удалено из избранного');
            }
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        });
    });

    function showToast(text) {
        const toast = document.createElement('div');
        toast.className = 'toast-notify';
        toast.textContent = text;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }
});
