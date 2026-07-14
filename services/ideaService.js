var IdeaService = (function () {
  var BASE_URL = '/api/ideas';

  function getAuthHeaders() {
    var headers = {
      'Content-Type': 'application/json'
    };
    if (typeof AuthSystem !== 'undefined') {
      var user = AuthSystem.getCurrentUser();
      if (user && user.accessToken) {
        headers['Authorization'] = 'Bearer ' + user.accessToken;
      }
    }
    return headers;
  }

  function getIdeas() {
    return fetch(BASE_URL, {
      headers: getAuthHeaders()
    }).then(function (res) {
      if (!res.ok) throw new Error('Failed to fetch ideas');
      return res.json();
    });
  }

  function getIdeaById(id) {
    return fetch(BASE_URL + '/' + id, {
      headers: getAuthHeaders()
    }).then(function (res) {
      if (!res.ok) throw new Error('Idea not found: ' + id);
      return res.json();
    });
  }

  function getIdeasBySubmitter(email) {
    return fetch(BASE_URL + '?submitterEmail=' + encodeURIComponent(email), {
      headers: getAuthHeaders()
    }).then(function (res) {
      if (!res.ok) throw new Error('Failed to fetch submitter ideas');
      return res.json();
    });
  }

  function getIdeasByStage(stage) {
    return getIdeas().then(function (ideas) {
      return ideas.filter(function (i) { return i.stage === stage; });
    });
  }

  function getIdeasByStatus(status) {
    return getIdeas().then(function (ideas) {
      return ideas.filter(function (i) { return i.status === status; });
    });
  }

  function getIdeasByCategory(category) {
    return getIdeas().then(function (ideas) {
      return ideas.filter(function (i) { return i.category === category; });
    });
  }

  function getIdeasByDepartment(department) {
    return getIdeas().then(function (ideas) {
      return ideas.filter(function (i) { return i.department === department; });
    });
  }

  function getPendingReviews() {
    return getIdeas().then(function (ideas) {
      return ideas.filter(function (i) { return i.status === 'Under Review' || i.status === 'Pending Information'; });
    });
  }

  function updateIdea(id, updates) {
    return fetch(BASE_URL + '/' + id, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    }).then(function (res) {
      if (!res.ok) throw new Error('Failed to update idea');
      return res.json();
    });
  }

  function deleteIdea(id) {
    return fetch(BASE_URL + '/' + id + '/retract', {
      method: 'POST',
      headers: getAuthHeaders()
    }).then(function (res) {
      if (!res.ok) throw new Error('Failed to retract idea');
      return res.json();
    });
  }

  function getDashboardSummary() {
    return getIdeas().then(function (ideas) {
      return {
        totalIdeasSubmitted: ideas.length,
        ideasUnderReview: ideas.filter(function (i) { return i.status === 'Under Review'; }).length,
        approvedIdeas: ideas.filter(function (i) { return i.status === 'Approved'; }).length,
        completedInnovations: ideas.filter(function (i) { return i.stage === 'Closed'; }).length,
        pendingReviews: ideas.filter(function (i) { return i.status === 'Under Review' || i.status === 'Pending Information'; }).length,
        conceptDevelopment: ideas.filter(function (i) { return i.stage === 'Concept Development'; }).length,
        experimentation: ideas.filter(function (i) { return i.stage === 'Experimentation'; }).length,
        deployment: ideas.filter(function (i) { return i.stage === 'Deployment'; }).length,
        declined: ideas.filter(function (i) { return i.status === 'Declined'; }).length
      };
    });
  }

  function searchIdeas(query) {
    return getIdeas().then(function (ideas) {
      if (!query || !query.trim()) return ideas;
      var q = query.toLowerCase().trim();
      return ideas.filter(function (i) {
        return i.title.toLowerCase().indexOf(q) !== -1 ||
               (i.submitterName && i.submitterName.toLowerCase().indexOf(q) !== -1) ||
               (i.department && i.department.toLowerCase().indexOf(q) !== -1) ||
               (i.category && i.category.toLowerCase().indexOf(q) !== -1);
      });
    });
  }

  return {
    getIdeas: getIdeas,
    getIdeaById: getIdeaById,
    getIdeasBySubmitter: getIdeasBySubmitter,
    getIdeasByStage: getIdeasByStage,
    getIdeasByStatus: getIdeasByStatus,
    getIdeasByCategory: getIdeasByCategory,
    getIdeasByDepartment: getIdeasByDepartment,
    getPendingReviews: getPendingReviews,
    updateIdea: updateIdea,
    deleteIdea: deleteIdea,
    getDashboardSummary: getDashboardSummary,
    searchIdeas: searchIdeas
  };
})();
