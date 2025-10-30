(function(){
  'use strict';

  // ==== Настройки =====
  const PAGE_SIZE = 8;

  // ==== Данные товаров (пример, расширять по нужде) ====
  const PRODUCTS = [
    {id:'laptop1', name:'ASUS Zenbook 14 OLED UX3402', price:119990, oldPrice:139990, img:'../img/product01.png', category:'laptop', brand:'asus'},
    {id:'laptop2', name:'MSI Modern 14 C12', price:68100, oldPrice:73990, img:'../img/product03.png', category:'laptop', brand:'msi'},
    {id:'laptop3', name:'HP Pavilion 15', price:74990, img:'../img/product06.png', category:'laptop', brand:'hp'},
    {id:'laptop4', name:'Lenovo IdeaPad 5 14', price:62990, img:'../img/product08.png', category:'laptop', brand:'lenovo'},

    {id:'head1', name:'Sony WH-CH720N', price:9990, img:'../img/product02.png', category:'headphones', brand:'sony'},
    {id:'head2', name:'JBL Tune 510BT', price:3990, oldPrice:4990, img:'../img/product05.png', category:'headphones', brand:'jbl'},

    {id:'tablet1', name:'Apple iPad 10.9 (2022)', price:39990, oldPrice:45990, img:'../img/product04.png', category:'tablet', brand:'apple'},

    {id:'phone1', name:'Samsung Galaxy S23', price:79990, img:'../img/product07.png', category:'smartphone', brand:'samsung'},

    {id:'camera1', name:'Canon EOS R50', price:89800, oldPrice:96990, img:'../img/product09.png', category:'camera', brand:'canon'}
  ];
  let state = {page:1, filtered: PRODUCTS.slice()};

  function renderProducts(){
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    const start = (state.page-1)*PAGE_SIZE;
    const pageProducts = state.filtered.slice(start, start+PAGE_SIZE);
    if(pageProducts.length===0){
      grid.innerHTML = '<div class="col-md-12"><p style="font-size:20px;text-align:center;margin:48px 0;">Товаров больше нет</p></div>';
      return;
    }
    pageProducts.forEach(prod => {
      const el = document.createElement('div');
      el.className = 'col-md-3 col-xs-6';
      el.innerHTML = `
        <div class="product" data-id="${prod.id}" data-category="${prod.category}" data-brand="${prod.brand}" data-price="${prod.price}">
          <div class="product-img"><img src="${prod.img}" alt="${prod.name}">${prod.oldPrice?'<div class="product-label"><span class="sale">-30%</span></div>':''}</div>
          <div class="product-body">
            <p class="product-category">${categoryName(prod.category)}</p>
            <h3 class="product-name"><a href="#">${prod.name}</a></h3>
            <h4 class="product-price">${prod.price.toLocaleString('ru-RU')} ₽ ${prod.oldPrice?('<del class="product-old-price">'+prod.oldPrice.toLocaleString('ru-RU')+' ₽</del>'):''}</h4>
            <div class="product-rating">${'<i class="fa fa-star"></i>'.repeat(5)}</div>
            <div class="product-btns">
              <button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">в избранное</span></button>
            </div>
          </div>
          <div class="add-to-cart">
            <button class="add-to-cart-btn" data-id="${prod.id}" data-name="${prod.name}" data-price="${prod.price}" data-image="${prod.img}"><i class="fa fa-shopping-cart"></i> в корзину</button>
          </div>
        </div>`;
      grid.appendChild(el);
    });
    // Повторно инициализировать wishlist icon state (см. products.js)
    if(window.updateWishlistIcons) updateWishlistIcons();
  }

  function renderPagination(){
    const pag = document.getElementById('pagination');
    const total = Math.ceil(state.filtered.length / PAGE_SIZE) || 1;
    let html = '';
    for(let i=1;i<=total;i++){
      html += `<button class="btn btn-sm ${i===state.page?'btn-primary':'btn-default'}" style="margin:0 2px;" data-page="${i}">${i}</button>`;
    }
    pag.innerHTML = total>1 ? html : '';
    pag.querySelectorAll('button[data-page]').forEach(btn=>{
      btn.onclick = function(){
        state.page = parseInt(btn.getAttribute('data-page'));
        renderProducts();
        renderPagination();
        window.scrollTo({top:document.getElementById('store').offsetTop-30,behavior:'smooth'});
      }
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

  function applyFilters(){
    const cats = getCheckedValues('input[data-filter="category"]');
    const brands = getCheckedValues('input[data-filter="brand"]');
    const min = parseFloat(document.getElementById('price-min')?.value)||0;
    const max = parseFloat(document.getElementById('price-max')?.value)||Number.MAX_VALUE;
    const query = (document.getElementById('search-name')?.value||'').trim().toLowerCase();
    const onlySale = !!(document.getElementById('only-sale') && document.getElementById('only-sale').checked);
    state.filtered = PRODUCTS.filter(p => {
      const okC = !cats.length || cats.includes(p.category);
      const okB = !brands.length || brands.includes(p.brand);
      const okP = p.price>=min && p.price<=max;
      const okQ = !query || p.name.toLowerCase().includes(query);
      const okS = !onlySale || !!p.oldPrice;
      return okC && okB && okP && okQ && okS;
    });
    state.page=1;
    renderProducts();
    renderPagination();
  }
  function resetFilters(){
    document.querySelectorAll('input[data-filter]').forEach(i=>i.checked=false);
    var minEl=document.getElementById('price-min'); if(minEl) minEl.value='';
    var maxEl=document.getElementById('price-max'); if(maxEl) maxEl.value='';
    var qEl=document.getElementById('search-name'); if(qEl) qEl.value='';
    state.filtered = PRODUCTS.slice();
    state.page=1;
    renderProducts();
    renderPagination();
  }

  document.addEventListener('DOMContentLoaded', function(){
    var wantSale = (window.location.hash === '#sale');
    resetFilters();
    if (wantSale){
      var saleCb = document.getElementById('only-sale');
      if (saleCb) saleCb.checked = true;
      applyFilters();
    }
    const filterBtn = document.getElementById('filter-apply-btn'); if (filterBtn) filterBtn.onclick = applyFilters;
    const resetBtn = document.getElementById('filter-reset-btn'); if (resetBtn) resetBtn.onclick = resetFilters;
    ['price-min','price-max','search-name'].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('keypress',function(e){if(e.key==='Enter')applyFilters();}); });
    var saleCb2 = document.getElementById('only-sale'); if (saleCb2) saleCb2.addEventListener('change', applyFilters);
  });

  // Помощник для checkboxes, category и brand
  function getCheckedValues(selector){
    return Array.prototype.slice.call(document.querySelectorAll(selector+':checked')).map(i=>i.value);
  }

})();


