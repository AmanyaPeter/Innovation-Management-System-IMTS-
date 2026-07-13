(function () {

  var allNotifications = [];

  function loadAndRender(filter) {
    NotificationService.getNotifications().then(function (notifications) {
      allNotifications = notifications;
      render(filter || 'All');
    });
  }

  function render(filter) {
    var container = document.querySelector('.card');
    var tabs = container?.querySelector('.notification-tabs');
    if (!container) return;

    var filtered = allNotifications;
    if (filter === 'Unread') filtered = allNotifications.filter(function (n) { return !n.read; });
    if (filter === 'Read') filtered = allNotifications.filter(function (n) { return n.read; });

    // Keep tabs, remove old items
    var items = container.querySelectorAll('.notification-item');
    items.forEach(function (el) { el.remove(); });

    if (!filtered.length) {
      var emptyEl = document.createElement('div');
      emptyEl.style.cssText = 'padding:40px;text-align:center;color:var(--text-tertiary);font-size:14px;';
      emptyEl.textContent = 'No ' + filter.toLowerCase() + ' notifications.';
      tabs?.after(emptyEl);
      return;
    }

    filtered.forEach(function (n) {
      tabs?.after(createItem(n));
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function createItem(n) {
    var div = document.createElement('div');
    div.className = 'notification-item' + (n.read ? '' : ' unread');

    var iconMap = {
      'status': 'bar-chart-3',
      'comment': 'users',
      'approval': 'check-circle',
      'info': 'file-text',
      'warning': 'alert-triangle',
      'announcement': 'megaphone'
    };

    div.innerHTML =
      '<div class="notif-icon"><i data-lucide="' + (iconMap[n.type] || 'bell') + '" style="width:18px;height:18px;"></i></div>' +
      '<div class="notif-content">' +
        '<div class="notif-title">' + escapeHtml(n.title) + '</div>' +
        '<div class="notif-desc">' + escapeHtml(n.message) + '</div>' +
        '<div class="notif-time">' + timeAgo(n.timestamp) + '</div>' +
      '</div>' +
      (n.read ? '' : '<div class="unread-dot"></div>');

    div.addEventListener('click', function () {
      if (!n.read) {
        n.read = true;
        div.querySelector('.unread-dot')?.remove();
        div.classList.remove('unread');
        // Optionally persist
        if (typeof NotificationService !== 'undefined' && NotificationService.markAsRead) {
          NotificationService.markAsRead(n.id);
        }
      }
    });
    return div;
  }

  // Tab switching
  document.addEventListener('click', function (e) {
    var tab = e.target.closest('.tab');
    if (!tab) return;
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');
    render(tab.textContent.trim());
  });

  function timeAgo(iso) {
    if (!iso) return '';
    var diff = Date.now() - new Date(iso).getTime();
    var mins = Math.floor(diff / 60000);
    if (mins < 60) return mins + ' minutes ago';
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + ' hours ago';
    var days = Math.floor(hrs / 24);
    return days + ' days ago';
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  loadAndRender('All');
})();
