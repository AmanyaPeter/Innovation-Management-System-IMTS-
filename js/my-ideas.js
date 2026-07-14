(function () {

  var allIdeas = [];
  var currentPage = 1;

  var columns = [
    { key: 'title', label: 'Idea Title', sortKey: 'title' },
    { key: 'category', label: 'Category', sortKey: 'category' },
    {
      key: 'stage', label: 'Stage', sortKey: 'stage',
      badge: { map: {
        'Submitted': 'badge-submitted',
        'Concept Development': 'badge-concept',
        'Experimentation': 'badge-experimentation',
        'Deployment': 'badge-deployment',
        'Closed': 'badge-closed'
      }}
    },
    {
      key: 'status', label: 'Status', sortKey: 'status',
      badge: { map: {
        'Submitted': 'badge-submitted',
        'Under Review': 'badge-under-review',
        'Pending Information': 'badge-pending-info',
        'Approved': 'badge-approved',
        'Declined': 'badge-declined'
      }}
    },
    {
      key: 'dateSubmitted', label: 'Date Submitted', sortKey: 'dateSubmitted',
      render: function (r) { return formatDate(r.dateSubmitted); }
    }
  ];

  var actions = [
    {
      text: 'View', class: 'btn btn-sm btn-secondary view-idea-btn',
      onClick: function (row) { window.location.href = 'idea-details.html?id=' + row.id; }
    },
    {
      text: 'Edit', class: 'btn btn-sm btn-secondary edit-idea-btn',
      onClick: function (row) { window.location.href = 'submit-idea.html?id=' + row.id; }
    },
    {
      text: 'Retract', class: 'btn btn-sm btn-secondary retract-idea-btn',
      onClick: function (row) {
        ModalSystem.openModal('Retract Idea', 'Are you sure you want to retract this idea? This action cannot be undone.', 'confirm', function () {
          updateIdeaStatus(row.id, 'Declined');
          ToastSystem.showToast('Idea retracted successfully.', 'success');
          loadAndRender();
        });
      }
    },
    {
      text: 'Cancel', class: 'btn btn-sm btn-danger cancel-idea-btn',
      condition: function (row) { return row.status === 'Submitted' || row.status === 'Under Review'; },
      onClick: function (row) {
        ModalSystem.openModal('Cancel Idea', 'Are you sure you want to cancel this idea?', 'confirm', function () {
          updateIdeaStatus(row.id, 'Cancelled');
          ToastSystem.showToast('Idea cancelled.', 'info');
          loadAndRender();
        });
      }
    }
  ];

  function loadAndRender() {
    Promise.all([
      IdeaService.getIdeas(),
      getLocalIdeas()
    ]).then(function (results) {
      var remote = results[0];
      var local = results[1];
      allIdeas = remote.filter(function (r) {
        return !local.some(function (l) { return l.id === r.id; });
      }).concat(local);

      // Apply search, filter, sort, pagination
      var filtered = applyFilters(allIdeas);
      var sorted = SortSystem.sortData(filtered, SortSystem.getSortState().field, SortSystem.getSortState().direction);
      var paged = PaginationSystem.paginate(sorted, currentPage);

      var container = document.querySelector('.table-container');
      TableSystem.renderTable(paged.data, columns, container, { actions: actions, emptyMessage: 'No ideas found.' });

      var paginationContainer = document.querySelector('.pagination-controls');
      if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-controls';
        container.parentElement.appendChild(paginationContainer);
      }
      PaginationSystem.renderControls(paginationContainer, paged, function (page) {
        currentPage = page;
        loadAndRender();
      });
    });
  }

  function getLocalIdeas() {
    try {
      return JSON.parse(localStorage.getItem('bou_ideas') || '[]');
    } catch (e) { return []; }
  }

  function updateIdeaStatus(id, newStatus) {
    // Try remote first
    IdeaService.getIdeas().then(function (ideas) {
      var idea = ideas.find(function (i) { return i.id === id; });
      if (idea) {
        idea.status = newStatus;
        idea.lastUpdated = new Date().toISOString();
        return;
      }
      // Try local
      var local = getLocalIdeas();
      var localIdea = local.find(function (i) { return i.id === id; });
      if (localIdea) {
        localIdea.status = newStatus;
        localIdea.lastUpdated = new Date().toISOString();
        localStorage.setItem('bou_ideas', JSON.stringify(local));
      }
    });
  }

  function applyFilters(data) {
    var q = document.querySelector('.search-input')?.value || '';
    var statusFilter = document.querySelectorAll('.filters-bar select')[0]?.value || '';
    var catFilter = document.querySelectorAll('.filters-bar select')[1]?.value || '';

    var result = data;

    if (q.trim()) {
      var query = q.toLowerCase().trim();
      result = result.filter(function (i) {
        return i.title.toLowerCase().indexOf(query) !== -1 ||
               i.category.toLowerCase().indexOf(query) !== -1;
      });
    }
    if (statusFilter) {
      result = result.filter(function (i) { return i.status === statusFilter; });
    }
    if (catFilter) {
      result = result.filter(function (i) { return i.category === catFilter; });
    }
    return result;
  }

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return d.getDate() + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] + ' ' + d.getFullYear();
  }

  // Wire search/filter inputs
  document.querySelector('.search-input')?.addEventListener('input', function () {
    currentPage = 1;
    loadAndRender();
  });
  document.querySelectorAll('.filters-bar select').forEach(function (s) {
    s.addEventListener('change', function () {
      currentPage = 1;
      loadAndRender();
    });
  });

  loadAndRender();
})();
