from typing import Optional, Dict, Any
from datetime import datetime


class Mvp:
    def __init__(self, data: Dict[str, Any]):
        self.id = data.get('id')
        self.mob_id = data.get('mob_id')
        self.name = data.get('name')
        self.map_name = data.get('map_name')
        self.spawn_delay = data.get('spawn_delay')
        self.spawn_variance = data.get('spawn_variance')
        self.status = data.get('status', 'alive')
        self.notes = data.get('notes')

        # Handle datetime fields
        self.last_killed = data.get('last_killed')
        self.respawn_at = data.get('respawn_at')

    def to_dict(self) -> Dict[str, Any]:
        """Convert object to dictionary for Firestore storage/JSON response"""
        data = {
            "mob_id": self.mob_id,
            "name": self.name,
            "map_name": self.map_name,
            "spawn_delay": self.spawn_delay,
            "spawn_variance": self.spawn_variance,
            "status": self.status,
            "notes": self.notes,
            "last_killed": self.last_killed,
            "respawn_at": self.respawn_at
        }
        if self.id:
            data['id'] = self.id

        # Serialize datetimes if they are objects
        if isinstance(data['last_killed'], datetime):
            data['last_killed'] = data['last_killed'].isoformat()
        if isinstance(data['respawn_at'], datetime):
            data['respawn_at'] = data['respawn_at'].isoformat()

        return data
