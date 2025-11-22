from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime


class Mvp(Document):
    mob_id: int = Field(...,
                        description="The game ID of the monster (e.g. 1511)")
    name: str = Field(..., description="Name of the MVP")
    map_name: str = Field(..., description="The map where this MVP spawns")

    # Spawn Data (Static)
    spawn_delay: int = Field(..., description="Minutes until respawn")
    spawn_variance: int = Field(..., description="Minutes of random variance")

    # Live Data (Dynamic)
    status: str = Field(
        default="alive", description="'alive', 'dead', or 'unknown'")
    last_killed: Optional[datetime] = Field(
        default=None, description="When it was last killed")
    respawn_at: Optional[datetime] = Field(
        default=None, description="Calculated respawn time")

    # Metadata
    notes: Optional[str] = None

    class Settings:
        name = "mvps"  # Collection name in MongoDB

    class Config:
        json_schema_extra = {
            "example": {
                "mob_id": 1511,
                "name": "Amon Ra",
                "map_name": "moc_pryd06",
                "spawn_delay": 60,
                "spawn_variance": 10,
                "status": "alive"
            }
        }
