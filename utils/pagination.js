var PaginationSystem = (function () {

  var PAGE_SIZE = 10;

  function paginate(data, page, pageSize) {
    pageSize = pageSize || PAGE_SIZE;
    var total = data.length;
    var totalPages = Math.max(1, Math.ceil(total / pageSize));
    page = Math.max(1, Math.min(page, totalPages));
    var start = (page - 1) * pageSize;
    var end = Math.min(start + pageSize, total);
    return {
      data: data.slice(start, end),
      page: page,
      pageSize: pageSize,
      total: total,
      totalPages: totalPages,
      start: start + 1,
      end: end
    };
  }

  function renderControls(container, state, onChange) {
    container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!container) return;
    container.innerHTML = '';

    if (state.totalPages <= 1) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'pagination-controls';
    wrapper.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:12px 0;font-size:13px;color:var(--text-tertiary);';

    var info = document.createElement('span');
    info.textContent = 'Showing ' + state.start + '\u2013' + state.end + ' of ' + state.total;
    wrapper.appendChild(info);

    var btns = document.createElement('div');
    btns.style.cssText = 'display:flex;gap:4px;align-items:center;';

    var prev = document.createElement('button');
    prev.className = 'btn btn-sm btn-secondary';
    prev.textContent = 'Previous';
    prev.disabled = state.page <= 1;
    prev.style.cssText = (prev.disabled ? 'opacity:0.4;cursor:default;' : '');
    prev.addEventListener('click', function () {
      if (state.page > 1) onChange(state.page - 1);
    });
    btns.appendChild(prev);

    var maxVisible = 5;
    var startPage = Math.max(1, state.page - Math.floor(maxVisible / 2));
    var endPage = Math.min(state.totalPages, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      btns.appendChild(createPageBtn(1, state.page === 1, onChange));
      if (startPage > 2) {
        var dots = document.createElement('span');
        dots.textContent = '...';
        dots.style.cssText = 'padding:0 4px;color:var(--text-tertiary);';
        btns.appendChild(dots);
      }
    }

    for (var i = startPage; i <= endPage; i++) {
      btns.appendChild(createPageBtn(i, state.page === i, onChange));
    }

    if (endPage < state.totalPages) {
      if (endPage < state.totalPages - 1) {
        var dots2 = document.createElement('span');
        dots2.textContent = '...';
        dots2.style.cssText = 'padding:0 4px;color:var(--text-tertiary);';
        btns.appendChild(dots2);
      }
      btns.appendChild(createPageBtn(state.totalPages, state.page === state.totalPages, onChange));
    }

    var next = document.createElement('button');
    next.className = 'btn btn-sm btn-secondary';
    next.textContent = 'Next';
    next.disabled = state.page >= state.totalPages;
    next.style.cssText = (next.disabled ? 'opacity:0.4;cursor:default;' : '');
    next.addEventListener('click', function () {
      if (state.page < state.totalPages) onChange(state.page + 1);
    });
    btns.appendChild(next);

    wrapper.appendChild(btns);
    container.appendChild(wrapper);
  }

  function createPageBtn(pageNum, isActive, onChange) {
    var btn = document.createElement('button');
    btn.className = 'btn btn-sm' + (isActive ? ' btn-primary' : ' btn-secondary');
    btn.textContent = pageNum;
    if (isActive) {
      btn.style.cssText = 'font-weight:600;';
    }
    btn.addEventListener('click', function () {
      if (!isActive) onChange(pageNum);
    });
    return btn;
  }

  return {
    paginate: paginate,
    renderControls: renderControls
  };
})();
