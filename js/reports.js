(function () {

  var allIdeas = [];

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
    var dept = document.querySelector('[id]') ? null : getSelectValue(1);
    var cat = getSelectValue(2);
    var status = getSelectValue(3);

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

  // Wire export buttons
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.export-btn');
    if (btn) {
      var format = btn.getAttribute('data-format') || 'CSV';
      ToastSystem.showToast('Exporting as ' + format + '...', 'info');
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
