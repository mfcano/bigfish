# Setup Guide

Welcome to the Big Fish project! Here is how to get started.

## Prerequisites

- [Python 3.10+](https://www.python.org/) (for the backend)
- A code editor (VS Code recommended)
- A web browser

## Quick Start (Recommended)

We have a script that starts everything for you!

1. Ensure you have set up the backend first (see "Backend Setup" below).
2. Run the start script from the root folder:
   ```bash
   python3 start_dev.py
   ```
   This will:
   - Start the API server
   - Open the website in your browser
   - Show you server logs in the terminal

---

## Manual Setup

If you prefer to run things manually:

### Frontend (The Website)

The frontend is currently a static HTML site.

1. Navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Open `index.html` in your browser.
   - On Mac: `open index.html`
   - On Windows: Double-click the file

### Backend (The Server)

We use **FastAPI** with Python.

1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create your environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```
4. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`.
   Interactive docs are at `http://localhost:8000/docs`.

## Project Structure

- **client/**: Contains the HTML/CSS/JS for the user interface.
- **server/**: Contains the Python FastAPI backend.
  - **app/**: Main application code.
  - **requirements.txt**: Python dependencies.
- **docs/**: Documentation for developers.
