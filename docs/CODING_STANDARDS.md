# Coding Standards

## JavaScript Conventions

### Module Pattern
All modules use the **IIFE (Immediately Invoked Function Expression)** pattern:

```js
var ModuleName = (function () {
  // Private variables and functions
  var privateVar = 'value';

  function privateMethod() {
    // ...
  }

  // Public API
  return {
    publicMethod: publicMethod
  };
})();
```

### Naming Conventions
- **Modules**: PascalCase (`IdeaService`, `ToastSystem`, `ModalSystem`)
- **Variables/functions**: camelCase (`getIdeas`, `allUsers`, `renderTable`)
- **Constants**: UPPER_SNAKE_CASE (`BASE_URL`, `STORAGE_KEY`)
- **Private members**: No underscore prefix — use closure scope for privacy

### Variable Declarations
Use `var` for all variables (ES5 compatibility). No `let` or `const`.

### Functions
Use `function` keyword expressions (not arrow functions):

```js
// Correct
function loadData() { ... }
element.addEventListener('click', function () { ... });

// Avoid
const loadData = () => { ... };
element.addEventListener('click', () => { ... });
```

### Error Handling
- Services throw errors via rejected promises
- Controllers should catch errors with `.catch()`
- Display user-facing errors with `ToastSystem.showToast(message, 'error')`
- Network errors are not currently handled gracefully — needs improvement

### Event Binding
Use `addEventListener()` directly on elements. For dynamically created elements, use event delegation on a parent container, or bind events immediately after creating elements.

## Folder Conventions

| Folder | Purpose | Contains |
|--------|---------|----------|
| `/` | Project root | Entry HTML files (login, password pages), config files |
| `/css/` | Stylesheets | One `styles.css` file for all pages |
| `/js/` | Application logic | Page-specific controllers, `app.js`, `auth.js` |
| `/utils/` | Reusable utilities | Framework-independent components (toast, modal, table, search, sort, filter, pagination) |
| `/services/` | Data access | Service modules that call `fetch()` on JSON or future API |
| `/data/` | Static data | JSON files simulating a database |
| `/pages/` | Role-based pages | Subdirectories: `staff/`, `admin/`, `innovation-team/` |
| `/docs/` | Documentation | Markdown documentation files |

## CSS Conventions

- **Single file**: All styles in `css/styles.css`
- **CSS custom properties** for theming (`--color-primary`, `--font-body`, etc.)
- **Class naming**: kebab-case (`.summary-card`, `.notification-item`)
- **BEM-lite**: Component-modifier pattern (`.badge-active`, `.badge-inactive`)
- **No CSS-in-JS**, no preprocessors (Sass, Less)
- **No utility framework** (Tailwind) — hand-written styles only
- **Responsive** via media queries at 1024px and 768px breakpoints

## HTML Conventions

- **DOCTYPE**: `<!DOCTYPE html>`
- **Language**: `<html lang="en">`
- **No template engine** — plain HTML5
- **Semantic elements** used where applicable (`<aside>`, `<main>`, `<header>`)
- **Inline event handlers** (`onclick="handleLogin()"`) used in some root pages (legacy pattern)
- **All pages include** favicon, stylesheet, Lucide CDN, and the full script stack
- **Forms** use `type="button"` (no default form submission) — JS handles actions

## File Naming

| File Type | Convention | Examples |
|-----------|-----------|---------|
| HTML pages | kebab-case | `forgot-password.html`, `idea-details.html`, `submitted-ideas.html` |
| JS controllers | kebab-case | `activity-log.js`, `submit-idea.js` |
| JS utilities | kebab-case | `pagination.js`, `notificationService.js` |
| JSON data | kebab-case | `activities.json`, `notifications.json` |
| Documentation | UPPER_SNAKE_CASE | `PROJECT_AUDIT.md`, `API_PREPARATION.md`, `AI_HANDOVER.md` |
| Config files | camelCase | `vite.config.js`, `package.json` |

## Import Conventions

Since the project uses plain `<script>` tags (no ES modules), there is no `import`/`export` syntax. Dependencies are resolved by **script load order** in HTML:

```html
<script src="utils/toast.js"></script>     <!-- Defines ToastSystem -->
<script src="utils/modal.js"></script>     <!-- Uses ToastSystem -->
```

Global variables serve as the module interface. Each script expects its dependencies to have been loaded earlier in the DOM.

## Comment Style

- Use `//` for single-line comments
- Use `// ===== Section =====` for section headers
- No JSDoc or formal docstrings
- Comments explain **why**, not **what** (the code should be self-documenting)
- Minimal comments in production code

```js
// ===== Login Handler =====
function handleLogin() {
  // Map short usernames to full emails for convenience
  var userMap = { 'brian': 'brian@bou.or.ug', 'jane': 'jane.mukasa@bou.or.ug', 'admin': 'admin@bou.or.ug' };
}
```
