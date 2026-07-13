var ActivityService = (function () {
  var BASE_URL = '/data/activities.json';

  function getActivities() {
    return fetch(BASE_URL).then(function (res) {
      if (!res.ok) throw new Error('Failed to fetch activities');
      return res.json();
    });
  }

  function getActivitiesByUser(user) {
    return getActivities().then(function (activities) {
      return activities.filter(function (a) { return a.user === user; });
    });
  }

  function getActivitiesByModule(module) {
    return getActivities().then(function (activities) {
      return activities.filter(function (a) { return a.module === module; });
    });
  }

  return {
    getActivities: getActivities,
    getActivitiesByUser: getActivitiesByUser,
    getActivitiesByModule: getActivitiesByModule
  };
})();
