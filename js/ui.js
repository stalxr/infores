(function(){
  'use strict';

  function ensureModal(){
    var m = document.getElementById('quickview-modal');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'quickview-modal';
    m.style.position='fixed'; m.style.left='0'; m.style.top='0'; m.style.right='0'; m.style.bottom='0';
    m.style.background='rgba(0,0,0,0.6)'; m.style.display='none'; m.style.zIndex='9999';
    m.innerHTML = '<div style="background:#fff;max-width:720px;margin:5% auto;padding:20px;position:relative">'+
      '<button id="qv-close" style="position:absolute;right:10px;top:10px;border:0;background:transparent;font-size:22px">×</button>'+ 
      '<div style="display:flex;gap:20px;align-items:flex-start">'+
        '<img id="qv-image" src="" style="max-width:300px;max-height:300px;object-fit:contain">'+
        '<div><h3 id="qv-name"></h3><div id="qv-price" style="font-weight:600;margin:10px 0"></div><div id="qv-desc">Быстрый просмотр товара</div></div>'+
      '</div></div>';
    document.body.appendChild(m);
    m.addEventListener('click', function(e){ if (e.target.id==='quickview-modal' || e.target.id==='qv-close') m.style.display='none'; });
    return m;
  }

  function openQuickView(source){
    var modal = ensureModal();
    var product = source.closest('.product');
    if (!product) return;
    var img = product.querySelector('.product-img img');
    var name = product.querySelector('.product-name a');
    var price = product.querySelector('.product-price');
    document.getElementById('qv-image').src = img ? img.getAttribute('src') : '';
    document.getElementById('qv-name').textContent = name ? name.textContent : 'Товар';
    document.getElementById('qv-price').textContent = price ? price.textContent : '';
    var desc = product.getAttribute('data-desc') || 'Быстрый просмотр товара';
    var descEl = document.getElementById('qv-desc');
    if (descEl) descEl.textContent = desc;
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


