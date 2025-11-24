import os
import sys
import firebase_admin
from firebase_admin import credentials, firestore


def get_prod_data(service_account_path):
    """
    Connects to Production Firestore and reads all collections and documents.
    """
    # Ensure no emulator env var interferes with Prod connection
    if "FIRESTORE_EMULATOR_HOST" in os.environ:
        del os.environ["FIRESTORE_EMULATOR_HOST"]

    print(f"🔌 Connecting to Production using {service_account_path}...")
    cred = credentials.Certificate(service_account_path)

    try:
        app = firebase_admin.get_app('prod')
    except ValueError:
        app = firebase_admin.initialize_app(cred, name='prod')

    db = firestore.client(app=app)

    data = {}

    # Helper to recursively read
    def read_collection(col_ref, parent_path=""):
        col_data = {}
        for doc in col_ref.stream():
            doc_path = f"{parent_path}/{doc.id}" if parent_path else doc.id
            doc_dict = doc.to_dict()

            # Recursively get subcollections
            sub_cols_data = {}
            for sub_col in doc.reference.collections():
                sub_cols_data[sub_col.id] = read_collection(sub_col, doc_path)

            col_data[doc.id] = {
                "data": doc_dict,
                "subcollections": sub_cols_data
            }
        return col_data

    print("📥 Fetching data from Production...")
    # list_collections() gets root collections
    for col in db.collections():
        print(f"   Reading collection: {col.id}")
        data[col.id] = read_collection(col)

    return data


def write_local_data(data, service_account_path):
    """
    Connects to Local Emulator and writes the provided data.
    """
    # Set emulator env var
    os.environ["FIRESTORE_EMULATOR_HOST"] = "127.0.0.1:8081"
    os.environ["GCLOUD_PROJECT"] = "big-fish-9dbec"

    print(
        f"🔌 Connecting to Emulator at {os.environ['FIRESTORE_EMULATOR_HOST']}...")

    # Use the same credentials for the emulator (it ignores validity but needs a structured object)
    cred = credentials.Certificate(service_account_path)

    try:
        app = firebase_admin.get_app('local')
    except ValueError:
        app = firebase_admin.initialize_app(cred, name='local', options={
            'projectId': "big-fish-9dbec"
        })

    db = firestore.client(app=app)

    def write_collection(col_ref, col_data):
        for doc_id, content in col_data.items():
            doc_ref = col_ref.document(doc_id)
            if content.get("data"):
                doc_ref.set(content["data"])

            # Subcollections
            for sub_col_id, sub_col_data in content.get("subcollections", {}).items():
                write_collection(doc_ref.collection(sub_col_id), sub_col_data)

    print("📤 Writing data to Emulator...")
    for col_id, col_data in data.items():
        print(f"   Writing collection: {col_id}")
        write_collection(db.collection(col_id), col_data)


if __name__ == "__main__":
    sa_path = None

    # 1. Try argument
    if len(sys.argv) >= 2:
        sa_path = sys.argv[1]

    # 2. Try finding json in current dir or parent dir
    if not sa_path:
        possible_dirs = ['.', '..']
        for d in possible_dirs:
            try:
                if not os.path.exists(d):
                    continue
                files = [f for f in os.listdir(d) if f.endswith(
                    '.json') and 'firebase-adminsdk' in f]
                if files:
                    sa_path = os.path.join(d, files[0])
                    print(f"🔍 Found service account file: {sa_path}")
                    break
            except OSError:
                pass

    if not sa_path or not os.path.exists(sa_path):
        print("❌ Error: Could not find service account JSON file.")
        print(
            "Usage: python migrations/seed_local.py [path_to_service_account.json]")
        sys.exit(1)

    try:
        # 1. Read Prod
        data = get_prod_data(sa_path)
        print(f"✅ Fetched {len(data)} root collections.")

        # 2. Write Local
        write_local_data(data, sa_path)
        print("✅ Done! Local emulator seeded.")

    except Exception as e:
        print(f"❌ Error: {e}")
        # Print full traceback for debugging
        import traceback
        traceback.print_exc()
        sys.exit(1)
