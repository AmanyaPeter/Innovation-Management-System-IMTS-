var AuthSystem = (function () {
  var STORAGE_KEY = 'bou_current_user';

  function login(email, password) {
    // Extract username from email or use as-is
    var username = email;
    if (email.indexOf('@') !== -1) {
      var emailToUser = {
        'brian@bou.or.ug': 'brian',
        'jane.mukasa@bou.or.ug': 'jane',
        'admin@bou.or.ug': 'admin'
      };
      username = emailToUser[email.toLowerCase()] || email.split('@')[0];
    }

    return fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }).then(function (res) {
      if (res.status === 401) {
        return { success: false, reason: 'Invalid credentials' };
      }
      if (res.status === 403) {
        return { success: false, reason: 'Account locked' };
      }
      if (!res.ok) {
        return { success: false, reason: 'Server error' };
      }
      return res.json().then(function (data) {
        // Look up the full user in UserService to preserve matching properties (avatar, department, permissions, etc.)
        return UserService.getUserByEmail(data.user.email).then(function (localUser) {
          var sessionUser = localUser;
          if (!sessionUser) {
            sessionUser = {
              id: 999,
              name: data.user.displayName,
              email: data.user.email,
              department: 'IT',
              role: data.user.roles[0] === 'ITAdmin' ? 'IT Admin' : (data.user.roles[0] === 'InnovationTeam' ? 'Innovation Manager' : 'Staff'),
              accountStatus: 'Active',
              onlineStatus: 'Online',
              permissions: data.user.roles[0] === 'ITAdmin' ? ['Full System Access'] : ['Submit Ideas', 'View Resources'],
              avatar: data.user.displayName.split(' ').map(function (s) { return s[0]; }).join('').toUpperCase().slice(0, 2)
            };
          }
          // Preserve tokens in the session shape
          sessionUser.accessToken = data.accessToken;
          sessionUser.refreshToken = data.refreshToken;

          localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
          return { success: true, user: sessionUser };
        });
      });
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
    var user = getCurrentUser();
    if (user && user.accessToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + user.accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: user.refreshToken || ''
        })
      }).catch(function (e) {
        console.error('Failed to notify backend logout:', e);
      });
    }
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
