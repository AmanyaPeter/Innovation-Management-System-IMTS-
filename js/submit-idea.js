(function () {

  var DRAFT_KEY = 'bou_idea_draft';

  // Collect form data from all steps
  function collectFormData() {
    var isTeam = document.querySelector('input[name="submissionType"]:checked')?.value === 'team';

    var data = {
      id: Date.now(),
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
      attachments: [],
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

  function loadDraft() {
    var saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return;
    try {
      var data = JSON.parse(saved);
      ToastSystem.showToast('Draft restored.', 'info');
    } catch (e) {
      localStorage.removeItem(DRAFT_KEY);
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
      // Store in localStorage idea list
      var ideas = [];
      try {
        ideas = JSON.parse(localStorage.getItem('bou_ideas') || '[]');
      } catch (e) { ideas = []; }
      ideas.push(data);
      localStorage.setItem('bou_ideas', JSON.stringify(ideas));
      localStorage.removeItem(DRAFT_KEY);

      ToastSystem.showToast('Idea submitted successfully!', 'success');
      setTimeout(function () {
        window.location.href = 'my-ideas.html';
      }, 800);
    });
  }

  // Wire events
  document.querySelectorAll('.save-draft-btn').forEach(function (btn) {
    btn.addEventListener('click', saveDraft);
  });

  document.querySelectorAll('.submit-idea-btn').forEach(function (btn) {
    btn.addEventListener('click', submitIdea);
  });

  // Load draft on page load
  loadDraft();
})();
