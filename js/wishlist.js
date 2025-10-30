(function(){
  'use strict';

  // Массив всех товаров (или импортировать PRODUCTS из store.js)
  const PRODUCTS = [
    {id:'laptop1', name:'ASUS Zenbook 14 OLED', price:119990, img:'../img/product01.png', category:'laptop', brand:'asus'},
    {id:'laptop2', name:'Dell Inspiron 15', price:87600, img:'../img/product02.png', category:'laptop', brand:'dell'},
    {id:'laptop3', name:'MSI Modern 14', price:68100, img:'../img/product03.png', category:'laptop', brand:'msi'},
    {id:'laptop4', name:'Apple MacBook Air 13"', price:99900, img:'../img/product04.png', category:'laptop', brand:'apple'},
    {id:'smart1', name:'Samsung Galaxy S24', price:79990, img:'../img/product05.png', category:'smartphone', brand:'samsung'},
    {id:'smart2', name:'Realme 11 Pro', price:45500, img:'../img/product06.png', category:'smartphone', brand:'realme'},
    {id:'smart3', name:'Xiaomi 14 Pro', price:59870, img:'../img/product07.png', category:'smartphone', brand:'xiaomi'},
    {id:'smart4', name:'Honor 90 Lite', price:29990, img:'../img/product08.png', category:'smartphone', brand:'honor'},
    {id:'camera1', name:'Canon EOS R50', price:89800, img:'../img/product09.png', category:'camera', brand:'canon'},
    {id:'camera2', name:'Sony ZV-E10', price:62910, img:'../img/product01.png', category:'camera', brand:'sony'},
    {id:'camera3', name:'Nikon Z30', price:71340, img:'../img/product02.png', category:'camera', brand:'nikon'},
    {id:'camera4', name:'Panasonic Lumix G7', price:61500, img:'../img/product03.png', category:'camera', brand:'panasonic'},
    {id:'acc1', name:'Мышь Logitech M650', price:2480, img:'../img/product04.png', category:'accessory', brand:'logitech'},
    {id:'acc2', name:'Клавиатура Redragon Shiva', price:3990, img:'../img/product05.png', category:'accessory', brand:'redragon'},
    {id:'acc3', name:'Наушники Sony WH-CH520', price:6500, img:'../img/product06.png', category:'accessory', brand:'sony'},
    {id:'acc4', name:'Колонка JBL Go 3', price:3799, img:'../img/product07.png', category:'accessory', brand:'jbl'}
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
    if(!wishlist.length){
      wishGrid.innerHTML = `<div class='col-md-12 text-center' style='margin:40px 0;'>
        <h3 style='color:#888;margin-bottom:24px;'><i class='fa fa-heart-o fa-2x' style='margin-bottom:18px;color:#fa4b53'></i><br>Ваш список избранного пуст</h3>
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
        <div class="product" data-id="${prod.id}" data-category="${prod.category}" data-brand="${prod.brand}" data-price="${prod.price}">
          <div class="product-img"><img src="${prod.img}" alt="${prod.name}"></div>
          <div class="product-body">
            <p class="product-category">${categoryName(prod.category)}</p>
            <h3 class="product-name"><a href="#">${prod.name}</a></h3>
            <h4 class="product-price">${prod.price.toLocaleString('ru-RU')} ₽</h4>
            <div class="product-rating">${'<i class="fa fa-star"></i>'.repeat(5)}</div>
            <div class="product-btns">
              <button class="remove-from-wishlist"><i class="fa fa-heart"></i><span class="tooltipp">удалить</span></button>
            </div>
          </div>
          <div class="add-to-cart">
            <button class="add-to-cart-btn" data-id="${prod.id}" data-name="${prod.name}" data-price="${prod.price}" data-image="${prod.img}"><i class="fa fa-shopping-cart"></i> в корзину</button>
            </div>
        </div>`;
      wishGrid.appendChild(col);
    });
    wishGrid.querySelectorAll('.remove-from-wishlist').forEach(btn=>{
      btn.onclick = function(){
        const par = btn.closest('.product');
        if(!par)return;
        let wishlist = JSON.parse(localStorage.getItem('wishlist')||'[]');
        const id = par.getAttribute('data-id');
        wishlist = wishlist.filter(x=>x!==id);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        renderWishlist();
        if(window.updateWishlistIcons) window.updateWishlistIcons();
      };
    });
    // корзина может реализовываться отдельно
  }
  function categoryName(val){
    if(val==='laptop') return 'Ноутбуки';
    if(val==='smartphone') return 'Смартфоны';
    if(val==='camera') return 'Камеры';
    if(val==='accessory') return 'Аксессуары';
    return val;
  }
  document.addEventListener('DOMContentLoaded', function(){
    renderWishlist();
    updateWishlistQty();
    const clearBtn = document.getElementById('wishlist-clear-all');
    if(clearBtn) clearBtn.onclick = function(){
      localStorage.setItem('wishlist','[]');
      renderWishlist();
      if(window.updateWishlistIcons) window.updateWishlistIcons();
    };
  });
  // Счетчик обновляется на любых страницах
  setInterval(updateWishlistQty, 2000);
})();


