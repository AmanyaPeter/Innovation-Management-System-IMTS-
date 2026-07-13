var TableSystem = (function () {

  function renderTable(data, columns, container, options) {
    options = options || {};
    container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!container) return;

    var table = document.createElement('table');
    table.className = 'data-table';

    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    columns.forEach(function (col) {
      var th = document.createElement('th');
      th.textContent = col.label;
      headerRow.appendChild(th);
    });
    if (options.actions && options.actions.length) {
      var th = document.createElement('th');
      th.textContent = 'Actions';
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');

    if (!data || !data.length) {
      var emptyRow = document.createElement('tr');
      var colspan = columns.length + (options.actions && options.actions.length ? 1 : 0);
      var td = document.createElement('td');
      td.colSpan = colspan;
      td.className = 'empty-state';
      td.innerHTML = '<i data-lucide="inbox" style="width:48px;height:48px;color:var(--text-tertiary);margin-bottom:16px;"></i><p>' + (options.emptyMessage || 'No data available.') + '</p>';
      td.style.cssText = 'text-align:center;padding:60px 20px;color:var(--text-tertiary);';
      emptyRow.appendChild(td);
      tbody.appendChild(emptyRow);
      table.appendChild(tbody);
      container.innerHTML = '';
      container.appendChild(table);
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    data.forEach(function (row) {
      var tr = document.createElement('tr');
      columns.forEach(function (col) {
        var td = document.createElement('td');
        if (col.render) {
          td.innerHTML = col.render(row);
        } else {
          var val = resolveValue(row, col.key);
          if (col.badge) {
            var badgeClass = col.badge.map[val] || '';
            td.innerHTML = '<span class="badge ' + badgeClass + '">' + escapeHtml(val) + '</span>';
          } else {
            td.textContent = val;
          }
        }
        tr.appendChild(td);
      });
      if (options.actions && options.actions.length) {
        var actionTd = document.createElement('td');
        var actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';
        actionsDiv.style.cssText = 'display:flex;gap:6px;';
        options.actions.forEach(function (action) {
          if (action.condition && !action.condition(row)) return;
          var btn = document.createElement('button');
          btn.className = action.class || 'btn btn-sm btn-secondary';
          btn.textContent = action.text;
          if (action.onClick) {
            (function (r, a) {
              btn.addEventListener('click', function (e) { a.onClick(r, e); });
            })(row, action);
          }
          actionsDiv.appendChild(btn);
        });
        if (actionsDiv.children.length) {
          actionTd.appendChild(actionsDiv);
        }
        tr.appendChild(actionTd);
      }
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.innerHTML = '';
    container.appendChild(table);
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function resolveValue(obj, key) {
    if (!key) return '';
    var parts = key.split('.');
    var val = obj;
    for (var i = 0; i < parts.length; i++) {
      if (val == null) return '';
      val = val[parts[i]];
    }
    return val == null ? '' : val;
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return {
    renderTable: renderTable
  };
})();
