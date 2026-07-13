var AuthSystem = (function () {
  var STORAGE_KEY = 'bou_current_user';

  function login(email, password) {
    return UserService.authenticate(email, password).then(function (result) {
      if (!result.success) {
        return { success: false, reason: result.reason };
      }
      var user = result.user;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return { success: true, user: user };
    });
  }

  function getCurrentUser() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function isLoggedIn() {
    return getCurrentUser() !== null;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function getDestinationForRole(role) {
    var isSubPage = window.location.pathname.indexOf('/pages/') !== -1;
    var prefix = isSubPage ? '../../' : '';
    var map = {
      'staff': prefix + 'pages/staff/dashboard.html',
      'innovation-team': prefix + 'pages/innovation-team/dashboard.html',
      'admin': prefix + 'pages/admin/dashboard.html'
    };
    return map[role] || map['staff'];
  }

  return {
    login: login,
    getCurrentUser: getCurrentUser,
    isLoggedIn: isLoggedIn,
    logout: logout,
    getDestinationForRole: getDestinationForRole
  };
})();
