from firebase_admin import firestore
from firebase_functions import https_fn
import json
from datetime import datetime

def get_all_mvps(req: https_fn.Request, headers: dict) -> https_fn.Response:
    db = firestore.client()
    docs = db.collection('mvps').stream()
    mvps = []
    for doc in docs:
        data = doc.to_dict()
        data['id'] = doc.id
        # Serialize datetime objects
        if 'last_killed' in data and data['last_killed'] and hasattr(data['last_killed'], 'isoformat'):
            data['last_killed'] = data['last_killed'].isoformat()
        if 'respawn_at' in data and data['respawn_at'] and hasattr(data['respawn_at'], 'isoformat'):
            data['respawn_at'] = data['respawn_at'].isoformat()
        mvps.append(data)
    return https_fn.Response(json.dumps(mvps), headers=headers)

def create_mvp(req: https_fn.Request, headers: dict) -> https_fn.Response:
    db = firestore.client()
    try:
        data = req.get_json()
        update_time, doc_ref = db.collection('mvps').add(data)
        data['id'] = doc_ref.id
        return https_fn.Response(json.dumps(data), status=201, headers=headers)
    except Exception as e:
        return https_fn.Response(json.dumps({"error": str(e)}), status=400, headers=headers)

def get_mvp(req: https_fn.Request, headers: dict, mvp_id: str) -> https_fn.Response:
    db = firestore.client()
    doc_ref = db.collection('mvps').document(mvp_id)
    doc = doc_ref.get()
    if not doc.exists:
        return https_fn.Response(json.dumps({"error": "MVP not found"}), status=404, headers=headers)
    
    data = doc.to_dict()
    data['id'] = doc.id
    # Serialize datetime
    if 'last_killed' in data and data['last_killed'] and hasattr(data['last_killed'], 'isoformat'):
        data['last_killed'] = data['last_killed'].isoformat()
    if 'respawn_at' in data and data['respawn_at'] and hasattr(data['respawn_at'], 'isoformat'):
        data['respawn_at'] = data['respawn_at'].isoformat()
        
    return https_fn.Response(json.dumps(data), headers=headers)

def update_mvp(req: https_fn.Request, headers: dict, mvp_id: str) -> https_fn.Response:
    db = firestore.client()
    try:
        data = req.get_json()
        doc_ref = db.collection('mvps').document(mvp_id)
        
        # Check existence
        if not doc_ref.get().exists:
            return https_fn.Response(json.dumps({"error": "MVP not found"}), status=404, headers=headers)
        
        doc_ref.set(data, merge=True)
        
        # Return updated
        updated_doc = doc_ref.get()
        updated_data = updated_doc.to_dict()
        updated_data['id'] = updated_doc.id
        # Serialize
        if 'last_killed' in updated_data and updated_data['last_killed'] and hasattr(updated_data['last_killed'], 'isoformat'):
            updated_data['last_killed'] = updated_data['last_killed'].isoformat()
        if 'respawn_at' in updated_data and updated_data['respawn_at'] and hasattr(updated_data['respawn_at'], 'isoformat'):
            updated_data['respawn_at'] = updated_data['respawn_at'].isoformat()
            
        return https_fn.Response(json.dumps(updated_data), headers=headers)
    except Exception as e:
        return https_fn.Response(json.dumps({"error": str(e)}), status=400, headers=headers)

