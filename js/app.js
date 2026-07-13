// ===== Dynamic UI Component Injection =====
(function injectComponents() {
  // Session timeout bar
  if (!document.getElementById('sessionBar')) {
    var sb = document.createElement('div');
    sb.id = 'sessionBar';
    sb.className = 'session-bar';
    sb.innerHTML =
      'Your session will expire soon due to inactivity. ' +
      '<button class="btn btn-sm btn-primary" onclick="staySignedIn()">Stay Signed In</button>';
    document.body.appendChild(sb);
  }

  // Breadcrumb - inject at top of .main-content if not present
  if (!document.getElementById('breadcrumb')) {
    var mc = document.querySelector('.main-content');
    if (mc && window.location.pathname.indexOf('index.html') === -1 && window.location.pathname !== '/') {
      var bc = document.createElement('div');
      bc.id = 'breadcrumb';
      bc.className = 'breadcrumb';
      mc.insertBefore(bc, mc.firstChild);
    }
  }
})();

// ===== Session Timeout =====
var timeoutTimer = null;
var warningTimer = null;
var SESSION_DURATION = 30 * 60 * 1000;
var WARNING_BEFORE = 5 * 60 * 1000;

function resetSessionTimer() {
  var bar = document.getElementById('sessionBar');
  if (bar) bar.classList.remove('active');
  clearTimeout(timeoutTimer);
  clearTimeout(warningTimer);
  if (window.location.pathname.indexOf('index.html') !== -1 || window.location.pathname === '/') return;
  warningTimer = setTimeout(showSessionWarning, SESSION_DURATION - WARNING_BEFORE);
  timeoutTimer = setTimeout(handleSessionTimeout, SESSION_DURATION);
}

function showSessionWarning() {
  var bar = document.getElementById('sessionBar');
  if (bar) bar.classList.add('active');
}

function handleSessionTimeout() {
  var bar = document.getElementById('sessionBar');
  if (bar) bar.classList.remove('active');
  ToastSystem.showToast('Session timed out. Redirecting to login.', 'error');
  setTimeout(function () { window.location.href = '../../index.html'; }, 1500);
}

function staySignedIn() {
  resetSessionTimer();
  ToastSystem.showToast('Session extended.', 'success');
}

['click', 'keydown', 'mousemove', 'scroll', 'touchstart'].forEach(function (ev) {
  document.addEventListener(ev, resetSessionTimer);
});

// ===== Breadcrumb =====
function generateBreadcrumb() {
  var container = document.getElementById('breadcrumb');
  if (!container) return;
  var path = window.location.pathname;
  var parts = path.replace(/\.html$/, '').split('/').filter(Boolean);
  var html = '<a href="../../index.html">Home</a>';
  var roleMap = {
    'staff': 'Staff',
    'innovation-team': 'Innovation Team',
    'admin': 'Admin'
  };
  var pageNames = {
    'dashboard': 'Dashboard',
    'submit-idea': 'Submit Idea',
    'my-ideas': 'My Ideas',
    'idea-details': 'Idea Details',
    'notifications': 'Notifications',
    'resources': 'Resources Library',
    'submitted-ideas': 'Submitted Ideas',
    'review-idea': 'Review Idea',
    'reports': 'Reports',
    'categories': 'Categories',
    'permissions': 'Permissions',
    'users': 'Users',
    'activity-log': 'Activity Log',
    'forgot-password': 'Forgot Password',
    'change-password': 'Change Password'
  };
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i];
    html += '<span class="separator">/</span>';
    if (roleMap[p]) {
      html += '<span>' + roleMap[p] + '</span>';
    } else if (pageNames[p]) {
      html += '<span class="current">' + pageNames[p] + '</span>';
    } else {
      html += '<span>' + p.charAt(0).toUpperCase() + p.slice(1) + '</span>';
    }
  }
  container.innerHTML = html;
}

// ===== Login Handler =====
function handleLogin() {
  var username = document.getElementById('username');
  var password = document.getElementById('password');
  var role = document.getElementById('loginRole');
  if (!username || !password) return;
  if (!username.value.trim() || !password.value.trim()) {
    ToastSystem.showToast('Please enter both username and password.', 'error');
    return;
  }
  var roleValue = role ? role.value : 'staff';
  var email = username.value.trim();
  // If username doesn't look like an email, map to a known test email
  if (email.indexOf('@') === -1) {
    var userMap = { 'brian': 'brian@bou.or.ug', 'jane': 'jane.mukasa@bou.or.ug', 'admin': 'admin@bou.or.ug' };
    email = userMap[email.toLowerCase()] || email;
  }
  AuthSystem.login(email, password.value.trim()).then(function (result) {
    if (!result.success) {
      ToastSystem.showToast(result.reason === 'Account locked' ? 'Account is locked. Contact IT admin.' : 'Invalid credentials.', 'error');
      return;
    }
    ToastSystem.showToast('Login successful. Welcome!', 'success');
    setTimeout(function () {
      window.location.href = AuthSystem.getDestinationForRole(roleValue);
    }, 600);
  }).catch(function () {
    ToastSystem.showToast('Login failed. Please try again.', 'error');
  });
}

// ===== Notification button =====
function getNotificationsUrl() {
  return '../../pages/staff/notifications.html';
}

document.querySelectorAll('.notification-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    window.location.href = getNotificationsUrl();
  });
});

// ===== Tab switching =====
document.querySelectorAll('.notification-tabs').forEach(function (tabs) {
  tabs.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');
    });
  });
});

// ===== Toggle password =====
var togglePwd = document.getElementById('togglePassword');
if (togglePwd) {
  togglePwd.addEventListener('click', function () {
    var input = document.getElementById('password');
    if (!input) return;
    var type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    this.textContent = type === 'password' ? '\u25CF' : '\u25C9';
    this.setAttribute('aria-label', type === 'password' ? 'Show password' : 'Hide password');
  });
}

// ===== Sidebar active state =====
document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
  var href = link.getAttribute('href');
  if (href && window.location.href.indexOf(href) !== -1) {
    link.classList.add('active');
  }
});

// ===== Logout =====
document.querySelectorAll('.logout-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        ModalSystem.openModal('Log Out', 'Are you sure you want to log out?', 'confirm', function () {
            AuthSystem.logout();
            ToastSystem.showToast('Logged out successfully.', 'info');
            setTimeout(function () { window.location.href = '../../index.html'; }, 500);
        });
    });
});

// ===== Stepper =====
function goToStep(step) {
  var stepperSteps = document.querySelectorAll('.stepper-step');
  var formPages = document.querySelectorAll('.form-page');
  stepperSteps.forEach(function (el, i) {
    el.classList.remove('active', 'completed');
    if (i + 1 < step) el.classList.add('completed');
    else if (i + 1 === step) el.classList.add('active');
  });
  formPages.forEach(function (el, i) {
    el.style.display = i + 1 === step ? 'block' : 'none';
  });
  document.querySelectorAll('.stepper-connector').forEach(function (el, i) {
    el.classList.toggle('completed', i + 1 < step);
  });
}

function nextStep(current) { goToStep(current + 1); }
function prevStep(current) { goToStep(current - 1); }

if (document.querySelector('.stepper')) { goToStep(1); }

// ===== Save draft =====
document.querySelectorAll('.save-draft-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    ToastSystem.showToast('Draft saved successfully.', 'success');
  });
});

// ===== File upload =====
document.querySelectorAll('.file-upload-area').forEach(function (area) {
  area.addEventListener('click', function () {
    var input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.click();
  });
});

// ===== Quick action =====
document.querySelectorAll('.quick-action-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    window.location.href = '../../pages/staff/submit-idea.html';
  });
});

// ===== Idea submission final =====
document.querySelectorAll('.submit-idea-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    ToastSystem.showToast('Idea submitted successfully!', 'success');
    setTimeout(function () { window.location.href = '../../pages/staff/my-ideas.html'; }, 800);
  });
});

// ===== My Ideas actions =====
document.querySelectorAll('.view-idea-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    window.location.href = '../../pages/staff/idea-details.html';
  });
});

document.querySelectorAll('.edit-idea-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    window.location.href = '../../pages/staff/submit-idea.html';
  });
});

document.querySelectorAll('.retract-idea-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    ModalSystem.openModal('Retract Idea', 'Are you sure you want to retract this idea? This action cannot be undone.', 'confirm', function () { ToastSystem.showToast('Idea retracted successfully.', 'success'); });
  });
});

document.querySelectorAll('.cancel-idea-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    ModalSystem.openModal('Cancel Idea', 'Are you sure you want to cancel this idea?', 'confirm', function () { ToastSystem.showToast('Idea cancelled.', 'info'); });
  });
});

// ===== Review idea =====
document.querySelectorAll('.review-idea-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    window.location.href = '../../pages/innovation-team/review-idea.html';
  });
});

// ===== Save review =====
document.querySelectorAll('.save-review-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    ToastSystem.showToast('Review saved. Submitter will be notified.', 'success');
  });
});

// ===== Notify submitter =====
document.querySelectorAll('.notify-submitter-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    ToastSystem.showToast('Submitter has been notified.', 'success');
  });
});

// ===== Reports =====
document.querySelectorAll('.generate-report-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    ToastSystem.showToast('Report generated successfully.', 'success');
  });
});

document.querySelectorAll('.export-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var format = this.getAttribute('data-format') || 'exported';
    ToastSystem.showToast('Exporting as ' + format + '...', 'info');
  });
});

// ===== Categories =====
document.querySelectorAll('.add-category-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    ModalSystem.openModal('Add Category', 'Enter the name for the new category:', 'confirm', function () { ToastSystem.showToast('Category added successfully.', 'success'); });
  });
});

document.querySelectorAll('.edit-cat-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    ModalSystem.openModal('Edit Category', 'Enter the new name for this category:', 'confirm', function () { ToastSystem.showToast('Category updated.', 'success'); });
  });
});

document.querySelectorAll('.delete-cat-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    ModalSystem.openModal('Delete Category', 'Are you sure you want to delete this category? Ideas in this category may be affected.', 'confirm', function () {
      var row = btn.closest('tr');
      if (row) row.remove();
      ToastSystem.showToast('Category deleted.', 'info');
    });
  });
});

// ===== Permissions =====
document.querySelectorAll('.edit-permissions-btn').forEach(function (btn) {
  btn.addEventListener('click', function () { ToastSystem.showToast('Permissions editor would open.', 'info'); });
});

document.querySelectorAll('.activate-user-btn').forEach(function (btn) {
  btn.addEventListener('click', function () { ToastSystem.showToast('User activated.', 'success'); });
});

document.querySelectorAll('.disable-user-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    ModalSystem.openModal('Disable User', 'Are you sure you want to disable this user?', 'confirm', function () { ToastSystem.showToast('User disabled.', 'info'); });
  });
});

// ===== User management =====
document.querySelectorAll('.create-user-btn').forEach(function (btn) {
  btn.addEventListener('click', function () { ToastSystem.showToast('Create user form would open.', 'info'); });
});

document.querySelectorAll('.reset-pwd-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    ModalSystem.openModal('Reset Password', 'Send password reset email to this user?', 'confirm', function () { ToastSystem.showToast('Password reset email sent.', 'success'); });
  });
});

document.querySelectorAll('.lock-account-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    ModalSystem.openModal('Lock Account', 'Are you sure you want to lock this account? The user will not be able to log in.', 'confirm', function () { ToastSystem.showToast('Account locked.', 'info'); });
  });
});

document.querySelectorAll('.unlock-account-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    ModalSystem.openModal('Unlock Account', 'Unlock this account? The user will regain access.', 'confirm', function () { ToastSystem.showToast('Account unlocked.', 'success'); });
  });
});

// ===== Notification click =====
document.querySelectorAll('.notification-item').forEach(function (item) {
  item.addEventListener('click', function () {
    window.location.href = '../../pages/staff/idea-details.html';
  });
});

// ===== Forgot password =====
function handleForgotPassword() {
  var email = document.getElementById('resetEmail');
  if (!email) return;
  if (!email.value.trim()) {
    ToastSystem.showToast('Please enter your email address.', 'error');
    return;
  }
  ToastSystem.showToast('Password reset link sent to your email.', 'success');
}

// ===== Change password =====
function handleChangePassword() {
  var currentPwd = document.getElementById('currentPassword');
  var newPwd = document.getElementById('newPassword');
  var confirmPwd = document.getElementById('confirmPassword');
  if (!currentPwd || !newPwd || !confirmPwd) return;
  if (!currentPwd.value.trim() || !newPwd.value.trim() || !confirmPwd.value.trim()) {
    ToastSystem.showToast('Please fill in all fields.', 'error');
    return;
  }
  if (newPwd.value !== confirmPwd.value) {
    ToastSystem.showToast('New passwords do not match.', 'error');
    return;
  }
  ToastSystem.showToast('Password changed successfully.', 'success');
  setTimeout(function () { window.location.href = '../../index.html'; }, 1000);
}

// ===== Comment submit =====
document.querySelectorAll('.comment-submit-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var textarea = this.parentElement.querySelector('textarea');
    if (textarea && textarea.value.trim()) {
      ToastSystem.showToast('Comment posted.', 'success');
      textarea.value = '';
    } else {
      ToastSystem.showToast('Please write a comment.', 'error');
    }
  });
});

// ===== Resource view/download =====
document.querySelectorAll('.resource-view-btn').forEach(function (btn) {
  btn.addEventListener('click', function () { ToastSystem.showToast('Opening resource...', 'info'); });
});
document.querySelectorAll('.resource-download-btn').forEach(function (btn) {
  btn.addEventListener('click', function () { ToastSystem.showToast('Downloading resource...', 'info'); });
});

// ===== Individual / Team Toggle =====
function toggleSubmissionType() {
  var isTeam = document.querySelector('input[name="submissionType"]:checked').value === 'team';
  var indivSection = document.getElementById('individualSection');
  var teamSection = document.getElementById('teamSection');

  if (isTeam) {
    // Switch to Team: clear individual selections
    indivSection.classList.remove('visible');
    teamSection.classList.add('visible');
    clearIndividualSelections();
  } else {
    // Switch to Individual: clear team selections
    teamSection.classList.remove('visible');
    indivSection.classList.add('visible');
    clearTeamSelections();
  }
}

function clearIndividualSelections() {
  document.querySelectorAll('#individualSection input[type="radio"]').forEach(function (el) { el.checked = false; });
  var bu = document.getElementById('indivBusinessUnit');
  var st = document.getElementById('indivStation');
  if (bu) bu.selectedIndex = 0;
  if (st) st.selectedIndex = 0;
  hideIndividualErrors();
}

function clearTeamSelections() {
  document.querySelectorAll('#teamSection .matrix-radio').forEach(function (el) { el.checked = false; });
  document.getElementById('teamMatrixFeedback').classList.remove('show');
}

function hideIndividualErrors() {
  var fields = ['indivBuFeedback', 'indivStationFeedback', 'indivAgeFeedback', 'indivGenderFeedback', 'indivRankFeedback'];
  fields.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('show');
  });
  document.querySelectorAll('#individualSection .form-group').forEach(function (g) { g.classList.remove('has-error'); });
}

// ===== Step 1 Validation =====
function validateStep1() {
  var isTeam = document.querySelector('input[name="submissionType"]:checked').value === 'team';
  var btn = document.querySelector('.form-page#step1 .btn-primary');
  btn.dataset.blocked = 'true';

  if (isTeam) {
    return validateTeam();
  } else {
    return validateIndividual();
  }
}

function validateIndividual() {
  var valid = true;
  hideIndividualErrors();

  // Business Unit
  var bu = document.getElementById('indivBusinessUnit');
  if (!bu.value) { showFieldError('indivBuFeedback', bu); valid = false; }

  // Station
  var st = document.getElementById('indivStation');
  if (!st.value) { showFieldError('indivStationFeedback', st); valid = false; }

  // Age
  if (!document.querySelector('input[name="indivAge"]:checked')) {
    showFieldError('indivAgeFeedback', null);
    valid = false;
  }

  // Gender
  if (!document.querySelector('input[name="indivGender"]:checked')) {
    showFieldError('indivGenderFeedback', null);
    valid = false;
  }

  // Rank
  if (!document.querySelector('input[name="indivRank"]:checked')) {
    showFieldError('indivRankFeedback', null);
    valid = false;
  }

  if (!valid) {
    ToastSystem.showToast('Please complete all required fields in Innovator Details.', 'error');
  } else {
    document.querySelector('.form-page#step1 .btn-primary').dataset.blocked = '';
    nextStep(1);
  }
  return valid;
}

function showFieldError(feedbackId, inputEl) {
  var fb = document.getElementById(feedbackId);
  if (fb) fb.classList.add('show');
  if (inputEl) {
    var group = inputEl.closest('.form-group');
    if (group) group.classList.add('has-error');
  }
}

function validateTeam() {
  var matrices = ['teamRankMatrix', 'teamAgeMatrix', 'teamGenderMatrix', 'teamStationMatrix'];
  var hasSelection = false;

  matrices.forEach(function (matrixId) {
    var matrix = document.getElementById(matrixId);
    if (!matrix) return;
    var radios = matrix.querySelectorAll('.matrix-radio:checked');
    if (radios.length > 0) hasSelection = true;
  });

  var fb = document.getElementById('teamMatrixFeedback');
  if (!hasSelection) {
    fb.classList.add('show');
    ToastSystem.showToast('Please complete at least one team composition matrix.', 'error');
    return false;
  }

  fb.classList.remove('show');
  document.querySelector('.form-page#step1 .btn-primary').dataset.blocked = '';
  nextStep(1);
  return true;
}

// ===== Init =====
generateBreadcrumb();
resetSessionTimer();
