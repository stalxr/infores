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
    const wishlistBlock = document.getElementById('wishlist-list');
    const emptyBlock = document.getElementById('wishlist-empty');
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if(!wishlist.length){
        emptyBlock.style.display = 'block';
        wishlistBlock.innerHTML = '';
        return;
    }else{
        emptyBlock.style.display = 'none';
    }
    // Пример набора товаров, синхронизируем с products
    const products = [
        {id:'laptop1', name:'Ноутбук ASUS Zenbook 14 OLED', price:119990, img:'img/product01.png'},
        {id:'laptop2', name:'Ноутбук Apple MacBook Air 13"', price:99990, img:'img/product02.png'},
        {id:'smart1', name:'Смартфон Samsung Galaxy S24', price:79990, img:'img/product03.png'},
        {id:'smart2', name:'Смартфон Xiaomi 14 Pro', price:69990, img:'img/product04.png'},
        {id:'head1', name:'Наушники Sony WH-1000XM5', price:38990, img:'img/product05.png'},
        {id:'head2', name:'Наушники JBL Tune 770NC', price:9990, img:'img/product06.png'},
        {id:'camera1', name:'Фотоаппарат Canon EOS R50', price:74990, img:'img/product07.png'},
        {id:'camera2', name:'Камера Sony ZV-E10', price:67990, img:'img/product08.png'},
        {id:'acc1', name:'Портативная колонка JBL Charge 5', price:12990, img:'img/product09.png'},
        {id:'acc2', name:'Беспроводная мышь Logitech M185', price:1290, img:'img/product01.png'},
    ];
    let html = '';
    wishlist.forEach(id=>{
        const prod = products.find(p=>p.id===id);
        if(!prod)return;
        html += `<div class="product-card" data-id="${prod.id}">
            <img src="${prod.img}" alt="${prod.name}">
            <h4>${prod.name}</h4>
            <p class="price">${prod.price.toLocaleString()} ₽</p>
            <button class="add-to-cart" data-id="${prod.id}">В корзину</button>
        </div>`;
    });
    wishlistBlock.innerHTML = html;
    // обработка кнопок "В корзину"
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
  });
})();


