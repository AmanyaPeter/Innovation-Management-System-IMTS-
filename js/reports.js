(function () {

  var allIdeas = [];
  var currentFilteredIdeas = [];
  var categoryChartInstance = null;
  var trendChartInstance = null;

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
    updateCharts(filtered);
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

  function updateCharts(ideas) {
    updateCategoryChart(ideas);
    updateTrendChart(ideas);
  }

  function updateCategoryChart(ideas) {
    var categories = {};
    ideas.forEach(function (i) {
      var cat = i.category || 'Uncategorized';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    var labels = Object.keys(categories);
    var data = labels.map(function (k) { return categories[k]; });

    var ctx = document.getElementById('categoryChart')?.getContext('2d');
    if (!ctx) return;

    if (categoryChartInstance) {
      categoryChartInstance.destroy();
    }

    if (typeof Chart === 'undefined') return;

    categoryChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Ideas',
          data: data,
          backgroundColor: '#5A0C08',
          borderColor: '#5A0C08',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0
            }
          }
        }
      }
    });
  }

  function updateTrendChart(ideas) {
    var trends = {};
    ideas.forEach(function (i) {
      if (!i.dateSubmitted) return;
      var d = new Date(i.dateSubmitted);
      if (isNaN(d.getTime())) return;
      var year = d.getFullYear();
      var month = d.getMonth();
      var monthStr = (month + 1) < 10 ? '0' + (month + 1) : '' + (month + 1);
      var key = year + '-' + monthStr;
      trends[key] = (trends[key] || 0) + 1;
    });

    var sortedKeys = Object.keys(trends).sort();
    var labels = sortedKeys.map(function (k) {
      var parts = k.split('-');
      var yr = parts[0];
      var mo = parseInt(parts[1], 10);
      var monthName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][mo - 1];
      return monthName + ' ' + yr;
    });
    var data = sortedKeys.map(function (k) {
      return trends[k];
    });

    var ctx = document.getElementById('trendChart')?.getContext('2d');
    if (!ctx) return;

    if (trendChartInstance) {
      trendChartInstance.destroy();
    }

    if (typeof Chart === 'undefined') return;

    trendChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Submissions',
          data: data,
          fill: true,
          backgroundColor: 'rgba(90, 12, 8, 0.1)',
          borderColor: '#5A0C08',
          borderWidth: 2,
          tension: 0.3,
          pointBackgroundColor: '#5A0C08',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0
            }
          }
        }
      }
    });
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
