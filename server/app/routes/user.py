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

        # 1. Update Auth Profile (Display Name) if provided
        if display_name is not None:
            auth.update_user(
                uid,
                display_name=display_name
            )

        # 2. Update Firestore Document (Theme & synced display name)
        user_ref = db.collection('users').document(uid)
        
        # Prepare update data
        update_data = {}
        if theme is not None:
            update_data['theme'] = theme
        if display_name is not None:
            update_data['display_name'] = display_name
            
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
