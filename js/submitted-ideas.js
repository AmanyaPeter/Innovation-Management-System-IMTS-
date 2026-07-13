(function () {

  var allIdeas = [];

  function loadAndRender() {
    Promise.all([
      IdeaService.getIdeas(),
      getLocalIdeas()
    ]).then(function (results) {
      allIdeas = results[0].concat(results[1]);
      render();
    });
  }

  function getLocalIdeas() {
    try { return JSON.parse(localStorage.getItem('bou_ideas') || '[]'); } catch (e) { return []; }
  }

  function render() {
    var q = document.querySelector('.search-input')?.value || '';
    var selects = document.querySelectorAll('.filters-bar select');
    var statusVal = selects[0]?.value || '';
    var catVal = selects[1]?.value || '';
    var deptVal = selects[2]?.value || '';
    var dateVal = document.querySelector('.filters-bar input[type="date"]')?.value || '';

    var filtered = allIdeas;
    if (q.trim()) {
      var query = q.toLowerCase().trim();
      filtered = filtered.filter(function (i) {
        return i.title.toLowerCase().indexOf(query) !== -1 ||
               (i.submitterName || '').toLowerCase().indexOf(query) !== -1;
      });
    }
    if (statusVal) filtered = filtered.filter(function (i) { return i.status === statusVal; });
    if (catVal) filtered = filtered.filter(function (i) { return i.category === catVal; });
    if (deptVal) filtered = filtered.filter(function (i) { return i.department === deptVal; });
    if (dateVal) filtered = filtered.filter(function (i) { return i.dateSubmitted >= dateVal; });

    var tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    filtered.forEach(function (i) {
      tbody.appendChild(createRow(i));
    });
    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:32px;color:#888;">No ideas match the selected filters.</td></tr>';
    }
  }

  function createRow(i) {
    var tr = document.createElement('tr');
    var stageBadge = 'badge-' + (i.stage || i.status || '').toLowerCase().replace(/\s+/g, '-');
    var statusBadge = 'badge-' + (i.status || '').toLowerCase().replace(/\s+/g, '-');
    tr.innerHTML =
      '<td>' + escapeHtml(i.title) + '</td>' +
      '<td>' + escapeHtml(i.submitterName || '') + '</td>' +
      '<td>' + escapeHtml(i.department) + '</td>' +
      '<td>' + escapeHtml(i.category) + '</td>' +
      '<td><span class="badge ' + stageBadge + '">' + escapeHtml(i.stage || i.status) + '</span></td>' +
      '<td><span class="badge ' + statusBadge + '">' + escapeHtml(i.status) + '</span></td>' +
      '<td>' + formatDate(i.dateSubmitted) + '</td>' +
      '<td><button class="btn btn-sm btn-primary review-idea-btn" data-id="' + i.id + '">View Review</button></td>';

    tr.querySelector('.review-idea-btn')?.addEventListener('click', function () {
      window.location.href = 'review-idea.html?id=' + i.id;
    });
    return tr;
  }

  document.querySelector('.search-input')?.addEventListener('input', render);
  document.querySelectorAll('.filters-bar select, .filters-bar input[type="date"]').forEach(function (el) {
    el.addEventListener('change', render);
  });

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return d.getDate() + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] + ' ' + d.getFullYear();
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  loadAndRender();
})();
