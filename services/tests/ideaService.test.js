import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Setup Mock Data
const mockIdeas = [
  { id: 1, title: "Digital Currency Wallet", category: "FinTech", department: "Information Technology", stage: "Concept Development", status: "Under Review", submitterEmail: "brian@bou.or.ug", submitterName: "Brian Ssempijja" },
  { id: 2, title: "Automated Loan Disbursement System", category: "Process Improvement", department: "Finance", stage: "Deployment", status: "Approved", submitterEmail: "sarah@bou.or.ug", submitterName: "Sarah Kemigisha" },
  { id: 3, title: "Fraud Detection AI", category: "Technology/System", department: "Risk Management", stage: "Experimentation", status: "Under Review", submitterEmail: "peter.kaggwa@bou.or.ug", submitterName: "Peter Kaggwa" },
  { id: 4, title: "Mobile Banking Lite", category: "Product/Service", department: "Information Technology", stage: "Submitted", status: "Declined", submitterEmail: "grace@bou.or.ug", submitterName: "Grace Nabatanzi" }
];

globalThis.fetch = vi.fn().mockImplementation((url) => {
  if (url.endsWith('/data/ideas.json')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(JSON.parse(JSON.stringify(mockIdeas)))
    });
  }
  return Promise.reject(new Error('Fetch error'));
});

// Helper to load IdeaService
function loadIdeaService() {
  const filepath = path.resolve('services/ideaService.js');
  let code = fs.readFileSync(filepath, 'utf8');
  code += `\nglobalThis.IdeaService = IdeaService;`;
  eval(code);
}

describe('IdeaService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadIdeaService();
  });

  it('should fetch and return all ideas', async () => {
    const ideas = await globalThis.IdeaService.getIdeas();
    expect(ideas).toHaveLength(4);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('should return idea by ID', async () => {
    const idea = await globalThis.IdeaService.getIdeaById(2);
    expect(idea.title).toBe("Automated Loan Disbursement System");
  });

  it('should throw error if idea ID not found', async () => {
    await expect(globalThis.IdeaService.getIdeaById(999)).rejects.toThrow('Idea not found: 999');
  });

  it('should filter ideas by Submitter Email', async () => {
    const ideas = await globalThis.IdeaService.getIdeasBySubmitter("brian@bou.or.ug");
    expect(ideas).toHaveLength(1);
    expect(ideas[0].title).toBe("Digital Currency Wallet");
  });

  it('should filter ideas by Stage', async () => {
    const ideas = await globalThis.IdeaService.getIdeasByStage("Experimentation");
    expect(ideas).toHaveLength(1);
    expect(ideas[0].title).toBe("Fraud Detection AI");
  });

  it('should filter ideas by Status', async () => {
    const ideas = await globalThis.IdeaService.getIdeasByStatus("Under Review");
    expect(ideas).toHaveLength(2);
  });

  it('should filter ideas by Category', async () => {
    const ideas = await globalThis.IdeaService.getIdeasByCategory("FinTech");
    expect(ideas).toHaveLength(1);
    expect(ideas[0].title).toBe("Digital Currency Wallet");
  });

  it('should filter ideas by Department', async () => {
    const ideas = await globalThis.IdeaService.getIdeasByDepartment("Information Technology");
    expect(ideas).toHaveLength(2);
  });

  it('should filter pending reviews (Under Review or Pending Information)', async () => {
    const pending = await globalThis.IdeaService.getPendingReviews();
    expect(pending).toHaveLength(2);
    expect(pending.every(i => i.status === "Under Review")).toBe(true);
  });

  it('should mock update idea and set lastUpdated', async () => {
    const updated = await globalThis.IdeaService.updateIdea(3, { title: "Updated AI" });
    expect(updated.title).toBe("Updated AI");
    expect(updated.lastUpdated).toBeDefined();
  });

  it('should mock delete idea', async () => {
    const success = await globalThis.IdeaService.deleteIdea(2);
    expect(success).toBe(true);
  });

  it('should throw error on update with non-existent ID', async () => {
    await expect(globalThis.IdeaService.updateIdea(999, { title: "None" })).rejects.toThrow('Idea not found: 999');
  });

  it('should search ideas using multi-field query matching', async () => {
    const matches = await globalThis.IdeaService.searchIdeas("brian");
    expect(matches).toHaveLength(1);
    expect(matches[0].title).toBe("Digital Currency Wallet");

    const categoryMatches = await globalThis.IdeaService.searchIdeas("fintech");
    expect(categoryMatches).toHaveLength(1);

    const emptyMatches = await globalThis.IdeaService.searchIdeas("  ");
    expect(emptyMatches).toHaveLength(4);
  });

  it('should return dashboard summary statistics', async () => {
    const summary = await globalThis.IdeaService.getDashboardSummary();
    expect(summary.totalIdeasSubmitted).toBe(4);
    expect(summary.ideasUnderReview).toBe(2);
    expect(summary.approvedIdeas).toBe(1);
    expect(summary.declined).toBe(1);
  });
});
