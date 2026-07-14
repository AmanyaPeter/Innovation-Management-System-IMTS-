var CategoryService = (function () {
  var BASE_URL = '/api/categories';

  function getAuthHeaders() {
    var headers = {
      'Content-Type': 'application/json'
    };
    if (typeof AuthSystem !== 'undefined') {
      var user = AuthSystem.getCurrentUser();
      if (user && user.accessToken) {
        headers['Authorization'] = 'Bearer ' + user.accessToken;
      }
    }
    return headers;
  }

  function getCategories() {
    var stored = localStorage.getItem('bou_categories');
    if (stored) {
      try {
        return Promise.resolve(JSON.parse(stored));
      } catch (e) {}
    }
    return fetch(BASE_URL, {
      headers: getAuthHeaders()
    }).then(function (res) {
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    }).then(function (categories) {
      localStorage.setItem('bou_categories', JSON.stringify(categories));
      return categories;
    });
  }

  function getActiveCategories() {
    return getCategories().then(function (cats) {
      return cats.filter(function (c) { return c.isActive === true || c.status === 'Active'; });
    });
  }

  function saveCategories(categories) {
    localStorage.setItem('bou_categories', JSON.stringify(categories));
    return Promise.resolve(categories);
  }

  return {
    getCategories: getCategories,
    getActiveCategories: getActiveCategories,
    saveCategories: saveCategories
  };
})();
