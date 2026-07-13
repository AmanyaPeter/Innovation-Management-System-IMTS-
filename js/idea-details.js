(function () {

  function getParam(name) {
    var match = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function loadIdea() {
    var id = parseInt(getParam('id'), 10);
    if (!id) {
      document.querySelector('.detail-grid').innerHTML = '<div class="card" style="padding:40px;text-align:center;color:var(--text-tertiary);">Idea not found.</div>';
      return;
    }

    Promise.all([
      IdeaService.getIdeas(),
      getLocalIdeas()
    ]).then(function (results) {
      var all = results[0].concat(results[1]);
      var idea = all.find(function (i) { return i.id === id; });
      if (!idea) {
        document.querySelector('.detail-grid').innerHTML = '<div class="card" style="padding:40px;text-align:center;color:var(--text-tertiary);">Idea not found.</div>';
        return;
      }
      renderIdea(idea);
    });
  }

  function getLocalIdeas() {
    try { return JSON.parse(localStorage.getItem('bou_ideas') || '[]'); } catch (e) { return []; }
  }

  function renderIdea(idea) {
    // Header
    var header = document.querySelector('.detail-section h3');
    if (header) header.textContent = idea.title;

    var sub = document.querySelector('.detail-section p');
    if (sub) sub.textContent = 'Submitted on ' + formatDate(idea.dateSubmitted) + ' by ' + idea.submitterName;

    var badges = document.querySelectorAll('.detail-section .badge');
    if (badges.length >= 1) {
      var statusMap = {
        'Submitted': 'badge-submitted', 'Under Review': 'badge-under-review',
        'Pending Information': 'badge-pending-info', 'Approved': 'badge-approved', 'Declined': 'badge-declined'
      };
      badges[0].className = 'badge ' + (statusMap[idea.status] || 'badge-submitted');
      badges[0].textContent = idea.status;
    }
    if (badges.length >= 2) {
      var stageMap = {
        'Submitted': 'badge-submitted', 'Concept Development': 'badge-concept',
        'Experimentation': 'badge-experimentation', 'Deployment': 'badge-deployment', 'Closed': 'badge-closed'
      };
      badges[1].className = 'badge ' + (stageMap[idea.stage] || 'badge-submitted');
      badges[1].textContent = idea.stage;
    }

    // Description
    setText('Description ~ p', idea.executiveSummary);
    setText('Problem Statement ~ p', idea.problemOrOpportunity);
    setText('Proposed Solution ~ p', idea.proposedSolution);

    // Attachments
    var attachContainer = null;
    var sections = document.querySelectorAll('.detail-section');
    sections.forEach(function (s) {
      var h3 = s.querySelector('h3');
      if (h3 && h3.textContent.trim() === 'Attachments') {
        attachContainer = s.querySelector('div[style*="gap"]');
      }
    });

    if (attachContainer) {
      if (idea.attachments && idea.attachments.length) {
        attachContainer.innerHTML = '';
        idea.attachments.forEach(function (a) {
          var el;
          if (a.data) {
            el = document.createElement('a');
            el.href = a.data;
            el.download = a.name;
            el.title = 'Click to download ' + a.name;
            el.style.cssText = 'background:#f0f0f0;padding:6px 14px;border-radius:4px;font-size:13px;color:var(--text-primary);text-decoration:none;display:inline-flex;align-items:center;gap:6px;cursor:pointer;';
          } else {
            el = document.createElement('span');
            el.style.cssText = 'background:#f0f0f0;padding:6px 14px;border-radius:4px;font-size:13px;display:inline-flex;align-items:center;gap:6px;';
          }

          var icon = a.type?.indexOf('spreadsheet') !== -1 ? 'bar-chart-3' : a.type?.indexOf('image') !== -1 ? 'image' : 'file-text';
          el.innerHTML = '<i data-lucide="' + icon + '" style="width:14px;height:14px;"></i> ' + escapeHtml(a.name);
          attachContainer.appendChild(el);
        });
        if (typeof lucide !== 'undefined') lucide.createIcons();
      } else {
        attachContainer.innerHTML = '<span style="color:var(--text-tertiary);font-size:13px;">No attachments</span>';
      }
    }

    // Progress tracker
    var tracker = document.querySelector('.progress-tracker');
    if (tracker && idea.progressStages) {
      tracker.innerHTML = '';
      idea.progressStages.forEach(function (s) {
        var div = document.createElement('div');
        div.className = 'stage-item' + (s.completed ? ' completed' : '') + (s.active ? ' active' : '');
        div.innerHTML = '<div class="stage-dot"></div><div class="stage-name">' + escapeHtml(s.name) + '</div>';
        tracker.appendChild(div);
      });
    }

    // Timeline
    var timelineContainer = tracker?.parentElement?.nextElementSibling?.querySelector('div[style]');
    if (timelineContainer && idea.timeline) {
      timelineContainer.innerHTML = '';
      idea.timeline.forEach(function (t) {
        var div = document.createElement('div');
        div.style.cssText = 'display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;';
        div.innerHTML = '<span>' + escapeHtml(t.stage) + '</span><span>' + formatDate(t.date) + '</span>';
        timelineContainer.appendChild(div);
      });
      var lastDiv = document.createElement('div');
      lastDiv.style.cssText = 'display:flex;justify-content:space-between;padding:8px 0;';
      lastDiv.innerHTML = '<span>Last Updated</span><span>' + formatDate(idea.lastUpdated) + '</span>';
      timelineContainer.appendChild(lastDiv);
    }

    // Comments
    renderComments(idea.comments);

    // Back link
    var backLink = document.querySelector('[style*="margin-bottom"][style*="20px"] a');
    if (backLink) backLink.href = 'my-ideas.html';
  }

  function setText(pattern, val) {
    if (!val) return;
    var sections = document.querySelectorAll('.detail-section');
    sections.forEach(function (s) {
      var h3 = s.querySelector('h3');
      var p = s.querySelector('p');
      if (h3 && pattern.indexOf(h3.textContent.trim()) !== -1 && p) {
        p.textContent = val;
      }
    });
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

  // Wire comment submit
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
