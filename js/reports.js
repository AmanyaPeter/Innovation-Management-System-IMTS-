(function () {

  var allIdeas = [];
  var currentFilteredIdeas = [];

  function loadAndRender() {
    Promise.all([
      IdeaService.getIdeas(),
      getLocalIdeas()
    ]).then(function (results) {
      allIdeas = results[0].concat(results[1]);
      applyFilters();
    });
  }

  function getLocalIdeas() {
    try { return JSON.parse(localStorage.getItem('bou_ideas') || '[]'); } catch (e) { return []; }
  }

  function applyFilters() {
    // Since no IDs, use nth-of-type approach
    var selects = document.querySelectorAll('.filters-bar select');
    var deptVal = selects[0]?.value || 'All Departments';
    var catVal = selects[1]?.value || 'All Categories';
    var statusVal = selects[2]?.value || 'All Statuses';

    var filtered = allIdeas;
    if (deptVal !== 'All Departments') filtered = filtered.filter(function (i) { return i.department === deptVal; });
    if (catVal !== 'All Categories') filtered = filtered.filter(function (i) { return i.category === catVal; });
    if (statusVal !== 'All Statuses') filtered = filtered.filter(function (i) { return i.status === statusVal; });

    var dateFrom = document.querySelector('input[type="date"]:first-of-type')?.value;
    var dateTo = document.querySelector('input[type="date"]:last-of-type')?.value;

    if (dateFrom) filtered = filtered.filter(function (i) { return i.dateSubmitted >= dateFrom; });
    if (dateTo) filtered = filtered.filter(function (i) { return i.dateSubmitted <= dateTo; });

    currentFilteredIdeas = filtered;

    updateSummary(filtered);
    updateTable(filtered);
  }

  function updateSummary(ideas) {
    var total = ideas.length;
    var approved = ideas.filter(function (i) { return i.status === 'Approved' || i.status === 'Deployed'; }).length;
    var underReview = ideas.filter(function (i) { return i.status === 'Under Review' || i.status === 'Submitted'; }).length;
    var declined = ideas.filter(function (i) { return i.status === 'Declined' || i.status === 'Rejected'; }).length;

    var nums = document.querySelectorAll('[style*="font-size:28px"]');
    if (nums.length >= 1) nums[0].textContent = total;
    if (nums.length >= 2) nums[1].textContent = approved;
    if (nums.length >= 3) nums[2].textContent = underReview;
    if (nums.length >= 4) nums[3].textContent = declined;
  }

  function updateTable(ideas) {
    var tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    ideas.forEach(function (i) {
      var tr = document.createElement('tr');
      var badgeClass = 'badge-' + (i.status || '').toLowerCase().replace(/\s+/g, '-');
      tr.innerHTML =
        '<td>' + escapeHtml(i.title) + '</td>' +
        '<td>' + escapeHtml(i.submitterName || i.submitter || '') + '</td>' +
        '<td>' + escapeHtml(i.department) + '</td>' +
        '<td>' + escapeHtml(i.category) + '</td>' +
        '<td><span class="badge ' + badgeClass + '">' + escapeHtml(i.status) + '</span></td>' +
        '<td>' + formatDate(i.dateSubmitted) + '</td>';
      tbody.appendChild(tr);
    });

    if (!ideas.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#888;">No ideas match the selected filters.</td></tr>';
    }
  }

  // Wire Generate Report
  document.querySelector('.generate-report-btn')?.addEventListener('click', function () {
    applyFilters();
    ToastSystem.showToast('Report generated.', 'success');
  });

  function exportToCSV() {
    var headers = ['Idea Title', 'Submitter', 'Department', 'Category', 'Status', 'Date'];
    var rows = [headers];

    currentFilteredIdeas.forEach(function (i) {
      var title = i.title || '';
      var submitter = i.submitterName || i.submitter || '';
      var dept = i.department || '';
      var cat = i.category || '';
      var status = i.status || '';
      var date = formatDate(i.dateSubmitted) || '';

      rows.push([title, submitter, dept, cat, status, date]);
    });

    var csvContent = rows.map(function (row) {
      return row.map(function (val) {
        var str = String(val).replace(/"/g, '""');
        return '"' + str + '"';
      }).join(',');
    }).join('\n');

    try {
      var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'imts-reports-export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      ToastSystem.showToast('CSV report exported successfully.', 'success');
    } catch (err) {
      ToastSystem.showToast('Failed to export CSV.', 'error');
    }
  }

  // Wire export buttons
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.export-btn');
    if (btn) {
      var format = btn.getAttribute('data-format') || 'CSV';
      if (format === 'CSV') {
        exportToCSV();
      } else {
        ToastSystem.showToast(format + ' export is coming soon (requires backend services).', 'info');
      }
    }
  });

  // Wire date inputs and select changes to auto-filter
  document.querySelectorAll('.filters-bar select, .filters-bar input[type="date"]').forEach(function (el) {
    el.addEventListener('change', applyFilters);
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
