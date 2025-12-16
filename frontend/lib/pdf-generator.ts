/**
 * Generador de PDFs para facturas
 * Este módulo maneja la creación de PDFs profesionales para las facturas
 *
 * INTEGRACIÓN CON BACKEND (Persona A):
 * - Los datos de la factura vendrán del backend
 * - Se puede guardar el PDF generado en el servidor si es necesario
 */

interface InvoiceData {
  id: string
  clientName: string
  date: string
  total: number
  items: Array<{
    description: string
    quantity: number
    price: number
  }>
}

export async function generateInvoicePDF(invoice: InvoiceData) {
  // Importar jsPDF dinámicamente para evitar errores de SSR
  const { default: jsPDF } = await import("jspdf")
  await import("jspdf-autotable")

  const doc = new jsPDF()

  // Configuración de colores
  const primaryColor = [66, 82, 189] as [number, number, number] // Color primario del tema
  const textColor = [26, 26, 26] as [number, number, number]

  // Encabezado
  doc.setFontSize(24)
  doc.setTextColor(...primaryColor)
  doc.text("FACTURA", 20, 25)

  // Información de la empresa
  doc.setFontSize(10)
  doc.setTextColor(...textColor)
  doc.text("Tu Empresa S.A.", 20, 35)
  doc.text("Calle Principal 123", 20, 40)
  doc.text("Ciudad, CP 12345", 20, 45)
  doc.text("Tel: +34 123 456 789", 20, 50)

  // Información de la factura
  doc.setFontSize(10)
  doc.text(`Factura: ${invoice.id}`, 150, 35)
  doc.text(`Fecha: ${new Date(invoice.date).toLocaleDateString("es-ES")}`, 150, 40)

  // Línea separadora
  doc.setDrawColor(...primaryColor)
  doc.setLineWidth(0.5)
  doc.line(20, 55, 190, 55)

  // Información del cliente
  doc.setFontSize(12)
  doc.setTextColor(...primaryColor)
  doc.text("Cliente:", 20, 65)
  doc.setFontSize(10)
  doc.setTextColor(...textColor)
  doc.text(invoice.clientName, 20, 70)

  // Tabla de items
  const tableData = invoice.items.map((item) => [
    item.description,
    item.quantity.toString(),
    `$${item.price.toFixed(2)}`,
    `$${(item.quantity * item.price).toFixed(2)}`,
  ])

  // @ts-ignore - jspdf-autotable añade el método autoTable
  doc.autoTable({
    startY: 80,
    head: [["Descripción", "Cantidad", "Precio Unitario", "Subtotal"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: "center" },
      2: { cellWidth: 40, halign: "right" },
      3: { cellWidth: 40, halign: "right" },
    },
  })

  // Calcular totales
  // @ts-ignore
  const finalY = doc.lastAutoTable.finalY || 80
  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const tax = subtotal * 0.16 // 16% IVA
  const total = subtotal + tax

  // Totales
  const totalsStartY = finalY + 10
  doc.setFontSize(10)

  doc.text("Subtotal:", 140, totalsStartY)
  doc.text(`$${subtotal.toFixed(2)}`, 190, totalsStartY, { align: "right" })

  doc.text("IVA (16%):", 140, totalsStartY + 7)
  doc.text(`$${tax.toFixed(2)}`, 190, totalsStartY + 7, { align: "right" })

  // Total en negrita
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(...primaryColor)
  doc.text("TOTAL:", 140, totalsStartY + 17)
  doc.text(`$${total.toFixed(2)}`, 190, totalsStartY + 17, { align: "right" })

  // Pie de página
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(128, 128, 128)
  doc.text("Gracias por su confianza. Para cualquier consulta, contáctenos.", 105, 280, { align: "center" })

  // Descargar el PDF
  doc.save(`Factura_${invoice.id}.pdf`)
}

/**
 * NOTAS DE INTEGRACIÓN PARA PERSONA A:
 *
 * 1. Esta función se puede llamar desde el frontend cuando el usuario hace clic en "Descargar PDF"
 * 2. También se puede implementar una versión en el backend para generar PDFs en el servidor
 * 3. Los PDFs generados se pueden:
 *    - Descargar directamente en el navegador (actual)
 *    - Guardar en el servidor y devolver una URL
 *    - Enviar por email automáticamente
 *
 * Ejemplo de uso desde el backend:
 *
 * // Route Handler (app/api/invoices/[id]/pdf/route.ts)
 * export async function GET(request: Request, { params }: { params: { id: string } }) {
 *   const invoice = await getInvoiceFromDatabase(params.id)
 *   const pdfBuffer = await generateInvoicePDFBuffer(invoice)
 *
 *   return new Response(pdfBuffer, {
 *     headers: {
 *       'Content-Type': 'application/pdf',
 *       'Content-Disposition': `attachment; filename="Factura_${invoice.id}.pdf"`
 *     }
 *   })
 * }
 */
