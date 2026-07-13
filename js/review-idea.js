(function () {

  function getParam(name) {
    var match = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function loadIdea() {
    var id = parseInt(getParam('id'), 10);
    if (!id) return;

    Promise.all([
      IdeaService.getIdeas(),
      getLocalIdeas()
    ]).then(function (results) {
      var all = results[0].concat(results[1]);
      var idea = all.find(function (i) { return i.id === id; });
      if (!idea) return;
      renderIdea(idea);
    });
  }

  function getLocalIdeas() {
    try { return JSON.parse(localStorage.getItem('bou_ideas') || '[]'); } catch (e) { return []; }
  }

  function renderIdea(idea) {
    // Title
    var h3 = document.querySelector('.detail-section h3');
    if (h3) h3.textContent = idea.title;

    // Submitter info
    var sub = document.querySelector('.detail-section p');
    if (sub) sub.innerHTML = 'Submitted by <strong>' + escapeHtml(idea.submitterName) + '</strong> &middot; ' + escapeHtml(idea.department) + ' &middot; ' + formatDate(idea.dateSubmitted);

    // Description
    var descSections = document.querySelectorAll('.detail-section p');
    if (descSections.length >= 2) descSections[1].textContent = idea.executiveSummary;
    if (descSections.length >= 3) descSections[2].textContent = idea.problemOrOpportunity;
    if (descSections.length >= 4) descSections[3].textContent = idea.proposedSolution;

    // Attachments
    var attachContainer = document.querySelector('[style*="display:flex"][style*="gap:10px"]');
    if (attachContainer && idea.attachments && idea.attachments.length) {
      attachContainer.innerHTML = '';
      idea.attachments.forEach(function (a) {
        attachContainer.appendChild(createFileBadge(a));
      });
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Strategic alignment
    var alignPs = document.querySelectorAll('.detail-section p strong');
    if (alignPs.length >= 1) alignPs[0].parentElement.textContent = 'Strategic Objective: ' + (idea.strategicObjective || '—');
    if (alignPs.length >= 2) alignPs[1].parentElement.textContent = 'SDG Contribution: ' + (idea.sdgContribution || '—');

    // Review controls
    var selects = document.querySelectorAll('.review-grid select');
    if (selects.length >= 1) selects[0].value = idea.status || 'Submitted';
    if (selects.length >= 2) selects[1].value = idea.stage || 'Submitted';
    if (selects.length >= 3) selects[2].value = idea.reviewDeadline ? idea.reviewDeadline.split('T')[0] : '';

    // Comments
    renderComments(idea.comments);

    // Approval workflow
    renderWorkflow(idea.approvalWorkflow);
  }

  function createFileBadge(a) {
    var span = document.createElement('span');
    span.style.cssText = 'background:#f0f0f0;padding:6px 14px;border-radius:4px;font-size:13px;';
    var icon = a.type?.indexOf('spreadsheet') !== -1 ? 'bar-chart-3' : a.type?.indexOf('image') !== -1 ? 'image' : 'file-text';
    span.innerHTML = '<i data-lucide="' + icon + '" style="width:14px;height:14px;vertical-align:middle;"></i> ' + escapeHtml(a.name);
    return span;
  }

  function renderComments(comments) {
    var thread = document.querySelector('.comment-thread');
    if (!thread) return;
    thread.innerHTML = '';
    if (!comments || !comments.length) {
      thread.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text-tertiary);font-size:13px;">No comments yet.</div>';
      return;
    }
    comments.forEach(function (c) {
      var item = document.createElement('div');
      item.className = 'comment-item';
      var initials = (c.author || '?').split(' ').map(function (s) { return s[0]; }).join('').toUpperCase().slice(0, 2);
      var meta = c.authorRole ? escapeHtml(c.authorRole) + ' &middot; ' + timeAgo(c.timestamp) : timeAgo(c.timestamp);
      item.innerHTML =
        '<div class="comment-avatar">' + initials + '</div>' +
        '<div class="comment-body">' +
          '<span class="comment-author">' + escapeHtml(c.author) + '</span>' +
          '<span class="comment-meta">' + meta + '</span>' +
          '<div class="comment-text">' + escapeHtml(c.text) + '</div>' +
        '</div>';
      thread.appendChild(item);
    });
  }

  function renderWorkflow(workflow) {
    if (!workflow) return;
    var cards = document.querySelectorAll('.card');
    var workflowCard = null;
    cards.forEach(function (c) {
      var h = c.querySelector('h3');
      if (h && h.textContent === 'Approval Workflow') workflowCard = c;
    });
    if (!workflowCard) return;
    var container = workflowCard.querySelector('div[style*="font-size"]');
    if (!container) return;
    container.innerHTML = '';
    workflow.forEach(function (w) {
      var div = document.createElement('div');
      div.style.cssText = 'display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0;';
      var color = w.status === 'Complete' ? '#2e7d32' : w.status === 'Pending' ? '#e65100' : '#999';
      var icon = w.status === 'Complete' ? '<i data-lucide="check-circle" style="width:14px;height:14px;vertical-align:middle;"></i> ' : '';
      div.innerHTML = '<span>' + escapeHtml(w.step) + '</span><span style="color:' + color + ';">' + icon + escapeHtml(w.status) + '</span>';
      container.appendChild(div);
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Wire review buttons
  document.querySelector('.save-review-btn')?.addEventListener('click', function () {
    ToastSystem.showToast('Review saved. Submitter will be notified.', 'success');
  });

  document.querySelector('.notify-submitter-btn')?.addEventListener('click', function () {
    ToastSystem.showToast('Submitter has been notified.', 'success');
  });

  document.querySelector('.comment-submit-btn')?.addEventListener('click', function () {
    var textarea = this.parentElement.querySelector('textarea');
    if (textarea && textarea.value.trim()) {
      ToastSystem.showToast('Comment posted.', 'success');
      textarea.value = '';
    } else {
      ToastSystem.showToast('Please write a comment.', 'error');
    }
  });

  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return d.getDate() + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] + ' ' + d.getFullYear();
  }

  function timeAgo(iso) {
    if (!iso) return '';
    var diff = Date.now() - new Date(iso).getTime();
    var mins = Math.floor(diff / 60000);
    if (mins < 60) return mins + ' minutes ago';
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + ' hours ago';
    var days = Math.floor(hrs / 24);
    return days + ' days ago';
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  loadIdea();
})();
