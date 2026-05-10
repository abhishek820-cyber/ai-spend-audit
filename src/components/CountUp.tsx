'use client'

import { useCountUp } from '@/hooks/useCountUp'

interface CountUpProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  delay?: number
  className?: string
}

export default function CountUp({
  value,
  prefix = '',
  suffix = '',
  decimals = 2,
  duration = 1500,
  delay = 0,
  className = '',
}: CountUpProps) {
  const count = useCountUp({ end: value, decimals, duration, delay })

  return (
    <span className={className}>
      {prefix}{count.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}{suffix}
    </span>
  )
}