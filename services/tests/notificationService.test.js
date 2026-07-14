import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Setup Mock Data
const mockNotifications = [
  { id: 1, text: "New submission received", isRead: false },
  { id: 2, text: "Review completed", isRead: true },
  { id: 3, text: "SLA alert", isRead: false }
];

globalThis.fetch = vi.fn().mockImplementation((url) => {
  if (url.endsWith('/data/notifications.json')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(JSON.parse(JSON.stringify(mockNotifications)))
    });
  }
  return Promise.reject(new Error('Fetch error'));
});

// Helper to load NotificationService
function loadNotificationService() {
  const filepath = path.resolve('services/notificationService.js');
  let code = fs.readFileSync(filepath, 'utf8');
  code += `\nglobalThis.NotificationService = NotificationService;`;
  eval(code);
}

describe('NotificationService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadNotificationService();
  });

  it('should fetch and return all notifications', async () => {
    const notifications = await globalThis.NotificationService.getNotifications();
    expect(notifications).toHaveLength(3);
  });

  it('should filter unread notifications', async () => {
    const unread = await globalThis.NotificationService.getUnreadNotifications();
    expect(unread).toHaveLength(2);
    expect(unread.every(n => !n.isRead)).toBe(true);
  });

  it('should return correct unread count', async () => {
    const count = await globalThis.NotificationService.getUnreadCount();
    expect(count).toBe(2);
  });

  it('should mark notification as read', async () => {
    const n = await globalThis.NotificationService.markAsRead(1);
    expect(n.isRead).toBe(true);
  });

  it('should mark all notifications as read', async () => {
    const success = await globalThis.NotificationService.markAllAsRead();
    expect(success).toBe(true);
  });

  it('should return subset of recent notifications', async () => {
    const recent = await globalThis.NotificationService.getRecentNotifications(2);
    expect(recent).toHaveLength(2);
  });
});
