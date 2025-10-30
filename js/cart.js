(function(){
  'use strict';

  function readCart(){
    try { return JSON.parse(localStorage.getItem('electro_cart')) || []; } catch(e){ return []; }
  }
  function writeCart(cart){ localStorage.setItem('electro_cart', JSON.stringify(cart)); }
  function format(amount){ return '₽' + Number(amount).toFixed(2); }

  function addToCart(item){
    var cart = readCart();
    var existing = cart.find(function(x){return x.id === item.id;});
    if (existing){ existing.qty += item.qty; }
    else { cart.push(item); }
    writeCart(cart);
    renderHeaderCart();
  }

  function removeFromCart(id){
    var cart = readCart().filter(function(x){return x.id !== id;});
    writeCart(cart);
    renderHeaderCart();
  }

  function renderHeaderCart(){
    var cart = readCart();
    var qtyEl = document.getElementById('cart-qty');
    var listEl = document.getElementById('cart-list');
    var itemsCountEl = document.getElementById('cart-items-count');
    var totalEl = document.getElementById('cart-total');
    if (!qtyEl || !listEl) return; // Не на всех страницах есть шапка
    var totalQty = cart.reduce(function(s,i){return s + i.qty;}, 0);
    var total = cart.reduce(function(s,i){return s + i.qty * i.price;}, 0);
    qtyEl.textContent = String(totalQty);
    if (itemsCountEl) itemsCountEl.textContent = totalQty + ' товаров';
    if (totalEl) totalEl.textContent = format(total);
    listEl.innerHTML = '';
    cart.forEach(function(item){
      var w = document.createElement('div');
      w.className = 'product-widget';
      w.innerHTML = '<div class="product-img"><img src="'+item.image+'" alt=""></div>'+
        '<div class="product-body">'+
          '<h3 class="product-name"><a href="#">'+item.name+'</a></h3>'+
          '<h4 class="product-price"><span class="qty">'+item.qty+'x</span>'+format(item.price)+'</h4>'+
        '</div>'+
        '<button class="delete" data-remove="'+item.id+'"><i class="fa fa-close"></i></button>';
      listEl.appendChild(w);
    });
    // делегирование удаления вынесено глобально
  }

  function bindAddToCartButtons(){
    document.body.addEventListener('click', function(e){
      var btn = e.target.closest('.add-to-cart-btn');
      if (!btn) return;
      // Гейт: только после регистрации
      try {
        var user = JSON.parse(localStorage.getItem('electro_user')||'null');
        if (!user){
          alert('Для добавления в корзину войдите или зарегистрируйтесь');
          window.location.href = 'pages/auth.html';
          return;
        }
      } catch(_) {}
      var product = btn.closest('.product');
      var id = btn.getAttribute('data-id');
      var name = btn.getAttribute('data-name');
      var priceAttr = btn.getAttribute('data-price');
      var image = btn.getAttribute('data-image');
      if (!name && product){
        var nameA = product.querySelector('.product-name a');
        name = nameA ? nameA.textContent.trim() : 'Товар';
      }
      if (!image && product){
        var imgEl = product.querySelector('.product-img img');
        image = imgEl ? imgEl.getAttribute('src') : '';
      }
      var price = 0;
      if (priceAttr) price = parseFloat(priceAttr);
      else if (product){
        var priceEl = product.querySelector('.product-price');
        if (priceEl){
          var txt = priceEl.textContent.replace(/[^0-9.,]/g,'').replace(',', '.');
          price = parseFloat(txt) || 0;
        }
      }
      if (!id){
        id = (name || 'product') + '-' + Math.random().toString(36).slice(2,7);
      }
      addToCart({ id: id, name: name, price: price, image: image || '', qty: 1 });
    });
    // глобальное удаление из корзины
    document.body.addEventListener('click', function(e){
      var del = e.target.closest('[data-remove]');
      if (!del) return;
      var id = del.getAttribute('data-remove');
      if (!id) return;
      removeFromCart(id);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    const cartBlock = document.getElementById('cart-list');
    const emptyBlock = document.getElementById('cart-empty');
    const authBlock = document.getElementById('cart-auth-required');
    const cartTotal = document.getElementById('cart-total');
    // Проверка авторизации (пример — можно поменять под свою auth)
    let logged = localStorage.getItem('userLogged');
    if(!logged){
        emptyBlock.style.display = 'none';
        authBlock.style.display = 'block';
        cartBlock.innerHTML = '';
        return;
    }
    authBlock.style.display = 'none';
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if(!cart.length){
        emptyBlock.style.display = 'block';
        cartBlock.innerHTML = '';
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
    let total = 0;
    cart.forEach(id=>{
        const prod = products.find(p=>p.id===id);
        if(!prod)return;
        html += `<div class="product-card" data-id="${prod.id}">
            <img src="${prod.img}" alt="${prod.name}">
            <h4>${prod.name}</h4>
            <p class="price">${prod.price.toLocaleString()} ₽</p>
        </div>`;
        total+=prod.price;
    });
    cartBlock.innerHTML = html;
    cartTotal.textContent = total.toLocaleString()+ ' ₽';
});
})();


