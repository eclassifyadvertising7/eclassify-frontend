"use client"

import { useState, useEffect, useCallback } from "react"

export function useResendTimer(initialTime = 30) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false)
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  const startTimer = useCallback(() => {
    setTimeLeft(initialTime)
    setIsActive(true)
  }, [initialTime])

  const resetTimer = useCallback(() => {
    setTimeLeft(0)
    setIsActive(false)
  }, [])

  const canResend = !isActive && timeLeft === 0

  return {
    timeLeft,
    canResend,
    startTimer,
    resetTimer,
    isActive
  }
}