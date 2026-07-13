(function () {

  var allCategories = [];
  var nextId = 8;

  function loadAndRender() {
    CategoryService.getCategories().then(function (cats) {
      allCategories = cats;
      nextId = cats.reduce(function (max, c) { return Math.max(max, c.id); }, 0) + 1;
      render();
    });
  }

  function render() {
    var tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    allCategories.forEach(function (c) {
      tbody.appendChild(createRow(c));
    });
  }

  function createRow(c) {
    var tr = document.createElement('tr');
    var isActive = c.status === 'Active';
    tr.innerHTML =
      '<td>' + escapeHtml(c.name) + '</td>' +
      '<td>' + escapeHtml(c.description) + '</td>' +
      '<td>' + formatDate(c.createdDate) + '</td>' +
      '<td><span class="badge ' + (isActive ? 'badge-active' : 'badge-inactive') + '">' + escapeHtml(c.status) + '</span></td>' +
      '<td>' +
        '<div class="actions">' +
          '<button class="btn btn-sm btn-secondary edit-cat-btn" data-id="' + c.id + '">Edit</button>' +
          '<button class="btn btn-sm btn-danger delete-cat-btn" data-id="' + c.id + '">Delete</button>' +
        '</div>' +
      '</td>';

    tr.querySelector('.edit-cat-btn')?.addEventListener('click', function () {
      ModalSystem.openModal('Edit Category',
        '<div style="display:flex;flex-direction:column;gap:12px;">' +
          '<div><label style="font-size:13px;font-weight:500;display:block;margin-bottom:4px;">Name</label><input id="editCatName" class="form-control" value="' + escapeHtml(c.name) + '"></div>' +
          '<div><label style="font-size:13px;font-weight:500;display:block;margin-bottom:4px;">Description</label><textarea id="editCatDesc" class="form-control" style="min-height:60px;">' + escapeHtml(c.description) + '</textarea></div>' +
          '<div><label style="font-size:13px;font-weight:500;display:block;margin-bottom:4px;">Status</label><select id="editCatStatus" class="form-control"><option value="Active"' + (c.status === 'Active' ? ' selected' : '') + '>Active</option><option value="Inactive"' + (c.status === 'Inactive' ? ' selected' : '') + '>Inactive</option></select></div>' +
        '</div>', 'confirm', function () {
        var name = document.getElementById('editCatName')?.value?.trim();
        var desc = document.getElementById('editCatDesc')?.value?.trim();
        var status = document.getElementById('editCatStatus')?.value;
        if (!name) { ToastSystem.showToast('Category name is required.', 'error'); return; }
        c.name = name;
        c.description = desc || '';
        c.status = status || 'Active';
        render();
        ToastSystem.showToast('Category updated.', 'success');
      });
    });

    tr.querySelector('.delete-cat-btn')?.addEventListener('click', function () {
      ModalSystem.openModal('Delete Category', 'Are you sure you want to delete "' + c.name + '"?', 'confirm', function () {
        var idx = allCategories.indexOf(c);
        if (idx !== -1) allCategories.splice(idx, 1);
        render();
        ToastSystem.showToast('Category deleted.', 'info');
      });
    });

    return tr;
  }

  document.querySelector('.add-category-btn')?.addEventListener('click', function () {
    ModalSystem.openModal('Add Category',
      '<div style="display:flex;flex-direction:column;gap:12px;">' +
        '<div><label style="font-size:13px;font-weight:500;display:block;margin-bottom:4px;">Name</label><input id="addCatName" class="form-control" placeholder="e.g. Digital Banking"></div>' +
        '<div><label style="font-size:13px;font-weight:500;display:block;margin-bottom:4px;">Description</label><textarea id="addCatDesc" class="form-control" style="min-height:60px;" placeholder="Brief description of the category"></textarea></div>' +
      '</div>', 'confirm', function () {
      var name = document.getElementById('addCatName')?.value?.trim();
      var desc = document.getElementById('addCatDesc')?.value?.trim();
      if (!name) { ToastSystem.showToast('Category name is required.', 'error'); return; }
      allCategories.push({
        id: nextId++,
        name: name,
        description: desc || '',
        createdDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      });
      render();
      ToastSystem.showToast('Category "' + name + '" added.', 'success');
    });
  });

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return d.getDate() + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] + ' ' + d.getFullYear();
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  loadAndRender();
})();
