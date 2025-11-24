# Migrations & Seeding

This directory contains scripts to manage data migrations and seeding for the Big Fish project.

## Seed Local Emulator

Use `seed_local.py` to copy data from the **Production Firestore** database to your **Local Firestore Emulator**.

### Prerequisites

1.  Ensure the **Firestore Emulator** is running (e.g., via `python start_dev.py`).
2.  You need a **Service Account Key** JSON file for the production Firebase project.
3.  You need the python dependencies installed (same as server).

### Usage

Run the script from the project root or `migrations/` folder. Ensure you use the python environment with `firebase-admin` installed (typically `server/venv`).

```bash
# 1. Activate server virtual environment
source server/venv/bin/activate

# 2. Run the seed script
# It automatically finds a service account JSON in the current directory
python migrations/seed_local.py

# OR specify the path explicitly
python migrations/seed_local.py /path/to/service-account.json
```

### What it does

1.  Connects to the Production Firestore using the Service Account.
2.  Reads all root collections and their documents (including subcollections).
3.  Connects to the Local Firestore Emulator (port 8081).
4.  Writes all the fetched data to the emulator.

### Persistence

The emulator started by `start_dev.py` is configured to **persist data** to the `emulator-data/` directory.

- **On Start**: Loads data from `emulator-data/`.
- **On Exit**: Saves data to `emulator-data/`.

This means you only need to run this seed script **once** (or whenever you want to refresh your local data from production).
