(function () {
  var path = window.location.pathname;

  if (path.indexOf('staff/dashboard') !== -1) {
    initStaffDashboard();
  } else if (path.indexOf('innovation-team/dashboard') !== -1) {
    initTeamDashboard();
  } else if (path.indexOf('admin/dashboard') !== -1) {
    initAdminDashboard();
  }

  function initStaffDashboard() {
    // Summary cards
    IdeaService.getDashboardSummary().then(function (s) {
      var cards = document.querySelectorAll('.summary-card .card-value');
      if (cards.length >= 4) {
        cards[0].textContent = s.totalIdeasSubmitted;
        cards[1].textContent = s.ideasUnderReview;
        cards[2].textContent = s.approvedIdeas;
        cards[3].textContent = s.completedInnovations;
      }
    });

    // Recent submissions table
    IdeaService.getIdeas().then(function (ideas) {
      var recent = ideas.slice(0, 5);
      var container = document.querySelector('.two-col-grid .table-container');
      if (!container) return;
      var columns = [
        { key: 'title', label: 'Idea Title' },
        { key: 'category', label: 'Category' },
        {
          key: 'status', label: 'Status',
          badge: { map: {
            'Submitted': 'badge-submitted',
            'Under Review': 'badge-under-review',
            'Approved': 'badge-approved',
            'Declined': 'badge-declined',
            'Pending Information': 'badge-pending-info'
          }}
        },
        {
          key: 'dateSubmitted', label: 'Date',
          render: function (r) { return formatDate(r.dateSubmitted); }
        }
      ];
      TableSystem.renderTable(recent, columns, container);
    });

    // Recent notifications
    NotificationService.getRecentNotifications(3).then(function (notifs) {
      renderNotifications(notifs, document.querySelector('.two-col-grid .notification-item')?.parentElement);
    });
  }

  function initTeamDashboard() {
    // Summary cards
    IdeaService.getDashboardSummary().then(function (s) {
      var cards = document.querySelectorAll('.summary-card .card-value');
      if (cards.length >= 5) {
        cards[0].textContent = s.totalIdeasSubmitted;
        cards[1].textContent = s.pendingReviews;
        cards[2].textContent = s.conceptDevelopment;
        cards[3].textContent = s.experimentation;
        cards[4].textContent = s.deployment;
      }
    });

    // Recent submissions (first table in two-col-grid)
    IdeaService.getIdeas().then(function (ideas) {
      var recent = ideas.slice(0, 5);
      var containers = document.querySelectorAll('.two-col-grid .table-container');
      if (containers.length >= 1) {
        var columns = [
          { key: 'title', label: 'Idea Title' },
          { key: 'submitterName', label: 'Submitter' },
          {
            key: 'status', label: 'Status',
            badge: { map: {
              'Submitted': 'badge-submitted',
              'Under Review': 'badge-under-review',
              'Approved': 'badge-approved',
              'Declined': 'badge-declined',
              'Pending Information': 'badge-pending-info'
            }}
          },
          {
            key: 'dateSubmitted', label: 'Date',
            render: function (r) { return formatDate(r.dateSubmitted); }
          }
        ];
        TableSystem.renderTable(recent, columns, containers[0]);
      }
    });

    // Review queue (right column of two-col-grid)
    IdeaService.getPendingReviews().then(function (pending) {
      var reviewCards = document.querySelectorAll('.two-col-grid .card');
      if (reviewCards.length >= 2) {
        var queueDiv = reviewCards[1].querySelector('div[style]');
        if (queueDiv) {
          queueDiv.innerHTML = '';
          if (!pending.length) {
            queueDiv.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-tertiary);">No pending reviews.</div>';
          } else {
            pending.forEach(function (idea) {
              var item = document.createElement('div');
              item.style.cssText = 'display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0;';
              item.innerHTML = '<span>' + escapeHtml(idea.title) + '</span><span style="color:#e65100;">Due in ' + getDueDays(idea.reviewDeadline) + '</span>';
              queueDiv.appendChild(item);
            });
          }
        }
      }
    });

    // SLA Deadlines table (bottom card)
    IdeaService.getIdeas().then(function (ideas) {
      var slaContainers = document.querySelectorAll('.card .table-container');
      // Last table-container is the SLA table
      var slaContainer = slaContainers[slaContainers.length - 1];
      if (slaContainer && slaContainer.parentElement.querySelector('h3')?.textContent.indexOf('SLA') !== -1) {
        var slaColumns = [
          { key: 'title', label: 'Idea' },
          { key: 'reviewer', label: 'Reviewer' },
          {
            key: 'reviewDeadline', label: 'Deadline',
            render: function (r) { return formatDate(r.reviewDeadline); }
          },
          {
            key: 'reviewSlaStatus', label: 'Status',
            render: function (r) {
              var colors = { 'On Track': '#2e7d32', 'At Risk': '#e65100', 'Overdue': '#d32f2f' };
              return '<span style="color:' + (colors[r.reviewSlaStatus] || '#666') + ';">' + escapeHtml(r.reviewSlaStatus) + '</span>';
            }
          }
        ];
        TableSystem.renderTable(ideas.filter(function (i) { return i.reviewer; }), slaColumns, slaContainer);
      }
    });
  }

  function initAdminDashboard() {
    // Summary cards
    UserService.getDashboardSummary().then(function (s) {
      var cards = document.querySelectorAll('.summary-card .card-value');
      if (cards.length >= 4) {
        cards[0].textContent = s.totalUsers;
        cards[1].textContent = s.activeUsers;
        cards[2].textContent = s.lockedAccounts;
        cards[3].textContent = s.recentActivities || '—';
      }
    });
  }

  function renderNotifications(notifs, container) {
    if (!container) return;
    container.innerHTML = '';
    notifs.forEach(function (n) {
      var item = document.createElement('div');
      item.className = 'notification-item' + (!n.isRead ? ' unread' : '');
      item.innerHTML =
        '<div class="notif-icon"><i data-lucide="' + n.type + '" style="width:18px;height:18px;"></i></div>' +
        '<div class="notif-content">' +
          '<div class="notif-title">' + escapeHtml(n.title) + '</div>' +
          '<div class="notif-desc">' + escapeHtml(n.description) + '</div>' +
          '<div class="notif-time">' + escapeHtml(n.time) + '</div>' +
        '</div>' +
        (!n.isRead ? '<div class="unread-dot"></div>' : '');
      container.appendChild(item);
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }

  function formatDate(isoStr) {
    if (!isoStr) return '';
    var d = new Date(isoStr);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  function getDueDays(deadline) {
    if (!deadline) return '—';
    var now = new Date();
    var due = new Date(deadline);
    var diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Overdue';
    return diff + ' days';
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
})();
