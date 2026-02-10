import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generatePDF(invoiceData, isPremium = false) {
  const doc = new jsPDF();
  
  // Colors
  const primaryColor = [37, 99, 235]; // Blue
  const darkGray = [31, 41, 55];
  const lightGray = [107, 114, 128];
  
  // Title
  doc.setFontSize(24);
  doc.setTextColor(...darkGray);
  doc.text('INVOICE', 20, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(...lightGray);
  doc.text(`#${invoiceData.invoiceNumber || '001'}`, 20, 32);
  
  // From section
  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.text('From', 20, 45);
  
  doc.setFontSize(11);
  doc.setTextColor(...darkGray);
  doc.text(invoiceData.fromName || 'Your Business', 20, 52);
  
  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  if (invoiceData.fromEmail) doc.text(invoiceData.fromEmail, 20, 58);
  if (invoiceData.fromAddress) {
    const addressLines = invoiceData.fromAddress.split('\n');
    addressLines.forEach((line, i) => {
      doc.text(line, 20, 64 + (i * 5));
    });
  }
  
  // To section
  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.text('To', 120, 45);
  
  doc.setFontSize(11);
  doc.setTextColor(...darkGray);
  doc.text(invoiceData.toName || 'Client Name', 120, 52);
  
  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  if (invoiceData.toEmail) doc.text(invoiceData.toEmail, 120, 58);
  if (invoiceData.toAddress) {
    const addressLines = invoiceData.toAddress.split('\n');
    addressLines.forEach((line, i) => {
      doc.text(line, 120, 64 + (i * 5));
    });
  }
  
  // Dates
  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.text('Invoice Date', 20, 90);
  doc.text('Due Date', 80, 90);
  
  doc.setFontSize(10);
  doc.setTextColor(...darkGray);
  doc.text(invoiceData.invoiceDate, 20, 96);
  doc.text(invoiceData.dueDate || 'N/A', 80, 96);
  
  // Items table
  const tableData = invoiceData.items.map(item => [
    item.description || 'Service',
    item.quantity.toString(),
    `$${item.rate.toFixed(2)}`,
    `$${(item.quantity * item.rate).toFixed(2)}`
  ]);
  
  autoTable(doc, {
    startY: 110,
    head: [['Description', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: [249, 250, 251],
      textColor: darkGray,
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      textColor: darkGray,
      fontSize: 9
    },
    columnStyles: {
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right', fontStyle: 'bold' }
    }
  });
  
  // Calculate totals
  const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const taxAmount = subtotal * (invoiceData.tax / 100);
  const total = subtotal + taxAmount;
  
  // Totals section
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 140;
  
  doc.setFontSize(9);
  doc.setTextColor(...lightGray);
  doc.text('Subtotal', 140, finalY);
  doc.text(`Tax (${invoiceData.tax}%)`, 140, finalY + 6);
  
  doc.setTextColor(...darkGray);
  doc.text(`$${subtotal.toFixed(2)}`, 190, finalY, { align: 'right' });
  doc.text(`$${taxAmount.toFixed(2)}`, 190, finalY + 6, { align: 'right' });
  
  // Total
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Total', 140, finalY + 15);
  doc.text(`$${total.toFixed(2)}`, 190, finalY + 15, { align: 'right' });
  
  // Notes
  if (invoiceData.notes) {
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...lightGray);
    doc.text('Notes', 20, finalY + 25);
    
    doc.setTextColor(...darkGray);
    const notesLines = doc.splitTextToSize(invoiceData.notes, 170);
    doc.text(notesLines, 20, finalY + 31);
  }
  
    // Watermark (only if not premium)
      if (!isPremium) {
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        
        // Large diagonal watermark across the page
        doc.setFontSize(50);
        doc.setTextColor(220, 220, 220); // Very light gray
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.3 }));
        
        // Rotate and place diagonal watermark
        const centerX = pageWidth / 2;
        const centerY = pageHeight / 2;
        doc.text('PREMIUM INVOICE', centerX, centerY, {
          align: 'center',
          angle: 45
        });
        
        doc.restoreGraphicsState();
        
        // Small footer text
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Remove watermark at https://invoice-generator-blond-iota.vercel.app for $5', 105, pageHeight - 10, { align: 'center' });
      }
  
  // Download
  const fileName = `Invoice_${invoiceData.invoiceNumber || '001'}_${invoiceData.toName?.replace(/\s+/g, '_') || 'Client'}.pdf`;
  doc.save(fileName);
}
