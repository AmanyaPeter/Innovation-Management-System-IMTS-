var SortSystem = (function () {

  var sortState = {
    field: null,
    direction: null
  };

  function sortData(data, field, direction) {
    if (!field || !direction) return data;
    var sorted = data.slice().sort(function (a, b) {
      var valA = resolveValue(a, field);
      var valB = resolveValue(b, field);
      var cmp = compare(valA, valB);
      return direction === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }

  function compare(a, b) {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;

    if (typeof a === 'number' && typeof b === 'number') return a - b;

    var strA = String(a).toLowerCase();
    var strB = String(b).toLowerCase();

    if (isDate(strA) && isDate(strB)) {
      return new Date(strA) - new Date(strB);
    }

    if (strA < strB) return -1;
    if (strA > strB) return 1;
    return 0;
  }

  function isDate(str) {
    return /^\d{1,2}\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}$/i.test(str);
  }

  function toggleSort(field) {
    if (sortState.field === field) {
      if (sortState.direction === 'asc') {
        sortState.direction = 'desc';
      } else if (sortState.direction === 'desc') {
        sortState.field = null;
        sortState.direction = null;
      }
    } else {
      sortState.field = field;
      sortState.direction = 'asc';
    }
    return { field: sortState.field, direction: sortState.direction };
  }

  function resetSort() {
    sortState.field = null;
    sortState.direction = null;
  }

  function getSortState() {
    return { field: sortState.field, direction: sortState.direction };
  }

  function attachSort(headerSelector, dataProvider, columns, renderCallback) {
    var headers = document.querySelectorAll(headerSelector);
    headers.forEach(function (th, index) {
      var col = columns[index];
      if (!col || !col.sortKey) return;
      th.style.cursor = 'pointer';
      th.addEventListener('click', function () {
        var state = toggleSort(col.sortKey);
        dataProvider(function (allData) {
          var sorted = state.field ? sortData(allData, state.field, state.direction) : allData;
          renderCallback(sorted);
          updateHeaderIndicators(headers, columns, state);
        });
      });
    });
  }

  function updateHeaderIndicators(headers, columns, state) {
    headers.forEach(function (th, index) {
      var col = columns[index];
      var arrow = th.querySelector('.sort-arrow');
      if (arrow) arrow.remove();
      if (col && col.sortKey && col.sortKey === state.field) {
        var span = document.createElement('span');
        span.className = 'sort-arrow';
        span.style.cssText = 'margin-left:4px;font-size:11px;';
        span.textContent = state.direction === 'asc' ? '\u25B2' : '\u25BC';
        th.appendChild(span);
      }
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
    sortData: sortData,
    toggleSort: toggleSort,
    resetSort: resetSort,
    getSortState: getSortState,
    attachSort: attachSort
  };
})();
