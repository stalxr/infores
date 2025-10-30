(function(){
  'use strict';

  function ensureModal(){
    var m = document.getElementById('quickview-modal');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'quickview-modal';
    m.style.position='fixed'; m.style.left='0'; m.style.top='0'; m.style.right='0'; m.style.bottom='0';
    m.style.background='rgba(0,0,0,0.6)'; m.style.display='none'; m.style.zIndex='9999';
    m.innerHTML = '
      <div style="background:#fff;max-width:860px;margin:5% auto;padding:24px 24px 18px;position:relative;border-radius:10px;box-shadow:0 18px 48px rgba(0,0,0,0.25);">
        <button id="qv-close" style="position:absolute;right:12px;top:10px;border:0;background:transparent;font-size:24px;line-height:1;cursor:pointer">×</button>
        <div id="qv-price-badge" style="position:absolute;right:16px;top:16px;color:#d32f2f;font-weight:700;font-size:18px"></div>
        <div style="display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap;">
          <img id="qv-image" src="" style="max-width:320px;max-height:320px;object-fit:contain;border-radius:8px;border:1px solid #eee">
          <div style="flex:1 1 280px;min-width:260px">
            <h3 id="qv-name" style="margin:0 0 10px;font-size:20px;font-weight:700"></h3>
            <div id="qv-specs" style="margin:8px 0 6px;">
            </div>
          </div>
        </div>
      </div>';
    document.body.appendChild(m);
    m.addEventListener('click', function(e){ if (e.target.id==='quickview-modal' || e.target.id==='qv-close') m.style.display='none'; });
    return m;
  }

  function parseFileName(src){
    if (!src) return '';
    try { return src.split('/').pop().toLowerCase(); } catch(_) { return src; }
  }

  function getQuickDataByImage(file){
    var map = {
      'product01.png': { name: 'ASUS Zenbook 14 OLED UX3402', price: '119 990 ₽', specs: ['14" OLED, 2880×1800, 90Гц','Intel Core i7','16 ГБ RAM, 512 ГБ SSD','Время работы до 10 ч','Вес 1.39 кг'] },
      'product02.png': { name: 'Sony WH-CH720N', price: '9 990 ₽', specs: ['Bluetooth 5.2, ANC','До 35 ч автономности','Быстрая зарядка','Вес 192 г','Кодеки AAC/SBC'] },
      'product03.png': { name: 'MSI Modern 14 C12', price: '68 100 ₽', specs: ['14" IPS, FHD','Intel Core i5','16 ГБ RAM, 512 ГБ SSD','Подсветка клавиатуры','Вес 1.4 кг'] },
      'product04.png': { name: 'Apple iPad 10.9 (2022)', price: '39 990 ₽', specs: ['10.9" Liquid Retina','Чип A14 Bionic','Wi‑Fi, USB‑C','Поддержка Apple Pencil','Вес 477 г'] },
      'product05.png': { name: 'JBL Tune 510BT', price: '3 990 ₽', specs: ['Bluetooth 5.0','До 40 ч автономности','Зарядка USB‑C','Складная конструкция','Лёгкий корпус'] },
      'product06.png': { name: 'HP Pavilion 15', price: '74 990 ₽', specs: ['15.6" IPS, FHD','AMD Ryzen 5','16 ГБ RAM, 512 ГБ SSD','Wi‑Fi 6, BT 5.2','Подсветка клавиш'] },
      'product07.png': { name: 'Samsung Galaxy S23', price: '79 990 ₽', specs: ['6.1" AMOLED 120Гц','Snapdragon 8 Gen 2','8/128 ГБ','Камера 50 МП','Батарея 3900 мА·ч'] },
      'product08.png': { name: 'Lenovo IdeaPad 5 14', price: '62 990 ₽', specs: ['14" IPS, FHD','Intel Core i5','16 ГБ RAM, 512 ГБ SSD','Читатель отпечатка','Вес 1.38 кг'] },
      // дубликат product08.png как фотоаппарат — используем другое имя файла при необходимости
    };
    return map[file] || null;
  }

  function buildSpecsHtml(specs){
    if (!specs || !specs.length) return '<p style="color:#666">Характеристики уточняются</p>';
    return '<ul style="margin:8px 0 0 18px;padding:0;color:#333;">'+
      specs.map(function(s){return '<li style="margin:3px 0;">'+s+'</li>';}).join('')+
      '</ul>';
  }

  function openQuickView(source){
    var modal = ensureModal();
    var product = source.closest('.product');
    if (!product) return;
    var img = product.querySelector('.product-img img');
    var nameEl = product.querySelector('.product-name a');
    var priceEl = product.querySelector('.product-price');

    var src = img ? img.getAttribute('src') : '';
    var file = parseFileName(src);
    var mapped = getQuickDataByImage(file);

    var displayName = mapped ? mapped.name : (nameEl ? nameEl.textContent : 'Товар');
    var displayPrice = mapped ? mapped.price : (priceEl ? priceEl.textContent : '');
    var displaySpecs = mapped ? mapped.specs : [];

    document.getElementById('qv-image').src = src || '';
    document.getElementById('qv-name').textContent = displayName;
    document.getElementById('qv-price-badge').textContent = displayPrice;
    var specsEl = document.getElementById('qv-specs');
    if (specsEl) specsEl.innerHTML = buildSpecsHtml(displaySpecs);

    modal.style.display='block';
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.body.addEventListener('click', function(e){
      var btn = e.target.closest('.quick-view');
      if (!btn) return;
      e.preventDefault();
      openQuickView(btn);
    });
  });
})();


