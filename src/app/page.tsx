'use client'

import { useState } from 'react'
import SpendForm from '@/components/SpendForm'

export default function Home() {
  const [auditData, setAuditData] = useState(null)

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data)
    setAuditData(data)
    // We'll add the audit logic next
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      {!auditData ? (
        <SpendForm onSubmit={handleFormSubmit} />
      ) : (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-4">Your Audit Results</h1>
          <pre>{JSON.stringify(auditData, null, 2)}</pre>
        </div>
      )}
    </main>
  )
}