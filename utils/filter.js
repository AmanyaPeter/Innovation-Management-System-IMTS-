var FilterSystem = (function () {

  var activeFilters = {};

  function filterData(data, filters) {
    if (!filters || !Object.keys(filters).length) return data;
    return data.filter(function (item) {
      return Object.keys(filters).every(function (key) {
        var filterVal = filters[key];
        if (filterVal == null || filterVal === '' || filterVal === 'all') return true;
        var itemVal = resolveValue(item, key);
        return String(itemVal).toLowerCase() === String(filterVal).toLowerCase();
      });
    });
  }

  function setFilter(key, value) {
    if (value == null || value === '' || value === 'all') {
      delete activeFilters[key];
    } else {
      activeFilters[key] = value;
    }
  }

  function clearFilters() {
    activeFilters = {};
  }

  function getFilters() {
    var copy = {};
    Object.keys(activeFilters).forEach(function (k) { copy[k] = activeFilters[k]; });
    return copy;
  }

  function attachFilter(selectSelector, filterKey, dataProvider, renderCallback) {
    var select = typeof selectSelector === 'string' ? document.querySelector(selectSelector) : selectSelector;
    if (!select) return;
    select.addEventListener('change', function () {
      setFilter(filterKey, this.value);
      dataProvider(function (allData) {
        renderCallback(filterData(allData, getFilters()));
      });
    });
  }

  function attachMultiple(selectors, dataProvider, renderCallback) {
    var selects = [];
    selectors.forEach(function (cfg) {
      var el = document.querySelector(cfg.selector);
      if (el) {
        selects.push(el);
        el.addEventListener('change', function () {
          selects.forEach(function (s, i) {
            setFilter(selectors[i].filterKey, s.value);
          });
          dataProvider(function (allData) {
            renderCallback(filterData(allData, getFilters()));
          });
        });
      }
    });
  }

  function populateSelect(selectSelector, options, placeholder) {
    var select = typeof selectSelector === 'string' ? document.querySelector(selectSelector) : selectSelector;
    if (!select) return;
    select.innerHTML = '';
    if (placeholder) {
      var opt = document.createElement('option');
      opt.value = '';
      opt.textContent = placeholder;
      select.appendChild(opt);
    }
    options.forEach(function (o) {
      var opt = document.createElement('option');
      opt.value = o.value || o;
      opt.textContent = o.label || o;
      select.appendChild(opt);
    });
  }

  function resolveValue(obj, key) {
    var parts = key.split('.');
    var val = obj;
    for (var i = 0; i < parts.length; i++) {
      if (val == null) return '';
      val = val[parts[i]];
    }
    return val == null ? '' : val;
  }

  return {
    filterData: filterData,
    setFilter: setFilter,
    clearFilters: clearFilters,
    getFilters: getFilters,
    attachFilter: attachFilter,
    attachMultiple: attachMultiple,
    populateSelect: populateSelect
  };
})();
