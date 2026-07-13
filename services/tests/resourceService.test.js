import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Setup Mock Data
const mockResources = [
  { id: 1, title: "Guidelines", description: "BOU Guidelines", category: "Governance" },
  { id: 2, title: "Fintech report", description: "MNO report", category: "Reports" },
  { id: 3, title: "AI Framework", description: "BOU AI", category: "Governance" }
];

globalThis.fetch = vi.fn().mockImplementation((url) => {
  if (url.endsWith('/data/resources.json')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(JSON.parse(JSON.stringify(mockResources)))
    });
  }
  return Promise.reject(new Error('Fetch error'));
});

// Helper to load ResourceService
function loadResourceService() {
  const filepath = path.resolve('services/resourceService.js');
  let code = fs.readFileSync(filepath, 'utf8');
  code += `\nglobalThis.ResourceService = ResourceService;`;
  eval(code);
}

describe('ResourceService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadResourceService();
  });

  it('should fetch and return all resources', async () => {
    const res = await globalThis.ResourceService.getResources();
    expect(res).toHaveLength(3);
  });

  it('should get resource by ID', async () => {
    const res = await globalThis.ResourceService.getResourceById(2);
    expect(res.title).toBe("Fintech report");
  });

  it('should throw error if ID not found', async () => {
    await expect(globalThis.ResourceService.getResourceById(999)).rejects.toThrow('Resource not found: 999');
  });

  it('should filter resources by category', async () => {
    const list = await globalThis.ResourceService.getResourcesByCategory("Governance");
    expect(list).toHaveLength(2);
  });

  it('should return sorted list of unique categories', async () => {
    const cats = await globalThis.ResourceService.getResourceCategories();
    expect(cats).toEqual(["Governance", "Reports"]);
  });

  it('should search resources by title or description matching', async () => {
    const matches = await globalThis.ResourceService.searchResources("report");
    expect(matches).toHaveLength(1);
    expect(matches[0].title).toBe("Fintech report");
  });
});
