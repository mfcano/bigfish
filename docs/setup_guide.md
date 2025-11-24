# Setup Guide

Welcome to the Big Fish project! Here is how to get started.

## Prerequisites

- [Python 3.10+](https://www.python.org/) (for the backend)
- [Node.js 20+](https://nodejs.org/) (Required for Vite 6/7)
  - Recommended: Use `nvm` to manage versions.
  - Run `nvm use` in the project root to auto-select version 20.
- [Firebase CLI](https://firebase.google.com/docs/cli)
  - Run `npm install -g firebase-tools`
  - Run `firebase login` to authenticate.
- Java 11+ (Required for Firebase Emulators)
- A code editor (VS Code recommended)
- A web browser

## Quick Start (Recommended)

We have a script that sets up dependencies and starts everything for you!

1.  **Configure Environment**:

    - Copy `server/env.example` to `server/.env`.
    - You need a Firebase Service Account JSON key (optional for local emulator, but required for production).
      - Place the JSON file in the `server/` directory.
      - Update `server/.env` to point to it: `SERVICE_ACCOUNT_FILE=server/your-key-file.json`.

2.  **Run the Start Script**:
    From the root folder, run:

    ```bash
    python3 start_dev.py
    ```

    This will:

    - Check that required ports (8000, 5173, 8081, 4000) are free.
    - Install Python dependencies (`server/requirements.txt`).
    - **Automatically install Node dependencies** (`client/package.json`).
    - Start the Backend (Cloud Functions emulator via `functions-framework`).
    - Start the Frontend React dev server (Strictly on port 5173).
    - **Start the Firebase Emulator Suite** (Firestore) on port 8081.
    - Stream logs from all services to your terminal.

    > **Note:** The Firestore Emulator is configured to **persist data**. It loads from and saves to the `emulator-data/` directory automatically. You only need to seed data once.

    > **UI:** Use the Emulator UI at `http://localhost:4000` to inspect your local database.

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
- **migrations/**: Scripts for data seeding and migration.
- **start_dev.py**: Development entry point script.
- **deploy.sh**: Deployment script.
- **emulator-data/**: Local data storage for Firestore emulator persistence.
