# IMTS Development and Handover Guide

Welcome to the Bank of Uganda Innovation Management System (IMTS) codebase! This manual serves as your technical guide to running, extending, and integrating this system.

---

## 1. Quick Start

### Installation
```bash
# 1. Install dependencies (Vite)
npm install

# 2. Run the hot-reloading development server
npm run dev

# 3. Build optimized production assets
npm run build

# 4. Preview your production build locally
npm run preview
```
The dev server starts at `http://localhost:5173`. Open this URL to inspect and test the prototype.

---

## 2. Developer Guides

### How to Add a New Page
1. Create a semantic HTML page under `/pages/{role}/new-page.html`.
2. Follow the standard head templates to link `css/styles.css` and the Lucide CDN.
3. List your required service dependencies, components under `/utils`, and `js/auth.js` + `js/app.js` followed by your page controller script `js/new-page.js` at the bottom of the body:
   ```html
   <script src="../../services/userService.js"></script>
   <script src="../../utils/toast.js"></script>
   <script src="../../js/auth.js"></script>
   <script src="../../js/app.js"></script>
   <script src="../../js/new-page.js"></script>
   ```
4. Define your page inputs and targets in `vite.config.js` inside the rollup options to ensure the new HTML page is bundled:
   ```js
   'new-page': 'pages/staff/new-page.html',
   ```

### How to Add New Local Mock Data
1. Add initial objects directly inside the corresponding `/data/*.json` file to establish baseline values.
2. If you are extending structure fields (e.g. adding a priority score), make sure to include defaults in `/services/*` and your UI controllers (like `my-ideas.js` column mappings).
3. If you want to reset all simulated database changes, clear your browser's local storage (e.g., `localStorage.clear()`).

### How to Transition to a Live Backend API
1. Change the `BASE_URL` in `/services/*` from pointing to local files (like `/data/ideas.json`) to pointing to the API Gateway `/api/ideas`.
2. Add authorization headers to the service request helper:
   ```js
   headers: {
     'Authorization': 'Bearer ' + AuthSystem.getCurrentUser().token
   }
   ```
3. Remove local storage override checks from the service methods, delegating full state, querying, and sorting to the database via API queries.
