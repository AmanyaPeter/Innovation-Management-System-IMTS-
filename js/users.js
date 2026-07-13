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
               u.email.toLowerCase().indexOf(query) !== -1 ||
               u.department.toLowerCase().indexOf(query) !== -1;
      });
    }

    tbody.innerHTML = '';
    filtered.forEach(function (u) {
      tbody.appendChild(createRow(u));
    });
  }

  function createRow(u) {
    var tr = document.createElement('tr');
    var isLocked = u.accountStatus === 'locked' || u.accountStatus === 'Locked';

    tr.innerHTML =
      '<td>' + escapeHtml(u.name) + '</td>' +
      '<td>' + escapeHtml(u.email) + '</td>' +
      '<td>' + escapeHtml(u.department) + '</td>' +
      '<td>' + escapeHtml(u.role) + '</td>' +
      '<td><span class="badge ' + (isLocked ? 'badge-inactive' : 'badge-active') + '">' + escapeHtml(u.accountStatus) + '</span></td>' +
      '<td>' +
        '<div class="actions">' +
          '<button class="btn btn-sm btn-secondary reset-pwd-btn" data-id="' + u.id + '">Reset Password</button>' +
          '<button class="btn btn-sm btn-' + (isLocked ? 'success unlock-account-btn' : 'danger lock-account-btn') + '" data-id="' + u.id + '">' + (isLocked ? 'Unlock Account' : 'Lock Account') + '</button>' +
        '</div>' +
      '</td>';

    tr.querySelector('.reset-pwd-btn')?.addEventListener('click', function () {
      ToastSystem.showToast('Password reset link sent to ' + u.email, 'success');
    });

    tr.querySelector('.lock-account-btn')?.addEventListener('click', function () {
      u.accountStatus = 'Locked';
      // Persist the lock status to localStorage so it survives a refresh
      UserService.saveUsers(allUsers).then(function () {
        render();
        ToastSystem.showToast('Account locked: ' + u.name, 'warning');
      });
    });

    tr.querySelector('.unlock-account-btn')?.addEventListener('click', function () {
      u.accountStatus = 'Active';
      // Persist the unlock status to localStorage so it survives a refresh
      UserService.saveUsers(allUsers).then(function () {
        render();
        ToastSystem.showToast('Account unlocked: ' + u.name, 'success');
      });
    });

    return tr;
  }

  // Wire search
  document.querySelector('.search-input')?.addEventListener('input', function () {
    render();
  });

  // Wire Create User
  document.querySelector('.create-user-btn')?.addEventListener('click', function () {
    ToastSystem.showToast('User creation form coming soon.', 'info');
  });

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  loadAndRender();
})();
