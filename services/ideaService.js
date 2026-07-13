var IdeaService = (function () {
  var BASE_URL = '/data/ideas.json';

  function getIdeas() {
    return fetch(BASE_URL).then(function (res) {
      if (!res.ok) throw new Error('Failed to fetch ideas');
      return res.json();
    });
  }

  function getIdeaById(id) {
    return getIdeas().then(function (ideas) {
      var idea = ideas.find(function (i) { return i.id === id; });
      if (!idea) throw new Error('Idea not found: ' + id);
      return idea;
    });
  }

  function getIdeasBySubmitter(email) {
    return getIdeas().then(function (ideas) {
      return ideas.filter(function (i) { return i.submitterEmail === email; });
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
    return getIdeas().then(function (ideas) {
      var index = ideas.findIndex(function (i) { return i.id === id; });
      if (index === -1) throw new Error('Idea not found: ' + id);
      ideas[index] = Object.assign({}, ideas[index], updates);
      ideas[index].lastUpdated = new Date().toISOString();
      return ideas[index];
    });
  }

  function deleteIdea(id) {
    return getIdeas().then(function (ideas) {
      var index = ideas.findIndex(function (i) { return i.id === id; });
      if (index === -1) throw new Error('Idea not found: ' + id);
      ideas.splice(index, 1);
      return true;
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
               i.submitterName.toLowerCase().indexOf(q) !== -1 ||
               i.department.toLowerCase().indexOf(q) !== -1 ||
               i.category.toLowerCase().indexOf(q) !== -1;
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
