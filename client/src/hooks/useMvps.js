import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:8000'

export const useMvps = () => {
  const [mvps, setMvps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMvps = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/mvps`)
      if (!response.ok) throw new Error('Failed to fetch MVPs')
      const data = await response.json()

      // Group MVPs by mob_id (same monster, different spawn locations)
      const groupedMvps = data.reduce((acc, mvp) => {
        const key = mvp.mob_id
        if (!acc[key]) {
          acc[key] = {
            id: mvp.mob_id,
            name: mvp.name,
            locations: []
          }
        }
        acc[key].locations.push({
          _id: mvp._id || mvp.id,
          map: mvp.map_name,
          status: mvp.status,
          respawnTime: calculateRespawnDisplay(mvp),
          respawnAt: mvp.respawn_at,
          lastKilled: mvp.last_killed,
          coords: 'Random',
        })
        return acc
      }, {})

      // Convert to array and sort locations by status (alive first)
      const transformed = Object.values(groupedMvps).map(mvp => ({
        ...mvp,
        locations: mvp.locations.sort((a, b) => {
          if (a.status === 'alive' && b.status !== 'alive') return -1
          if (a.status !== 'alive' && b.status === 'alive') return 1
          return 0
        })
      }))

      setMvps(transformed)
      setError(null)
    } catch (err) {
      console.error('Error fetching MVPs:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const calculateRespawnDisplay = (mvp) => {
    if (mvp.status === 'alive') return 'Now'
    if (mvp.respawn_at) {
      return new Date(mvp.respawn_at).toLocaleTimeString()
    }
    return `${mvp.spawn_delay}m`
  }

  const reportKill = async (locationId) => {
    try {
      // Optimistic update
      setMvps((prev) =>
        prev.map((mvp) => ({
          ...mvp,
          locations: mvp.locations.map((loc) =>
            loc._id === locationId
              ? { ...loc, status: 'dead', respawnTime: 'Calculating...' }
              : loc
          )
        }))
      )

      const response = await fetch(`${API_BASE}/mvps/${locationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'dead' }),
      })

      if (response.ok) {
        await fetchMvps()
      }
    } catch (err) {
      console.error('Error reporting kill:', err)
      // Revert optimistic update on error
      await fetchMvps()
    }
  }

  useEffect(() => {
    fetchMvps()
  }, [])

  return { mvps, loading, error, reportKill, refetch: fetchMvps }
}

