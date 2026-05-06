'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [status, setStatus] = useState('Connecting to database...')

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('audits')
          .select('id')
          .limit(1)

        if (error) {
          console.error('Supabase error:', error)
          setStatus(`Error: ${error.message}`)
        } else {
          setStatus('✓ DB Connected Successfully')
        }
      } catch (err) {
        console.error('Exception:', err)
        setStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    testConnection()
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">AI Spend Audit</h1>
      <p className="mt-4 text-lg">{status}</p>
    </main>
  )
}