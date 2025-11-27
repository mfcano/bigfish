from firebase_admin import firestore, auth, storage
from firebase_functions import https_fn
import json
from ..models.user import User


def update_user(req: https_fn.Request, headers: dict, uid: str) -> https_fn.Response:
    """
    Updates user profile (Auth) and user preferences (Firestore).
    Expects JSON body with optional 'displayName' and 'theme'.
    """
    db = firestore.client()
    try:
        data = req.get_json()
        display_name = data.get('displayName')
        theme = data.get('theme')
        mvp_layout = data.get('mvpLayout')

        # 1. Update Auth Profile (Display Name) if provided
        # Wrap in try-except to handle Auth errors without failing the whole request
        if display_name is not None:
            try:
                auth.update_user(
                    uid,
                    display_name=display_name
                )
            except Exception as auth_error:
                print(
                    f"Warning: Failed to update Auth profile for {uid}: {auth_error}")
                # If this is a credential issue (Invalid JWT Signature), we log it but proceed to update Firestore
                # This allows the user to at least update their preferences.

        # 2. Update Firestore Document (Theme & synced display name)
        user_ref = db.collection('users').document(uid)

        # Prepare update data
        update_data = {}
        if theme is not None:
            update_data['theme'] = theme
        if display_name is not None:
            update_data['display_name'] = display_name
        if mvp_layout is not None:
            update_data['mvp_layout'] = mvp_layout

        update_data['updated_at'] = firestore.SERVER_TIMESTAMP

        # Use set with merge=True to create if doesn't exist
        user_ref.set(update_data, merge=True)

        return https_fn.Response(json.dumps({"success": True}), headers=headers)

    except Exception as e:
        print(f"Error updating user {uid}: {e}")
        return https_fn.Response(json.dumps({"error": str(e)}), status=400, headers=headers)


def get_user(req: https_fn.Request, headers: dict, uid: str) -> https_fn.Response:
    """
    Fetches user data from Firestore.
    """
    db = firestore.client()
    try:
        user_ref = db.collection('users').document(uid)
        doc = user_ref.get()

        if not doc.exists:
            # If not in Firestore yet, return basic auth info or empty
            # But for now, 404 or default
            return https_fn.Response(json.dumps({}), headers=headers)

        user_data = doc.to_dict()
        return https_fn.Response(json.dumps(user_data), headers=headers)

    except Exception as e:
        print(f"Error fetching user {uid}: {e}")
        return https_fn.Response(json.dumps({"error": str(e)}), status=400, headers=headers)


def upload_avatar(req: https_fn.Request, headers: dict, uid: str) -> https_fn.Response:
    """
    Uploads a user avatar to Firebase Storage and updates Auth/Firestore.
    Expects multipart/form-data with 'avatar' file field.
    """
    try:
        if 'avatar' not in req.files:
            return https_fn.Response(json.dumps({"error": "No file provided"}), status=400, headers=headers)

        file = req.files['avatar']
        if not file:
            return https_fn.Response(json.dumps({"error": "Empty file"}), status=400, headers=headers)

        # Upload to Firebase Storage
        bucket = storage.bucket()
        # Use a fixed name or keep extension?
        # Keeping original filename might be risky, but for now it's okay.
        # Better to standardize, e.g., avatar.jpg or keep extension.
        # Let's keep original name for now to support different extensions easily.
        blob = bucket.blob(f"avatars/{uid}/{file.filename}")
        blob.upload_from_file(file.stream, content_type=file.content_type)

        # Make public
        blob.make_public()
        photo_url = blob.public_url

        # Update Auth
        auth.update_user(uid, photo_url=photo_url)

        # Update Firestore
        db = firestore.client()
        db.collection('users').document(uid).set({
            'photo_url': photo_url,
            'updated_at': firestore.SERVER_TIMESTAMP
        }, merge=True)

        return https_fn.Response(json.dumps({"photoUrl": photo_url}), headers=headers)

    except Exception as e:
        print(f"Error uploading avatar for {uid}: {e}")
        return https_fn.Response(json.dumps({"error": str(e)}), status=400, headers=headers)


def get_all_users(req: https_fn.Request, headers: dict) -> https_fn.Response:
    """
    Fetches all users from Firestore.
    """
    db = firestore.client()
    try:
        users_ref = db.collection('users')
        docs = users_ref.stream()

        users_list = []
        for doc in docs:
            user_data = doc.to_dict()
            # Include ID if needed
            user_data['uid'] = doc.id
            # Convert timestamps to string if necessary, but JSON serialization usually handles basic types.
            # However, Firestore timestamps might need manual conversion if json.dumps fails.
            # Let's check if we need a custom encoder or just convert here.
            # Simple conversion for safety:
            if 'created_at' in user_data and user_data['created_at']:
                user_data['created_at'] = user_data['created_at'].isoformat()
            if 'updated_at' in user_data and user_data['updated_at']:
                user_data['updated_at'] = user_data['updated_at'].isoformat()

            users_list.append(user_data)

        return https_fn.Response(json.dumps(users_list, default=str), headers=headers)

    except Exception as e:
        print(f"Error fetching all users: {e}")
        return https_fn.Response(json.dumps({"error": str(e)}), status=400, headers=headers)
