import html2pdf from 'html2pdf.js'

/**
 * Cleanly export any printable HTML element to an A4 PDF document.
 * @param {HTMLElement|string} elementOrId - DOM element or ID of the element to convert
 * @param {string} filename - Desired filename for the PDF download
 */
export async function downloadReportAsPdf(elementOrId, filename = 'Silver-Catering-Day-1-Report.pdf') {
  let element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId

  // Fallback selector if specific element wasn't passed
  if (!element) {
    element = document.querySelector('.a4-print-sheet')
  }

  if (!element) {
    // Ultimate fallback to browser print if DOM element cannot be located
    window.print()
    return false
  }

  const opt = {
    margin: [8, 8, 8, 8],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
      scrollY: 0,
      backgroundColor: '#ffffff',
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
      avoid: ['.avoid-page-break', 'tr', 'thead', 'tfoot', '.report-header', '.report-footer'],
    },
  }

  try {
    await html2pdf().set(opt).from(element).save()
    return true
  } catch (error) {
    console.error('Direct PDF export error, falling back to browser print:', error)
    window.print()
    return false
  }
}

