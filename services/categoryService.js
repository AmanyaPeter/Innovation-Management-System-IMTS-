var CategoryService = (function () {
  var BASE_URL = '/data/categories.json';

  function getCategories() {
    return fetch(BASE_URL).then(function (res) {
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    });
  }

  function getActiveCategories() {
    return getCategories().then(function (cats) {
      return cats.filter(function (c) { return c.status === 'Active'; });
    });
  }

  return {
    getCategories: getCategories,
    getActiveCategories: getActiveCategories
  };
})();
