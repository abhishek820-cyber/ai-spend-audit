import React from 'react'

interface SkeletonBlockProps {
  className?: string
  style?: React.CSSProperties
}

export function SkeletonBlock({ className = '', style }: SkeletonBlockProps) {
  return (
    <div 
      className={`bg-surface-container-high rounded-lg animate-pulse ${className}`} 
      style={style} 
    />
  )
}

export function AuditResultsSkeleton() {
  return (
    <div className="space-y-gutter">
      {/* Hero card skeleton */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm">
        <div className="flex justify-between items-start mb-stack-md">
          <div className="space-y-2">
            <SkeletonBlock className="h-8 w-48" />
            <SkeletonBlock className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <SkeletonBlock className="h-10 w-28" />
            <SkeletonBlock className="h-10 w-28" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-stack-md">
          {/* Green savings card */}
          <div className="bg-primary/20 rounded-xl p-stack-md">
            <SkeletonBlock className="h-4 w-32 mb-4 bg-primary/30" />
            <SkeletonBlock className="h-10 w-40 mb-2 bg-primary/30" />
            <SkeletonBlock className="h-3 w-24 bg-primary/30" />
          </div>
          {/* Other metric cards */}
          {[1, 2].map((i) => (
            <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md">
              <div className="flex justify-between mb-4">
                <SkeletonBlock className="h-4 w-28" />
                <SkeletonBlock className="h-8 w-8 rounded-md" />
              </div>
              <SkeletonBlock className="h-10 w-32 mb-2" />
              <SkeletonBlock className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="p-stack-md border-b border-outline-variant flex justify-between items-center">
          <div className="space-y-2">
            <SkeletonBlock className="h-6 w-40" />
            <SkeletonBlock className="h-4 w-56" />
          </div>
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <SkeletonBlock key={i} className="h-4 w-16" />
            ))}
          </div>
        </div>
        <div className="p-stack-md">
          {/* Chart bars */}
          <div className="flex items-end gap-4 h-64 px-8">
            {[60, 85, 45, 70, 55, 90, 40].map((height, i) => (
              <div key={i} className="flex-1 flex items-end gap-1">
                <SkeletonBlock className="flex-1 rounded-t-sm" style={{ height: `${height}%` }} />
                <SkeletonBlock className="flex-1 rounded-t-sm bg-primary/20" style={{ height: `${height * 0.3}%` }} />
                <SkeletonBlock className="flex-1 rounded-t-sm bg-primary/40" style={{ height: `${height * 0.7}%` }} />
              </div>
            ))}
          </div>
          {/* X axis labels */}
          <div className="flex gap-4 px-8 mt-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <SkeletonBlock key={i} className="flex-1 h-3" />
            ))}
          </div>
        </div>
      </div>

      {/* Tools breakdown skeleton */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="p-stack-md border-b border-outline-variant flex justify-between items-center">
          <SkeletonBlock className="h-6 w-40" />
          <SkeletonBlock className="h-4 w-16" />
        </div>
        <div className="divide-y divide-outline-variant">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-stack-md">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <SkeletonBlock className="w-10 h-10 rounded-lg" />
                  <div className="space-y-2">
                    <SkeletonBlock className="h-4 w-32" />
                    <SkeletonBlock className="h-3 w-24" />
                  </div>
                </div>
                <SkeletonBlock className="h-7 w-28 rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="space-y-1">
                    <SkeletonBlock className="h-3 w-24" />
                    <SkeletonBlock className="h-5 w-20" />
                  </div>
                ))}
              </div>
              <SkeletonBlock className="h-1.5 w-full rounded-full mb-3" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-3/4 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="space-y-stack-md animate-pulse">
      {/* Tool card skeleton */}
      <div className="p-stack-md border border-outline-variant rounded-xl bg-surface-container-low">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <SkeletonBlock className="h-3 w-20" />
              <SkeletonBlock className="h-11 w-full" />
            </div>
          ))}
        </div>
        <SkeletonBlock className="h-4 w-24" />
      </div>

      {/* Add tool button skeleton */}
      <SkeletonBlock className="h-10 w-28" />

      {/* Team size and use case */}
      <div className="grid grid-cols-2 gap-4 pt-stack-sm border-t border-outline-variant">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-11 w-full" />
          </div>
        ))}
      </div>

      {/* Submit button skeleton */}
      <SkeletonBlock className="h-12 w-full rounded-lg" />
    </div>
  )
}