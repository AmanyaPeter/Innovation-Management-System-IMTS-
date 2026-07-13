var SearchSystem = (function () {

  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var args = arguments;
      var ctx = this;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
    };
  }

  function filterData(data, query, fields) {
    if (!query || !query.trim()) return data;
    var q = query.toLowerCase().trim();
    return data.filter(function (item) {
      return fields.some(function (field) {
        var val = resolveValue(item, field);
        return val != null && String(val).toLowerCase().indexOf(q) !== -1;
      });
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

  function attachSearch(inputSelector, dataProvider, fields, renderCallback) {
    var input = typeof inputSelector === 'string' ? document.querySelector(inputSelector) : inputSelector;
    if (!input) return;

    var handler = debounce(function () {
      dataProvider(function (allData) {
        var filtered = filterData(allData, input.value, fields);
        renderCallback(filtered);
      });
    }, 200);

    input.addEventListener('input', handler);
  }

  return {
    filterData: filterData,
    attachSearch: attachSearch,
    debounce: debounce
  };
})();
