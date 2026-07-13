var ModalSystem = (function () {
  var overlay = null;
  var modalCallback = null;

  function createModal() {
    if (document.getElementById('modalOverlay')) return;
    overlay = document.createElement('div');
    overlay.id = 'modalOverlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal">' +
        '<div class="modal-header">' +
          '<h3 id="modalTitle">Title</h3>' +
          '<button class="modal-close">&times;</button>' +
        '</div>' +
        '<div class="modal-body" id="modalMessage">Message</div>' +
        '<div class="modal-footer" id="modalFooter">' +
          '<button class="btn btn-secondary" id="modalCancel" style="display:none;">Cancel</button>' +
          '<button class="btn btn-primary" id="modalConfirm" style="display:none;">Confirm</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (e) {
      if (e.target.classList.contains('modal-close') || e.target === overlay) {
        closeModal();
      }
    });
  }

  function openModal(title, message, type, callback) {
    createModal();
    var overlay = document.getElementById('modalOverlay');
    if (!overlay) return;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').innerHTML = message;
    var confirmBtn = document.getElementById('modalConfirm');
    var cancelBtn = document.getElementById('modalCancel');
    var footer = document.getElementById('modalFooter');

    confirmBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    confirmBtn.className = 'btn btn-primary';
    confirmBtn.onclick = null;
    cancelBtn.onclick = null;
    modalCallback = null;

    if (type === 'confirm') {
      confirmBtn.textContent = 'Confirm';
      cancelBtn.textContent = 'Cancel';
      confirmBtn.style.display = '';
      cancelBtn.style.display = '';
      modalCallback = callback || null;
      confirmBtn.onclick = function () { var cb = modalCallback; closeModal(); if (cb) cb(); };
      cancelBtn.onclick = function () { closeModal(); };
    } else {
      confirmBtn.textContent = 'OK';
      confirmBtn.style.display = '';
      confirmBtn.className = 'btn btn-primary';
      modalCallback = callback || null;
      confirmBtn.onclick = function () { var cb = modalCallback; closeModal(); if (cb) cb(); };
    }

    overlay.classList.add('active');
  }

  function closeModal() {
    var overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('active');
    modalCallback = null;
  }

  createModal();

  return {
    openModal: openModal,
    closeModal: closeModal
  };
})();
