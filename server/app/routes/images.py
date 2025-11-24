from firebase_admin import storage
from firebase_functions import https_fn
import json
import urllib.request


def get_image(req: https_fn.Request, headers: dict, image_name: str) -> https_fn.Response:
    """Check if an image exists in storage and return its public URL."""
    try:
        bucket = storage.bucket()
        blob = bucket.blob(f"mobs/{image_name}")
        if blob.exists():
            # Ensure it's public (may already be)
            try:
                blob.make_public()
            except Exception:
                pass
            return https_fn.Response(json.dumps({"url": blob.public_url}), headers=headers)
        else:
            return https_fn.Response(json.dumps({"error": "Not found"}), status=404, headers=headers)
    except Exception as e:
        return https_fn.Response(json.dumps({"error": str(e)}), status=400, headers=headers)


def save_image(req: https_fn.Request, headers: dict) -> https_fn.Response:
    """Fetch an external image and save it into Firebase Storage under mobs/<key>.

    Expects JSON body: { "externalUrl": "https://...", "key": "123.gif" }
    Returns { url: publicUrl } on success.
    """
    try:
        data = req.get_json()
        external = data.get("externalUrl")
        key = data.get("key")
        if not external or not key:
            return https_fn.Response(json.dumps({"error": "externalUrl and key required"}), status=400, headers=headers)

        # Fetch external image
        try:
            resp = urllib.request.urlopen(external, timeout=10)
            content_type = resp.headers.get_content_type()
            img_bytes = resp.read()
        except Exception as e:
            return https_fn.Response(json.dumps({"error": f"Failed to fetch external image: {e}"}), status=400, headers=headers)

        # Upload to storage
        bucket = storage.bucket()
        blob = bucket.blob(f"mobs/{key}")
        blob.upload_from_string(img_bytes, content_type=content_type or "application/octet-stream")
        try:
            blob.make_public()
        except Exception:
            pass

        return https_fn.Response(json.dumps({"url": blob.public_url}), headers=headers)

    except Exception as e:
        return https_fn.Response(json.dumps({"error": str(e)}), status=400, headers=headers)
