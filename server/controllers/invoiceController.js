import PDFDocument from 'pdfkit'
import Booking from '../models/Booking.js'

export const generateInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('packageId', 'title destination duration price image')
      .populate('userId', 'name email phone')

    if (!booking) return res.status(404).json({ message: 'Booking not found' })

    // Auth: own booking or admin
    if (booking.userId._id.toString() !== req.userId && !req.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const doc = new PDFDocument({ margin: 50, size: 'A4' })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=momentry-invoice-${booking._id}.pdf`)
    doc.pipe(res)

    const formatINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

    // Header band
    doc.rect(0, 0, doc.page.width, 100).fill('#C9A535')
    doc.fillColor('white').fontSize(32).font('Helvetica-Bold').text('MOMENTRY', 50, 28)
    doc.fontSize(11).font('Helvetica').text('Boutique Travel Experiences', 50, 66)
    doc.fillColor('#C9A535').fontSize(14).font('Helvetica-Bold').text('INVOICE', doc.page.width - 150, 38)

    doc.fillColor('#2C1810')
    doc.moveDown(3)

    // Invoice meta
    const invoiceNum = String(booking._id).slice(-8).toUpperCase()
    doc.fontSize(10).font('Helvetica')
    doc.text(`Invoice #: MOM-${invoiceNum}`, { continued: true })
       .text(`Date: ${formatDate(booking.createdAt)}`, { align: 'right' })
    doc.text(`Status: ${booking.status.toUpperCase()}`, { continued: true })
       .text('momentry.in', { align: 'right', link: 'https://momentry.in' })

    doc.moveDown().moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#e5e7eb').moveDown()

    // Bill To
    doc.fontSize(9).fillColor('#6B7280').text('BILLED TO')
    doc.fontSize(12).fillColor('#2C1810').font('Helvetica-Bold').text(booking.userId.name || 'Customer')
    doc.fontSize(10).font('Helvetica').fillColor('#374151').text(booking.userId.email || '')
    if (booking.userId.phone) doc.text(booking.userId.phone)

    doc.moveDown().moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#e5e7eb').moveDown()

    // Package details table header
    doc.fillColor('#F9FAFB').rect(50, doc.y, doc.page.width - 100, 24).fill()
    doc.fillColor('#374151').fontSize(9).font('Helvetica-Bold')
    const tableTop = doc.y - 18
    doc.text('PACKAGE', 60, tableTop + 7)
    doc.text('DURATION', 280, tableTop + 7)
    doc.text('TRAVELERS', 360, tableTop + 7)
    doc.text('AMOUNT', doc.page.width - 120, tableTop + 7)

    doc.moveDown(0.3)
    doc.fillColor('#2C1810').fontSize(10).font('Helvetica')
    const rowTop = doc.y
    doc.text(booking.packageId.title || 'Travel Package', 60, rowTop, { width: 210 })
    doc.text(`${booking.packageId.duration || 'N/A'} days`, 280, rowTop)
    doc.text(`x${booking.quantity}`, 375, rowTop)
    doc.font('Helvetica-Bold').text(formatINR(booking.totalPrice), doc.page.width - 120, rowTop)

    doc.moveDown(2)
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#e5e7eb').moveDown()

    // Total
    doc.font('Helvetica-Bold').fontSize(14)
    doc.text('Total Amount:', { continued: true })
    doc.fillColor('#C9A535').text(formatINR(booking.totalPrice), { align: 'right' })

    if (booking.paymentId) {
      doc.moveDown(0.5).fillColor('#6B7280').fontSize(9).font('Helvetica')
      doc.text(`Payment ID: ${booking.paymentId}`)
    }
    if (booking.orderId) {
      doc.fillColor('#6B7280').fontSize(9).text(`Order ID: ${booking.orderId}`)
    }

    // Destination
    if (booking.packageId.destination) {
      doc.moveDown().fillColor('#374151').fontSize(10)
      doc.text(`Destination: ${booking.packageId.destination}`)
    }

    // Footer
    doc.moveDown(3)
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke('#e5e7eb')
    doc.moveDown(0.5).fillColor('#9CA3AF').fontSize(8).font('Helvetica')
    doc.text('Thank you for travelling with Momentry. For support: support@momentry.in | momentry.in', { align: 'center' })
    doc.text('This is a computer-generated invoice and does not require a signature.', { align: 'center' })

    doc.end()
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: error.message })
    }
  }
}
