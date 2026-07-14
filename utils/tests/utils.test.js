import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Setup Mock DOM elements for utility scripts
beforeEach(() => {
  document.body.innerHTML = '';
});

// Helpers to load Utility scripts
function loadUtil(filename, globalName) {
  const filepath = path.resolve('utils', filename);
  let code = fs.readFileSync(filepath, 'utf8');
  code += `\nglobalThis.${globalName} = ${globalName};`;
  eval(code);
}

describe('ToastSystem Unit Tests', () => {
  beforeEach(() => {
    loadUtil('toast.js', 'ToastSystem');
  });

  it('should create a toast container and display a toast alert', () => {
    globalThis.ToastSystem.showToast("Test success toast", "success");

    const container = document.getElementById('toastContainer');
    expect(container).not.toBeNull();

    const toast = container.querySelector('.toast-success');
    expect(toast).not.toBeNull();
    expect(toast.textContent).toContain("Test success toast");
  });
});

describe('SearchSystem Unit Tests', () => {
  beforeEach(() => {
    loadUtil('search.js', 'SearchSystem');
  });

  it('should filter items by query matching nested fields', () => {
    const data = [
      { id: 1, title: "Fintech Wallet", author: { name: "Brian" } },
      { id: 2, title: "Process Automation", author: { name: "Sarah" } },
      { id: 3, title: "AI Analytics", author: { name: "Peter" } }
    ];

    const results = globalThis.SearchSystem.filterData(data, "brian", ["title", "author.name"]);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(1);

    const titleResults = globalThis.SearchSystem.filterData(data, "automation", ["title"]);
    expect(titleResults).toHaveLength(1);
    expect(titleResults[0].id).toBe(2);
  });

  it('should support debounced event listener execution', async () => {
    vi.useFakeTimers();
    const spy = vi.fn();
    const debounced = globalThis.SearchSystem.debounce(spy, 100);

    debounced();
    debounced();
    debounced();

    expect(spy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});

describe('SortSystem Unit Tests', () => {
  beforeEach(() => {
    loadUtil('sort.js', 'SortSystem');
  });

  it('should sort items ascending and descending by string/numeric properties', () => {
    const data = [
      { id: 3, score: 95, name: "Charlie" },
      { id: 1, score: 85, name: "Alice" },
      { id: 2, score: 90, name: "Bob" }
    ];

    // Numeric sort asc
    const sortedNum = globalThis.SortSystem.sortData(data, "score", "asc");
    expect(sortedNum[0].id).toBe(1);
    expect(sortedNum[2].id).toBe(3);

    // String sort desc
    const sortedStr = globalThis.SortSystem.sortData(data, "name", "desc");
    expect(sortedStr[0].name).toBe("Charlie");
    expect(sortedStr[2].name).toBe("Alice");
  });

  it('should toggle state correctly', () => {
    globalThis.SortSystem.resetSort();
    expect(globalThis.SortSystem.getSortState().field).toBeNull();

    const state1 = globalThis.SortSystem.toggleSort("title");
    expect(state1.field).toBe("title");
    expect(state1.direction).toBe("asc");

    const state2 = globalThis.SortSystem.toggleSort("title");
    expect(state2.direction).toBe("desc");

    const state3 = globalThis.SortSystem.toggleSort("title");
    expect(state3.field).toBeNull();
  });
});

describe('FilterSystem Unit Tests', () => {
  beforeEach(() => {
    loadUtil('filter.js', 'FilterSystem');
    globalThis.FilterSystem.clearFilters();
  });

  it('should filter dataset by multiple active criteria', () => {
    const data = [
      { id: 1, category: "FinTech", status: "Active" },
      { id: 2, category: "Process", status: "Active" },
      { id: 3, category: "FinTech", status: "Inactive" }
    ];

    globalThis.FilterSystem.setFilter("category", "FinTech");
    globalThis.FilterSystem.setFilter("status", "Active");

    const filtered = globalThis.FilterSystem.filterData(data, globalThis.FilterSystem.getFilters());
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(1);
  });

  it('should populate select element options dynamically', () => {
    const select = document.createElement('select');
    document.body.appendChild(select);

    const options = ["Option A", "Option B"];
    globalThis.FilterSystem.populateSelect(select, options, "Select one");

    expect(select.options).toHaveLength(3);
    expect(select.options[0].text).toBe("Select one");
    expect(select.options[1].value).toBe("Option A");
  });
});

describe('PaginationSystem Unit Tests', () => {
  beforeEach(() => {
    loadUtil('pagination.js', 'PaginationSystem');
  });

  it('should return correct page chunk metadata', () => {
    const data = Array.from({ length: 25 }, (_, i) => i + 1);

    const result = globalThis.PaginationSystem.paginate(data, 2, 10);
    expect(result.data).toHaveLength(10);
    expect(result.data[0]).toBe(11);
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(3);
    expect(result.start).toBe(11);
    expect(result.end).toBe(20);
  });

  it('should render interactive pagination buttons with Previous/Next', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const state = {
      page: 2,
      pageSize: 10,
      total: 25,
      totalPages: 3,
      start: 11,
      end: 20
    };

    const spy = vi.fn();
    globalThis.PaginationSystem.renderControls(container, state, spy);

    const buttons = container.querySelectorAll('button');
    expect(buttons).not.toHaveLength(0);

    const activePageButton = container.querySelector('.btn-primary');
    expect(activePageButton.textContent).toBe("2");
  });
});
