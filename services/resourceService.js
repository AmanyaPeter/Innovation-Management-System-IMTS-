var ResourceService = (function () {
  var BASE_URL = '/data/resources.json';

  function getResources() {
    return fetch(BASE_URL).then(function (res) {
      if (!res.ok) throw new Error('Failed to fetch resources');
      return res.json();
    });
  }

  function getResourceById(id) {
    return getResources().then(function (resources) {
      var resource = resources.find(function (r) { return r.id === id; });
      if (!resource) throw new Error('Resource not found: ' + id);
      return resource;
    });
  }

  function getResourcesByCategory(category) {
    return getResources().then(function (resources) {
      return resources.filter(function (r) { return r.category === category; });
    });
  }

  function getResourceCategories() {
    return getResources().then(function (resources) {
      var cats = [];
      resources.forEach(function (r) {
        if (cats.indexOf(r.category) === -1) cats.push(r.category);
      });
      return cats.sort();
    });
  }

  function searchResources(query) {
    return getResources().then(function (resources) {
      if (!query || !query.trim()) return resources;
      var q = query.toLowerCase().trim();
      return resources.filter(function (r) {
        return r.title.toLowerCase().indexOf(q) !== -1 ||
               r.description.toLowerCase().indexOf(q) !== -1;
      });
    });
  }

  return {
    getResources: getResources,
    getResourceById: getResourceById,
    getResourcesByCategory: getResourcesByCategory,
    getResourceCategories: getResourceCategories,
    searchResources: searchResources
  };
})();
