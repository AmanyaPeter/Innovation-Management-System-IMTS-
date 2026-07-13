import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Setup Mock Data
const mockActivities = [
  { id: 1, user: "brian@bou.or.ug", action: "Login", module: "Auth" },
  { id: 2, user: "jane.mukasa@bou.or.ug", action: "Reviewed idea", module: "Review" },
  { id: 3, user: "brian@bou.or.ug", action: "Submitted idea", module: "Ideas" }
];

globalThis.fetch = vi.fn().mockImplementation((url) => {
  if (url.endsWith('/data/activities.json')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(JSON.parse(JSON.stringify(mockActivities)))
    });
  }
  return Promise.reject(new Error('Fetch error'));
});

// Helper to load ActivityService
function loadActivityService() {
  const filepath = path.resolve('services/activityService.js');
  let code = fs.readFileSync(filepath, 'utf8');
  code += `\nglobalThis.ActivityService = ActivityService;`;
  eval(code);
}

describe('ActivityService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadActivityService();
  });

  it('should fetch and return all activities', async () => {
    const act = await globalThis.ActivityService.getActivities();
    expect(act).toHaveLength(3);
  });

  it('should filter activities by user', async () => {
    const list = await globalThis.ActivityService.getActivitiesByUser("brian@bou.or.ug");
    expect(list).toHaveLength(2);
  });

  it('should filter activities by module', async () => {
    const list = await globalThis.ActivityService.getActivitiesByModule("Review");
    expect(list).toHaveLength(1);
    expect(list[0].action).toBe("Reviewed idea");
  });
});
