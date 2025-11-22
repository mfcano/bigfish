# Setup Guide

Welcome to the Big Fish project! Here is how to get started.

## Prerequisites
- [Python 3.10+](https://www.python.org/) (for the backend)
- A code editor (VS Code recommended)
- A web browser

## Frontend (The Website)
The frontend is currently a static HTML site.

1. Navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Open `index.html` in your browser.
   - On Mac: `open index.html`
   - On Windows: Double-click the file

## Backend (The Server)
We use **FastAPI** with Python.

1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Create a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create your environment file:
   ```bash
   cp .env.example .env
   ```
5. Start the server:
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

