# Setup Guide

Welcome to the Big Fish project! Here is how to get started.

## Prerequisites

- [Python 3.10+](https://www.python.org/) (for the backend)
- [Node.js 20+](https://nodejs.org/) (Required for Vite 6/7)
  - Recommended: Use `nvm` to manage versions.
  - Run `nvm use` in the project root to auto-select version 20.
- A code editor (VS Code recommended)
- A web browser

## Quick Start (Recommended)

We have a script that sets up dependencies and starts everything for you!

1.  **Configure Environment**:

    - Copy `server/env.example` to `server/.env`.
    - You need a Firebase Service Account JSON key.
      - Place the JSON file in the `server/` directory.
      - Update `server/.env` to point to it: `SERVICE_ACCOUNT_FILE=server/your-key-file.json`.

2.  **Run the Start Script**:
    From the root folder, run:

    ```bash
    python3 start_dev.py
    ```

    This will:

    - Install Python dependencies (`server/requirements.txt`).
    - **Automatically install Node dependencies** (`client/package.json`).
    - Start the Backend (Cloud Functions emulator via `functions-framework`).
    - Start the Frontend React dev server.
    - Stream logs from both to your terminal.

    > **Note:** If you encounter permission errors with `npm`, please fix your npm permissions or run the script with elevated privileges (though fixing permissions is recommended).

---

## Deployment

We deploy the frontend to **Firebase Hosting** and the backend to **Firebase Cloud Functions**.

### Prerequisites for Deployment

1.  **Firebase Blaze Plan**: You must upgrade your Firebase project to the **Blaze (Pay-as-you-go)** plan. This is required for Cloud Functions (Python runtime).
2.  **Firebase Tools**: Ensure you have the CLI installed and logged in:
    ```bash
    npm install -g firebase-tools
    firebase login
    ```

### How to Deploy

Simply run the deployment script:

```bash
./deploy.sh
```

This will:

1.  Build the frontend client.
2.  Deploy the client to Firebase Hosting.
3.  Deploy the Python backend to Firebase Cloud Functions (Function name: `api`).

**Note:** The deployed backend URL will look like `https://api-big-fish-9dbec.uc.a.run.app` (or similar). You MUST update `client/src/hooks/useMvps.js` with this URL for the production app to work.

---

## Project Structure

- **client/**: React frontend application.
- **server/**: Python Cloud Functions backend.
  - **main.py**: Entry point for Cloud Functions (contains all API logic).
  - **app/**: Application logic.
    - **models/**: Data models.
    - **routes/**: Route handlers.
  - **requirements.txt**: Python dependencies.
- **docs/**: Documentation for developers.
- **start_dev.py**: Development entry point script.
- **deploy.sh**: Deployment script.
