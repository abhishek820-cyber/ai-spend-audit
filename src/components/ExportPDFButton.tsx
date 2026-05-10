'use client'

import { useState } from 'react'
import { exportAuditPDF } from '@/lib/exportPDF'
import { useToast } from '@/components/Toast'

interface ExportPDFButtonProps {
  targetId: string
  filename?: string
  className?: string
}

export default function ExportPDFButton({
  targetId,
  filename = 'ai-spend-audit.pdf',
  className = '',
}: ExportPDFButtonProps) {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleExport = async () => {
    setLoading(true)
    showToast('Preparing your PDF...', 'info')

    try {
      const success = await exportAuditPDF(targetId, filename)
      if (success) {
        showToast('PDF downloaded successfully!', 'success')
      } else {
        showToast('Failed to export PDF. Please try again.', 'error')
      }
    } catch (err) {
      showToast('Failed to export PDF. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2.5 border border-outline-variant text-on-surface-variant rounded-lg text-body-sm hover:bg-surface-container transition-all disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-on-surface-variant border-t-transparent rounded-full animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export PDF
        </>
      )}
    </button>
  )
}