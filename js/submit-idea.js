(function () {

  var DRAFT_KEY = 'bou_idea_draft';
  var uploadedAttachments = [];
  var editingIdeaId = null;

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function getParam(name) {
    var match = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  // Collect form data from all steps
  function collectFormData() {
    var isTeam = document.querySelector('input[name="submissionType"]:checked')?.value === 'team';

    var data = {
      id: editingIdeaId || Date.now(),
      title: document.querySelector('#step2 input[type="text"]')?.value || '',
      category: document.querySelector('input[name="innovationCat"]:checked')?.value || '',
      department: document.getElementById('indivBusinessUnit')?.value || '',
      stage: 'Submitted',
      status: 'Submitted',
      dateSubmitted: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      submitterName: document.getElementById('fullName')?.value || '',
      submitterEmail: document.getElementById('email')?.value || '',
      submissionType: isTeam ? 'team' : 'individual',
      individual: {},
      teamComposition: {},
      executiveSummary: document.querySelector('#step2 textarea')?.value || '',
      problemOrOpportunity: '',
      proposedSolution: '',
      attachments: uploadedAttachments,
      strategicObjective: document.querySelector('input[name="strategicObj"]:checked')?.value || '',
      innovationCategory: document.querySelector('input[name="innovationCat"]:checked')?.value || '',
      sdgContribution: '',
      expectedBenefits: document.querySelector('#step4 textarea:nth-of-type(1)')?.value || '',
      keyEnablers: document.querySelector('#step4 textarea:nth-of-type(2)')?.value || '',
      implementationApproach: document.querySelector('#step4 textarea:nth-of-type(3)')?.value || '',
      expectedImpactIndicators: document.querySelector('#step4 textarea:nth-of-type(4)')?.value || '',
      reviewer: '',
      reviewDeadline: '',
      reviewSlaStatus: '',
      approvalWorkflow: [
        { step: 'Initial Review', status: 'Pending' },
        { step: 'Manager Approval', status: 'Not Started' },
        { step: 'DDIPS Review', status: 'Not Started' },
        { step: 'Final Approval', status: 'Not Started' }
      ],
      comments: [],
      timeline: [{ stage: 'Submitted', date: new Date().toISOString().split('T')[0] }],
      progressStages: [
        { name: 'Submitted', completed: true },
        { name: 'Concept Development', completed: false },
        { name: 'Experimentation', completed: false },
        { name: 'Deployment', completed: false },
        { name: 'Closed', completed: false }
      ]
    };

    // Step 2 textareas
    var step2Textareas = document.querySelectorAll('#step2 textarea');
    if (step2Textareas.length >= 3) {
      data.problemOrOpportunity = step2Textareas[1].value;
      data.proposedSolution = step2Textareas[2].value;
    }

    if (isTeam) {
      data.teamComposition = collectTeamData();
    } else {
      data.individual = {
        fullName: document.getElementById('fullName')?.value || '',
        email: document.getElementById('email')?.value || '',
        businessUnit: document.getElementById('indivBusinessUnit')?.value || '',
        dutyStation: document.getElementById('indivStation')?.value || '',
        age: document.querySelector('input[name="indivAge"]:checked')?.value || '',
        gender: document.querySelector('input[name="indivGender"]:checked')?.value || '',
        jobRank: document.querySelector('input[name="indivRank"]:checked')?.value || ''
      };
      data.department = document.getElementById('indivBusinessUnit')?.value || '';
    }

    return data;
  }

  function collectTeamData() {
    var matrices = {
      teamMembersByRank: collectMatrix('teamRankMatrix'),
      teamMembersByAge: collectMatrix('teamAgeMatrix'),
      teamMembersByGender: collectMatrix('teamGenderMatrix'),
      teamMembersByStation: collectMatrix('teamStationMatrix')
    };
    return matrices;
  }

  function collectMatrix(matrixId) {
    var matrix = {};
    var table = document.getElementById(matrixId);
    if (!table) return matrix;
    var rows = table.querySelectorAll('tbody tr');
    rows.forEach(function (row) {
      var label = row.querySelector('td')?.textContent?.trim();
      if (!label) return;
      var checked = row.querySelector('.matrix-radio:checked');
      if (checked) matrix[label] = parseInt(checked.value, 10);
    });
    return matrix;
  }

  function saveDraft() {
    var data = collectFormData();
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    ToastSystem.showToast('Draft saved.', 'success');
  }

  function saveDraftSilently() {
    var data = collectFormData();
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  }

  function populateForm(data) {
    if (!data) return;

    // Step 1
    var fullNameInput = document.getElementById('fullName');
    if (fullNameInput && data.submitterName) fullNameInput.value = data.submitterName;

    var emailInput = document.getElementById('email');
    if (emailInput && data.submitterEmail) emailInput.value = data.submitterEmail;

    var subTypeRad = document.querySelector('input[name="submissionType"][value="' + (data.submissionType || 'individual') + '"]');
    if (subTypeRad) {
      subTypeRad.checked = true;
      if (typeof toggleSubmissionType === 'function') {
        toggleSubmissionType();
      }
    }

    if (data.submissionType === 'individual' && data.individual) {
      var buSelect = document.getElementById('indivBusinessUnit');
      if (buSelect && data.individual.businessUnit) buSelect.value = data.individual.businessUnit;

      var stationSelect = document.getElementById('indivStation');
      if (stationSelect && data.individual.dutyStation) stationSelect.value = data.individual.dutyStation;

      var ageRad = document.querySelector('input[name="indivAge"][value="' + data.individual.age + '"]');
      if (ageRad) ageRad.checked = true;

      var genRad = document.querySelector('input[name="indivGender"][value="' + data.individual.gender + '"]');
      if (genRad) genRad.checked = true;

      var rankRad = document.querySelector('input[name="indivRank"][value="' + data.individual.jobRank + '"]');
      if (rankRad) rankRad.checked = true;
    } else if (data.submissionType === 'team' && data.teamComposition) {
      populateMatrix('teamRankMatrix', data.teamComposition.teamMembersByRank);
      populateMatrix('teamAgeMatrix', data.teamComposition.teamMembersByAge);
      populateMatrix('teamGenderMatrix', data.teamComposition.teamMembersByGender);
      populateMatrix('teamStationMatrix', data.teamComposition.teamMembersByStation);
    }

    // Step 2
    var titleInput = document.querySelector('#step2 input[type="text"]');
    if (titleInput && data.title) titleInput.value = data.title;

    var step2Textareas = document.querySelectorAll('#step2 textarea');
    if (step2Textareas.length >= 3) {
      if (data.executiveSummary) step2Textareas[0].value = data.executiveSummary;
      if (data.problemOrOpportunity) step2Textareas[1].value = data.problemOrOpportunity;
      if (data.proposedSolution) step2Textareas[2].value = data.proposedSolution;
    }

    // Step 3
    var stratRad = document.querySelector('input[name="strategicObj"][value="' + data.strategicObjective + '"]');
    if (stratRad) stratRad.checked = true;

    var catRad = document.querySelector('input[name="innovationCat"][value="' + data.innovationCategory + '"]');
    if (catRad) catRad.checked = true;

    // Step 4
    var step4Textareas = document.querySelectorAll('#step4 textarea');
    if (step4Textareas.length >= 4) {
      if (data.expectedBenefits) step4Textareas[0].value = data.expectedBenefits;
      if (data.keyEnablers) step4Textareas[1].value = data.keyEnablers;
      if (data.implementationApproach) step4Textareas[2].value = data.implementationApproach;
      if (data.expectedImpactIndicators) step4Textareas[3].value = data.expectedImpactIndicators;
    }

    // Attachments
    uploadedAttachments = data.attachments || [];
    renderUploadedFiles();
  }

  function populateMatrix(matrixId, matrixData) {
    if (!matrixData) return;
    var table = document.getElementById(matrixId);
    if (!table) return;
    var rows = table.querySelectorAll('tbody tr');
    rows.forEach(function (row) {
      var label = row.querySelector('td')?.textContent?.trim();
      if (!label || matrixData[label] === undefined) return;
      var val = matrixData[label];
      var rad = row.querySelector('.matrix-radio[value="' + val + '"]');
      if (rad) rad.checked = true;
    });
  }

  function getLocalIdeas() {
    try {
      return JSON.parse(localStorage.getItem('bou_ideas') || '[]');
    } catch (e) { return []; }
  }

  function loadExistingIdeaOrDraft() {
    var idStr = getParam('id');
    if (idStr) {
      var id = parseInt(idStr, 10);
      editingIdeaId = id;

      Promise.all([
        IdeaService.getIdeas(),
        Promise.resolve(getLocalIdeas())
      ]).then(function (results) {
        var all = results[0].filter(function (r) {
          return !results[1].some(function (l) { return l.id === r.id; });
        }).concat(results[1]);

        var idea = all.find(function (i) { return i.id === id; });
        if (idea) {
          populateForm(idea);
          ToastSystem.showToast('Idea loaded for editing.', 'info');
        } else {
          ToastSystem.showToast('Idea not found.', 'error');
        }
      });
    } else {
      var saved = localStorage.getItem(DRAFT_KEY);
      if (!saved) return;
      try {
        var data = JSON.parse(saved);
        populateForm(data);
        ToastSystem.showToast('Draft restored.', 'info');
      } catch (e) {
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }

  function submitIdea() {
    var data = collectFormData();

    // Basic validation
    if (!data.title || !data.executiveSummary) {
      ToastSystem.showToast('Please complete all required fields before submitting.', 'error');
      return;
    }

    ModalSystem.openModal('Confirm Submission', 'Are you sure you want to submit this innovation idea?', 'confirm', function () {
      var ideas = [];
      try {
        ideas = JSON.parse(localStorage.getItem('bou_ideas') || '[]');
      } catch (e) { ideas = []; }

      // If editing an existing idea, update/replace it!
      var existingIndex = ideas.findIndex(function (i) { return i.id === editingIdeaId; });
      if (existingIndex !== -1) {
        ideas[existingIndex] = data;
      } else {
        ideas.push(data);
      }
      localStorage.setItem('bou_ideas', JSON.stringify(ideas));
      localStorage.removeItem(DRAFT_KEY);

      ToastSystem.showToast('Idea submitted successfully!', 'success');
      setTimeout(function () {
        window.location.href = 'my-ideas.html';
      }, 800);
    });
  }

  function renderUploadedFiles() {
    var listContainer = document.getElementById('uploadedFilesList');
    if (!listContainer) {
      listContainer = document.createElement('div');
      listContainer.id = 'uploadedFilesList';
      listContainer.style.cssText = 'margin-top:12px;display:flex;flex-direction:column;gap:8px;';
      var fileArea = document.querySelector('.file-upload-area');
      if (fileArea) {
        fileArea.parentNode.appendChild(listContainer);
      }
    }

    if (!listContainer) return;
    listContainer.innerHTML = '';

    uploadedAttachments.forEach(function (att, idx) {
      var item = document.createElement('div');
      item.className = 'uploaded-file-item';
      item.style.cssText = 'display:flex;justify-content:space-between;align-items:center;background:#f5f5f5;padding:8px 12px;border-radius:4px;font-size:13px;';

      var sizeKb = Math.round(att.size / 1024);
      var sizeText = sizeKb > 1024 ? (sizeKb / 1024).toFixed(1) + ' MB' : sizeKb + ' KB';

      item.innerHTML =
        '<span style="display:flex;align-items:center;gap:6px;max-width:85%;">' +
          '<i data-lucide="paperclip" style="width:14px;height:14px;flex-shrink:0;"></i>' +
          '<strong style="color:var(--text-primary);word-break:break-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="' + escapeHtml(att.name) + '">' + escapeHtml(att.name) + '</strong> (' + sizeText + ')' +
        '</span>' +
        '<button type="button" class="btn-remove-file" data-idx="' + idx + '" style="background:none;border:none;color:#d9534f;cursor:pointer;font-weight:bold;font-size:14px;padding:2px 6px;">✕</button>';

      listContainer.appendChild(item);
    });

    // Wire remove buttons
    listContainer.querySelectorAll('.btn-remove-file').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var idx = parseInt(this.getAttribute('data-idx'), 10);
        uploadedAttachments.splice(idx, 1);
        renderUploadedFiles();
        saveDraftSilently();
      });
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  function handleSelectedFiles(files) {
    var filesLoaded = 0;
    var filesToLoad = files.length;

    for (var i = 0; i < files.length; i++) {
      (function (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var base64Data = e.target.result;

          var exists = uploadedAttachments.some(function (att) {
            return att.name === file.name && att.size === file.size;
          });

          if (!exists) {
            uploadedAttachments.push({
              name: file.name,
              type: file.type,
              size: file.size,
              data: base64Data
            });
          }

          filesLoaded++;
          if (filesLoaded === filesToLoad) {
            renderUploadedFiles();
            saveDraftSilently();
          }
        };
        reader.onerror = function () {
          filesLoaded++;
          ToastSystem.showToast('Failed to read file: ' + file.name, 'error');
        };
        reader.readAsDataURL(file);
      })(files[i]);
    }
  }

  // File picker and area integration
  var fileUploadArea = document.querySelector('.file-upload-area');
  if (fileUploadArea) {
    // Clone and replace to strip any existing click listeners from js/app.js
    var newArea = fileUploadArea.cloneNode(true);
    fileUploadArea.parentNode.replaceChild(newArea, fileUploadArea);
    fileUploadArea = newArea;

    var fileInput = fileUploadArea.querySelector('#fileInput');

    fileUploadArea.addEventListener('click', function (e) {
      if (fileInput && e.target !== fileInput) {
        fileInput.click();
      }
    });

    if (fileInput) {
      fileInput.addEventListener('change', function (e) {
        var files = e.target.files;
        if (files && files.length) {
          handleSelectedFiles(files);
        }
      });
    }

    // Drag & drop handlers
    fileUploadArea.addEventListener('dragover', function (e) {
      e.preventDefault();
      fileUploadArea.style.borderColor = '#5A0C08';
      fileUploadArea.style.backgroundColor = 'rgba(90, 12, 8, 0.05)';
    });

    fileUploadArea.addEventListener('dragleave', function (e) {
      e.preventDefault();
      fileUploadArea.style.borderColor = '';
      fileUploadArea.style.backgroundColor = '';
    });

    fileUploadArea.addEventListener('drop', function (e) {
      e.preventDefault();
      fileUploadArea.style.borderColor = '';
      fileUploadArea.style.backgroundColor = '';
      var files = e.dataTransfer.files;
      if (files && files.length) {
        handleSelectedFiles(files);
      }
    });
  }

  // Clone and replace submit buttons and save draft buttons to strip duplicate global event listeners from app.js
  document.querySelectorAll('.submit-idea-btn').forEach(function (btn) {
    var newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      submitIdea();
    });
  });

  document.querySelectorAll('.save-draft-btn').forEach(function (btn) {
    var newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      saveDraft();
    });
  });

  // Load existing idea or draft on page load
  loadExistingIdeaOrDraft();
})();
