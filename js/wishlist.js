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
    const wishlistBlock = document.getElementById('wish-grid') || document.getElementById('wishlist-list');
    if(!wishlistBlock) return;
    
    // Массив всех товаров каталога
    const products = [
        {id:'laptop1', name:'ASUS Zenbook 14 OLED', price:119990, img:'../img/product01.png'},
        {id:'laptop2', name:'Dell Inspiron 15', price:87600, img:'../img/product02.png'},
        {id:'laptop3', name:'MSI Modern 14', price:68100, img:'../img/product03.png'},
        {id:'laptop4', name:'Apple MacBook Air 13"', price:99900, img:'../img/product04.png'},

        {id:'smart1', name:'Samsung Galaxy S24', price:79990, img:'../img/product05.png'},
        {id:'smart2', name:'Realme 11 Pro', price:45500, img:'../img/product06.png'},
        {id:'smart3', name:'Xiaomi 14 Pro', price:59870, img:'../img/product07.png'},
        {id:'smart4', name:'Honor 90 Lite', price:29990, img:'../img/product08.png'},

        {id:'camera1', name:'Canon EOS R50', price:89800, img:'../img/product09.png'},
        {id:'camera2', name:'Sony ZV-E10', price:62910, img:'../img/product01.png'},
        {id:'camera3', name:'Nikon Z30', price:71340, img:'../img/product02.png'},
        {id:'camera4', name:'Panasonic Lumix G7', price:61500, img:'../img/product03.png'},

        {id:'acc1', name:'Мышь Logitech M650', price:2480, img:'../img/product04.png'},
        {id:'acc2', name:'Клавиатура Redragon Shiva', price:3990, img:'../img/product05.png'},
        {id:'acc3', name:'Наушники Sony WH-CH520', price:6500, img:'../img/product06.png'},
        {id:'acc4', name:'Колонка JBL Go 3', price:3799, img:'../img/product07.png'},
    ];
    
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if(!wishlist.length){
        wishlistBlock.innerHTML = '<div class="col-md-12"><p style="font-size:21px;margin:35px 0;">Ваш список избранного пуст 😔</p></div>';
        return;
    }
    let html = '';
    wishlist.forEach(id=>{
        const prod = products.find(p=>p.id===id);
        if(!prod)return;
        html += `<div class="col-md-3 col-xs-6">
            <div class="product-card">
                <img src="${prod.img}" alt="${prod.name}">
                <h4>${prod.name}</h4>
                <p class="price">${prod.price.toLocaleString('ru-RU')} ₽</p>
                <button class="add-to-cart" data-id="${prod.id}">В корзину</button>
                <button class="remove-from-wishlist" data-id="${prod.id}">Удалить</button>
            </div>
        </div>`;
    });
    wishlistBlock.innerHTML = html;
    // Добавить в корзину из избранного
    wishlistBlock.querySelectorAll('.add-to-cart').forEach(btn=>{
        btn.addEventListener('click', function(){
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const id = btn.dataset.id;
            if(!cart.includes(id)){
                cart.push(id);
                localStorage.setItem('cart', JSON.stringify(cart));
                btn.textContent = 'Добавлено в корзину';
            }else{
                btn.textContent = 'Уже в корзине';
            }
        });
    });
    // Удалить из избранного
    wishlistBlock.querySelectorAll('.remove-from-wishlist').forEach(btn=>{
        btn.addEventListener('click', function(){
            wishlist = wishlist.filter(id2=>id2!==btn.dataset.id);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            btn.closest('.col-md-3').remove();
            if (wishlist.length === 0) wishlistBlock.innerHTML = '<div class="col-md-12"><p style="font-size:21px;margin:35px 0;">Ваш список избранного пуст 😔</p></div>';
        });
    });
});
})();


