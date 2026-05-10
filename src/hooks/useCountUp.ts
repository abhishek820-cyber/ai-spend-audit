import { useState, useEffect, useRef } from 'react'

interface UseCountUpOptions {
  start?: number
  end: number
  duration?: number
  decimals?: number
  delay?: number
}

export function useCountUp({
  start = 0,
  end,
  duration = 1500,
  decimals = 2,
  delay = 0,
}: UseCountUpOptions) {
  const [value, setValue] = useState(start)
  const frameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (end === 0) {
      setValue(0)
      return
    }

    const timeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp

        const elapsed = timestamp - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1)

        // Ease out cubic for natural feel
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = start + (end - start) * eased

        setValue(parseFloat(current.toFixed(decimals)))

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate)
        } else {
          setValue(end)
        }
      }

      frameRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      startTimeRef.current = null
    }
  }, [end, start, duration, decimals, delay])

  return value
}