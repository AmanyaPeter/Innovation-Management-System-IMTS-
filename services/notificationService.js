var NotificationService = (function () {
  var BASE_URL = '/data/notifications.json';

  function getNotifications() {
    return fetch(BASE_URL).then(function (res) {
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return res.json();
    });
  }

  function getUnreadNotifications() {
    return getNotifications().then(function (notifications) {
      return notifications.filter(function (n) { return !n.isRead; });
    });
  }

  function getUnreadCount() {
    return getUnreadNotifications().then(function (notifications) {
      return notifications.length;
    });
  }

  function markAsRead(id) {
    return getNotifications().then(function (notifications) {
      var notification = notifications.find(function (n) { return n.id === id; });
      if (notification) notification.isRead = true;
      return notification;
    });
  }

  function markAllAsRead() {
    return getNotifications().then(function (notifications) {
      notifications.forEach(function (n) { n.isRead = true; });
      return true;
    });
  }

  function getRecentNotifications(count) {
    return getNotifications().then(function (notifications) {
      return notifications.slice(0, count || 5);
    });
  }

  return {
    getNotifications: getNotifications,
    getUnreadNotifications: getUnreadNotifications,
    getUnreadCount: getUnreadCount,
    markAsRead: markAsRead,
    markAllAsRead: markAllAsRead,
    getRecentNotifications: getRecentNotifications
  };
})();
