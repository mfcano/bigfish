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

      const transformed = data.map((mvp) => ({
        id: mvp.mob_id,
        _id: mvp._id || mvp.id,
        name: mvp.name,
        map: mvp.map_name,
        status: mvp.status,
        respawnTime: calculateRespawnDisplay(mvp),
        coords: 'Random',
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

  const reportKill = async (mvp) => {
    try {
      // Optimistic update
      setMvps((prev) =>
        prev.map((m) =>
          m._id === mvp._id
            ? { ...m, status: 'dead', respawnTime: 'Calculating...' }
            : m
        )
      )

      const response = await fetch(`${API_BASE}/mvps/${mvp._id}`, {
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

