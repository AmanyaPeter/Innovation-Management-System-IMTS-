import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Setup localStorage Mock
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

// Setup mock fetch
const mockUsersData = [
  { id: 1, name: "Brian Ssempijja", email: "brian@bou.or.ug", role: "staff", department: "Information Technology", accountStatus: "Active", onlineStatus: "Online" },
  { id: 2, name: "Jane Mukasa", email: "jane.mukasa@bou.or.ug", role: "innovation-team", department: "Operations", accountStatus: "Active", onlineStatus: "Offline" },
  { id: 3, name: "Admin User", email: "admin@bou.or.ug", role: "admin", department: "Administrative Services", accountStatus: "Locked", onlineStatus: "Offline" }
];

globalThis.fetch = vi.fn().mockImplementation((url) => {
  if (url.endsWith('/data/users.json')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockUsersData)
    });
  }
  return Promise.reject(new Error('Fetch error'));
});

// Helper to load UserService
function loadUserService() {
  const filepath = path.resolve('services/userService.js');
  let code = fs.readFileSync(filepath, 'utf8');
  code += `\nglobalThis.UserService = UserService;`;
  eval(code);
}

describe('UserService Unit Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    loadUserService();
  });

  it('should load mock users from remote fetch and set localStorage', async () => {
    const users = await globalThis.UserService.getUsers();
    expect(users).toHaveLength(3);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    // Verify localStorage cache
    const stored = JSON.parse(localStorageMock.getItem('bou_users'));
    expect(stored).toHaveLength(3);
    expect(stored[0].name).toBe("Brian Ssempijja");
  });

  it('should load users from localStorage cache if present', async () => {
    const customUsers = [{ id: 9, name: "Custom cached user", email: "custom@bou.or.ug", accountStatus: "Active" }];
    localStorageMock.setItem('bou_users', JSON.stringify(customUsers));

    const users = await globalThis.UserService.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].name).toBe("Custom cached user");
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('should retrieve user by ID', async () => {
    const user = await globalThis.UserService.getUserById(2);
    expect(user.name).toBe("Jane Mukasa");
  });

  it('should throw an error for non-existent user ID', async () => {
    await expect(globalThis.UserService.getUserById(999)).rejects.toThrow('User not found: 999');
  });

  it('should retrieve user by Email', async () => {
    const user = await globalThis.UserService.getUserByEmail("brian@bou.or.ug");
    expect(user.name).toBe("Brian Ssempijja");
  });

  it('should return null for non-existent email', async () => {
    const user = await globalThis.UserService.getUserByEmail("unknown@bou.or.ug");
    expect(user).toBeNull();
  });

  it('should filter users by Role', async () => {
    const adminUsers = await globalThis.UserService.getUsersByRole("admin");
    expect(adminUsers).toHaveLength(1);
    expect(adminUsers[0].name).toBe("Admin User");
  });

  it('should filter users by Department', async () => {
    const itUsers = await globalThis.UserService.getUsersByDepartment("Information Technology");
    expect(itUsers).toHaveLength(1);
    expect(itUsers[0].name).toBe("Brian Ssempijja");
  });

  it('should filter Active users', async () => {
    const active = await globalThis.UserService.getActiveUsers();
    expect(active).toHaveLength(2);
    expect(active.some(u => u.name === "Admin User")).toBe(false);
  });

  it('should filter Online users', async () => {
    const online = await globalThis.UserService.getOnlineUsers();
    expect(online).toHaveLength(1);
    expect(online[0].name).toBe("Brian Ssempijja");
  });

  it('should filter Locked users', async () => {
    const locked = await globalThis.UserService.getLockedAccounts();
    expect(locked).toHaveLength(1);
    expect(locked[0].name).toBe("Admin User");
  });

  it('should authenticate user successfully', async () => {
    const res = await globalThis.UserService.authenticate("brian@bou.or.ug", "any_password");
    expect(res.success).toBe(true);
    expect(res.user.name).toBe("Brian Ssempijja");
  });

  it('should deny authentication for non-existent user', async () => {
    const res = await globalThis.UserService.authenticate("notfound@bou.or.ug", "any_password");
    expect(res.success).toBe(false);
    expect(res.reason).toBe("User not found");
  });

  it('should deny authentication for locked user account', async () => {
    const res = await globalThis.UserService.authenticate("admin@bou.or.ug", "any_password");
    expect(res.success).toBe(false);
    expect(res.reason).toBe("Account locked");
  });

  it('should save users to localStorage', async () => {
    const updated = [...mockUsersData, { id: 4, name: "New User", email: "new@bou.or.ug", accountStatus: "Active" }];
    const res = await globalThis.UserService.saveUsers(updated);
    expect(res).toHaveLength(4);

    const stored = JSON.parse(localStorageMock.getItem('bou_users'));
    expect(stored).toHaveLength(4);
    expect(stored[3].name).toBe("New User");
  });

  it('should return mock dashboard summary metrics', async () => {
    const summary = await globalThis.UserService.getDashboardSummary();
    expect(summary.totalUsers).toBe(3);
    expect(summary.activeUsers).toBe(2);
    expect(summary.lockedAccounts).toBe(1);
    expect(summary.onlineUsers).toBe(1);
  });
});
