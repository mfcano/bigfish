from fastapi import APIRouter, HTTPException
from app.models.mvp import Mvp
from typing import List
from beanie import PydanticObjectId

router = APIRouter(
    prefix="/mvps",
    tags=["MVPs"]
)

@router.get("/", response_model=List[Mvp])
async def get_all_mvps():
    """
    Get all tracked MVPs
    """
    return await Mvp.find_all().to_list()

@router.post("/", response_model=Mvp)
async def create_mvp(mvp: Mvp):
    """
    Add a new MVP to track
    """
    await mvp.create()
    return mvp

@router.get("/{id}", response_model=Mvp)
async def get_mvp(id: PydanticObjectId):
    """
    Get a specific MVP by ID
    """
    mvp = await Mvp.get(id)
    if not mvp:
        raise HTTPException(status_code=404, detail="MVP not found")
    return mvp

@router.put("/{id}", response_model=Mvp)
async def update_mvp(id: PydanticObjectId, mvp_data: Mvp):
    """
    Update an MVP (e.g. update status or respawn time)
    """
    mvp = await Mvp.get(id)
    if not mvp:
        raise HTTPException(status_code=404, detail="MVP not found")
    
    # Update fields
    mvp.status = mvp_data.status
    mvp.respawn_at = mvp_data.respawn_at
    mvp.last_killed = mvp_data.last_killed
    mvp.notes = mvp_data.notes
    
    await mvp.save()
    return mvp

