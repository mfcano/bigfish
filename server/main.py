from firebase_functions import https_fn
from firebase_admin import initialize_app
import json
import os
import sys

# Add the current directory to sys.path to allow importing 'app' module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.routes import mvp

# Initialize Firebase Admin
# Use GOOGLE_APPLICATION_CREDENTIALS env var or default credentials
if not os.getenv("FIREBASE_CONFIG"):
    # Local dev or manual credential path
    cred_path = os.getenv("SERVICE_ACCOUNT_FILE")
    if cred_path and os.path.exists(cred_path):
        from firebase_admin import credentials
        cred = credentials.Certificate(cred_path)
        try:
            initialize_app(cred)
        except ValueError:
            pass  # Already initialized
    else:
        try:
            initialize_app()
        except ValueError:
            pass
else:
    # Cloud environment
    try:
        initialize_app()
    except ValueError:
        pass


@https_fn.on_request()
def api(req: https_fn.Request) -> https_fn.Response:
    """
    Single entry point for the API.
    Delegates to route handlers based on path.
    """
    # CORS Headers
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    }

    # Handle Preflight
    if req.method == 'OPTIONS':
        return https_fn.Response('', status=204, headers=headers)

    path = req.path
    # Normalize path (remove trailing slash if present and not root)
    if len(path) > 1 and path.endswith('/'):
        path = path[:-1]

    # --- ROUTING ---

    # /mvps
    if path == '/mvps':
        if req.method == 'GET':
            return mvp.get_all_mvps(req, headers)
        if req.method == 'POST':
            return mvp.create_mvp(req, headers)

    # /mvps/<id>
    if path.startswith('/mvps/'):
        mvp_id = path.split('/')[-1]
        if req.method == 'GET':
            return mvp.get_mvp(req, headers, mvp_id)
        if req.method == 'PUT':
            return mvp.update_mvp(req, headers, mvp_id)

    # Default 404
    return https_fn.Response(json.dumps({"error": "Not Found", "path": path}), status=404, headers=headers)
