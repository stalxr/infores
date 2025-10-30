(function(){
  'use strict';

  function getCheckedValues(selector){
    return Array.prototype.slice.call(document.querySelectorAll(selector+':checked')).map(function(i){return i.value;});
  }

  function applyFilters(){
    var cats = getCheckedValues('input[data-filter="category"]');
    var brands = getCheckedValues('input[data-filter="brand"]');
    var min = parseFloat(document.getElementById('price-min') && document.getElementById('price-min').value) || 0;
    var max = parseFloat(document.getElementById('price-max') && document.getElementById('price-max').value) || Number.MAX_VALUE;
    var products = document.querySelectorAll('#products-grid .product');
    var anyVisible = false;
    products.forEach(function(p){
      var pc = p.getAttribute('data-category');
      var pb = p.getAttribute('data-brand');
      var pp = parseFloat(p.getAttribute('data-price')) || 0;
      var okCat = !cats.length || cats.indexOf(pc) !== -1;
      var okBrand = !brands.length || brands.indexOf(pb) !== -1;
      var okPrice = pp >= min && pp <= max;
      var show = (okCat && okBrand && okPrice);
      p.parentElement.style.display = show ? '' : 'none';
      if (show) anyVisible = true;
    });
    var grid = document.getElementById('products-grid');
    if (!grid) return;
    var emptyId = 'products-empty';
    var empty = document.getElementById(emptyId);
    if (!anyVisible) {
      if (!empty){
        empty = document.createElement('div');
        empty.id = emptyId;
        empty.textContent = 'Товаров пока нет';
        empty.style.padding = '20px';
        empty.style.fontWeight = '600';
        grid.appendChild(empty);
      }
    } else if (empty) {
      empty.remove();
    }
  }

  function sortProducts(){
    var select = document.getElementById('sort-select');
    if (!select) return;
    var grid = document.getElementById('products-grid');
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.col-md-4.col-xs-6'));
    var mode = select.value;
    cards.sort(function(a,b){
      var pa = parseFloat(a.querySelector('.product').getAttribute('data-price'))||0;
      var pb = parseFloat(b.querySelector('.product').getAttribute('data-price'))||0;
      if (mode === 'price-asc') return pa - pb;
      if (mode === 'price-desc') return pb - pa;
      return 0;
    });
    cards.forEach(function(c){ grid.appendChild(c); });
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('input[data-filter]').forEach(function(i){ i.addEventListener('change', applyFilters); });
    var min = document.getElementById('price-min');
    var max = document.getElementById('price-max');
    if (min) min.addEventListener('change', applyFilters);
    if (max) max.addEventListener('change', applyFilters);
    var sort = document.getElementById('sort-select');
    if (sort) sort.addEventListener('change', sortProducts);
  });
})();


