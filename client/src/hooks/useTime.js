import { useState, useEffect } from 'react'

export const useTime = () => {
  const [serverTime, setServerTime] = useState('')
  const [localTime, setLocalTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setLocalTime(now.toLocaleTimeString())
      setServerTime(
        now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return { serverTime, localTime }
}

