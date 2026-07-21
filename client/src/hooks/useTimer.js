import { useState, useEffect, useCallback } from 'react'

export function useTimer(initialTime, isPaused = false, onTimeUp = () => {}) {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)

  // Démarre le timer
  const start = useCallback(() => {
    setTimeLeft(initialTime)
    setIsRunning(true)
  }, [initialTime])

  // Met en pause
  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  // Reprend
  const resume = useCallback(() => {
    setIsRunning(true)
  }, [])

  // Réinitialise
  const reset = useCallback(() => {
    setTimeLeft(initialTime)
    setIsRunning(false)
  }, [initialTime])

  // Effet du compte à rebours
  useEffect(() => {
    if (!isRunning || isPaused || timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsRunning(false)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, isPaused, timeLeft, onTimeUp])

  return {
    timeLeft,
    isRunning,
    isCritical: timeLeft <= 5 && timeLeft > 0,
    isTimeUp: timeLeft === 0,
    start,
    pause,
    resume,
    reset,
  }
}