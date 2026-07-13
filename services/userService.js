var UserService = (function () {
  var BASE_URL = '/data/users.json';

  function getUsers() {
    return fetch(BASE_URL).then(function (res) {
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    });
  }

  function getUserById(id) {
    return getUsers().then(function (users) {
      var user = users.find(function (u) { return u.id === id; });
      if (!user) throw new Error('User not found: ' + id);
      return user;
    });
  }

  function getUserByEmail(email) {
    return getUsers().then(function (users) {
      return users.find(function (u) { return u.email === email; }) || null;
    });
  }

  function getUsersByRole(role) {
    return getUsers().then(function (users) {
      return users.filter(function (u) { return u.role === role; });
    });
  }

  function getUsersByDepartment(department) {
    return getUsers().then(function (users) {
      return users.filter(function (u) { return u.department === department; });
    });
  }

  function getActiveUsers() {
    return getUsers().then(function (users) {
      return users.filter(function (u) { return u.accountStatus === 'Active'; });
    });
  }

  function getOnlineUsers() {
    return getUsers().then(function (users) {
      return users.filter(function (u) { return u.onlineStatus === 'Online'; });
    });
  }

  function getLockedAccounts() {
    return getUsers().then(function (users) {
      return users.filter(function (u) { return u.accountStatus === 'Locked'; });
    });
  }

  function authenticate(email, password) {
    return getUsers().then(function (users) {
      var user = users.find(function (u) { return u.email === email; });
      if (!user) return { success: false, reason: 'User not found' };
      if (user.accountStatus === 'Locked') return { success: false, reason: 'Account locked' };
      return { success: true, user: user };
    });
  }

  function getDashboardSummary() {
    return getUsers().then(function (users) {
      return {
        totalUsers: users.length,
        activeUsers: users.filter(function (u) { return u.accountStatus === 'Active'; }).length,
        lockedAccounts: users.filter(function (u) { return u.accountStatus === 'Locked'; }).length,
        onlineUsers: users.filter(function (u) { return u.onlineStatus === 'Online'; }).length
      };
    });
  }

  return {
    getUsers: getUsers,
    getUserById: getUserById,
    getUserByEmail: getUserByEmail,
    getUsersByRole: getUsersByRole,
    getUsersByDepartment: getUsersByDepartment,
    getActiveUsers: getActiveUsers,
    getOnlineUsers: getOnlineUsers,
    getLockedAccounts: getLockedAccounts,
    authenticate: authenticate,
    getDashboardSummary: getDashboardSummary
  };
})();
