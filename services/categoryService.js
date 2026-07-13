var CategoryService = (function () {
  var BASE_URL = '/data/categories.json';

  function getCategories() {
    var stored = localStorage.getItem('bou_categories');
    if (stored) {
      try {
        return Promise.resolve(JSON.parse(stored));
      } catch (e) {}
    }
    return fetch(BASE_URL).then(function (res) {
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    }).then(function (categories) {
      localStorage.setItem('bou_categories', JSON.stringify(categories));
      return categories;
    });
  }

  function getActiveCategories() {
    return getCategories().then(function (cats) {
      return cats.filter(function (c) { return c.status === 'Active'; });
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
