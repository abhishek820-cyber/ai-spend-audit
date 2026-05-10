import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportAuditPDF(elementId: string, filename: string = 'audit-report.pdf') {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error('Element not found:', elementId)
    return
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 0

    const totalPages = Math.ceil((imgHeight * ratio) / pdfHeight)

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage()
      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        -(page * pdfHeight) + imgY,
        imgWidth * ratio,
        imgHeight * ratio
      )
    }

    pdf.save(filename)
    return true
  } catch (error) {
    console.error('PDF export error:', error)
    return false
  }
}