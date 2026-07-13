# Microservices API Endpoint Mapping

This mapping document maps the current static JSON/localStorage requests to future REST endpoints exposed by the ASP.NET Core API Gateway.

## Service Mapping Matrix

| Frontend Service Module | Target REST Endpoint | HTTP Method | Request Body / Query Params | Purpose |
|-------------------------|----------------------|-------------|----------------------------|---------|
| **`UserService.authenticate`** | `/api/auth/login` | `POST` | `{ email, password }` | Authenticates credentials and returns JWT token + user details. |
| **`UserService.getUsers`** | `/api/users` | `GET` | — | Retrieves list of system users. Supports pagination/search on server. |
| **`UserService.saveUsers`** | `/api/users/{id}` | `PUT` | `{ permissions, accountStatus }` | Modifies user accounts (locks, activations, roles). |
| **`IdeaService.getIdeas`** | `/api/ideas` | `GET` | — | Retrieves all ideas. Filtered by ownership automatically for Staff. |
| **`IdeaService.updateIdea`** | `/api/ideas/{id}` | `PUT` | `{ status, stage, comments, timeline }` | Updates proposal stages, timelines, or appends a comment. |
| **`CategoryService.getCategories`**| `/api/categories` | `GET` | — | Retrieves list of categories. |
| **`CategoryService.saveCategories`**| `/api/categories` | `POST` / `PUT` | `{ id, name, description, status }` | Commits modifications or additions of categories. |
| **`ActivityService.getActivities`**| `/api/activities` | `GET` | `?module={module}&user={user}` | Reads administrative system activity logs. |
| **`NotificationService`** | `/api/notifications` | `GET` | — | Retrieves notification inbox for current logged-in user. |
| **`ResourceService`** | `/api/resources` | `GET` | — | Reads available resource guide files. |

---

## Example: Transitioning fetching layer to REST API

### Current IIFE Pattern (Mock)
```js
var IdeaService = (function () {
  var BASE_URL = '/data/ideas.json';

  function getIdeas() {
    return fetch(BASE_URL).then(function (res) {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    });
  }
})();
```

### Future REST Pattern (with JWT)
```js
var IdeaService = (function () {
  var BASE_URL = '/api/ideas';

  function getIdeas() {
    var user = AuthSystem.getCurrentUser();
    var token = user ? user.token : '';

    return fetch(BASE_URL, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }).then(function (res) {
      if (!res.ok) throw new Error('Failed to fetch from API');
      return res.json();
    });
  }
})();
```
By encapsulating request execution within clean services under `/services`, transitioning to the REST API requires zero changes to your UI controllers.
