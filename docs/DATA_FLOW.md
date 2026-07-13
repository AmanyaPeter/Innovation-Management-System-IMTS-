# Application Data Flow

Data flows linearly from user actions or page initialization, through page-specific controllers, through service-level caching and localStorage overrides, and is formatted by procedural utilities into DOM mutations.

## Data Flow Diagram

```
[ User Interaction (click, filter, edit, submit) ]
                       │
                       ▼
         [ Page Controller (js/*.js) ]
                       │
                       ├─► Read/Write LocalStorage (drafts, session)
                       │
                       ▼
     [ Data Services Layer (services/*.js) ]
                       │
           ┌───────────┴───────────┐
           ▼                       ▼
   [ fetch('/data/*.json') ]   [ LocalStorage Override Check ]
           │                       │
           └───────────┬───────────┘
                       ▼
          [ Merged Dataset returned ]
                       │
                       ▼
       [ Page-level Search/Sort/Filter ]
                       │
                       ▼
    [ Utilities Layer (utils/table, pagination) ]
                       │
                       ▼
     [ DOM Rendering (lucide.createIcons) ]
```

---

## Core Flow Patterns

### 1. Unified Merge Pattern (The Overrides Mechanism)
To support realistic write simulations without a backend, the services merge static JSON datasets with dynamic modifications inside `localStorage`.

When a service loads data:
1. It requests the baseline static file (e.g., `/data/ideas.json`) via `fetch`.
2. It parses the matching override item from `localStorage` (e.g., `bou_ideas`).
3. If an idea in `localStorage` has the same `id` as an idea in the static list, the local override is selected.
4. Any new ideas created on the client (which don't exist in the static list) are appended.
5. The combined, up-to-date collection is returned as a Promise.

### 2. State Mutation Pattern (Writes)
When a state change occurs (e.g., updating an idea stage, changing user lock status, editing permissions, adding a comment):
1. The page controller captures the user action.
2. It calls the corresponding service method (e.g., `UserService.saveUsers()` or `IdeaService.updateIdea()`).
3. The service writes the updated entity back into the corresponding `localStorage` list.
4. The service resolves the promise.
5. The controller triggers `loadAndRender()` to update the UI on-the-fly.
