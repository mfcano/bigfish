from firebase_functions import https_fn
from firebase_admin import initialize_app
import json
import os
import sys

# Add the current directory to sys.path to allow importing 'app' module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.routes import mvp, user

# Initialize Firebase Admin
# Use GOOGLE_APPLICATION_CREDENTIALS env var or default credentials
options = {
    'storageBucket': 'big-fish-9dbec.firebasestorage.app'
}

if not os.getenv("FIREBASE_CONFIG"):
    # Local dev or manual credential path
    cred_path = os.getenv("SERVICE_ACCOUNT_FILE")

    # Fallback: Check project root for service account file if not provided/found
    if not cred_path or not os.path.exists(cred_path):
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.dirname(current_dir)
            for f in os.listdir(project_root):
                if f.endswith('.json') and 'firebase-adminsdk' in f:
                    cred_path = os.path.join(project_root, f)
                    print(f"Found service account in root: {cred_path}")
                    break
        except Exception:
            pass

    if cred_path and os.path.exists(cred_path):
        from firebase_admin import credentials
        cred = credentials.Certificate(cred_path)
        try:
            initialize_app(cred, options)
        except ValueError:
            pass  # Already initialized
    else:
        try:
            initialize_app(options=options)
        except ValueError:
            pass
else:
    # Cloud environment
    try:
        initialize_app(options=options)
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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

    # /users
    if path == '/users':
        if req.method == 'GET':
            return user.get_all_users(req, headers)

    # /users/<id>/avatar
    if '/users/' in path and path.endswith('/avatar'):
        # Extract user_id from /users/<user_id>/avatar
        parts = path.split('/')
        # parts = ['', 'users', '<user_id>', 'avatar']
        if len(parts) == 4:
            user_id = parts[2]
            if req.method == 'POST':
                return user.upload_avatar(req, headers, user_id)

    # /users/<id>
    if path.startswith('/users/'):
        user_id = path.split('/')[-1]
        if req.method == 'PUT':
            return user.update_user(req, headers, user_id)
        if req.method == 'GET':
            return user.get_user(req, headers, user_id)

    # Default 404
    return https_fn.Response(json.dumps({"error": "Not Found", "path": path}), status=404, headers=headers)
