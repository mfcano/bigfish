#!/usr/bin/env python3
import os
import subprocess
import sys
import webbrowser
import time
from pathlib import Path


def main():
    """
    Starts the Big Fish development environment:
    1. Checks if required packages are installed (simple check)
    2. Starts the FastAPI backend server
    3. Opens the frontend HTML file in the default browser
    """
    project_root = Path(__file__).parent.absolute()
    server_dir = project_root / "server"
    # client_file = project_root / "client" / "index.html"

    print("🐟 Starting Big Fish Development Environment...")

    # 1. Basic Dependency Check (optional but helpful)
    # We'll just try to import uvicorn to see if it's there
    try:
        import uvicorn
    except ImportError:
        print("⚠️  'uvicorn' is not installed.")
        print("   Please run: pip install -r server/requirements.txt")
        sys.exit(1)

    # 2. Start Backend Server
    print("🚀 Starting Backend Server...")

    # Use the current python executable
    python_exe = sys.executable

    # Run uvicorn as a subprocess
    # We use Popen so it runs in parallel/background while we continue
    try:
        server_process = subprocess.Popen(
            [python_exe, "-m", "uvicorn", "app.main:app",
                "--reload", "--port", "8000"],
            cwd=server_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        print("   Server process started (PID: {})".format(server_process.pid))
        print("   Waiting for server to initialize...")

        # Give it a moment to start up
        time.sleep(3)

        # Check if it crashed immediately
        if server_process.poll() is not None:
            stdout, stderr = server_process.communicate()
            print("❌ Server failed to start:")
            print(stderr)
            sys.exit(1)

    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)

    # 3. Open Frontend
    print("🌐 Please open the frontend in a separate terminal by running 'npm run dev' in the client directory! <3")
    # webbrowser.open(f"file://{client_file}")

    print("\n✅ Environment Running!")
    print("   - Backend: http://localhost:8000")
    print("   - API Docs: http://localhost:8000/docs")
    print("   - Frontend: Opened in browser")
    print("\n🔴 Press Ctrl+C to stop the server and exit.")

    try:
        # Stream server output to console so user can see logs
        while True:
            line = server_process.stdout.readline()
            if not line and server_process.poll() is not None:
                break
            if line:
                print(f"[Server] {line.strip()}")
    except KeyboardInterrupt:
        print("\n🛑 Stopping server...")
        server_process.terminate()
        print("👋 Goodbye!")


if __name__ == "__main__":
    main()
