(function () {

  var allUsers = [];

  function loadAndRender() {
    UserService.getUsers().then(function (users) {
      allUsers = users;
      render();
    });
  }

  function render() {
    var q = document.querySelector('.search-input')?.value || '';
    var tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;

    var filtered = allUsers;
    if (q.trim()) {
      var query = q.toLowerCase().trim();
      filtered = filtered.filter(function (u) {
        return u.name.toLowerCase().indexOf(query) !== -1 ||
               u.email.toLowerCase().indexOf(query) !== -1;
      });
    }

    tbody.innerHTML = '';
    filtered.forEach(function (u) {
      tbody.appendChild(createRow(u));
    });
    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:#888;">No users found.</td></tr>';
    }
  }

  function createRow(u) {
    var tr = document.createElement('tr');
    var perms = Array.isArray(u.permissions) ? u.permissions.join(', ') : (u.permissions || '');
    var isActive = u.accountStatus === 'Active';

    tr.innerHTML =
      '<td>' + escapeHtml(u.name) + '</td>' +
      '<td>' + escapeHtml(u.email) + '</td>' +
      '<td>' + escapeHtml(u.department) + '</td>' +
      '<td>' + escapeHtml(u.role) + '</td>' +
      '<td style="font-size:13px;">' + escapeHtml(perms) + '</td>' +
      '<td>' +
        '<div class="actions">' +
          '<button class="btn btn-sm btn-secondary edit-permissions-btn" data-id="' + u.id + '">Edit</button>' +
          '<button class="btn btn-sm btn-' + (isActive ? 'danger disable-user-btn' : 'success activate-user-btn') + '" data-id="' + u.id + '">' + (isActive ? 'Disable' : 'Activate') + '</button>' +
        '</div>' +
      '</td>';

    tr.querySelector('.edit-permissions-btn')?.addEventListener('click', function () {
      ModalSystem.openModal('Edit Permissions', 'Edit permissions for ' + u.name + ':', 'confirm', function () {
        ToastSystem.showToast('Permissions updated for ' + u.name, 'success');
      });
    });

    tr.querySelector('.disable-user-btn')?.addEventListener('click', function () {
      ModalSystem.openModal('Disable User', 'Are you sure you want to disable ' + u.name + '?', 'confirm', function () {
        u.accountStatus = 'Inactive';
        render();
        ToastSystem.showToast(u.name + ' disabled.', 'warning');
      });
    });

    tr.querySelector('.activate-user-btn')?.addEventListener('click', function () {
      ModalSystem.openModal('Activate User', 'Activate ' + u.name + '?', 'confirm', function () {
        u.accountStatus = 'Active';
        render();
        ToastSystem.showToast(u.name + ' activated.', 'success');
      });
    });

    return tr;
  }

  document.querySelector('.search-input')?.addEventListener('input', render);

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  loadAndRender();
})();
