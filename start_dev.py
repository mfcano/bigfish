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
    3. Starts the Vite frontend server
    4. Opens the frontend in the default browser
    """
    project_root = Path(__file__).parent.absolute()
    server_dir = project_root / "server"
    client_dir = project_root / "client"

    print("🐟 Starting Big Fish Development Environment...")

    # 1. Basic Dependency Check (optional but helpful)
    # We'll just try to import uvicorn to see if it's there
    try:
        import uvicorn
    except ImportError:
        print("⚠️  'uvicorn' is not installed.")
        print("   Please run: pip install -r server/requirements.txt")
        sys.exit(1)

    # Check if Node.js/npm is available
    try:
        # On Windows, use shell=True to find npm in PATH
        if sys.platform == "win32":
            subprocess.run("npm --version", shell=True, capture_output=True, check=True)
        else:
            subprocess.run(["npm", "--version"], capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("⚠️  'npm' is not installed or not in PATH.")
        print("   Please install Node.js: https://nodejs.org/")
        print("   If npm is installed, try restarting your terminal/IDE to refresh PATH.")
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

    # 3. Start Frontend Server
    print("🌐 Starting Frontend Server...")
    
    try:
        # Check if node_modules exists, if not, suggest installing
        if not (client_dir / "node_modules").exists():
            print("⚠️  node_modules not found. Installing dependencies...")
            # On Windows, use shell=True to find npm in PATH
            if sys.platform == "win32":
                install_process = subprocess.run(
                    "npm install",
                    cwd=client_dir,
                    shell=True,
                    capture_output=True,
                    text=True
                )
            else:
                install_process = subprocess.run(
                    ["npm", "install"],
                    cwd=client_dir,
                    capture_output=True,
                    text=True
                )
            if install_process.returncode != 0:
                print("❌ Failed to install dependencies. Try running 'npm install' manually in the client directory.")
                print("❌ Error logs:")
                print(install_process.stderr)
                sys.exit(1)
            print("✅ Dependencies installed!")

        frontend_process = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=client_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            shell=sys.platform == "win32"  # Use shell on Windows
        )

        print("   Frontend process started (PID: {})".format(frontend_process.pid))
        print("   Waiting for frontend to initialize...")
        
        # Give it a moment to start up
        time.sleep(3)

        # Check if it crashed immediately
        if frontend_process.poll() is not None:
            stdout, stderr = frontend_process.communicate()
            print("❌ Frontend failed to start:")
            print(stderr)
            sys.exit(1)

        # Open browser after a short delay
        time.sleep(2)
        webbrowser.open("http://localhost:4000")

    except Exception as e:
        print(f"❌ Failed to start frontend: {e}")
        sys.exit(1)

    print("\n✅ Environment Running!")
    print("   - Backend: http://localhost:8000")
    print("   - API Docs: http://localhost:8000/docs")
    print("   - Frontend: http://localhost:4000")
    print("\n🔴 Press Ctrl+C to stop all servers and exit.")

    try:
        # Stream both server outputs to console
        import threading

        def stream_output(process, prefix):
            try:
                while True:
                    line = process.stdout.readline()
                    if not line and process.poll() is not None:
                        break
                    if line:
                        print(f"[{prefix}] {line.strip()}")
            except:
                pass

        # Start threads to stream output from both processes
        backend_thread = threading.Thread(
            target=stream_output, args=(server_process, "Backend"), daemon=True
        )
        frontend_thread = threading.Thread(
            target=stream_output, args=(frontend_process, "Frontend"), daemon=True
        )
        
        backend_thread.start()
        frontend_thread.start()

        # Wait for threads (they'll run until processes die)
        backend_thread.join()
        frontend_thread.join()

    except KeyboardInterrupt:
        print("\n🛑 Stopping servers...")
        server_process.terminate()
        frontend_process.terminate()
        print("👋 Goodbye!")


if __name__ == "__main__":
    main()