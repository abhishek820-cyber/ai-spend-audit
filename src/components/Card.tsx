import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  shadow?: 'sm' | 'md' | 'lg'
}

export default function Card({ children, className = '', shadow = 'md' }: CardProps) {
  const shadowMap = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  }

  return (
    <div className={`bg-white rounded-xl border border-neutral-200 ${shadowMap[shadow]} p-6 ${className}`}>
      {children}
    </div>
  )
}