#!/usr/bin/env python3
import os
import subprocess
import sys
import time
import signal
from pathlib import Path
from threading import Thread


def install_python_deps(server_dir):
    print("📦 Checking Python dependencies...")
    try:
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], cwd=server_dir)
    except subprocess.CalledProcessError:
        print("❌ Failed to install Python dependencies.")
        sys.exit(1)


def install_node_deps(client_dir):
    print("📦 Checking Node dependencies...")
    node_modules = client_dir / "node_modules"

    # Always verify dependencies are installed
    print("   Ensuring 'node_modules' are installed...")
    try:
        if not node_modules.exists():
          subprocess.check_call(["npm", "install"], cwd=client_dir, shell=True)
    except subprocess.CalledProcessError:
        print("❌ Failed to install Node dependencies.")
        sys.exit(1)


def build_client(client_dir):
    print("🔨 Building client...")
    try:
        subprocess.check_call(["npm", "run", "build"], cwd=client_dir, shell=True)
        print("✅ Client build successful!")
    except subprocess.CalledProcessError:
        print("❌ Failed to build client.")
        sys.exit(1)


def stream_output(process, prefix):
    try:
        while True:
            line = process.stdout.readline()
            if not line:
                break
            print(f"[{prefix}] {line.strip()}")
    except ValueError:
        pass


def main():
    """
    Starts the Big Fish development environment:
    1. Installs dependencies
    2. Builds client
    3. Starts Backend (Functions Framework)
    4. Starts Frontend (Vite)
    """
    project_root = Path(__file__).parent.absolute()
    server_dir = project_root / "server"
    client_dir = project_root / "client"

    print("🐟 Starting Big Fish Development Environment...")

    # 1. Install Dependencies
    install_python_deps(server_dir)
    install_node_deps(client_dir)

    # 2. Build Client
    build_client(client_dir)

    processes = []

    def cleanup(signum, frame):
        print("\n🛑 Stopping services...")
        for p in processes:
            p.terminate()
        print("👋 Goodbye!")
        sys.exit(0)

    signal.signal(signal.SIGINT, cleanup)

    # 3. Start Backend (Functions Framework)
    print("🚀 Starting Backend Server (Functions Framework)...")
    # NOTE: We use 'main:api' because file is main.py and function is api
    # We set port 8000 to match client config
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "functions_framework", "--target=api",
            "--source=main.py", "--port=8000", "--debug"],
        cwd=server_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,  # Merge stderr into stdout
        text=True,
        bufsize=1,
        env={**os.environ, "PORT": "8000"}  # Explicitly pass PORT
    )
    processes.append(backend_process)

    # Start a thread to stream backend output
    backend_thread = Thread(target=stream_output,
                            args=(backend_process, "Backend"))
    backend_thread.daemon = True
    backend_thread.start()

    # 4. Start Frontend
    print("🌐 Starting Frontend Server...")
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=client_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        shell=True
    )
    processes.append(frontend_process)

    # Start a thread to stream frontend output
    frontend_thread = Thread(target=stream_output,
                             args=(frontend_process, "Frontend"))
    frontend_thread.daemon = True
    frontend_thread.start()

    print("\n✅ Environment Running!")
    print("   - Backend: http://localhost:8000")
    print("   - Frontend: http://localhost:5173 (or similar)")
    print("\n🔴 Press Ctrl+C to stop all servers.")

    # Wait for processes
    while True:
        time.sleep(1)
        if backend_process.poll() is not None:
            print("❌ Backend server stopped unexpectedly.")
            cleanup(None, None)
        if frontend_process.poll() is not None:
            print("❌ Frontend server stopped unexpectedly.")
            cleanup(None, None)


if __name__ == "__main__":
    main()