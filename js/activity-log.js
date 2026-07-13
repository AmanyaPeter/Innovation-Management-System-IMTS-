(function () {

  var allActivities = [];

  function loadAndRender() {
    ActivityService.getActivities().then(function (activities) {
      allActivities = activities;
      render();
    });
  }

  function render() {
    var q = document.querySelector('.search-input')?.value || '';
    var dateVal = document.querySelector('.filters-bar input[type="date"]')?.value || '';

    var filtered = allActivities;
    if (q.trim()) {
      var query = q.toLowerCase().trim();
      filtered = filtered.filter(function (a) {
        return a.user.toLowerCase().indexOf(query) !== -1 ||
               a.action.toLowerCase().indexOf(query) !== -1 ||
               a.module.toLowerCase().indexOf(query) !== -1;
      });
    }
    if (dateVal) {
      filtered = filtered.filter(function (a) {
        return a.dateTime && a.dateTime.indexOf(dateVal) === 0;
      });
    }

    var tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    filtered.forEach(function (a) {
      tbody.appendChild(createRow(a));
    });
    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#888;">No activity log entries found.</td></tr>';
    }
  }

  function createRow(a) {
    var tr = document.createElement('tr');
    var isSuccess = a.status === 'Success';
    tr.innerHTML =
      '<td>' + formatDateTime(a.dateTime) + '</td>' +
      '<td>' + escapeHtml(a.user) + '</td>' +
      '<td>' + escapeHtml(a.action) + '</td>' +
      '<td>' + escapeHtml(a.module) + '</td>' +
      '<td>' + escapeHtml(a.ipAddress) + '</td>' +
      '<td><span class="badge ' + (isSuccess ? 'badge-active' : 'badge-inactive') + '">' + escapeHtml(a.status) + '</span></td>';
    return tr;
  }

  document.querySelector('.search-input')?.addEventListener('input', render);
  document.querySelector('.filters-bar input[type="date"]')?.addEventListener('change', render);

  document.querySelector('.export-btn')?.addEventListener('click', function () {
    ToastSystem.showToast('Exporting activity log as CSV...', 'info');
  });

  function formatDateTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return d.getDate() + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] + ' ' + d.getFullYear() + ', ' +
      pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  loadAndRender();
})();
