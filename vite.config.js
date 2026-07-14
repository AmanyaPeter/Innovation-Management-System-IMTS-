import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  appType: 'mpa',

  test: {
    environment: 'jsdom',
    globals: true,
  },

  server: {
    port: 5173,
    open: '/index.html',
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        'forgot-password': 'forgot-password.html',
        'change-password': 'change-password.html',
        'staff-dashboard': 'pages/staff/dashboard.html',
        'staff-submit-idea': 'pages/staff/submit-idea.html',
        'staff-my-ideas': 'pages/staff/my-ideas.html',
        'staff-idea-details': 'pages/staff/idea-details.html',
        'staff-notifications': 'pages/staff/notifications.html',
        'staff-resources': 'pages/staff/resources.html',
        'admin-dashboard': 'pages/admin/dashboard.html',
        'admin-users': 'pages/admin/users.html',
        'admin-activity-log': 'pages/admin/activity-log.html',
        'innovation-dashboard': 'pages/innovation-team/dashboard.html',
        'innovation-submitted-ideas': 'pages/innovation-team/submitted-ideas.html',
        'innovation-review-idea': 'pages/innovation-team/review-idea.html',
        'innovation-categories': 'pages/innovation-team/categories.html',
        'innovation-reports': 'pages/innovation-team/reports.html',
        'innovation-permissions': 'pages/innovation-team/permissions.html'
      }
    }
  }
});
