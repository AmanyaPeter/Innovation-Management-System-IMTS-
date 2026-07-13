var ToastSystem = (function () {
  var icons = {
    success: 'check-circle',
    error: 'x-circle',
    warning: 'alert-triangle',
    info: 'info'
  };

  function createContainer() {
    if (document.getElementById('toastContainer')) return;
    var tc = document.createElement('div');
    tc.id = 'toastContainer';
    tc.className = 'toast-container';
    document.body.appendChild(tc);
  }

  function showToast(message, type) {
    createContainer();
    var container = document.getElementById('toastContainer');
    if (!container) return;
    type = type || 'info';
    var icon = icons[type] || icons.info;
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML = '<i data-lucide="' + icon + '" style="width:18px;height:18px;color:currentColor;"></i> ' + message;
    container.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3500);
  }

  createContainer();

  return {
    showToast: showToast
  };
})();
