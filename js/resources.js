(function () {

  var allResources = [];

  function loadAndRender() {
    ResourceService.getResources().then(function (resources) {
      allResources = resources;

      var q = document.querySelector('.search-input')?.value || '';
      var cat = document.querySelector('.filters-bar select')?.value || '';

      var filtered = allResources;
      if (q.trim()) {
        var query = q.toLowerCase().trim();
        filtered = filtered.filter(function (r) {
          return r.title.toLowerCase().indexOf(query) !== -1 ||
                 r.description.toLowerCase().indexOf(query) !== -1;
        });
      }
      if (cat) {
        filtered = filtered.filter(function (r) { return r.category === cat; });
      }

      var grid = document.querySelector('.resource-grid');
      if (!grid) return;
      grid.innerHTML = '';

      if (!filtered.length) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-tertiary);">No resources found.</div>';
        return;
      }

      filtered.forEach(function (r) {
        grid.appendChild(createCard(r));
      });
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }

  function createCard(r) {
    var card = document.createElement('div');
    card.className = 'resource-card';
    card.innerHTML =
      '<div class="doc-icon"><i data-lucide="file-text" style="width:24px;height:24px;"></i></div>' +
      '<h4>' + escapeHtml(r.title) + '</h4>' +
      '<p>' + escapeHtml(r.description) + '</p>' +
      '<div class="resource-meta">Uploaded: ' + escapeHtml(r.uploadedDate) + ' &middot; ' + escapeHtml(r.fileSize) + '</div>' +
      '<div class="resource-actions">' +
        '<button class="btn btn-sm btn-primary resource-view-btn" data-id="' + r.id + '">View</button>' +
        '<button class="btn btn-sm btn-secondary resource-download-btn" data-id="' + r.id + '">Download</button>' +
      '</div>';
    return card;
  }

  // Wire search/filter
  document.querySelector('.search-input')?.addEventListener('input', function () {
    loadAndRender();
  });
  document.querySelector('.filters-bar select')?.addEventListener('change', function () {
    loadAndRender();
  });

  // Wire view/download via delegation
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('resource-view-btn')) {
      ToastSystem.showToast('Opening resource...', 'info');
    }
    if (e.target.classList.contains('resource-download-btn')) {
      ToastSystem.showToast('Downloading resource...', 'info');
    }
  });

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  loadAndRender();
})();
