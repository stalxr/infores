(function(){
  'use strict';

  const PRODUCTS = [
    {id:'laptop1', name:'ASUS Zenbook 14 OLED UX3402', price:119990, img:'../img/product01.png', category:'laptop', brand:'asus'},
    {id:'laptop2', name:'MSI Modern 14 C12', price:68100, img:'../img/product03.png', category:'laptop', brand:'msi'},
    {id:'laptop3', name:'HP Pavilion 15', price:74990, img:'../img/product06.png', category:'laptop', brand:'hp'},
    {id:'laptop4', name:'Lenovo IdeaPad 5 14', price:62990, img:'../img/product08.png', category:'laptop', brand:'lenovo'},
    {id:'head1', name:'Sony WH-CH720N', price:9990, img:'../img/product02.png', category:'headphones', brand:'sony'},
    {id:'head2', name:'JBL Tune 510BT', price:3990, img:'../img/product05.png', category:'headphones', brand:'jbl'},
    {id:'tablet1', name:'Apple iPad 10.9 (2022)', price:39990, img:'../img/product04.png', category:'tablet', brand:'apple'},
    {id:'phone1', name:'Samsung Galaxy S23', price:79990, img:'../img/product07.png', category:'smartphone', brand:'samsung'},
    {id:'camera1', name:'Canon EOS R50', price:89800, img:'../img/product09.png', category:'camera', brand:'canon'}
  ];
  function updateWishlistQty() {
    let qty = 0;
    try { qty = JSON.parse(localStorage.getItem('wishlist')||'[]').length; } catch(e){}
    document.querySelectorAll('#wishlist-qty').forEach(el=>{el.textContent = qty;});
  }
  function renderWishlist(){
    const wishGrid = document.getElementById('wish-grid');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')||'[]');
    updateWishlistQty();
    if(!wishGrid) return;
    if(!wishlist.length){
      wishGrid.innerHTML = `<div class='col-md-12 text-center' style='margin:40px 0;'>
        <h3 style='color:#888;margin-bottom:24px;'>Ваш список избранного пуст</h3>
        <a href='store.html' class='btn btn-primary btn-lg'>Посмотреть каталог</a>
      </div>`;
      return;
    }
    wishGrid.innerHTML = '';
    wishlist.forEach(id=>{
      const prod = PRODUCTS.find(p=>p.id===id);
      if(!prod) return;
      const col = document.createElement('div');
      col.className = 'col-md-3 col-xs-6';
      col.innerHTML = `
        <div class="product" data-id="${prod.id}" data-category="${prod.category}" data-brand="${prod.brand}" data-price="${prod.price}" style="position:relative;">
          <button type="button" class="wish-delete" data-wish-remove="${prod.id}" title="Удалить" style="position:absolute;right:8px;top:8px;border:0;background:#eee;color:#444;width:24px;height:24px;border-radius:50%;line-height:24px;text-align:center;cursor:pointer">×</button>
          <div class="product-img"><img src="${prod.img}" alt="${prod.name}"></div>
          <div class="product-body">
            <p class="product-category">${categoryName(prod.category)}</p>
            <h3 class="product-name"><a href="#">${prod.name}</a></h3>
            <h4 class="product-price">${prod.price.toLocaleString('ru-RU')} ₽</h4>
            <div class="product-rating">${'<i class="fa fa-star"></i>'.repeat(5)}</div>
          </div>
          <div class="add-to-cart">
            <button class="add-to-cart-btn" data-id="${prod.id}" data-name="${prod.name}" data-price="${prod.price}" data-image="${prod.img}"><i class="fa fa-shopping-cart"></i> в корзину</button>
          </div>
        </div>`;
      wishGrid.appendChild(col);
    });
  }
  function categoryName(val){
    if(val==='laptop') return 'Ноутбуки';
    if(val==='headphones') return 'Наушники';
    if(val==='tablet') return 'Планшеты';
    if(val==='smartphone') return 'Смартфоны';
    if(val==='camera') return 'Камеры';
    return val;
  }
  document.addEventListener('DOMContentLoaded', function(){
    const wishGrid = document.getElementById('wish-grid');
    renderWishlist();
    updateWishlistQty();
    if (wishGrid && !wishGrid._wishDelBound){
      wishGrid.addEventListener('click', function(e){
        var del = e.target.closest && e.target.closest('.wish-delete');
        if (!del) return;
        e.preventDefault();
        e.stopPropagation();
        let wishlist = JSON.parse(localStorage.getItem('wishlist')||'[]');
        const id = del.getAttribute('data-wish-remove');
        wishlist = wishlist.filter(x=>x!==id);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        renderWishlist();
        updateWishlistQty();
        if (window.updateWishlistIcons) window.updateWishlistIcons();
      });
      // fallback on document level just in case
      document.addEventListener('click', function(e){
        if (!document.getElementById('wish-grid')) return;
        var del = e.target.closest && e.target.closest('.wish-delete');
        if (!del) return;
        e.preventDefault();
        let wishlist = JSON.parse(localStorage.getItem('wishlist')||'[]');
        const id = del.getAttribute('data-wish-remove');
        wishlist = wishlist.filter(x=>x!==id);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        renderWishlist();
        updateWishlistQty();
        if (window.updateWishlistIcons) window.updateWishlistIcons();
      }, false);
      wishGrid._wishDelBound = true;
    }
    const clearBtn = document.getElementById('wishlist-clear-all');
    if(clearBtn) clearBtn.onclick = function(){
      localStorage.setItem('wishlist','[]');
      renderWishlist();
      updateWishlistQty();
      if(window.updateWishlistIcons) window.updateWishlistIcons();
    };
  });
})();


