# Repository Structure

This document explains the folder and file structure of the Big Fish project. Understanding this layout will help you navigate the codebase and know where to add new features.

## Overview

```
bigfish/
├── client/              # Frontend (what users see in their browser)
├── server/              # Backend (API and database logic)
├── docs/                # Documentation for developers
├── .gitignore          # Files Git should ignore
└── README.md            # Main project overview!
```

---

## Frontend (`client/`)

The frontend is what your users interact with in their web browser. Currently, it's a single HTML file with embedded CSS and JavaScript.

```
client/
├── index.html          # Main HTML file - contains all the UI, styles, and logic
└── assets/             # Static files (images, fonts, etc.)
    └── banner.png      # Guild banner image
```

**What goes here:**

- HTML, CSS, and JavaScript files
- Images, icons, fonts
- Any static assets users download

**Future:** When we migrate to a framework (React, Vue, etc.), we'll replace the contents of this folder with the framework's project structure.

---

## Backend (`server/`)

The backend handles all the "behind the scenes" logic: database connections, API endpoints, and business logic.

```
server/
├── app/                # Main application code
│   ├── __init__.py     # Makes 'app' a Python package
│   ├── main.py         # Entry point - starts the FastAPI server
│   ├── config/         # Configuration files (database connections, etc.)
│   │   └── __init__.py
│   ├── models/         # Database models (defines what your data looks like)
│   │   └── __init__.py
│   ├── routes/         # API endpoints (the URLs your frontend calls)
│   │   └── __init__.py
│   └── controllers/    # Business logic (what happens when an endpoint is called)
│       └── __init__.py
├── requirements.txt    # Python dependencies (like package.json for Node)
└── .env.example        # Template for environment variables (copy to .env)
```

**What goes where:**

- **`main.py`**: The FastAPI app initialization and startup code. This is where you configure CORS, middleware, and include your routes.
- **`models/`**: Pydantic models that define the structure of your data (e.g., what fields an MVP has).
- **`routes/`**: API endpoint definitions (e.g., `GET /api/mvps`, `POST /api/events`).
- **`controllers/`**: The actual logic that runs when someone hits an endpoint (e.g., "fetch MVPs from MongoDB").
- **`config/`**: Database connection strings, API keys, and other configuration.

**Note:** The `__init__.py` files are required to make Python recognize these folders as packages. They can be empty, but they must exist.

---

## Documentation (`docs/`)

Helpful guides for developers working on the project.

```
docs/
├── api_endpoints.md    # List of all API endpoints (planned/implemented)
└── setup_guide.md      # How to get the project running locally
```

**What goes here:**

- API documentation
- Setup instructions
- Architecture decisions
- Contributing guidelines

---

## Root Files

```
.gitignore              # Tells Git which files to ignore (node_modules, .env, etc.)
README.md               # Project overview, features, and general info
```

**`.gitignore`**: Prevents sensitive files (like `.env` with passwords) or generated files (like `__pycache__`) from being committed to Git.

**`README.md`**: The first thing people see when they visit your repo. Explains what the project does and how to use it.

---

## Common Patterns

### Adding a New Feature

1. **Frontend Feature**: Add HTML/CSS/JS to `client/index.html` (or create separate files in `client/`).
2. **Backend Feature**:
   - Create a model in `server/app/models/` (if you need new data)
   - Create a route in `server/app/routes/` (the endpoint)
   - Create a controller in `server/app/controllers/` (the logic)
   - Import and include the route in `server/app/main.py`

### File Naming Conventions

- **Python files**: Use `snake_case.py` (e.g., `mvp_controller.py`)
- **HTML/CSS/JS**: Use `kebab-case` or `camelCase` (e.g., `mvp-tracker.js` or `mvpTracker.js`)
- **Config files**: Use lowercase with dots (e.g., `.env.example`)

---

## Quick Reference

| Want to...                | Go to...                                 |
| ------------------------- | ---------------------------------------- |
| Change the UI             | `client/index.html`                      |
| Add an API endpoint       | `server/app/routes/`                     |
| Define data structure     | `server/app/models/`                     |
| Write business logic      | `server/app/controllers/`                |
| Configure database        | `server/app/config/`                     |
| Add dependencies          | `server/requirements.txt`                |
| Set environment variables | `server/.env` (copy from `.env.example`) |

---

## Questions?

If you're unsure where something should go:

- **"Does this run in the browser?"** → `client/`
- **"Does this run on the server?"** → `server/app/`
- **"Is this documentation?"** → `docs/`
