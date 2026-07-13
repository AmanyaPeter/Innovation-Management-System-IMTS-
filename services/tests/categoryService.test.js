import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Setup Mock Data
const mockCategories = [
  { id: 1, name: "FinTech", description: "Financial Technology", status: "Active" },
  { id: 2, name: "Process Improvement", description: "Operational efficiency", status: "Active" },
  { id: 3, name: "Legacy Projects", description: "Older frameworks", status: "Inactive" }
];

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
globalThis.localStorage = localStorageMock;

globalThis.fetch = vi.fn().mockImplementation((url) => {
  if (url.endsWith('/data/categories.json')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(JSON.parse(JSON.stringify(mockCategories)))
    });
  }
  return Promise.reject(new Error('Fetch error'));
});

// Helper to load CategoryService
function loadCategoryService() {
  const filepath = path.resolve('services/categoryService.js');
  let code = fs.readFileSync(filepath, 'utf8');
  code += `\nglobalThis.CategoryService = CategoryService;`;
  eval(code);
}

describe('CategoryService Unit Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    loadCategoryService();
  });

  it('should fetch and cache categories in localStorage', async () => {
    const cats = await globalThis.CategoryService.getCategories();
    expect(cats).toHaveLength(3);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    const cached = JSON.parse(localStorageMock.getItem('bou_categories'));
    expect(cached).toHaveLength(3);
  });

  it('should return cached categories from localStorage if present', async () => {
    localStorageMock.setItem('bou_categories', JSON.stringify([{ id: 9, name: "Cached", status: "Active" }]));
    const cats = await globalThis.CategoryService.getCategories();
    expect(cats).toHaveLength(1);
    expect(cats[0].name).toBe("Cached");
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('should filter active categories only', async () => {
    const active = await globalThis.CategoryService.getActiveCategories();
    expect(active).toHaveLength(2);
    expect(active.every(c => c.status === 'Active')).toBe(true);
  });

  it('should persist saved categories', async () => {
    const newCats = [{ id: 1, name: "New Category", status: "Active" }];
    await globalThis.CategoryService.saveCategories(newCats);

    const stored = JSON.parse(localStorageMock.getItem('bou_categories'));
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe("New Category");
  });
});
