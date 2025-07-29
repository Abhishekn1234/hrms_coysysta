// // import jsPDF from 'jspdf';
// // import autoTable from 'jspdf-autotable';  // Named import

// // export const generateQuotationPdf = (quotationData, frontPageContent, backPageContent) => {
// //   const doc = new jsPDF();
  
// //   // Front Page
// //   if (frontPageContent) {
// //     doc.setFontSize(22);
// //     doc.text(frontPageContent.title || 'QUOTATION', 105, 40, { align: 'center' });
// //     doc.setFontSize(12);
    
// //     const frontContentLines = doc.splitTextToSize(
// //       frontPageContent.content || `Prepared for: ${quotationData.customerName}`,
// //       180
// //     );
    
// //     let yPosition = 60;
// //     frontContentLines.forEach(line => {
// //       doc.text(line, 105, yPosition, { align: 'center' });
// //       yPosition += 7;
// //     });
// //     doc.addPage();
// //   }

// //   // Main Content
// //   doc.setFontSize(18);
// //   doc.text('QUOTATION DETAILS', 105, 20, { align: 'center' });
  
// //   doc.setFontSize(12);
// //   doc.text(`Customer: ${quotationData.customerName}`, 15, 30);
// //   doc.text(`Project: ${quotationData.projectName}`, 15, 40);
// //   doc.text(`Date: ${quotationData.date}`, 15, 50);
  
// //   // Use autoTable explicitly
// //   autoTable(doc, {
// //     startY: 60,
// //     head: [['Item', 'Qty', 'Unit Price', 'Total']],
// //     body: quotationData.items.map(item => [
// //       item.name,
// //       item.qty,
// //       `$${item.price.toFixed(2)}`,
// //       `$${(item.qty * item.price).toFixed(2)}`
// //     ]),
// //     styles: { fontSize: 10 },
// //     headStyles: { fillColor: [41, 128, 185] }
// //   });
  
// //   // Summary
// //   const finalY = doc.lastAutoTable.finalY + 10;
// //   doc.text(`Subtotal: $${quotationData.subtotal.toFixed(2)}`, 150, finalY);
// //   doc.text(`Discount: $${quotationData.discount.toFixed(2)}`, 150, finalY + 10);
// //   doc.text(`Tax: $${quotationData.tax.toFixed(2)}`, 150, finalY + 20);
// //   doc.text(`Total: $${quotationData.totalAmount.toFixed(2)}`, 150, finalY + 30);
  
// //   // Back Page
// //   if (backPageContent) {
// //     doc.addPage();
// //     doc.setFontSize(16);
// //     doc.text(backPageContent.title || 'TERMS & CONDITIONS', 105, 30, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     const backContentLines = doc.splitTextToSize(
// //       backPageContent.content || 'Standard terms and conditions apply.',
// //       180
// //     );
    
// //     let yPosition = 50;
// //     backContentLines.forEach(line => {
// //       doc.text(line, 15, yPosition);
// //       yPosition += 7;
// //     });
// //   }
  
// //   return doc;
// // };


// // import jsPDF from 'jspdf';
// // import autoTable from 'jspdf-autotable';

// // export const generateQuotationPdf = (quotationData) => {
// //   const doc = new jsPDF();
// //   const { 
// //     frontPage, 
// //     backPage, 
// //     attachments,
// //     customerName,
// //     projectName,
// //     date,
// //     items,
// //     subtotal,
// //     discount,
// //     tax,
// //     totalAmount
// //   } = quotationData;

// //   // Front Page
// //   if (frontPage) {
// //     doc.setFontSize(22);
// //     doc.text(frontPage.title || 'QUOTATION', 105, 40, { align: 'center' });
// //     doc.setFontSize(12);
    
// //     const frontContentLines = doc.splitTextToSize(
// //       frontPage.content || `Prepared for: ${customerName}`,
// //       180
// //     );
    
// //     let yPosition = 60;
// //     frontContentLines.forEach(line => {
// //       doc.text(line, 105, yPosition, { align: 'center' });
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are more sections
// //     if (items.length > 0 || backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Main Content
// //   if (items.length > 0) {
// //     doc.setFontSize(18);
// //     doc.text('QUOTATION DETAILS', 105, 20, { align: 'center' });
    
// //     doc.setFontSize(12);
// //     doc.text(`Customer: ${customerName}`, 15, 30);
// //     doc.text(`Project: ${projectName}`, 15, 40);
// //     doc.text(`Date: ${date}`, 15, 50);
    
// //     autoTable(doc, {
// //       startY: 60,
// //       head: [['Item', 'Qty', 'Unit Price', 'Total']],
// //       body: items.map(item => [
// //         item.name,
// //         item.qty,
// //         `$${item.price.toFixed(2)}`,
// //         `$${(item.qty * item.price).toFixed(2)}`
// //       ]),
// //       styles: { fontSize: 10 },
// //       headStyles: { fillColor: [41, 128, 185] }
// //     });
    
// //     // Summary
// //     const finalY = doc.lastAutoTable.finalY + 10;
// //     doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, finalY);
// //     doc.text(`Discount: $${discount.toFixed(2)}`, 150, finalY + 10);
// //     doc.text(`Tax: $${tax.toFixed(2)}`, 150, finalY + 20);
// //     doc.text(`Total: $${totalAmount.toFixed(2)}`, 150, finalY + 30);
    
// //     // Add page if there are more sections
// //     if (backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Back Page
// //   if (backPage) {
// //     doc.setFontSize(16);
// //     doc.text(backPage.title || 'TERMS & CONDITIONS', 105, 30, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     const backContentLines = doc.splitTextToSize(
// //       backPage.content || 'Standard terms and conditions apply.',
// //       180
// //     );
    
// //     let yPosition = 50;
// //     backContentLines.forEach(line => {
// //       doc.text(line, 15, yPosition);
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are attachments
// //     if (attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Attachments
// //   if (attachments.length > 0) {
// //     doc.setFontSize(16);
// //     doc.text('ATTACHMENTS', 105, 20, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     let yPosition = 40;
// //     doc.text('The following documents are included with this quotation:', 15, 30);
    
// //     attachments.forEach((file, index) => {
// //       doc.text(`${index + 1}. ${file.name}`, 20, yPosition);
// //       yPosition += 10;
// //     });
// //   }

// //   return doc;
// // };
// // import jsPDF from 'jspdf';
// // import autoTable from 'jspdf-autotable';

// // export const generateQuotationPdf = (quotationData) => {
// //   const doc = new jsPDF();
// //   const { 
// //     frontPage, 
// //     backPage, 
// //     attachments,
// //     customerName,
// //     projectName,
// //     date,
// //     items,
// //     subtotal,
// //     discount,
// //     tax,
// //     totalAmount
// //   } = quotationData;

// //   // Front Page
// //   if (frontPage) {
// //     doc.setFontSize(22);
// //     doc.text(frontPage.title || 'QUOTATION', 105, 40, { align: 'center' });
// //     doc.setFontSize(12);
    
// //     const frontContentLines = doc.splitTextToSize(
// //       frontPage.content || `Prepared for: ${customerName}`,
// //       180
// //     );
    
// //     let yPosition = 60;
// //     frontContentLines.forEach(line => {
// //       doc.text(line, 105, yPosition, { align: 'center' });
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are more sections
// //     if (items.length > 0 || backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Main Content
// //   if (items.length > 0) {
// //     doc.setFontSize(18);
// //     doc.text('QUOTATION DETAILS', 105, 20, { align: 'center' });
    
// //     doc.setFontSize(12);
// //     doc.text(`Customer: ${customerName}`, 15, 30);
// //     doc.text(`Project: ${projectName}`, 15, 40);
// //     doc.text(`Date: ${date}`, 15, 50);
    
// //     autoTable(doc, {
// //       startY: 60,
// //       head: [['Item', 'Qty', 'Unit Price', 'Total']],
// //       body: items.map(item => [
// //         item.name,
// //         item.qty,
// //         `$${item.price.toFixed(2)}`,
// //         `$${(item.qty * item.price).toFixed(2)}`
// //       ]),
// //       styles: { fontSize: 10 },
// //       headStyles: { fillColor: [41, 128, 185] }
// //     });
    
// //     // Summary
// //     const finalY = doc.lastAutoTable.finalY + 10;
// //     doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, finalY);
// //     doc.text(`Discount: $${discount.toFixed(2)}`, 150, finalY + 10);
// //     doc.text(`Tax: $${tax.toFixed(2)}`, 150, finalY + 20);
// //     doc.text(`Total: $${totalAmount.toFixed(2)}`, 150, finalY + 30);
    
// //     // Add page if there are more sections
// //     if (backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Back Page
// //   if (backPage) {
// //     doc.setFontSize(16);
// //     doc.text(backPage.title || 'TERMS & CONDITIONS', 105, 30, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     const backContentLines = doc.splitTextToSize(
// //       backPage.content || 'Standard terms and conditions apply.',
// //       180
// //     );
    
// //     let yPosition = 50;
// //     backContentLines.forEach(line => {
// //       doc.text(line, 15, yPosition);
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are attachments
// //     if (attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Attachments with Preview
// //   if (attachments.length > 0) {
// //     doc.setFontSize(16);
// //     doc.text('ATTACHMENTS', 105, 20, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     let yPosition = 40;
// //     const pageHeight = 297; // A4 height in mm
// //     const margin = 15; // Page margins
    
// //     // Introduction text
// //     doc.text('The following documents are included with this quotation:', 15, 30);
    
// //     attachments.forEach((file, index) => {
// //       // Page break check
// //       if (yPosition > pageHeight - 30) {
// //         doc.addPage();
// //         yPosition = 20;
// //         doc.setFontSize(10);
// //       }
      
// //       // File name
// //       doc.text(`${index + 1}. ${file.name}`, margin, yPosition);
// //       yPosition += 8;
      
// //       // Image preview (for supported types)
// //       if (file.type?.startsWith('image/') && file.data) {
// //         const aspectRatio = file.width / file.height;
// //         const maxWidth = 180; // Max width in mm
// //         const maxHeight = 150; // Max height in mm
        
// //         // Calculate display dimensions
// //         let imgWidth = maxWidth;
// //         let imgHeight = maxWidth / aspectRatio;
        
// //         // Adjust if height exceeds limit
// //         if (imgHeight > maxHeight) {
// //           imgHeight = maxHeight;
// //           imgWidth = maxHeight * aspectRatio;
// //         }
        
// //         // Check if image fits on page
// //         if (yPosition + imgHeight > pageHeight - margin) {
// //           doc.addPage();
// //           yPosition = 20;
// //           doc.setFontSize(10);
// //         }
        
// //         try {
// //           // Extract format from MIME type
// //           const format = file.type.split('/')[1];
          
// //           // Add image to PDF
// //           doc.addImage(
// //             file.data,
// //             format,
// //             margin,
// //             yPosition,
// //             imgWidth,
// //             imgHeight
// //           );
          
// //           // Add caption
// //           doc.setFontSize(8);
// //           doc.text(`Preview of: ${file.name}`, margin, yPosition + imgHeight + 5);
// //           doc.setFontSize(10);
          
// //           // Update position
// //           yPosition += imgHeight + 15;
// //         } catch (error) {
// //           console.error('Error embedding image:', error);
// //           doc.text('(Preview unavailable)', margin, yPosition);
// //           yPosition += 10;
// //         }
// //       } else {
// //         // Non-image file handling
// //         doc.text('(Preview not supported for this file type)', margin, yPosition);
// //         yPosition += 10;
// //       }
// //     });
// //   }

// //   return doc;
// // };

// // // Helper function to process images before generating PDF
// // export const processImageAttachments = async (files) => {
// //   const processedAttachments = [];
  
// //   for (const file of files) {
// //     if (file.type.startsWith('image/')) {
// //       try {
// //         const processed = await getImageData(file);
// //         processedAttachments.push(processed);
// //       } catch (error) {
// //         console.error('Error processing image:', error);
// //         // Fallback to basic file info
// //         processedAttachments.push({
// //           name: file.name,
// //           type: file.type,
// //           data: null,
// //           width: 0,
// //           height: 0
// //         });
// //       }
// //     } else {
// //       // Non-image files
// //       processedAttachments.push({
// //         name: file.name,
// //         type: file.type,
// //         data: null,
// //         width: 0,
// //         height: 0
// //       });
// //     }
// //   }
  
// //   return processedAttachments;
// // };

// // // Helper to get image dimensions and base64 data
// // const getImageData = (file) => {
// //   return new Promise((resolve, reject) => {
// //     const reader = new FileReader();
    
// //     reader.onload = (e) => {
// //       const img = new Image();
// //       img.src = e.target.result;
      
// //       img.onload = () => {
// //         resolve({
// //           name: file.name,
// //           type: file.type,
// //           data: e.target.result,
// //           width: img.width,
// //           height: img.height
// //         });
// //       };
      
// //       img.onerror = () => {
// //         reject(new Error('Failed to load image'));
// //       };
// //     };
    
// //     reader.onerror = () => {
// //       reject(new Error('Failed to read file'));
// //     };
    
// //     reader.readAsDataURL(file);
// //   });
// // };

// // import jsPDF from 'jspdf';
// // import autoTable from 'jspdf-autotable';

// // export const generateQuotationPdf = (quotationData) => {
// //   const doc = new jsPDF();
// //   const { 
// //     frontPage, 
// //     backPage, 
// //     attachments,
// //     customerName,
// //     projectName,
// //     date,
// //     items,
// //     subtotal,
// //     discount,
// //     tax,
// //     totalAmount
// //   } = quotationData;

// //   // Front Page
// //   if (frontPage) {
// //     doc.setFontSize(22);
// //     doc.text(frontPage.title || 'QUOTATION', 105, 40, { align: 'center' });
// //     doc.setFontSize(12);
    
// //     const frontContentLines = doc.splitTextToSize(
// //       frontPage.content || `Prepared for: ${customerName}`,
// //       180
// //     );
    
// //     let yPosition = 60;
// //     frontContentLines.forEach(line => {
// //       doc.text(line, 105, yPosition, { align: 'center' });
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are more sections
// //     if (items.length > 0 || backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Main Content
// //   if (items.length > 0) {
// //     doc.setFontSize(18);
// //     doc.text('QUOTATION DETAILS', 105, 20, { align: 'center' });
    
// //     doc.setFontSize(12);
// //     doc.text(`Customer: ${customerName}`, 15, 30);
// //     doc.text(`Project: ${projectName}`, 15, 40);
// //     doc.text(`Date: ${date}`, 15, 50);
    
// //     autoTable(doc, {
// //       startY: 60,
// //       head: [['Item', 'Qty', 'Unit Price', 'Total']],
// //       body: items.map(item => [
// //         item.name,
// //         item.qty,
// //         `$${item.price.toFixed(2)}`,
// //         `$${(item.qty * item.price).toFixed(2)}`
// //       ]),
// //       styles: { fontSize: 10 },
// //       headStyles: { fillColor: [41, 128, 185] }
// //     });
    
// //     // Summary
// //     const finalY = doc.lastAutoTable.finalY + 10;
// //     doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, finalY);
// //     doc.text(`Discount: $${discount.toFixed(2)}`, 150, finalY + 10);
// //     doc.text(`Tax: $${tax.toFixed(2)}`, 150, finalY + 20);
// //     doc.text(`Total: $${totalAmount.toFixed(2)}`, 150, finalY + 30);
    
// //     // Add page if there are more sections
// //     if (backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Back Page
// //   if (backPage) {
// //     doc.setFontSize(16);
// //     doc.text(backPage.title || 'TERMS & CONDITIONS', 105, 30, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     const backContentLines = doc.splitTextToSize(
// //       backPage.content || 'Standard terms and conditions apply.',
// //       180
// //     );
    
// //     let yPosition = 50;
// //     backContentLines.forEach(line => {
// //       doc.text(line, 15, yPosition);
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are attachments
// //     if (attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // UPDATED: Attachments section with unified preview handling
// //   if (attachments.length > 0) {
// //     doc.setFontSize(16);
// //     doc.text('ATTACHMENTS', 105, 20, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     let yPosition = 40;
// //     const pageHeight = 297; // A4 height in mm
// //     const margin = 15; // Page margins
    
// //     // Introduction text
// //     doc.text('The following documents are included with this quotation:', 15, 30);
    
// //     attachments.forEach((file, index) => {
// //       // Page break check
// //       if (yPosition > pageHeight - 30) {
// //         doc.addPage();
// //         yPosition = 20;
// //         doc.setFontSize(10);
// //       }
      
// //       // File name
// //       doc.text(`${index + 1}. ${file.name}`, margin, yPosition);
// //       yPosition += 8;
      
// //       // Preview handling for any file with data
// //       if (file.data) {
// //         const aspectRatio = file.width / file.height;
// //         const maxWidth = 180; // Max width in mm
// //         const maxHeight = 150; // Max height in mm
        
// //         // Calculate display dimensions
// //         let imgWidth = maxWidth;
// //         let imgHeight = maxWidth / aspectRatio;
        
// //         // Adjust if height exceeds limit
// //         if (imgHeight > maxHeight) {
// //           imgHeight = maxHeight;
// //           imgWidth = maxHeight * aspectRatio;
// //         }
        
// //         // Check if image fits on page
// //         if (yPosition + imgHeight > pageHeight - margin) {
// //           doc.addPage();
// //           yPosition = 20;
// //           doc.setFontSize(10);
// //         }
        
// //         try {
// //           // All previews are now PNG format
// //           doc.addImage(
// //             file.data,
// //             'PNG',
// //             margin,
// //             yPosition,
// //             imgWidth,
// //             imgHeight
// //           );
          
// //           // Add caption
// //           doc.setFontSize(8);
// //           doc.text(`Preview of: ${file.name}`, margin, yPosition + imgHeight + 5);
// //           doc.setFontSize(10);
          
// //           // Update position
// //           yPosition += imgHeight + 15;
// //         } catch (error) {
// //           doc.text(`(Preview failed: ${error.message})`, margin, yPosition);
// //           yPosition += 10;
// //         }
// //       } else {
// //         // No preview available
// //         let message = file.error 
// //           ? `(Error: ${file.error})` 
// //           : '(Preview not supported)';
        
// //         doc.text(message, margin, yPosition);
// //         yPosition += 10;
// //       }
// //     });
// //   }

// //   return doc;
// // };

// // // UPDATED: Unified file processor with image and PDF support
// // export const processFileAttachments = async (files) => {
// //   const processedAttachments = [];

// //   for (const file of files) {
// //     try {
// //       if (file.type.startsWith('image/')) {
// //         const processed = await getImageData(file);
// //         processedAttachments.push(processed);
// //       } 
// //       else if (file.type === 'application/pdf') {
// //         const processed = await getPdfPreview(file);
// //         processedAttachments.push(processed);
// //       }
// //       else {
// //         // Unsupported file type
// //         processedAttachments.push({
// //           name: file.name,
// //           type: file.type,
// //           data: null,
// //           width: 0,
// //           height: 0
// //         });
// //       }
// //     } catch (error) {
// //       console.error(`Error processing ${file.name}:`, error);
// //       processedAttachments.push({
// //         name: file.name,
// //         type: file.type,
// //         data: null,
// //         width: 0,
// //         height: 0,
// //         error: error.message
// //       });
// //     }
// //   }

// //   return processedAttachments;
// // };

// // // UPDATED: Image processor that always returns PNG
// // const getImageData = (file) => {
// //   return new Promise((resolve, reject) => {
// //     const reader = new FileReader();
    
// //     reader.onload = (e) => {
// //       const img = new Image();
// //       img.crossOrigin = 'Anonymous';
// //       img.src = e.target.result;
      
// //       img.onload = () => {
// //         const canvas = document.createElement('canvas');
// //         const ctx = canvas.getContext('2d');
// //         canvas.width = img.width;
// //         canvas.height = img.height;
        
// //         // Fill background for transparent images
// //         ctx.fillStyle = '#FFFFFF';
// //         ctx.fillRect(0, 0, canvas.width, canvas.height);
// //         ctx.drawImage(img, 0, 0);
        
// //         // Convert to PNG for consistent format
// //         const dataURL = canvas.toDataURL('image/png');
        
// //         resolve({
// //           name: file.name,
// //           type: file.type,
// //           data: dataURL,
// //           width: img.width,
// //           height: img.height
// //         });
// //       };
      
// //       img.onerror = (err) => {
// //         reject(new Error('Image loading failed: ' + err.message));
// //       };
// //     };
    
// //     reader.onerror = () => {
// //       reject(new Error('File reading failed'));
// //     };
    
// //     reader.readAsDataURL(file);
// //   });
// // };

// // // NEW: PDF to Image Converter
// // const getPdfPreview = (file) => {
// //   return new Promise(async (resolve, reject) => {
// //     try {
// //       // Dynamically import PDF.js to reduce bundle size
// //       const pdfjsLib = await import('pdfjs-dist/build/pdf');
// //       const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
// //       pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// //       const arrayBuffer = await file.arrayBuffer();
// //       const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
// //       const page = await pdf.getPage(1);
      
// //       // Set scale for better resolution
// //       const viewport = page.getViewport({ scale: 2.0 });
// //       const canvas = document.createElement('canvas');
// //       const ctx = canvas.getContext('2d');
// //       canvas.width = viewport.width;
// //       canvas.height = viewport.height;

// //       // Render PDF page to canvas
// //       await page.render({
// //         canvasContext: ctx,
// //         viewport: viewport
// //       }).promise;

// //       // Convert to PNG
// //       const dataURL = canvas.toDataURL('image/png');
      
// //       resolve({
// //         name: file.name,
// //         type: file.type,
// //         data: dataURL,
// //         width: viewport.width,
// //         height: viewport.height
// //       });
// //     } catch (error) {
// //       reject(new Error(`PDF processing failed: ${error.message}`));
// //     }
// //   });
// // };
// // import jsPDF from 'jspdf';
// // import autoTable from 'jspdf-autotable';

// // export const generateQuotationPdf = (quotationData) => {
// //   const doc = new jsPDF();
// //   const { 
// //     frontPage, 
// //     backPage, 
// //     attachments,
// //     customerName,
// //     projectName,
// //     date,
// //     items,
// //     subtotal,
// //     discount,
// //     tax,
// //     totalAmount
// //   } = quotationData;

// //   // Front Page
// //   if (frontPage) {
// //     doc.setFontSize(22);
// //     doc.text(frontPage.title || 'QUOTATION', 105, 40, { align: 'center' });
// //     doc.setFontSize(12);
    
// //     const frontContentLines = doc.splitTextToSize(
// //       frontPage.content || `Prepared for: ${customerName}`,
// //       180
// //     );
    
// //     let yPosition = 60;
// //     frontContentLines.forEach(line => {
// //       doc.text(line, 105, yPosition, { align: 'center' });
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are more sections
// //     if (items.length > 0 || backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Main Content
// //   if (items.length > 0) {
// //     doc.setFontSize(18);
// //     doc.text('QUOTATION DETAILS', 105, 20, { align: 'center' });
    
// //     doc.setFontSize(12);
// //     doc.text(`Customer: ${customerName}`, 15, 30);
// //     doc.text(`Project: ${projectName}`, 15, 40);
// //     doc.text(`Date: ${date}`, 15, 50);
    
// //     autoTable(doc, {
// //       startY: 60,
// //       head: [['Item', 'Qty', 'Unit Price', 'Total']],
// //       body: items.map(item => [
// //         item.name,
// //         item.qty,
// //         `$${item.price.toFixed(2)}`,
// //         `$${(item.qty * item.price).toFixed(2)}`
// //       ]),
// //       styles: { fontSize: 10 },
// //       headStyles: { fillColor: [41, 128, 185] }
// //     });
    
// //     // Summary
// //     const finalY = doc.lastAutoTable.finalY + 10;
// //     doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, finalY);
// //     doc.text(`Discount: $${discount.toFixed(2)}`, 150, finalY + 10);
// //     doc.text(`Tax: $${tax.toFixed(2)}`, 150, finalY + 20);
// //     doc.text(`Total: $${totalAmount.toFixed(2)}`, 150, finalY + 30);
    
// //     // Add page if there are more sections
// //     if (backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Back Page
// //   if (backPage) {
// //     doc.setFontSize(16);
// //     doc.text(backPage.title || 'TERMS & CONDITIONS', 105, 30, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     const backContentLines = doc.splitTextToSize(
// //       backPage.content || 'Standard terms and conditions apply.',
// //       180
// //     );
    
// //     let yPosition = 50;
// //     backContentLines.forEach(line => {
// //       doc.text(line, 15, yPosition);
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are attachments
// //     if (attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // UPDATED: Attachments section with document icon support
// //   if (attachments.length > 0) {
// //     doc.setFontSize(16);
// //     doc.text('ATTACHMENTS', 105, 20, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     let yPosition = 40;
// //     const pageHeight = 297; // A4 height in mm
// //     const margin = 15; // Page margins
    
// //     // Introduction text
// //     doc.text('The following documents are included with this quotation:', 15, 30);
    
// //     attachments.forEach((file, index) => {
// //       // Page break check
// //       if (yPosition > pageHeight - 30) {
// //         doc.addPage();
// //         yPosition = 20;
// //         doc.setFontSize(10);
// //       }
      
// //       // File name
// //       doc.text(`${index + 1}. ${file.name}`, margin, yPosition);
// //       yPosition += 8;
      
// //       // Preview handling for any file with data
// //       if (file.data) {
// //         const aspectRatio = file.width / file.height;
// //         const maxWidth = 180; // Max width in mm
// //         const maxHeight = 150; // Max height in mm
        
// //         // Calculate display dimensions
// //         let imgWidth = maxWidth;
// //         let imgHeight = maxWidth / aspectRatio;
        
// //         // Adjust if height exceeds limit
// //         if (imgHeight > maxHeight) {
// //           imgHeight = maxHeight;
// //           imgWidth = maxHeight * aspectRatio;
// //         }
        
// //         // Check if image fits on page
// //         if (yPosition + imgHeight > pageHeight - margin) {
// //           doc.addPage();
// //           yPosition = 20;
// //           doc.setFontSize(10);
// //         }
        
// //         try {
// //           // Add image to PDF
// //           doc.addImage(
// //             file.data,
// //             'PNG',
// //             margin,
// //             yPosition,
// //             imgWidth,
// //             imgHeight
// //           );
          
// //           // Add caption
// //           doc.setFontSize(8);
// //           doc.text(`Preview of: ${file.name}`, margin, yPosition + imgHeight + 5);
// //           doc.setFontSize(10);
          
// //           // Update position
// //           yPosition += imgHeight + 15;
// //         } catch (error) {
// //           doc.text(`(Preview failed: ${error.message})`, margin, yPosition);
// //           yPosition += 10;
// //         }
// //       } else if (file.icon) {
// //         // NEW: Handle document icons
// //         const iconSize = 30; // mm
        
// //         // Add document icon
// //         doc.addImage(
// //           file.icon,
// //           'PNG',
// //           margin,
// //           yPosition,
// //           iconSize,
// //           iconSize
// //         );
        
// //         // Add file info
// //         doc.setFontSize(10);
// //         doc.text(`File type: ${file.type || 'Document'}`, margin + iconSize + 5, yPosition + 10);
// //         doc.text(`Size: ${file.size || 'N/A'}`, margin + iconSize + 5, yPosition + 20);
        
// //         // Add caption
// //         doc.setFontSize(8);
// //         doc.text(`Preview not available for: ${file.name}`, margin, yPosition + iconSize + 5);
// //         doc.setFontSize(10);
        
// //         yPosition += iconSize + 15;
// //       } else {
// //         // No preview available
// //         let message = file.error 
// //           ? `(Error: ${file.error})` 
// //           : '(Preview not supported)';
        
// //         doc.text(message, margin, yPosition);
// //         yPosition += 10;
// //       }
// //     });
// //   }

// //   return doc;
// // };

// // // UPDATED: Unified file processor with document icon support
// // export const processFileAttachments = async (files) => {
// //   const processedAttachments = [];

// //   for (const file of files) {
// //     try {
// //       if (file.type.startsWith('image/')) {
// //         const processed = await getImageData(file);
// //         processedAttachments.push(processed);
// //       } 
// //       else if (file.type === 'application/pdf') {
// //         const processed = await getPdfPreview(file);
// //         processedAttachments.push(processed);
// //       }
// //       else {
// //         // NEW: Handle document files with icons
// //         const icon = await getDocumentIcon(file);
// //         processedAttachments.push({
// //           name: file.name,
// //           type: file.type,
// //           icon: icon,
// //           width: 100,
// //           height: 100,
// //           size: formatFileSize(file.size)
// //         });
// //       }
// //     } catch (error) {
// //       console.error(`Error processing ${file.name}:`, error);
// //       processedAttachments.push({
// //         name: file.name,
// //         type: file.type,
// //         data: null,
// //         icon: null,
// //         width: 0,
// //         height: 0,
// //         error: error.message
// //       });
// //     }
// //   }

// //   return processedAttachments;
// // };

// // // NEW: Format file size for display
// // const formatFileSize = (bytes) => {
// //   if (bytes === 0) return '0 Bytes';
// //   const k = 1024;
// //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
// //   const i = Math.floor(Math.log(bytes) / Math.log(k));
// //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
// // };

// // // NEW: Generate document icons
// // const getDocumentIcon = (file) => {
// //   return new Promise((resolve) => {
// //     const canvas = document.createElement('canvas');
// //     canvas.width = 200;
// //     canvas.height = 200;
// //     const ctx = canvas.getContext('2d');
    
// //     // Background
// //     ctx.fillStyle = '#e3f2fd';
// //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    
// //     // Folder shape
// //     ctx.fillStyle = '#bbdefb';
// //     ctx.beginPath();
// //     ctx.moveTo(30, 60);
// //     ctx.lineTo(80, 45);
// //     ctx.lineTo(170, 45);
// //     ctx.lineTo(170, 160);
// //     ctx.lineTo(30, 160);
// //     ctx.closePath();
// //     ctx.fill();
    
// //     // File shape
// //     ctx.fillStyle = '#ffffff';
// //     ctx.beginPath();
// //     ctx.moveTo(40, 70);
// //     ctx.lineTo(160, 70);
// //     ctx.lineTo(160, 150);
// //     ctx.lineTo(40, 150);
// //     ctx.closePath();
// //     ctx.fill();
// //     ctx.strokeStyle = '#90caf9';
// //     ctx.lineWidth = 2;
// //     ctx.stroke();
    
// //     // File corner fold
// //     ctx.fillStyle = '#e3f2fd';
// //     ctx.beginPath();
// //     ctx.moveTo(140, 70);
// //     ctx.lineTo(160, 70);
// //     ctx.lineTo(160, 90);
// //     ctx.closePath();
// //     ctx.fill();
    
// //     // File icon based on type
// //     ctx.fillStyle = '#42a5f5';
// //     ctx.font = '40px Arial';
// //     ctx.textAlign = 'center';
    
// //     if (file.type.includes('word') || file.name.match(/\.(docx?|rtf)$/i)) {
// //       ctx.fillText('W', 100, 120);
// //     } 
// //     else if (file.type.includes('excel') || file.name.match(/\.(xlsx?|csv)$/i)) {
// //       ctx.fillText('X', 100, 120);
// //     } 
// //     else if (file.type.includes('powerpoint') || file.name.match(/\.(pptx?)$/i)) {
// //       ctx.fillText('P', 100, 120);
// //     } 
// //     else {
// //       ctx.fillText('D', 100, 120);
// //     }
    
// //     resolve(canvas.toDataURL('image/png'));
// //   });
// // };

// // // Image processor
// // const getImageData = (file) => {
// //   return new Promise((resolve, reject) => {
// //     const reader = new FileReader();
    
// //     reader.onload = (e) => {
// //       const img = new Image();
// //       img.crossOrigin = 'Anonymous';
// //       img.src = e.target.result;
      
// //       img.onload = () => {
// //         const canvas = document.createElement('canvas');
// //         const ctx = canvas.getContext('2d');
// //         canvas.width = img.width;
// //         canvas.height = img.height;
        
// //         // Fill background for transparent images
// //         ctx.fillStyle = '#FFFFFF';
// //         ctx.fillRect(0, 0, canvas.width, canvas.height);
// //         ctx.drawImage(img, 0, 0);
        
// //         // Convert to PNG
// //         const dataURL = canvas.toDataURL('image/png');
        
// //         resolve({
// //           name: file.name,
// //           type: file.type,
// //           data: dataURL,
// //           width: img.width,
// //           height: img.height
// //         });
// //       };
      
// //       img.onerror = (err) => {
// //         reject(new Error('Image loading failed: ' + err.message));
// //       };
// //     };
    
// //     reader.onerror = () => {
// //       reject(new Error('File reading failed'));
// //     };
    
// //     reader.readAsDataURL(file);
// //   });
// // };

// // // PDF to Image Converter
// // const getPdfPreview = (file) => {
// //   return new Promise(async (resolve, reject) => {
// //     try {
// //       const pdfjsLib = await import('pdfjs-dist/build/pdf');
// //       const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
// //       pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// //       const arrayBuffer = await file.arrayBuffer();
// //       const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
// //       const page = await pdf.getPage(1);
      
// //       const viewport = page.getViewport({ scale: 2.0 });
// //       const canvas = document.createElement('canvas');
// //       const ctx = canvas.getContext('2d');
// //       canvas.width = viewport.width;
// //       canvas.height = viewport.height;

// //       await page.render({
// //         canvasContext: ctx,
// //         viewport: viewport
// //       }).promise;

// //       const dataURL = canvas.toDataURL('image/png');
      
// //       resolve({
// //         name: file.name,
// //         type: file.type,
// //         data: dataURL,
// //         width: viewport.width,
// //         height: viewport.height
// //       });
// //     } catch (error) {
// //       reject(new Error(`PDF processing failed: ${error.message}`));
// //     }
// //   });
// // };

// // import jsPDF from 'jspdf';
// // import autoTable from 'jspdf-autotable';

// // export const generateQuotationPdf = (quotationData) => {
// //   const doc = new jsPDF();
// //   const { 
// //     frontPage, 
// //     backPage, 
// //     attachments,
// //     customerName,
// //     projectName,
// //     date,
// //     items,
// //     subtotal,
// //     discount,
// //     tax,
// //     totalAmount
// //   } = quotationData;

// //   // Front Page
// //   if (frontPage) {
// //     doc.setFontSize(22);
// //     doc.text(frontPage.title || 'QUOTATION', 105, 40, { align: 'center' });
// //     doc.setFontSize(12);
    
// //     const frontContentLines = doc.splitTextToSize(
// //       frontPage.content || `Prepared for: ${customerName}`,
// //       180
// //     );
    
// //     let yPosition = 60;
// //     frontContentLines.forEach(line => {
// //       doc.text(line, 105, yPosition, { align: 'center' });
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are more sections
// //     if (items.length > 0 || backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Main Content
// //   if (items.length > 0) {
// //     doc.setFontSize(18);
// //     doc.text('QUOTATION DETAILS', 105, 20, { align: 'center' });
    
// //     doc.setFontSize(12);
// //     doc.text(`Customer: ${customerName}`, 15, 30);
// //     doc.text(`Project: ${projectName}`, 15, 40);
// //     doc.text(`Date: ${date}`, 15, 50);
    
// //     autoTable(doc, {
// //       startY: 60,
// //       head: [['Item', 'Qty', 'Unit Price', 'Total']],
// //       body: items.map(item => [
// //         item.name,
// //         item.qty,
// //         `$${item.price.toFixed(2)}`,
// //         `$${(item.qty * item.price).toFixed(2)}`
// //       ]),
// //       styles: { fontSize: 10 },
// //       headStyles: { fillColor: [41, 128, 185] }
// //     });
    
// //     // Summary
// //     const finalY = doc.lastAutoTable.finalY + 10;
// //     doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, finalY);
// //     doc.text(`Discount: $${discount.toFixed(2)}`, 150, finalY + 10);
// //     doc.text(`Tax: $${tax.toFixed(2)}`, 150, finalY + 20);
// //     doc.text(`Total: $${totalAmount.toFixed(2)}`, 150, finalY + 30);
    
// //     // Add page if there are more sections
// //     if (backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Back Page
// //   if (backPage) {
// //     doc.setFontSize(16);
// //     doc.text(backPage.title || 'TERMS & CONDITIONS', 105, 30, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     const backContentLines = doc.splitTextToSize(
// //       backPage.content || 'Standard terms and conditions apply.',
// //       180
// //     );
    
// //     let yPosition = 50;
// //     backContentLines.forEach(line => {
// //       doc.text(line, 15, yPosition);
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are attachments
// //     if (attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Attachments with enhanced document support
// //   if (attachments.length > 0) {
// //     doc.setFontSize(16);
// //     doc.text('ATTACHMENTS', 105, 20, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     let yPosition = 40;
// //     const pageHeight = 297; // A4 height in mm
// //     const margin = 15; // Page margins
    
// //     // Introduction text
// //     doc.text('The following documents are included with this quotation:', 15, 30);
    
// //     attachments.forEach((file, index) => {
// //       // Page break check
// //       if (yPosition > pageHeight - 30) {
// //         doc.addPage();
// //         yPosition = 20;
// //         doc.setFontSize(10);
// //       }
      
// //       // File name
// //       doc.text(`${index + 1}. ${file.name}`, margin, yPosition);
// //       yPosition += 8;
      
// //       // Preview handling for images and PDFs
// //       if (file.data) {
// //         const aspectRatio = file.width / file.height;
// //         const maxWidth = 180; // Max width in mm
// //         const maxHeight = 150; // Max height in mm
        
// //         // Calculate display dimensions
// //         let imgWidth = maxWidth;
// //         let imgHeight = maxWidth / aspectRatio;
        
// //         // Adjust if height exceeds limit
// //         if (imgHeight > maxHeight) {
// //           imgHeight = maxHeight;
// //           imgWidth = maxHeight * aspectRatio;
// //         }
        
// //         // Check if image fits on page
// //         if (yPosition + imgHeight > pageHeight - margin) {
// //           doc.addPage();
// //           yPosition = 20;
// //           doc.setFontSize(10);
// //         }
        
// //         try {
// //           // Add image to PDF
// //           doc.addImage(
// //             file.data,
// //             'PNG',
// //             margin,
// //             yPosition,
// //             imgWidth,
// //             imgHeight
// //           );
          
// //           // Add caption
// //           doc.setFontSize(8);
// //           doc.text(`Preview of: ${file.name}`, margin, yPosition + imgHeight + 5);
// //           doc.setFontSize(10);
          
// //           // Update position
// //           yPosition += imgHeight + 15;
// //         } catch (error) {
// //           doc.text(`(Preview failed: ${error.message})`, margin, yPosition);
// //           yPosition += 10;
// //         }
// //       } 
// //       // Document icon handling for office files
// //       else if (file.icon) {
// //         const iconSize = 30; // mm
        
// //         // Add document icon
// //         doc.addImage(
// //           file.icon,
// //           'PNG',
// //           margin,
// //           yPosition,
// //           iconSize,
// //           iconSize
// //         );
        
// //         // Add file info next to icon
// //         doc.setFontSize(10);
// //         doc.text(`File type: ${file.friendlyType || file.type}`, margin + iconSize + 5, yPosition + 10);
// //         doc.text(`Size: ${file.size || 'N/A'}`, margin + iconSize + 5, yPosition + 20);
        
// //         // Add caption below icon
// //         doc.setFontSize(8);
// //         doc.text(`Preview not available for: ${file.name}`, margin, yPosition + iconSize + 5);
// //         doc.setFontSize(10);
        
// //         // Update position
// //         yPosition += iconSize + 15;
// //       } 
// //       // Fallback for unsupported types
// //       else {
// //         let message = file.error 
// //           ? `(Error: ${file.error})` 
// //           : '(Preview not supported)';
        
// //         doc.text(message, margin, yPosition);
// //         yPosition += 10;
// //       }
// //     });
// //   }

// //   return doc;
// // };

// // // Unified file processor with enhanced document support
// // export const processFileAttachments = async (files) => {
// //   const processedAttachments = [];

// //   for (const file of files) {
// //     try {
// //       if (file.type.startsWith('image/')) {
// //         const processed = await getImageData(file);
// //         processedAttachments.push(processed);
// //       } 
// //       else if (file.type === 'application/pdf') {
// //         const processed = await getPdfPreview(file);
// //         processedAttachments.push(processed);
// //       }
// //       else {
// //         // Handle document files with icons
// //         const icon = await getDocumentIcon(file);
// //         processedAttachments.push({
// //           name: file.name,
// //           type: file.type,
// //           friendlyType: getFriendlyFileType(file),
// //           icon: icon,
// //           width: 100,
// //           height: 100,
// //           size: formatFileSize(file.size)
// //         });
// //       }
// //     } catch (error) {
// //       console.error(`Error processing ${file.name}:`, error);
// //       processedAttachments.push({
// //         name: file.name,
// //         type: file.type,
// //         friendlyType: getFriendlyFileType(file),
// //         data: null,
// //         icon: null,
// //         width: 0,
// //         height: 0,
// //         error: error.message
// //       });
// //     }
// //   }

// //   return processedAttachments;
// // };

// // // Get user-friendly file type names
// // const getFriendlyFileType = (file) => {
// //   const typeMap = {
// //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
// //     'application/msword': 'Word Document (Legacy)',
// //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
// //     'application/vnd.ms-excel': 'Excel Spreadsheet (Legacy)',
// //     'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint Presentation',
// //     'application/vnd.ms-powerpoint': 'PowerPoint Presentation (Legacy)',
// //     'text/plain': 'Text File',
// //     'application/zip': 'ZIP Archive',
// //     'application/x-zip-compressed': 'Compressed Folder'
// //   };

// //   // Get file extension
// //   const extension = file.name.split('.').pop().toUpperCase();
  
// //   return typeMap[file.type] || 
// //          `${file.type.split('/')[1] || 'Document'} (.${extension})` || 
// //          'Document';
// // };

// // // Format file size for display
// // const formatFileSize = (bytes) => {
// //   if (typeof bytes !== 'number' || bytes === 0) return '0 Bytes';
  
// //   const k = 1024;
// //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
// //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  
// //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// // };

// // // Generate document icons with file type indicators
// // const getDocumentIcon = (file) => {
// //   return new Promise((resolve) => {
// //     const canvas = document.createElement('canvas');
// //     canvas.width = 200;
// //     canvas.height = 200;
// //     const ctx = canvas.getContext('2d');
    
// //     // Background
// //     ctx.fillStyle = '#e3f2fd';
// //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    
// //     // Folder shape
// //     ctx.fillStyle = '#bbdefb';
// //     ctx.beginPath();
// //     ctx.moveTo(30, 60);
// //     ctx.lineTo(80, 45);
// //     ctx.lineTo(170, 45);
// //     ctx.lineTo(170, 160);
// //     ctx.lineTo(30, 160);
// //     ctx.closePath();
// //     ctx.fill();
    
// //     // File shape
// //     ctx.fillStyle = '#ffffff';
// //     ctx.beginPath();
// //     ctx.moveTo(40, 70);
// //     ctx.lineTo(160, 70);
// //     ctx.lineTo(160, 150);
// //     ctx.lineTo(40, 150);
// //     ctx.closePath();
// //     ctx.fill();
// //     ctx.strokeStyle = '#90caf9';
// //     ctx.lineWidth = 2;
// //     ctx.stroke();
    
// //     // File corner fold
// //     ctx.fillStyle = '#e3f2fd';
// //     ctx.beginPath();
// //     ctx.moveTo(140, 70);
// //     ctx.lineTo(160, 70);
// //     ctx.lineTo(160, 90);
// //     ctx.closePath();
// //     ctx.fill();
    
// //     // File icon based on type
// //     ctx.fillStyle = '#42a5f5';
// //     ctx.font = 'bold 40px Arial';
// //     ctx.textAlign = 'center';
    
// //     // Determine icon letter based on file type
// //     let iconLetter = 'D';
// //     let iconColor = '#42a5f5';
    
// //     if (file.type.includes('word') || file.name.match(/\.(docx?|rtf)$/i)) {
// //       iconLetter = 'W';
// //       iconColor = '#2b579a';
// //     } 
// //     else if (file.type.includes('excel') || file.name.match(/\.(xlsx?|csv)$/i)) {
// //       iconLetter = 'X';
// //       iconColor = '#217346';
// //     } 
// //     else if (file.type.includes('powerpoint') || file.name.match(/\.(pptx?)$/i)) {
// //       iconLetter = 'P';
// //       iconColor = '#d24726';
// //     }
    
// //     // Draw icon
// //     ctx.fillStyle = iconColor;
// //     ctx.fillText(iconLetter, 100, 120);
    
// //     // Add file extension below icon
// //     const extension = file.name.split('.').pop().toUpperCase();
// //     ctx.fillStyle = '#666';
// //     ctx.font = 'bold 16px Arial';
// //     ctx.fillText(`.${extension}`, 100, 150);
    
// //     resolve(canvas.toDataURL('image/png'));
// //   });
// // };

// // // Image processor
// // const getImageData = (file) => {
// //   return new Promise((resolve, reject) => {
// //     const reader = new FileReader();
    
// //     reader.onload = (e) => {
// //       const img = new Image();
// //       img.crossOrigin = 'Anonymous';
// //       img.src = e.target.result;
      
// //       img.onload = () => {
// //         const canvas = document.createElement('canvas');
// //         const ctx = canvas.getContext('2d');
// //         canvas.width = img.width;
// //         canvas.height = img.height;
        
// //         // Fill background for transparent images
// //         ctx.fillStyle = '#FFFFFF';
// //         ctx.fillRect(0, 0, canvas.width, canvas.height);
// //         ctx.drawImage(img, 0, 0);
        
// //         // Convert to PNG
// //         const dataURL = canvas.toDataURL('image/png');
        
// //         resolve({
// //           name: file.name,
// //           type: file.type,
// //           data: dataURL,
// //           width: img.width,
// //           height: img.height
// //         });
// //       };
      
// //       img.onerror = (err) => {
// //         reject(new Error('Image loading failed: ' + err.message));
// //       };
// //     };
    
// //     reader.onerror = () => {
// //       reject(new Error('File reading failed'));
// //     };
    
// //     reader.readAsDataURL(file);
// //   });
// // };

// // // PDF to Image Converter
// // const getPdfPreview = (file) => {
// //   return new Promise(async (resolve, reject) => {
// //     try {
// //       // Dynamically import PDF.js to reduce bundle size
// //       const pdfjsLib = await import('pdfjs-dist/build/pdf');
// //       const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
// //       pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// //       const arrayBuffer = await file.arrayBuffer();
// //       const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
// //       const page = await pdf.getPage(1);
      
// //       // Set scale for better resolution
// //       const viewport = page.getViewport({ scale: 2.0 });
// //       const canvas = document.createElement('canvas');
// //       const ctx = canvas.getContext('2d');
// //       canvas.width = viewport.width;
// //       canvas.height = viewport.height;

// //       // Render PDF page to canvas
// //       await page.render({
// //         canvasContext: ctx,
// //         viewport: viewport
// //       }).promise;

// //       // Convert to PNG
// //       const dataURL = canvas.toDataURL('image/png');
      
// //       resolve({
// //         name: file.name,
// //         type: file.type,
// //         data: dataURL,
// //         width: viewport.width,
// //         height: viewport.height
// //       });
// //     } catch (error) {
// //       reject(new Error(`PDF processing failed: ${error.message}`));
// //     }
// //   });
// // };

// // import jsPDF from 'jspdf';
// // import autoTable from 'jspdf-autotable';

// // export const generateQuotationPdf = (quotationData) => {
// //   const doc = new jsPDF();
// //   const { 
// //     frontPage, 
// //     backPage, 
// //     attachments,
// //     customerName,
// //     projectName,
// //     date,
// //     items,
// //     subtotal,
// //     discount,
// //     tax,
// //     totalAmount
// //   } = quotationData;

// //   // Front Page
// //   if (frontPage) {
// //     doc.setFontSize(22);
// //     doc.text(frontPage.title || 'QUOTATION', 105, 40, { align: 'center' });
// //     doc.setFontSize(12);
    
// //     const frontContentLines = doc.splitTextToSize(
// //       frontPage.content || `Prepared for: ${customerName}`,
// //       180
// //     );
    
// //     let yPosition = 60;
// //     frontContentLines.forEach(line => {
// //       doc.text(line, 105, yPosition, { align: 'center' });
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are more sections
// //     if (items.length > 0 || backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Main Content
// //   if (items.length > 0) {
// //     doc.setFontSize(18);
// //     doc.text('QUOTATION DETAILS', 105, 20, { align: 'center' });
    
// //     doc.setFontSize(12);
// //     doc.text(`Customer: ${customerName}`, 15, 30);
// //     doc.text(`Project: ${projectName}`, 15, 40);
// //     doc.text(`Date: ${date}`, 15, 50);
    
// //     autoTable(doc, {
// //       startY: 60,
// //       head: [['Item', 'Qty', 'Unit Price', 'Total']],
// //       body: items.map(item => [
// //         item.name,
// //         item.qty,
// //         `$${item.price.toFixed(2)}`,
// //         `$${(item.qty * item.price).toFixed(2)}`
// //       ]),
// //       styles: { fontSize: 10 },
// //       headStyles: { fillColor: [41, 128, 185] }
// //     });
    
// //     // Summary
// //     const finalY = doc.lastAutoTable.finalY + 10;
// //     doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, finalY);
// //     doc.text(`Discount: $${discount.toFixed(2)}`, 150, finalY + 10);
// //     doc.text(`Tax: $${tax.toFixed(2)}`, 150, finalY + 20);
// //     doc.text(`Total: $${totalAmount.toFixed(2)}`, 150, finalY + 30);
    
// //     // Add page if there are more sections
// //     if (backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Back Page
// //   if (backPage) {
// //     doc.setFontSize(16);
// //     doc.text(backPage.title || 'TERMS & CONDITIONS', 105, 30, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     const backContentLines = doc.splitTextToSize(
// //       backPage.content || 'Standard terms and conditions apply.',
// //       180
// //     );
    
// //     let yPosition = 50;
// //     backContentLines.forEach(line => {
// //       doc.text(line, 15, yPosition);
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are attachments
// //     if (attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Attachments with enhanced document support
// //   if (attachments.length > 0) {
// //     doc.setFontSize(16);
// //     doc.text('ATTACHMENTS', 105, 20, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     let yPosition = 40;
// //     const pageHeight = 297; // A4 height in mm
// //     const margin = 15; // Page margins
    
// //     // Introduction text
// //     doc.text('The following documents are included with this quotation:', 15, 30);
    
// //     attachments.forEach((file, index) => {
// //       // Page break check
// //       if (yPosition > pageHeight - 30) {
// //         doc.addPage();
// //         yPosition = 20;
// //         doc.setFontSize(10);
// //       }
      
// //       // File name
// //       doc.text(`${index + 1}. ${file.name}`, margin, yPosition);
// //       yPosition += 8;
      
// //       // Preview handling for images and PDFs
// //       if (file.data) {
// //         const aspectRatio = file.width / file.height;
// //         const maxWidth = 180; // Max width in mm
// //         const maxHeight = 150; // Max height in mm
        
// //         // Calculate display dimensions
// //         let imgWidth = maxWidth;
// //         let imgHeight = maxWidth / aspectRatio;
        
// //         // Adjust if height exceeds limit
// //         if (imgHeight > maxHeight) {
// //           imgHeight = maxHeight;
// //           imgWidth = maxHeight * aspectRatio;
// //         }
        
// //         // Check if image fits on page
// //         if (yPosition + imgHeight > pageHeight - margin) {
// //           doc.addPage();
// //           yPosition = 20;
// //           doc.setFontSize(10);
// //         }
        
// //         try {
// //           // Add image to PDF
// //           doc.addImage(
// //             file.data,
// //             'PNG',
// //             margin,
// //             yPosition,
// //             imgWidth,
// //             imgHeight
// //           );
          
// //           // Add caption
// //           doc.setFontSize(8);
// //           doc.text(`Preview of: ${file.name}`, margin, yPosition + imgHeight + 5);
// //           doc.setFontSize(10);
          
// //           // Update position
// //           yPosition += imgHeight + 15;
// //         } catch (error) {
// //           doc.text(`(Preview failed: ${error.message})`, margin, yPosition);
// //           yPosition += 10;
// //         }
// //       } 
// //       // Document icon handling for office files
// //       else if (file.icon) {
// //         const iconSize = 30; // mm
        
// //         // Add document icon
// //         doc.addImage(
// //           file.icon,
// //           'PNG',
// //           margin,
// //           yPosition,
// //           iconSize,
// //           iconSize
// //         );
        
// //         // Add file info next to icon
// //         doc.setFontSize(10);
// //         doc.text(`File type: ${file.friendlyType || file.type}`, margin + iconSize + 5, yPosition + 10);
// //         doc.text(`Size: ${file.size || 'N/A'}`, margin + iconSize + 5, yPosition + 20);
        
// //         // Add caption below icon
// //         doc.setFontSize(8);
// //         doc.text(`Preview not available for: ${file.name}`, margin, yPosition + iconSize + 5);
// //         doc.setFontSize(10);
        
// //         // Update position
// //         yPosition += iconSize + 15;
// //       } 
// //       // Fallback for unsupported types
// //       else {
// //         let message = file.error 
// //           ? `(Error: ${file.error})` 
// //           : '(Preview not supported)';
        
// //         doc.text(message, margin, yPosition);
// //         yPosition += 10;
// //       }
// //     });
// //   }

// //   return doc;
// // };

// // // Unified file processor with enhanced document support
// // export const processFileAttachments = async (files) => {
// //   const processedAttachments = [];

// //   for (const file of files) {
// //     try {
// //       if (file.type.startsWith('image/')) {
// //         const processed = await getImageData(file);
// //         processedAttachments.push(processed);
// //       } 
// //       else if (file.type === 'application/pdf') {
// //         const processed = await getPdfPreview(file);
// //         processedAttachments.push(processed);
// //       }
// //       else {
// //         // Handle document files with icons
// //         const icon = await getDocumentIcon(file);
// //         processedAttachments.push({
// //           name: file.name,
// //           type: file.type,
// //           friendlyType: getFriendlyFileType(file),
// //           icon: icon,
// //           width: 100,
// //           height: 100,
// //           size: formatFileSize(file.size)
// //         });
// //       }
// //     } catch (error) {
// //       console.error(`Error processing ${file.name}:`, error);
// //       processedAttachments.push({
// //         name: file.name,
// //         type: file.type,
// //         friendlyType: getFriendlyFileType(file),
// //         data: null,
// //         icon: null,
// //         width: 0,
// //         height: 0,
// //         error: error.message
// //       });
// //     }
// //   }

// //   return processedAttachments;
// // };

// // // Get user-friendly file type names
// // const getFriendlyFileType = (file) => {
// //   const typeMap = {
// //     // Word Documents
// //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
// //     'application/msword': 'Word Document (Legacy)',
// //     'application/rtf': 'Rich Text Format',
    
// //     // Excel Spreadsheets
// //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
// //     'application/vnd.ms-excel': 'Excel Spreadsheet (Legacy)',
// //     'application/vnd.ms-excel.sheet.macroEnabled.12': 'Excel Macro-Enabled Workbook',
// //     'application/vnd.ms-excel.sheet.binary.macroEnabled.12': 'Excel Binary Workbook',
    
// //     // PowerPoint Presentations
// //     'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint Presentation',
// //     'application/vnd.ms-powerpoint': 'PowerPoint Presentation (Legacy)',
// //     'application/vnd.ms-powerpoint.presentation.macroEnabled.12': 'PowerPoint Macro-Enabled Presentation',
    
// //     // Other types
// //     'text/plain': 'Text File',
// //     'application/zip': 'ZIP Archive',
// //     'application/x-zip-compressed': 'Compressed Folder',
// //     'application/json': 'JSON File',
// //     'text/csv': 'CSV File'
// //   };

// //   // Get file extension
// //   const extension = file.name.split('.').pop().toUpperCase();
  
// //   return typeMap[file.type] || 
// //          `${file.type.split('/')[1] || 'Document'} (.${extension})` || 
// //          'Document';
// // };

// // // Format file size for display
// // const formatFileSize = (bytes) => {
// //   if (typeof bytes !== 'number' || bytes === 0) return '0 Bytes';
  
// //   const k = 1024;
// //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
// //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  
// //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// // };

// // // Generate document icons with file type indicators
// // const getDocumentIcon = (file) => {
// //   return new Promise((resolve) => {
// //     const canvas = document.createElement('canvas');
// //     canvas.width = 200;
// //     canvas.height = 200;
// //     const ctx = canvas.getContext('2d');
    
// //     // Background
// //     ctx.fillStyle = '#e3f2fd';
// //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    
// //     // Folder shape
// //     ctx.fillStyle = '#bbdefb';
// //     ctx.beginPath();
// //     ctx.moveTo(30, 60);
// //     ctx.lineTo(80, 45);
// //     ctx.lineTo(170, 45);
// //     ctx.lineTo(170, 160);
// //     ctx.lineTo(30, 160);
// //     ctx.closePath();
// //     ctx.fill();
    
// //     // File shape
// //     ctx.fillStyle = '#ffffff';
// //     ctx.beginPath();
// //     ctx.moveTo(40, 70);
// //     ctx.lineTo(160, 70);
// //     ctx.lineTo(160, 150);
// //     ctx.lineTo(40, 150);
// //     ctx.closePath();
// //     ctx.fill();
// //     ctx.strokeStyle = '#90caf9';
// //     ctx.lineWidth = 2;
// //     ctx.stroke();
    
// //     // File corner fold
// //     ctx.fillStyle = '#e3f2fd';
// //     ctx.beginPath();
// //     ctx.moveTo(140, 70);
// //     ctx.lineTo(160, 70);
// //     ctx.lineTo(160, 90);
// //     ctx.closePath();
// //     ctx.fill();
    
// //     // File icon based on type
// //     ctx.fillStyle = '#42a5f5';
// //     ctx.font = 'bold 40px Arial';
// //     ctx.textAlign = 'center';
    
// //     // Determine icon letter based on file type
// //     let iconLetter = 'D';
// //     let iconColor = '#42a5f5';
    
// //     // Enhanced file type detection
// //     const fileType = file.type.toLowerCase();
// //     const fileName = file.name.toLowerCase();
    
// //     // Word detection
// //     const isWord = 
// //       fileType.includes('word') || 
// //       fileType.includes('document') || 
// //       fileType.includes('rtf') ||
// //       fileName.match(/\.(docx?|rtf|docm|dotx|dotm)$/);
    
// //     // Excel detection
// //     const isExcel = 
// //       fileType.includes('excel') || 
// //       fileType.includes('spreadsheet') || 
// //       fileType.includes('csv') ||
// //       fileName.match(/\.(xlsx?|xlsm|xlsb|csv|xltx|xltm)$/);
    
// //     // PowerPoint detection
// //     const isPowerPoint = 
// //       fileType.includes('powerpoint') || 
// //       fileType.includes('presentation') ||
// //       fileName.match(/\.(pptx?|ppt|pptm|potx|potm|ppsx)$/);
    
// //     if (isWord) {
// //       iconLetter = 'W';
// //       iconColor = '#2b579a'; // Word blue
// //     } 
// //     else if (isExcel) {
// //       iconLetter = 'X';
// //       iconColor = '#217346'; // Excel green
// //     } 
// //     else if (isPowerPoint) {
// //       iconLetter = 'P';
// //       iconColor = '#d24726'; // PowerPoint orange
// //     }
    
// //     // Draw icon
// //     ctx.fillStyle = iconColor;
// //     ctx.fillText(iconLetter, 100, 120);
    
// //     // Add file extension below icon
// //     const extension = file.name.split('.').pop().toUpperCase();
// //     ctx.fillStyle = '#666';
// //     ctx.font = 'bold 16px Arial';
// //     ctx.fillText(`.${extension}`, 100, 150);
    
// //     resolve(canvas.toDataURL('image/png'));
// //   });
// // };

// // // Image processor
// // const getImageData = (file) => {
// //   return new Promise((resolve, reject) => {
// //     const reader = new FileReader();
    
// //     reader.onload = (e) => {
// //       const img = new Image();
// //       img.crossOrigin = 'Anonymous';
// //       img.src = e.target.result;
      
// //       img.onload = () => {
// //         const canvas = document.createElement('canvas');
// //         const ctx = canvas.getContext('2d');
// //         canvas.width = img.width;
// //         canvas.height = img.height;
        
// //         // Fill background for transparent images
// //         ctx.fillStyle = '#FFFFFF';
// //         ctx.fillRect(0, 0, canvas.width, canvas.height);
// //         ctx.drawImage(img, 0, 0);
        
// //         // Convert to PNG
// //         const dataURL = canvas.toDataURL('image/png');
        
// //         resolve({
// //           name: file.name,
// //           type: file.type,
// //           data: dataURL,
// //           width: img.width,
// //           height: img.height
// //         });
// //       };
      
// //       img.onerror = (err) => {
// //         reject(new Error('Image loading failed: ' + err.message));
// //       };
// //     };
    
// //     reader.onerror = () => {
// //       reject(new Error('File reading failed'));
// //     };
    
// //     reader.readAsDataURL(file);
// //   });
// // };

// // // PDF to Image Converter
// // const getPdfPreview = (file) => {
// //   return new Promise(async (resolve, reject) => {
// //     try {
// //       // Dynamically import PDF.js to reduce bundle size
// //       const pdfjsLib = await import('pdfjs-dist/build/pdf');
// //       const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
// //       pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// //       const arrayBuffer = await file.arrayBuffer();
// //       const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
// //       const page = await pdf.getPage(1);
      
// //       // Set scale for better resolution
// //       const viewport = page.getViewport({ scale: 2.0 });
// //       const canvas = document.createElement('canvas');
// //       const ctx = canvas.getContext('2d');
// //       canvas.width = viewport.width;
// //       canvas.height = viewport.height;

// //       // Render PDF page to canvas
// //       await page.render({
// //         canvasContext: ctx,
// //         viewport: viewport
// //       }).promise;

// //       // Convert to PNG
// //       const dataURL = canvas.toDataURL('image/png');
      
// //       resolve({
// //         name: file.name,
// //         type: file.type,
// //         data: dataURL,
// //         width: viewport.width,
// //         height: viewport.height
// //       });
// //     } catch (error) {
// //       reject(new Error(`PDF processing failed: ${error.message}`));
// //     }
// //   });
// // };

// // import jsPDF from 'jspdf';
// // import autoTable from 'jspdf-autotable';

// // export const generateQuotationPdf = (quotationData) => {
// //   const doc = new jsPDF();
// //   const { 
// //     frontPage, 
// //     backPage, 
// //     attachments,
// //     customerName,
// //     projectName,
// //     date,
// //     items,
// //     subtotal,
// //     discount,
// //     tax,
// //     totalAmount
// //   } = quotationData;

// //   // Front Page
// //   if (frontPage) {
// //     doc.setFontSize(22);
// //     doc.text(frontPage.title || 'QUOTATION', 105, 40, { align: 'center' });
// //     doc.setFontSize(12);
    
// //     const frontContentLines = doc.splitTextToSize(
// //       frontPage.content || `Prepared for: ${customerName}`,
// //       180
// //     );
    
// //     let yPosition = 60;
// //     frontContentLines.forEach(line => {
// //       doc.text(line, 105, yPosition, { align: 'center' });
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are more sections
// //     if (items.length > 0 || backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Main Content
// //   if (items.length > 0) {
// //     doc.setFontSize(18);
// //     doc.text('QUOTATION DETAILS', 105, 20, { align: 'center' });
    
// //     doc.setFontSize(12);
// //     doc.text(`Customer: ${customerName}`, 15, 30);
// //     doc.text(`Project: ${projectName}`, 15, 40);
// //     doc.text(`Date: ${date}`, 15, 50);
    
// //     autoTable(doc, {
// //       startY: 60,
// //       head: [['Item', 'Qty', 'Unit Price', 'Total']],
// //       body: items.map(item => [
// //         item.name,
// //         item.qty,
// //         `$${item.price.toFixed(2)}`,
// //         `$${(item.qty * item.price).toFixed(2)}`
// //       ]),
// //       styles: { fontSize: 10 },
// //       headStyles: { fillColor: [41, 128, 185] }
// //     });
    
// //     // Summary
// //     const finalY = doc.lastAutoTable.finalY + 10;
// //     doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, finalY);
// //     doc.text(`Discount: $${discount.toFixed(2)}`, 150, finalY + 10);
// //     doc.text(`Tax: $${tax.toFixed(2)}`, 150, finalY + 20);
// //     doc.text(`Total: $${totalAmount.toFixed(2)}`, 150, finalY + 30);
    
// //     // Add page if there are more sections
// //     if (backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Back Page
// //   if (backPage) {
// //     doc.setFontSize(16);
// //     doc.text(backPage.title || 'TERMS & CONDITIONS', 105, 30, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     const backContentLines = doc.splitTextToSize(
// //       backPage.content || 'Standard terms and conditions apply.',
// //       180
// //     );
    
// //     let yPosition = 50;
// //     backContentLines.forEach(line => {
// //       doc.text(line, 15, yPosition);
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are attachments
// //     if (attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Enhanced Attachments Section
// //   if (attachments.length > 0) {
// //     doc.setFontSize(16);
// //     doc.text('ATTACHMENTS', 105, 20, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     let yPosition = 40;
// //     const pageHeight = 297; // A4 height in mm
// //     const margin = 15; // Page margins
    
// //     // Introduction text
// //     doc.text('The following documents are included with this quotation:', 15, 30);
    
// //     attachments.forEach((file, index) => {
// //       // Page break check
// //       if (yPosition > pageHeight - 30) {
// //         doc.addPage();
// //         yPosition = 20;
// //         doc.setFontSize(10);
// //       }
      
// //       // File header
// //       doc.setFontSize(12);
// //       doc.setTextColor(41, 128, 185);
// //       doc.text(`${index + 1}. ${file.name} (${file.friendlyType})`, margin, yPosition);
// //       doc.setFontSize(10);
// //       doc.setTextColor(0, 0, 0);
// //       yPosition += 8;
      
// //       // File metadata
// //       doc.text(`Size: ${file.size || 'N/A'} | Uploaded: ${file.lastModified || 'N/A'}`, margin, yPosition);
// //       yPosition += 8;
      
// //       // Preview handling
// //       if (file.data) {
// //         // Image/PDF preview
// //         const aspectRatio = file.width / file.height;
// //         const maxWidth = 180; // Max width in mm
// //         const maxHeight = 150; // Max height in mm
        
// //         // Calculate display dimensions
// //         let imgWidth = maxWidth;
// //         let imgHeight = maxWidth / aspectRatio;
        
// //         // Adjust if height exceeds limit
// //         if (imgHeight > maxHeight) {
// //           imgHeight = maxHeight;
// //           imgWidth = maxHeight * aspectRatio;
// //         }
        
// //         // Check if image fits on page
// //         if (yPosition + imgHeight > pageHeight - margin) {
// //           doc.addPage();
// //           yPosition = 20;
// //           doc.setFontSize(10);
// //         }
        
// //         try {
// //           // Add image to PDF
// //           doc.addImage(
// //             file.data,
// //             'PNG',
// //             margin,
// //             yPosition,
// //             imgWidth,
// //             imgHeight
// //           );
          
// //           // Update position
// //           yPosition += imgHeight + 5;
// //         } catch (error) {
// //           doc.text(`(Preview rendering failed: ${error.message})`, margin, yPosition);
// //           yPosition += 10;
// //         }
// //       } 
// //       else if (file.icon) {
// //         // Document icon preview
// //         const iconSize = 20; // mm
        
// //         // Check if icon fits on page
// //         if (yPosition + iconSize > pageHeight - margin) {
// //           doc.addPage();
// //           yPosition = 20;
// //           doc.setFontSize(10);
// //         }
        
// //         // Add document icon
// //         doc.addImage(
// //           file.icon,
// //           'PNG',
// //           margin,
// //           yPosition,
// //           iconSize,
// //           iconSize
// //         );
        
// //         // Add file info next to icon
// //         doc.text(`File type: ${file.friendlyType}`, margin + iconSize + 5, yPosition + 5);
// //         doc.text(`Size: ${file.size || 'N/A'}`, margin + iconSize + 5, yPosition + 10);
        
// //         // Update position
// //         yPosition += iconSize + 5;
// //       } 
// //       else {
// //         // Unsupported type
// //         doc.text(`(Preview not available for this file type)`, margin, yPosition);
// //         yPosition += 10;
// //       }
      
// //       // Add separator
// //       doc.line(margin, yPosition, 200 - margin, yPosition);
// //       yPosition += 15;
// //     });
// //   }

// //   return doc;
// // };

// // // Unified file processor with enhanced document support
// // export const processFileAttachments = async (files) => {
// //   const processedAttachments = [];

// //   for (const file of files) {
// //     try {
// //       if (file.type.startsWith('image/')) {
// //         const processed = await getImageData(file);
// //         processedAttachments.push(processed);
// //       } 
// //       else if (file.type === 'application/pdf') {
// //         const processed = await getPdfPreview(file);
// //         processedAttachments.push(processed);
// //       }
// //       else {
// //         // Handle all other file types with enhanced document icons
// //         const processed = await createDocumentIconPreview(file);
// //         processedAttachments.push(processed);
// //       }
// //     } catch (error) {
// //       console.error(`Error processing ${file.name}:`, error);
// //       processedAttachments.push({
// //         name: file.name,
// //         type: file.type,
// //         friendlyType: getFriendlyFileType(file),
// //         data: null,
// //         icon: null,
// //         width: 0,
// //         height: 0,
// //         size: formatFileSize(file.size),
// //         lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A',
// //         error: error.message
// //       });
// //     }
// //   }

// //   return processedAttachments;
// // };

// // // Create enhanced document icon preview
// // const createDocumentIconPreview = async (file) => {
// //   const icon = await getDocumentIcon(file);
  
// //   return {
// //     name: file.name,
// //     type: file.type,
// //     friendlyType: getFriendlyFileType(file),
// //     icon: icon,
// //     width: 100,
// //     height: 100,
// //     size: formatFileSize(file.size),
// //     lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
// //   };
// // };

// // // Get user-friendly file type names
// // const getFriendlyFileType = (file) => {
// //   const typeMap = {
// //     // Word Documents
// //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Microsoft Word',
// //     'application/msword': 'Microsoft Word (Legacy)',
// //     'application/rtf': 'Rich Text Document',
    
// //     // Excel Spreadsheets
// //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Microsoft Excel',
// //     'application/vnd.ms-excel': 'Microsoft Excel (Legacy)',
// //     'application/vnd.ms-excel.sheet.macroEnabled.12': 'Excel Macro-Enabled Workbook',
// //     'text/csv': 'CSV Spreadsheet',
    
// //     // PowerPoint Presentations
// //     'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'Microsoft PowerPoint',
// //     'application/vnd.ms-powerpoint': 'Microsoft PowerPoint (Legacy)',
    
// //     // PDF
// //     'application/pdf': 'PDF Document',
    
// //     // Images
// //     'image/jpeg': 'JPEG Image',
// //     'image/png': 'PNG Image',
// //     'image/gif': 'GIF Image',
// //     'image/svg+xml': 'SVG Image',
// //     'image/webp': 'WebP Image',
    
// //     // Archives
// //     'application/zip': 'ZIP Archive',
// //     'application/x-zip-compressed': 'Compressed Folder',
// //     'application/x-rar-compressed': 'RAR Archive',
// //     'application/x-7z-compressed': '7-Zip Archive',
    
// //     // Other common types
// //     'text/plain': 'Text File',
// //     'application/json': 'JSON File',
// //     'application/javascript': 'JavaScript File',
// //     'text/html': 'HTML Document'
// //   };

// //   // Get specific type from map
// //   if (typeMap[file.type]) {
// //     return typeMap[file.type];
// //   }
  
// //   // Fallback to general category
// //   const category = file.type.split('/')[0];
// //   const extension = file.name.split('.').pop().toUpperCase();
  
// //   const categoryNames = {
// //     'application': 'Application',
// //     'text': 'Text Document',
// //     'audio': 'Audio File',
// //     'video': 'Video File',
// //     'font': 'Font File'
// //   };
  
// //   return `${categoryNames[category] || 'File'} (.${extension})`;
// // };

// // // Format file size for display
// // const formatFileSize = (bytes) => {
// //   if (typeof bytes !== 'number' || bytes === 0) return '0 Bytes';
  
// //   const k = 1024;
// //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
// //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  
// //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// // };

// // // Generate document icons with file type indicators
// // const getDocumentIcon = (file) => {
// //   return new Promise((resolve) => {
// //     const canvas = document.createElement('canvas');
// //     canvas.width = 200;
// //     canvas.height = 200;
// //     const ctx = canvas.getContext('2d');
    
// //     // Background
// //     ctx.fillStyle = '#f5f5f5';
// //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    
// //     // File shape
// //     ctx.fillStyle = '#ffffff';
// //     ctx.beginPath();
// //     ctx.moveTo(40, 50);
// //     ctx.lineTo(160, 50);
// //     ctx.lineTo(160, 150);
// //     ctx.lineTo(40, 150);
// //     ctx.closePath();
// //     ctx.fill();
// //     ctx.strokeStyle = '#e0e0e0';
// //     ctx.lineWidth = 2;
// //     ctx.stroke();
    
// //     // File corner fold
// //     ctx.fillStyle = '#f5f5f5';
// //     ctx.beginPath();
// //     ctx.moveTo(140, 50);
// //     ctx.lineTo(160, 50);
// //     ctx.lineTo(160, 70);
// //     ctx.closePath();
// //     ctx.fill();
    
// //     // Determine icon color and letter based on file type
// //     let iconLetter = 'D';
// //     let iconColor = '#757575';
    
// //     // Detect file type
// //     const fileType = file.type.toLowerCase();
// //     const fileName = file.name.toLowerCase();
    
// //     // Word documents
// //     if (fileType.includes('word') || fileType.includes('document') || 
// //         fileName.endsWith('.doc') || fileName.endsWith('.docx') || 
// //         fileName.endsWith('.rtf')) {
// //       iconLetter = 'W';
// //       iconColor = '#2b579a'; // Word blue
// //     }
// //     // Excel spreadsheets
// //     else if (fileType.includes('excel') || fileType.includes('spreadsheet') || 
// //              fileName.endsWith('.xls') || fileName.endsWith('.xlsx') || 
// //              fileName.endsWith('.csv')) {
// //       iconLetter = 'X';
// //       iconColor = '#217346'; // Excel green
// //     }
// //     // PowerPoint presentations
// //     else if (fileType.includes('powerpoint') || fileType.includes('presentation') || 
// //              fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) {
// //       iconLetter = 'P';
// //       iconColor = '#d24726'; // PowerPoint orange
// //     }
// //     // PDF documents
// //     else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
// //       iconLetter = 'PDF';
// //       iconColor = '#f40f02'; // PDF red
// //     }
// //     // Images
// //     else if (fileType.startsWith('image/')) {
// //       iconLetter = 'IMG';
// //       iconColor = '#9c27b0'; // Purple
// //     }
// //     // Archives
// //     else if (fileType.includes('zip') || fileType.includes('compress') || 
// //              fileName.endsWith('.zip') || fileName.endsWith('.rar') || 
// //              fileName.endsWith('.7z')) {
// //       iconLetter = 'ZIP';
// //       iconColor = '#ff9800'; // Orange
// //     }
    
// //     // Draw icon
// //     ctx.fillStyle = iconColor;
// //     ctx.font = 'bold 24px Arial';
// //     ctx.textAlign = 'center';
// //     ctx.textBaseline = 'middle';
// //     ctx.fillText(iconLetter, 100, 100);
    
// //     // Add file extension below icon
// //     const extension = file.name.split('.').pop().toUpperCase();
// //     ctx.fillStyle = '#616161';
// //     ctx.font = 'bold 12px Arial';
// //     ctx.fillText(`.${extension}`, 100, 130);
    
// //     resolve(canvas.toDataURL('image/png'));
// //   });
// // };

// // // Image processor
// // const getImageData = (file) => {
// //   return new Promise((resolve, reject) => {
// //     const reader = new FileReader();
    
// //     reader.onload = (e) => {
// //       const img = new Image();
// //       img.crossOrigin = 'Anonymous';
// //       img.src = e.target.result;
      
// //       img.onload = () => {
// //         const canvas = document.createElement('canvas');
// //         const ctx = canvas.getContext('2d');
// //         canvas.width = img.width;
// //         canvas.height = img.height;
        
// //         // Fill background for transparent images
// //         ctx.fillStyle = '#FFFFFF';
// //         ctx.fillRect(0, 0, canvas.width, canvas.height);
// //         ctx.drawImage(img, 0, 0);
        
// //         // Convert to PNG
// //         const dataURL = canvas.toDataURL('image/png');
        
// //         resolve({
// //           name: file.name,
// //           type: file.type,
// //           friendlyType: getFriendlyFileType(file),
// //           data: dataURL,
// //           width: img.width,
// //           height: img.height,
// //           size: formatFileSize(file.size),
// //           lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
// //         });
// //       };
      
// //       img.onerror = (err) => {
// //         reject(new Error('Image loading failed: ' + err.message));
// //       };
// //     };
    
// //     reader.onerror = () => {
// //       reject(new Error('File reading failed'));
// //     };
    
// //     reader.readAsDataURL(file);
// //   });
// // };

// // // PDF to Image Converter
// // const getPdfPreview = (file) => {
// //   return new Promise(async (resolve, reject) => {
// //     try {
// //       // Dynamically import PDF.js to reduce bundle size
// //       const pdfjsLib = await import('pdfjs-dist/build/pdf');
// //       const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
// //       pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// //       const arrayBuffer = await file.arrayBuffer();
// //       const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
// //       const page = await pdf.getPage(1);
      
// //       // Set scale for better resolution
// //       const viewport = page.getViewport({ scale: 1.5 });
// //       const canvas = document.createElement('canvas');
// //       const ctx = canvas.getContext('2d');
// //       canvas.width = viewport.width;
// //       canvas.height = viewport.height;

// //       // Render PDF page to canvas
// //       await page.render({
// //         canvasContext: ctx,
// //         viewport: viewport
// //       }).promise;

// //       // Convert to PNG
// //       const dataURL = canvas.toDataURL('image/png');
      
// //       resolve({
// //         name: file.name,
// //         type: file.type,
// //         friendlyType: getFriendlyFileType(file),
// //         data: dataURL,
// //         width: viewport.width,
// //         height: viewport.height,
// //         size: formatFileSize(file.size),
// //         lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
// //       });
// //     } catch (error) {
// //       reject(new Error(`PDF processing failed: ${error.message}`));
// //     }
// //   });
// // };

// // import jsPDF from 'jspdf';
// // import autoTable from 'jspdf-autotable';

// // export const generateQuotationPdf = (quotationData) => {
// //   const doc = new jsPDF();
// //   const { 
// //     frontPage, 
// //     backPage, 
// //     attachments,
// //     customerName,
// //     projectName,
// //     date,
// //     items,
// //     subtotal,
// //     discount,
// //     tax,
// //     totalAmount
// //   } = quotationData;

// //   // Front Page
// //   if (frontPage) {
// //     doc.setFontSize(22);
// //     doc.text(frontPage.title || 'QUOTATION', 105, 40, { align: 'center' });
// //     doc.setFontSize(12);
    
// //     const frontContentLines = doc.splitTextToSize(
// //       frontPage.content || `Prepared for: ${customerName}`,
// //       180
// //     );
    
// //     let yPosition = 60;
// //     frontContentLines.forEach(line => {
// //       doc.text(line, 105, yPosition, { align: 'center' });
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are more sections
// //     if (items.length > 0 || backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Main Content
// //   if (items.length > 0) {
// //     doc.setFontSize(18);
// //     doc.text('QUOTATION DETAILS', 105, 20, { align: 'center' });
    
// //     doc.setFontSize(12);
// //     doc.text(`Customer: ${customerName}`, 15, 30);
// //     doc.text(`Project: ${projectName}`, 15, 40);
// //     doc.text(`Date: ${date}`, 15, 50);
    
// //     autoTable(doc, {
// //       startY: 60,
// //       head: [['Item', 'Qty', 'Unit Price', 'Total']],
// //       body: items.map(item => [
// //         item.name,
// //         item.qty,
// //         `$${item.price.toFixed(2)}`,
// //         `$${(item.qty * item.price).toFixed(2)}`
// //       ]),
// //       styles: { fontSize: 10 },
// //       headStyles: { fillColor: [41, 128, 185] }
// //     });
    
// //     // Summary
// //     const finalY = doc.lastAutoTable.finalY + 10;
// //     doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, finalY);
// //     doc.text(`Discount: $${discount.toFixed(2)}`, 150, finalY + 10);
// //     doc.text(`Tax: $${tax.toFixed(2)}`, 150, finalY + 20);
// //     doc.text(`Total: $${totalAmount.toFixed(2)}`, 150, finalY + 30);
    
// //     // Add page if there are more sections
// //     if (backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Back Page
// //   if (backPage) {
// //     doc.setFontSize(16);
// //     doc.text(backPage.title || 'TERMS & CONDITIONS', 105, 30, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     const backContentLines = doc.splitTextToSize(
// //       backPage.content || 'Standard terms and conditions apply.',
// //       180
// //     );
    
// //     let yPosition = 50;
// //     backContentLines.forEach(line => {
// //       doc.text(line, 15, yPosition);
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are attachments
// //     if (attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Enhanced Attachments Section
// //   if (attachments.length > 0) {
// //     doc.setFontSize(16);
// //     doc.text('ATTACHMENTS', 105, 20, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     let yPosition = 40;
// //     const pageHeight = 297; // A4 height in mm
// //     const margin = 15; // Page margins
    
// //     // Introduction text
// //     doc.text('The following documents are included with this quotation:', 15, 30);
    
// //     attachments.forEach((file, index) => {
// //       // Page break check
// //       if (yPosition > pageHeight - 30) {
// //         doc.addPage();
// //         yPosition = 20;
// //         doc.setFontSize(10);
// //       }
      
// //       // File header
// //       doc.setFontSize(12);
// //       doc.setTextColor(41, 128, 185);
// //       doc.text(`${index + 1}. ${file.name} (${file.friendlyType})`, margin, yPosition);
// //       doc.setFontSize(10);
// //       doc.setTextColor(0, 0, 0);
// //       yPosition += 8;
      
// //       // File metadata
// //       doc.text(`Size: ${file.size || 'N/A'} | Uploaded: ${file.lastModified || 'N/A'}`, margin, yPosition);
// //       yPosition += 8;
      
// //       // Preview handling
// //       if (file.data) {
// //         // Image/PDF preview
// //         const aspectRatio = file.width / file.height;
// //         const maxWidth = 180; // Max width in mm
// //         const maxHeight = 150; // Max height in mm
        
// //         // Calculate display dimensions
// //         let imgWidth = maxWidth;
// //         let imgHeight = maxWidth / aspectRatio;
        
// //         // Adjust if height exceeds limit
// //         if (imgHeight > maxHeight) {
// //           imgHeight = maxHeight;
// //           imgWidth = maxHeight * aspectRatio;
// //         }
        
// //         // Check if image fits on page
// //         if (yPosition + imgHeight > pageHeight - margin) {
// //           doc.addPage();
// //           yPosition = 20;
// //           doc.setFontSize(10);
// //         }
        
// //         try {
// //           // Add image to PDF
// //           doc.addImage(
// //             file.data,
// //             'PNG',
// //             margin,
// //             yPosition,
// //             imgWidth,
// //             imgHeight
// //           );
          
// //           // Update position
// //           yPosition += imgHeight + 5;
// //         } catch (error) {
// //           doc.text(`(Preview rendering failed: ${error.message})`, margin, yPosition);
// //           yPosition += 10;
// //         }
// //       } 
// //       else if (file.icon) {
// //         // Document icon preview
// //         const iconSize = 20; // mm
        
// //         // Check if icon fits on page
// //         if (yPosition + iconSize > pageHeight - margin) {
// //           doc.addPage();
// //           yPosition = 20;
// //           doc.setFontSize(10);
// //         }
        
// //         // Add document icon
// //         doc.addImage(
// //           file.icon,
// //           'PNG',
// //           margin,
// //           yPosition,
// //           iconSize,
// //           iconSize
// //         );
        
// //         // Add file info next to icon
// //         doc.text(`File type: ${file.friendlyType}`, margin + iconSize + 5, yPosition + 5);
// //         doc.text(`Size: ${file.size || 'N/A'}`, margin + iconSize + 5, yPosition + 10);
        
// //         // Update position
// //         yPosition += iconSize + 5;
// //       } 
// //       else {
// //         // Unsupported type
// //         doc.text(`(Preview not available for this file type)`, margin, yPosition);
// //         yPosition += 10;
// //       }
      
// //       // Add separator
// //       doc.line(margin, yPosition, 200 - margin, yPosition);
// //       yPosition += 15;
// //     });
// //   }

// //   return doc;
// // };

// // // Unified file processor with enhanced document support
// // export const processFileAttachments = async (files) => {
// //   const processedAttachments = [];

// //   for (const file of files) {
// //     try {
// //       if (file.type.startsWith('image/')) {
// //         const processed = await getImageData(file);
// //         processedAttachments.push(processed);
// //       } 
// //       else if (file.type === 'application/pdf') {
// //         const processed = await getPdfPreview(file);
// //         processedAttachments.push(processed);
// //       }
// //       else {
// //         // Handle all other file types with enhanced document icons
// //         const processed = await createDocumentIconPreview(file);
// //         processedAttachments.push(processed);
// //       }
// //     } catch (error) {
// //       console.error(`Error processing ${file.name}:`, error);
// //       processedAttachments.push({
// //         name: file.name,
// //         type: file.type,
// //         friendlyType: getFriendlyFileType(file),
// //         data: null,
// //         icon: null,
// //         width: 0,
// //         height: 0,
// //         size: formatFileSize(file.size),
// //         lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A',
// //         error: error.message
// //       });
// //     }
// //   }

// //   return processedAttachments;
// // };

// // // Create enhanced document icon preview
// // const createDocumentIconPreview = async (file) => {
// //   const icon = await getDocumentIcon(file);
  
// //   return {
// //     name: file.name,
// //     type: file.type,
// //     friendlyType: getFriendlyFileType(file),
// //     icon: icon,
// //     width: 100,
// //     height: 100,
// //     size: formatFileSize(file.size),
// //     lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
// //   };
// // };

// // // Get user-friendly file type names
// // const getFriendlyFileType = (file) => {
// //   const typeMap = {
// //     // Word Documents
// //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Microsoft Word',
// //     'application/msword': 'Microsoft Word (Legacy)',
// //     'application/rtf': 'Rich Text Document',
    
// //     // Excel Spreadsheets
// //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Microsoft Excel',
// //     'application/vnd.ms-excel': 'Microsoft Excel (Legacy)',
// //     'application/vnd.ms-excel.sheet.macroEnabled.12': 'Excel Macro-Enabled Workbook',
// //     'text/csv': 'CSV Spreadsheet',
    
// //     // PowerPoint Presentations
// //     'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'Microsoft PowerPoint',
// //     'application/vnd.ms-powerpoint': 'Microsoft PowerPoint (Legacy)',
    
// //     // PDF
// //     'application/pdf': 'PDF Document',
    
// //     // Images
// //     'image/jpeg': 'JPEG Image',
// //     'image/png': 'PNG Image',
// //     'image/gif': 'GIF Image',
// //     'image/svg+xml': 'SVG Image',
// //     'image/webp': 'WebP Image',
    
// //     // Archives
// //     'application/zip': 'ZIP Archive',
// //     'application/x-zip-compressed': 'Compressed Folder',
// //     'application/x-rar-compressed': 'RAR Archive',
// //     'application/x-7z-compressed': '7-Zip Archive',
    
// //     // Other common types
// //     'text/plain': 'Text File',
// //     'application/json': 'JSON File',
// //     'application/javascript': 'JavaScript File',
// //     'text/html': 'HTML Document'
// //   };

// //   // Get specific type from map
// //   if (typeMap[file.type]) {
// //     return typeMap[file.type];
// //   }
  
// //   // Fallback to general category
// //   const category = file.type.split('/')[0];
// //   const extension = file.name.split('.').pop().toUpperCase();
  
// //   const categoryNames = {
// //     'application': 'Application',
// //     'text': 'Text Document',
// //     'audio': 'Audio File',
// //     'video': 'Video File',
// //     'font': 'Font File'
// //   };
  
// //   return `${categoryNames[category] || 'File'} (.${extension})`;
// // };

// // // Format file size for display
// // const formatFileSize = (bytes) => {
// //   if (typeof bytes !== 'number' || bytes === 0) return '0 Bytes';
  
// //   const k = 1024;
// //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
// //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  
// //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// // };

// // // Generate document icons with file type indicators
// // const getDocumentIcon = (file) => {
// //   return new Promise((resolve) => {
// //     const canvas = document.createElement('canvas');
// //     canvas.width = 200;
// //     canvas.height = 200;
// //     const ctx = canvas.getContext('2d');
    
// //     // Background
// //     ctx.fillStyle = '#f5f5f5';
// //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    
// //     // File shape
// //     ctx.fillStyle = '#ffffff';
// //     ctx.beginPath();
// //     ctx.moveTo(40, 50);
// //     ctx.lineTo(160, 50);
// //     ctx.lineTo(160, 150);
// //     ctx.lineTo(40, 150);
// //     ctx.closePath();
// //     ctx.fill();
// //     ctx.strokeStyle = '#e0e0e0';
// //     ctx.lineWidth = 2;
// //     ctx.stroke();
    
// //     // File corner fold
// //     ctx.fillStyle = '#f5f5f5';
// //     ctx.beginPath();
// //     ctx.moveTo(140, 50);
// //     ctx.lineTo(160, 50);
// //     ctx.lineTo(160, 70);
// //     ctx.closePath();
// //     ctx.fill();
    
// //     // Determine icon color and letter based on file type
// //     let iconLetter = 'D';
// //     let iconColor = '#757575';
    
// //     // Detect file type
// //     const fileType = file.type.toLowerCase();
// //     const fileName = file.name.toLowerCase();
    
// //     // Word documents
// //     if (fileType.includes('word') || fileType.includes('document') || 
// //         fileName.endsWith('.doc') || fileName.endsWith('.docx') || 
// //         fileName.endsWith('.rtf')) {
// //       iconLetter = 'W';
// //       iconColor = '#2b579a'; // Word blue
// //     }
// //     // Excel spreadsheets
// //     else if (fileType.includes('excel') || fileType.includes('spreadsheet') || 
// //              fileName.endsWith('.xls') || fileName.endsWith('.xlsx') || 
// //              fileName.endsWith('.csv')) {
// //       iconLetter = 'X';
// //       iconColor = '#217346'; // Excel green
// //     }
// //     // PowerPoint presentations
// //     else if (fileType.includes('powerpoint') || fileType.includes('presentation') || 
// //              fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) {
// //       iconLetter = 'P';
// //       iconColor = '#d24726'; // PowerPoint orange
// //     }
// //     // PDF documents
// //     else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
// //       iconLetter = 'PDF';
// //       iconColor = '#f40f02'; // PDF red
// //     }
// //     // Images
// //     else if (fileType.startsWith('image/')) {
// //       iconLetter = 'IMG';
// //       iconColor = '#9c27b0'; // Purple
// //     }
// //     // Archives
// //     else if (fileType.includes('zip') || fileType.includes('compress') || 
// //              fileName.endsWith('.zip') || fileName.endsWith('.rar') || 
// //              fileName.endsWith('.7z')) {
// //       iconLetter = 'ZIP';
// //       iconColor = '#ff9800'; // Orange
// //     }
    
// //     // Draw icon
// //     ctx.fillStyle = iconColor;
// //     ctx.font = 'bold 24px Arial';
// //     ctx.textAlign = 'center';
// //     ctx.textBaseline = 'middle';
// //     ctx.fillText(iconLetter, 100, 100);
    
// //     // Add file extension below icon
// //     const extension = file.name.split('.').pop().toUpperCase();
// //     ctx.fillStyle = '#616161';
// //     ctx.font = 'bold 12px Arial';
// //     ctx.fillText(`.${extension}`, 100, 130);
    
// //     resolve(canvas.toDataURL('image/png'));
// //   });
// // };

// // // Image processor
// // const getImageData = (file) => {
// //   return new Promise((resolve, reject) => {
// //     const reader = new FileReader();
    
// //     reader.onload = (e) => {
// //       const img = new Image();
// //       img.crossOrigin = 'Anonymous';
// //       img.src = e.target.result;
      
// //       img.onload = () => {
// //         const canvas = document.createElement('canvas');
// //         const ctx = canvas.getContext('2d');
// //         canvas.width = img.width;
// //         canvas.height = img.height;
        
// //         // Fill background for transparent images
// //         ctx.fillStyle = '#FFFFFF';
// //         ctx.fillRect(0, 0, canvas.width, canvas.height);
// //         ctx.drawImage(img, 0, 0);
        
// //         // Convert to PNG
// //         const dataURL = canvas.toDataURL('image/png');
        
// //         resolve({
// //           name: file.name,
// //           type: file.type,
// //           friendlyType: getFriendlyFileType(file),
// //           data: dataURL,
// //           width: img.width,
// //           height: img.height,
// //           size: formatFileSize(file.size),
// //           lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
// //         });
// //       };
      
// //       img.onerror = (err) => {
// //         reject(new Error('Image loading failed: ' + err.message));
// //       };
// //     };
    
// //     reader.onerror = () => {
// //       reject(new Error('File reading failed'));
// //     };
    
// //     reader.readAsDataURL(file);
// //   });
// // };

// // // PDF to Image Converter
// // const getPdfPreview = (file) => {
// //   return new Promise(async (resolve, reject) => {
// //     try {
// //       // Dynamically import PDF.js to reduce bundle size
// //       const pdfjsLib = await import('pdfjs-dist/build/pdf');
// //       const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
// //       pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// //       const arrayBuffer = await file.arrayBuffer();
// //       const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
// //       const page = await pdf.getPage(1);
      
// //       // Set scale for better resolution
// //       const viewport = page.getViewport({ scale: 1.5 });
// //       const canvas = document.createElement('canvas');
// //       const ctx = canvas.getContext('2d');
// //       canvas.width = viewport.width;
// //       canvas.height = viewport.height;

// //       // Render PDF page to canvas
// //       await page.render({
// //         canvasContext: ctx,
// //         viewport: viewport
// //       }).promise;

// //       // Convert to PNG
// //       const dataURL = canvas.toDataURL('image/png');
      
// //       resolve({
// //         name: file.name,
// //         type: file.type,
// //         friendlyType: getFriendlyFileType(file),
// //         data: dataURL,
// //         width: viewport.width,
// //         height: viewport.height,
// //         size: formatFileSize(file.size),
// //         lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
// //       });
// //     } catch (error) {
// //       reject(new Error(`PDF processing failed: ${error.message}`));
// //     }
// //   });
// // };
// // import jsPDF from 'jspdf';
// // import autoTable from 'jspdf-autotable';
// // import axios from 'axios'; // Added import for axios

// // export const generateQuotationPdf = async (quotationData) => {
// //   const doc = new jsPDF();
// //   const { 
// //     frontPage, 
// //     backPage, 
// //     attachments,
// //     customerName,
// //     projectName,
// //     date,
// //     items,
// //     subtotal,
// //     discount,
// //     tax,
// //     totalAmount
// //   } = quotationData;

// //   // Front Page
// //   if (frontPage) {
// //     doc.setFontSize(22);
// //     doc.text(frontPage.title || 'QUOTATION', 105, 40, { align: 'center' });
// //     doc.setFontSize(12);
    
// //     const frontContentLines = doc.splitTextToSize(
// //       frontPage.content || `Prepared for: ${customerName}`,
// //       180
// //     );
    
// //     let yPosition = 60;
// //     frontContentLines.forEach(line => {
// //       doc.text(line, 105, yPosition, { align: 'center' });
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are more sections
// //     if (items.length > 0 || backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Main Content
// //   if (items.length > 0) {
// //     doc.setFontSize(18);
// //     doc.text('QUOTATION DETAILS', 105, 20, { align: 'center' });
    
// //     doc.setFontSize(12);
// //     doc.text(`Customer: ${customerName}`, 15, 30);
// //     doc.text(`Project: ${projectName}`, 15, 40);
// //     doc.text(`Date: ${date}`, 15, 50);
    
// //     autoTable(doc, {
// //       startY: 60,
// //       head: [['Item', 'Qty', 'Unit Price', 'Total']],
// //       body: items.map(item => [
// //         item.name,
// //         item.qty,
// //         `$${item.price.toFixed(2)}`,
// //         `$${(item.qty * item.price).toFixed(2)}`
// //       ]),
// //       styles: { fontSize: 10 },
// //       headStyles: { fillColor: [41, 128, 185] }
// //     });
    
// //     // Summary
// //     const finalY = doc.lastAutoTable.finalY + 10;
// //     doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, finalY);
// //     doc.text(`Discount: $${discount.toFixed(2)}`, 150, finalY + 10);
// //     doc.text(`Tax: $${tax.toFixed(2)}`, 150, finalY + 20);
// //     doc.text(`Total: $${totalAmount.toFixed(2)}`, 150, finalY + 30);
    
// //     // Add page if there are more sections
// //     if (backPage || attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Back Page
// //   if (backPage) {
// //     doc.setFontSize(16);
// //     doc.text(backPage.title || 'TERMS & CONDITIONS', 105, 30, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     const backContentLines = doc.splitTextToSize(
// //       backPage.content || 'Standard terms and conditions apply.',
// //       180
// //     );
    
// //     let yPosition = 50;
// //     backContentLines.forEach(line => {
// //       doc.text(line, 15, yPosition);
// //       yPosition += 7;
// //     });
    
// //     // Add page only if there are attachments
// //     if (attachments.length > 0) {
// //       doc.addPage();
// //     }
// //   }

// //   // Enhanced Attachments Section
// //   if (attachments.length > 0) {
// //     doc.setFontSize(16);
// //     doc.text('ATTACHMENTS', 105, 20, { align: 'center' });
// //     doc.setFontSize(10);
    
// //     let yPosition = 40;
// //     const pageHeight = 297; // A4 height in mm
// //     const margin = 15; // Page margins
    
// //     // Introduction text
// //     doc.text('The following documents are included with this quotation:', 15, 30);
    
// //     attachments.forEach((file, index) => {
// //       // Page break check
// //       if (yPosition > pageHeight - 30) {
// //         doc.addPage();
// //         yPosition = 20;
// //         doc.setFontSize(10);
// //       }
      
// //       // File header
// //       doc.setFontSize(12);
// //       doc.setTextColor(41, 128, 185);
// //       doc.text(`${index + 1}. ${file.name} (${file.friendlyType})`, margin, yPosition);
// //       doc.setFontSize(10);
// //       doc.setTextColor(0, 0, 0);
// //       yPosition += 8;
      
// //       // File metadata
// //       doc.text(`Size: ${file.size || 'N/A'} | Uploaded: ${file.lastModified || 'N/A'}`, margin, yPosition);
// //       yPosition += 8;
      
// //       // Preview handling
// //       if (file.data) {
// //         // Image/PDF preview
// //         const aspectRatio = file.width / file.height;
// //         const maxWidth = 180; // Max width in mm
// //         const maxHeight = 150; // Max height in mm
        
// //         // Calculate display dimensions
// //         let imgWidth = maxWidth;
// //         let imgHeight = maxWidth / aspectRatio;
        
// //         // Adjust if height exceeds limit
// //         if (imgHeight > maxHeight) {
// //           imgHeight = maxHeight;
// //           imgWidth = maxHeight * aspectRatio;
// //         }
        
// //         // Check if image fits on page
// //         if (yPosition + imgHeight > pageHeight - margin) {
// //           doc.addPage();
// //           yPosition = 20;
// //           doc.setFontSize(10);
// //         }
        
// //         try {
// //           // Add image to PDF
// //           doc.addImage(
// //             file.data,
// //             'PNG',
// //             margin,
// //             yPosition,
// //             imgWidth,
// //             imgHeight
// //           );
          
// //           // Update position
// //           yPosition += imgHeight + 5;
// //         } catch (error) {
// //           doc.text(`(Preview rendering failed: ${error.message})`, margin, yPosition);
// //           yPosition += 10;
// //         }
// //       } 
// //       else if (file.icon) {
// //         // Document icon preview
// //         const iconSize = 20; // mm
        
// //         // Check if icon fits on page
// //         if (yPosition + iconSize > pageHeight - margin) {
// //           doc.addPage();
// //           yPosition = 20;
// //           doc.setFontSize(10);
// //         }
        
// //         // Add document icon
// //         doc.addImage(
// //           file.icon,
// //           'PNG',
// //           margin,
// //           yPosition,
// //           iconSize,
// //           iconSize
// //         );
        
// //         // Add file info next to icon
// //         doc.text(`File type: ${file.friendlyType}`, margin + iconSize + 5, yPosition + 5);
// //         doc.text(`Size: ${file.size || 'N/A'}`, margin + iconSize + 5, yPosition + 10);
        
// //         // Update position
// //         yPosition += iconSize + 5;
// //       } 
// //       else {
// //         // Unsupported type
// //         doc.text(`(Preview not available for this file type)`, margin, yPosition);
// //         yPosition += 10;
// //       }
      
// //       // Add separator
// //       doc.line(margin, yPosition, 200 - margin, yPosition);
// //       yPosition += 15;
// //     });
// //   }

// //   // Convert PDF to Blob
// //   const pdfBlob = doc.output('blob');
  
// //   // Create FormData to send PDF to server
// //   const formData = new FormData();
// //   formData.append('pdf', pdfBlob, `quotation-${customerName}-${Date.now()}.pdf`);

// //   try {
// //     // Send PDF to server
// //     const response = await axios.post('/api/v1/quotations/save_pdf', formData, {
// //       headers: {
// //         'Content-Type': 'multipart/form-data',
// //       },
// //     });
// //     console.log("pdf data",response);

// //     // Return both the file path and the PDF Blob
// //     return {
// //       filePath: response.data.file_Path, // Assuming server returns { filePath: '/path/to/pdf' }
// //       pdfBlob: pdfBlob,
// //     };
// //   } catch (error) {
// //     console.error('Error saving PDF to server:', error);
// //     throw new Error('Failed to save PDF to server');
// //   }
// // };

// // // Unified file processor with enhanced document support
// // export const processFileAttachments = async (files) => {
// //   const processedAttachments = [];

// //   for (const file of files) {
// //     try {
// //       if (file.type.startsWith('image/')) {
// //         const processed = await getImageData(file);
// //         processedAttachments.push(processed);
// //       } 
// //       else if (file.type === 'application/pdf') {
// //         const processed = await getPdfPreview(file);
// //         processedAttachments.push(processed);
// //       }
// //       else {
// //         // Handle all other file types with enhanced document icons
// //         const processed = await createDocumentIconPreview(file);
// //         processedAttachments.push(processed);
// //       }
// //     } catch (error) {
// //       console.error(`Error processing ${file.name}:`, error);
// //       processedAttachments.push({
// //         name: file.name,
// //         type: file.type,
// //         friendlyType: getFriendlyFileType(file),
// //         data: null,
// //         icon: null,
// //         width: 0,
// //         height: 0,
// //         size: formatFileSize(file.size),
// //         lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A',
// //         error: error.message
// //       });
// //     }
// //   }

// //   return processedAttachments;
// // };

// // // Create enhanced document icon preview
// // const createDocumentIconPreview = async (file) => {
// //   const icon = await getDocumentIcon(file);
  
// //   return {
// //     name: file.name,
// //     type: file.type,
// //     friendlyType: getFriendlyFileType(file),
// //     icon: icon,
// //     width: 100,
// //     height: 100,
// //     size: formatFileSize(file.size),
// //     lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
// //   };
// // };

// // // Get user-friendly file type names
// // const getFriendlyFileType = (file) => {
// //   const typeMap = {
// //     // Word Documents
// //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Microsoft Word',
// //     'application/msword': 'Microsoft Word (Legacy)',
// //     'application/rtf': 'Rich Text Document',
    
// //     // Excel Spreadsheets
// //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Microsoft Excel',
// //     'application/vnd.ms-excel': 'Microsoft Excel (Legacy)',
// //     'application/vnd.ms-excel.sheet.macroEnabled.12': 'Excel Macro-Enabled Workbook',
// //     'text/csv': 'CSV Spreadsheet',
    
// //     // PowerPoint Presentations
// //     'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'Microsoft PowerPoint',
// //     'application/vnd.ms-powerpoint': 'Microsoft PowerPoint (Legacy)',
    
// //     // PDF
// //     'application/pdf': 'PDF Document',
    
// //     // Images
// //     'image/jpeg': 'JPEG Image',
// //     'image/png': 'PNG Image',
// //     'image/gif': 'GIF Image',
// //     'image/svg+xml': 'SVG Image',
// //     'image/webp': 'WebP Image',
    
// //     // Archives
// //     'application/zip': 'ZIP Archive',
// //     'application/x-zip-compressed': 'Compressed Folder',
// //     'application/x-rar-compressed': 'RAR Archive',
// //     'application/x-7z-compressed': '7-Zip Archive',
    
// //     // Other common types
// //     'text/plain': 'Text File',
// //     'application/json': 'JSON File',
// //     'application/javascript': 'JavaScript File',
// //     'text/html': 'HTML Document'
// //   };

// //   // Get specific type from map
// //   if (typeMap[file.type]) {
// //     return typeMap[file.type];
// //   }
  
// //   // Fallback to general category
// //   const category = file.type.split('/')[0];
// //   const extension = file.name.split('.').pop().toUpperCase();
  
// //   const categoryNames = {
// //     'application': 'Application',
// //     'text': 'Text Document',
// //     'audio': 'Audio File',
// //     'video': 'Video File',
// //     'font': 'Font File'
// //   };
  
// //   return `${categoryNames[category] || 'File'} (.${extension})`;
// // };

// // // Format file size for display
// // const formatFileSize = (bytes) => {
// //   if (typeof bytes !== 'number' || bytes === 0) return '0 Bytes';
  
// //   const k = 1024;
// //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
// //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  
// //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// // };

// // // Generate document icons with file type indicators
// // const getDocumentIcon = (file) => {
// //   return new Promise((resolve) => {
// //     const canvas = document.createElement('canvas');
// //     canvas.width = 200;
// //     canvas.height = 200;
// //     const ctx = canvas.getContext('2d');
    
// //     // Background
// //     ctx.fillStyle = '#f5f5f5';
// //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    
// //     // File shape
// //     ctx.fillStyle = '#ffffff';
// //     ctx.beginPath();
// //     ctx.moveTo(40, 50);
// //     ctx.lineTo(160, 50);
// //     ctx.lineTo(160, 150);
// //     ctx.lineTo(40, 150);
// //     ctx.closePath();
// //     ctx.fill();
// //     ctx.strokeStyle = '#e0e0e0';
// //     ctx.lineWidth = 2;
// //     ctx.stroke();
    
// //     // File corner fold
// //     ctx.fillStyle = '#f5f5f5';
// //     ctx.beginPath();
// //     ctx.moveTo(140, 50);
// //     ctx.lineTo(160, 50);
// //     ctx.lineTo(160, 70);
// //     ctx.closePath();
// //     ctx.fill();
    
// //     // Determine icon color and letter based on file type
// //     let iconLetter = 'D';
// //     let iconColor = '#757575';
    
// //     // Detect file type
// //     const fileType = file.type.toLowerCase();
// //     const fileName = file.name.toLowerCase();
    
// //     // Word documents
// //     if (fileType.includes('word') || fileType.includes('document') || 
// //         fileName.endsWith('.doc') || fileName.endsWith('.docx') || 
// //         fileName.endsWith('.rtf')) {
// //       iconLetter = 'W';
// //       iconColor = '#2b579a'; // Word blue
// //     }
// //     // Excel spreadsheets
// //     else if (fileType.includes('excel') || fileType.includes('spreadsheet') || 
// //              fileName.endsWith('.xls') || fileName.endsWith('.xlsx') || 
// //              fileName.endsWith('.csv')) {
// //       iconLetter = 'X';
// //       iconColor = '#217346'; // Excel green
// //     }
// //     // PowerPoint presentations
// //     else if (fileType.includes('powerpoint') || fileType.includes('presentation') || 
// //              fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) {
// //       iconLetter = 'P';
// //       iconColor = '#d24726'; // PowerPoint orange
// //     }
// //     // PDF documents
// //     else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
// //       iconLetter = 'PDF';
// //       iconColor = '#f40f02'; // PDF red
// //     }
// //     // Images
// //     else if (fileType.startsWith('image/')) {
// //       iconLetter = 'IMG';
// //       iconColor = '#9c27b0'; // Purple
// //     }
// //     // Archives
// //     else if (fileType.includes('zip') || fileType.includes('compress') || 
// //              fileName.endsWith('.zip') || fileName.endsWith('.rar') || 
// //              fileName.endsWith('.7z')) {
// //       iconLetter = 'ZIP';
// //       iconColor = '#ff9800'; // Orange
// //     }
    
// //     // Draw icon
// //     ctx.fillStyle = iconColor;
// //     ctx.font = 'bold 24px Arial';
// //     ctx.textAlign = 'center';
// //     ctx.textBaseline = 'middle';
// //     ctx.fillText(iconLetter, 100, 100);
    
// //     // Add file extension below icon
// //     const extension = file.name.split('.').pop().toUpperCase();
// //     ctx.fillStyle = '#616161';
// //     ctx.font = 'bold 12px Arial';
// //     ctx.fillText(`.${extension}`, 100, 130);
    
// //     resolve(canvas.toDataURL('image/png'));
// //   });
// // };

// // // Image processor
// // const getImageData = (file) => {
// //   return new Promise((resolve, reject) => {
// //     const reader = new FileReader();
    
// //     reader.onload = (e) => {
// //       const img = new Image();
// //       img.crossOrigin = 'Anonymous';
// //       img.src = e.target.result;
      
// //       img.onload = () => {
// //         const canvas = document.createElement('canvas');
// //         const ctx = canvas.getContext('2d');
// //         canvas.width = img.width;
// //         canvas.height = img.height;
        
// //         // Fill background for transparent images
// //         ctx.fillStyle = '#FFFFFF';
// //         ctx.fillRect(0, 0, canvas.width, canvas.height);
// //         ctx.drawImage(img, 0, 0);
        
// //         // Convert to PNG
// //         const dataURL = canvas.toDataURL('image/png');
        
// //         resolve({
// //           name: file.name,
// //           type: file.type,
// //           friendlyType: getFriendlyFileType(file),
// //           data: dataURL,
// //           width: img.width,
// //           height: img.height,
// //           size: formatFileSize(file.size),
// //           lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
// //         });
// //       };
      
// //       img.onerror = (err) => {
// //         reject(new Error('Image loading failed: ' + err.message));
// //       };
// //     };
    
// //     reader.onerror = () => {
// //       reject(new Error('File reading failed'));
// //     };
    
// //     reader.readAsDataURL(file);
// //   });
// // };

// // // PDF to Image Converter
// // const getPdfPreview = (file) => {
// //   return new Promise(async (resolve, reject) => {
// //     try {
// //       // Dynamically import PDF.js to reduce bundle size
// //       const pdfjsLib = await import('pdfjs-dist/build/pdf');
// //       const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
// //       pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// //       const arrayBuffer = await file.arrayBuffer();
// //       const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
// //       const page = await pdf.getPage(1);
      
// //       // Set scale for better resolution
// //       const viewport = page.getViewport({ scale: 1.5 });
// //       const canvas = document.createElement('canvas');
// //       const ctx = canvas.getContext('2d');
// //       canvas.width = viewport.width;
// //       canvas.height = viewport.height;

// //       // Render PDF page to canvas
// //       await page.render({
// //         canvasContext: ctx,
// //         viewport: viewport
// //       }).promise;

// //       // Convert to PNG
// //       const dataURL = canvas.toDataURL('image/png');
      
// //       resolve({
// //         name: file.name,
// //         type: file.type,
// //         friendlyType: getFriendlyFileType(file),
// //         data: dataURL,
// //         width: viewport.width,
// //         height: viewport.height,
// //         size: formatFileSize(file.size),
// //         lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
// //       });
// //     } catch (error) {
// //       reject(new Error(`PDF processing failed: ${error.message}`));
// //     }
// //   });
// // };
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import axios from 'axios';

// export const generateQuotationPdf = async (quotationData) => {
//   const doc = new jsPDF();
//   const { 
//     frontPage, 
//     backPage, 
//     attachments,
//     customerName,
//     projectName,
//     date,
//     items,
//     subtotal,
//     discount,
//     tax,
//     totalAmount
//   } = quotationData;

//   // Front Page
//   if (frontPage) {
//     doc.setFontSize(22);
//     doc.text(frontPage.title || 'QUOTATION', 105, 40, { align: 'center' });
//     doc.setFontSize(12);
    
//     const frontContentLines = doc.splitTextToSize(
//       frontPage.content || `Prepared for: ${customerName}`,
//       180
//     );
    
//     let yPosition = 60;
//     frontContentLines.forEach(line => {
//       doc.text(line, 105, yPosition, { align: 'center' });
//       yPosition += 7;
//     });
    
//     // Add page only if there are more sections
//     if (items.length > 0 || backPage || attachments.length > 0) {
//       doc.addPage();
//     }
//   }

//   // Main Content
//   if (items.length > 0) {
//     doc.setFontSize(18);
//     doc.text('QUOTATION DETAILS', 105, 20, { align: 'center' });
    
//     doc.setFontSize(12);
//     doc.text(`Customer: ${customerName}`, 15, 30);
//     doc.text(`Project: ${projectName}`, 15, 40);
//     doc.text(`Date: ${date}`, 15, 50);
    
//     autoTable(doc, {
//       startY: 60,
//       head: [['Item', 'Qty', 'Unit Price', 'Total']],
//       body: items.map(item => [
//         item.name,
//         item.qty,
//         `$${item.price.toFixed(2)}`,
//         `$${(item.qty * item.price).toFixed(2)}`
//       ]),
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [41, 128, 185] }
//     });
    
//     // Summary
//     const finalY = doc.lastAutoTable.finalY + 10;
//     doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, finalY);
//     doc.text(`Discount: $${discount.toFixed(2)}`, 150, finalY + 10);
//     doc.text(`Tax: $${tax.toFixed(2)}`, 150, finalY + 20);
//     doc.text(`Total: $${totalAmount.toFixed(2)}`, 150, finalY + 30);
    
//     // Add page if there are more sections
//     if (backPage || attachments.length > 0) {
//       doc.addPage();
//     }
//   }

//   // Back Page
//   if (backPage) {
//     doc.setFontSize(16);
//     doc.text(backPage.title || 'TERMS & CONDITIONS', 105, 30, { align: 'center' });
//     doc.setFontSize(10);
    
//     const backContentLines = doc.splitTextToSize(
//       backPage.content || 'Standard terms and conditions apply.',
//       180
//     );
    
//     let yPosition = 50;
//     backContentLines.forEach(line => {
//       doc.text(line, 15, yPosition);
//       yPosition += 7;
//     });
    
//     // Add page only if there are attachments
//     if (attachments.length > 0) {
//       doc.addPage();
//     }
//   }

//   // Enhanced Attachments Section
//   if (attachments.length > 0) {
//     doc.setFontSize(16);
//     doc.text('ATTACHMENTS', 105, 20, { align: 'center' });
//     doc.setFontSize(10);
    
//     let yPosition = 40;
//     const pageHeight = 297; // A4 height in mm
//     const margin = 15; // Page margins
    
//     // Introduction text
//     doc.text('The following documents are included with this quotation:', 15, 30);
    
//     attachments.forEach((file, index) => {
//       // Page break check
//       if (yPosition > pageHeight - 30) {
//         doc.addPage();
//         yPosition = 20;
//         doc.setFontSize(10);
//       }
      
//       // File header
//       doc.setFontSize(12);
//       doc.setTextColor(41, 128, 185);
//       doc.text(`${index + 1}. ${file.name} (${file.friendlyType})`, margin, yPosition);
//       doc.setFontSize(10);
//       doc.setTextColor(0, 0, 0);
//       yPosition += 8;
      
//       // File metadata
//       doc.text(`Size: ${file.size || 'N/A'} | Uploaded: ${file.lastModified || 'N/A'}`, margin, yPosition);
//       yPosition += 8;
      
//       // Preview handling
//       if (file.data) {
//         // Image/PDF preview
//         const aspectRatio = file.width / file.height;
//         const maxWidth = 180; // Max width in mm
//         const maxHeight = 150; // Max height in mm
        
//         // Calculate display dimensions
//         let imgWidth = maxWidth;
//         let imgHeight = maxWidth / aspectRatio;
        
//         // Adjust if height exceeds limit
//         if (imgHeight > maxHeight) {
//           imgHeight = maxHeight;
//           imgWidth = maxHeight * aspectRatio;
//         }
        
//         // Check if image fits on page
//         if (yPosition + imgHeight > pageHeight - margin) {
//           doc.addPage();
//           yPosition = 20;
//           doc.setFontSize(10);
//         }
        
//         try {
//           // Add image to PDF
//           doc.addImage(
//             file.data,
//             'PNG',
//             margin,
//             yPosition,
//             imgWidth,
//             imgHeight
//           );
          
//           // Update position
//           yPosition += imgHeight + 5;
//         } catch (error) {
//           doc.text(`(Preview rendering failed: ${error.message})`, margin, yPosition);
//           yPosition += 10;
//         }
//       } 
//       else if (file.icon) {
//         // Document icon preview
//         const iconSize = 20; // mm
        
//         // Check if icon fits on page
//         if (yPosition + iconSize > pageHeight - margin) {
//           doc.addPage();
//           yPosition = 20;
//           doc.setFontSize(10);
//         }
        
//         // Add document icon
//         doc.addImage(
//           file.icon,
//           'PNG',
//           margin,
//           yPosition,
//           iconSize,
//           iconSize
//         );
        
//         // Add file info next to icon
//         doc.text(`File type: ${file.friendlyType}`, margin + iconSize + 5, yPosition + 5);
//         doc.text(`Size: ${file.size || 'N/A'}`, margin + iconSize + 5, yPosition + 10);
        
//         // Update position
//         yPosition += iconSize + 5;
//       } 
//       else {
//         // Unsupported type
//         doc.text(`(Preview not available for this file type)`, margin, yPosition);
//         yPosition += 10;
//       }
      
//       // Add separator
//       doc.line(margin, yPosition, 200 - margin, yPosition);
//       yPosition += 15;
//     });
//   }

//   // Convert PDF to Blob
//   const pdfBlob = doc.output('blob');
  
//   // Create FormData to send PDF to server
//   const formData = new FormData();
//   const sanitizedCustomerName = customerName.replace(/[^a-zA-Z0-9]/g, '-');
//   const filename = `quotation-${sanitizedCustomerName}-${Date.now()}.pdf`;
//   formData.append('pdf', pdfBlob, filename);

//   try {
//     // Send PDF to server
//     console.log('Sending PDF to /api/v1/quotations/save_pdf with filename:', filename);
//     const response = await axios.post('/api/v1/quotations/save_pdf', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     // Log the actual server response
//     console.log('PDF save response:', response.data);

//     // Verify response contains file_path
//     if (!response.data.file_path) {
//       throw new Error('Server response missing file_path');
//     }

//     // Return both the file path and the PDF Blob
//     return {
//       filePath: response.data.file_path, // Use file_path as returned by Laravel
//       pdfBlob,
//     };
//   } catch (error) {
//     console.error('Error saving PDF to server:', error);
//     throw new Error(`Failed to save PDF to server: ${error.message}`);
//   }
// };

// // Unified file processor with enhanced document support
// export const processFileAttachments = async (files) => {
//   const processedAttachments = [];

//   for (const file of files) {
//     try {
//       if (file.type.startsWith('image/')) {
//         const processed = await getImageData(file);
//         processedAttachments.push(processed);
//       } 
//       else if (file.type === 'application/pdf') {
//         const processed = await getPdfPreview(file);
//         processedAttachments.push(processed);
//       }
//       else {
//         // Handle all other file types with enhanced document icons
//         const processed = await createDocumentIconPreview(file);
//         processedAttachments.push(processed);
//       }
//     } catch (error) {
//       console.error(`Error processing ${file.name}:`, error);
//       processedAttachments.push({
//         name: file.name,
//         type: file.type,
//         friendlyType: getFriendlyFileType(file),
//         data: null,
//         icon: null,
//         width: 0,
//         height: 0,
//         size: formatFileSize(file.size),
//         lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A',
//         error: error.message
//       });
//     }
//   }

//   return processedAttachments;
// };

// // Create enhanced document icon preview
// const createDocumentIconPreview = async (file) => {
//   const icon = await getDocumentIcon(file);
  
//   return {
//     name: file.name,
//     type: file.type,
//     friendlyType: getFriendlyFileType(file),
//     icon: icon,
//     width: 100,
//     height: 100,
//     size: formatFileSize(file.size),
//     lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
//   };
// };

// // Get user-friendly file type names
// const getFriendlyFileType = (file) => {
//   const typeMap = {
//     // Word Documents
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Microsoft Word',
//     'application/msword': 'Microsoft Word (Legacy)',
//     'application/rtf': 'Rich Text Document',
    
//     // Excel Spreadsheets
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Microsoft Excel',
//     'application/vnd.ms-excel': 'Microsoft Excel (Legacy)',
//     'application/vnd.ms-excel.sheet.macroEnabled.12': 'Excel Macro-Enabled Workbook',
//     'text/csv': 'CSV Spreadsheet',
    
//     // PowerPoint Presentations
//     'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'Microsoft PowerPoint',
//     'application/vnd.ms-powerpoint': 'Microsoft PowerPoint (Legacy)',
    
//     // PDF
//     'application/pdf': 'PDF Document',
    
//     // Images
//     'image/jpeg': 'JPEG Image',
//     'image/png': 'PNG Image',
//     'image/gif': 'GIF Image',
//     'image/svg+xml': 'SVG Image',
//     'image/webp': 'WebP Image',
    
//     // Archives
//     'application/zip': 'ZIP Archive',
//     'application/x-zip-compressed': 'Compressed Folder',
//     'application/x-rar-compressed': 'RAR Archive',
//     'application/x-7z-compressed': '7-Zip Archive',
    
//     // Other common types
//     'text/plain': 'Text File',
//     'application/json': 'JSON File',
//     'application/javascript': 'JavaScript File',
//     'text/html': 'HTML Document'
//   };

//   // Get specific type from map
//   if (typeMap[file.type]) {
//     return typeMap[file.type];
//   }
  
//   // Fallback to general category
//   const category = file.type.split('/')[0];
//   const extension = file.name.split('.').pop().toUpperCase();
  
//   const categoryNames = {
//     'application': 'Application',
//     'text': 'Text Document',
//     'audio': 'Audio File',
//     'video': 'Video File',
//     'font': 'Font File'
//   };
  
//   return `${categoryNames[category] || 'File'} (.${extension})`;
// };

// // Format file size for display
// const formatFileSize = (bytes) => {
//   if (typeof bytes !== 'number' || bytes === 0) return '0 Bytes';
  
//   const k = 1024;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
  
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// };

// // Generate document icons with file type indicators
// const getDocumentIcon = (file) => {
//   return new Promise((resolve) => {
//     const canvas = document.createElement('canvas');
//     canvas.width = 200;
//     canvas.height = 200;
//     const ctx = canvas.getContext('2d');
    
//     // Background
//     ctx.fillStyle = '#f5f5f5';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
    
//     // File shape
//     ctx.fillStyle = '#ffffff';
//     ctx.beginPath();
//     ctx.moveTo(40, 50);
//     ctx.lineTo(160, 50);
//     ctx.lineTo(160, 150);
//     ctx.lineTo(40, 150);
//     ctx.closePath();
//     ctx.fill();
//     ctx.strokeStyle = '#e0e0e0';
//     ctx.lineWidth = 2;
//     ctx.stroke();
    
//     // File corner fold
//     ctx.fillStyle = '#f5f5f5';
//     ctx.beginPath();
//     ctx.moveTo(140, 50);
//     ctx.lineTo(160, 50);
//     ctx.lineTo(160, 70);
//     ctx.closePath();
//     ctx.fill();
    
//     // Determine icon color and letter based on file type
//     let iconLetter = 'D';
//     let iconColor = '#757575';
    
//     // Detect file type
//     const fileType = file.type.toLowerCase();
//     const fileName = file.name.toLowerCase();
    
//     // Word documents
//     if (fileType.includes('word') || fileType.includes('document') || 
//         fileName.endsWith('.doc') || fileName.endsWith('.docx') || 
//         fileName.endsWith('.rtf')) {
//       iconLetter = 'W';
//       iconColor = '#2b579a'; // Word blue
//     }
//     // Excel spreadsheets
//     else if (fileType.includes('excel') || fileType.includes('spreadsheet') || 
//              fileName.endsWith('.xls') || fileName.endsWith('.xlsx') || 
//              fileName.endsWith('.csv')) {
//       iconLetter = 'X';
//       iconColor = '#217346'; // Excel green
//     }
//     // PowerPoint presentations
//     else if (fileType.includes('powerpoint') || fileType.includes('presentation') || 
//              fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) {
//       iconLetter = 'P';
//       iconColor = '#d24726'; // PowerPoint orange
//     }
//     // PDF documents
//     else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
//       iconLetter = 'PDF';
//       iconColor = '#f40f02'; // PDF red
//     }
//     // Images
//     else if (fileType.startsWith('image/')) {
//       iconLetter = 'IMG';
//       iconColor = '#9c27b0'; // Purple
//     }
//     // Archives
//     else if (fileType.includes('zip') || fileType.includes('compress') || 
//              fileName.endsWith('.zip') || fileName.endsWith('.rar') || 
//              fileName.endsWith('.7z')) {
//       iconLetter = 'ZIP';
//       iconColor = '#ff9800'; // Orange
//     }
    
//     // Draw icon
//     ctx.fillStyle = iconColor;
//     ctx.font = 'bold 24px Arial';
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     ctx.fillText(iconLetter, 100, 100);
    
//     // Add file extension below icon
//     const extension = file.name.split('.').pop().toUpperCase();
//     ctx.fillStyle = '#616161';
//     ctx.font = 'bold 12px Arial';
//     ctx.fillText(`.${extension}`, 100, 130);
    
//     resolve(canvas.toDataURL('image/png'));
//   });
// };

// // Image processor
// const getImageData = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
    
//     reader.onload = (e) => {
//       const img = new Image();
//       img.crossOrigin = 'Anonymous';
//       img.src = e.target.result;
      
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
//         canvas.width = img.width;
//         canvas.height = img.height;
        
//         // Fill background for transparent images
//         ctx.fillStyle = '#FFFFFF';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(img, 0, 0);
        
//         // Convert to PNG
//         const dataURL = canvas.toDataURL('image/png');
        
//         resolve({
//           name: file.name,
//           type: file.type,
//           friendlyType: getFriendlyFileType(file),
//           data: dataURL,
//           width: img.width,
//           height: img.height,
//           size: formatFileSize(file.size),
//           lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
//         });
//       };
      
//       img.onerror = (err) => {
//         reject(new Error('Image loading failed: ' + err.message));
//       };
//     };
    
//     reader.onerror = () => {
//       reject(new Error('File reading failed'));
//     };
    
//     reader.readAsDataURL(file);
//   });
// };

// // PDF to Image Converter
// const getPdfPreview = (file) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // Dynamically import PDF.js to reduce bundle size
//       const pdfjsLib = await import('pdfjs-dist/build/pdf');
//       const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
//       pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

//       const arrayBuffer = await file.arrayBuffer();
//       const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
//       const page = await pdf.getPage(1);
      
//       // Set scale for better resolution
//       const viewport = page.getViewport({ scale: 1.5 });
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       canvas.width = viewport.width;
//       canvas.height = viewport.height;

//       // Render PDF page to canvas
//       await page.render({
//         canvasContext: ctx,
//         viewport: viewport
//       }).promise;

//       // Convert to PNG
//       const dataURL = canvas.toDataURL('image/png');
      
//       resolve({
//         name: file.name,
//         type: file.type,
//         friendlyType: getFriendlyFileType(file),
//         data: dataURL,
//         width: viewport.width,
//         height: viewport.height,
//         size: formatFileSize(file.size),
//         lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
//       });
//     } catch (error) {
//       reject(new Error(`PDF processing failed: ${error.message}`));
//     }
//   });
// };

// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import axios from 'axios';

// // Updated to handle multiple pages
// export const generateQuotationPdf = async (quotationData) => {
//   const doc = new jsPDF();
//   const { 
//     frontPages = [], 
//     backPages = [], 
//     attachments = [],
//     customerName,
//     projectName,
//     date,
//     items,
//     subtotal,
//     discount,
//     tax,
//     totalAmount
//   } = quotationData;

//   // Generate Front Pages
//   for (let i = 0; i < frontPages.length; i++) {
//     if (i > 0) doc.addPage();
    
//     const page = frontPages[i];
//     doc.setFontSize(22);
//     doc.text(page.title || 'QUOTATION', 105, 40, { align: 'center' });
//     doc.setFontSize(12);
    
//     const frontContentLines = doc.splitTextToSize(
//       page.content || `Prepared for: ${customerName}`,
//       180
//     );
    
//     let yPosition = 60;
//     frontContentLines.forEach(line => {
//       doc.text(line, 105, yPosition, { align: 'center' });
//       yPosition += 7;
//     });
//   }

//   // Add page only if we have items to show
//   if (items.length > 0) {
//     if (frontPages.length > 0) doc.addPage();
    
//     // Main Content
//     doc.setFontSize(18);
//     doc.text('QUOTATION DETAILS', 105, 20, { align: 'center' });
    
//     doc.setFontSize(12);
//     doc.text(`Customer: ${customerName}`, 15, 30);
//     doc.text(`Project: ${projectName}`, 15, 40);
//     doc.text(`Date: ${date}`, 15, 50);
    
//     // Items Table
//     autoTable(doc, {
//       startY: 60,
//       head: [['Item', 'Qty', 'Unit Price', 'Total']],
//       body: items.map(item => [
//         item.name,
//         item.qty,
//         `$${item.price.toFixed(2)}`,
//         `$${(item.qty * item.price).toFixed(2)}`
//       ]),
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [41, 128, 185] }
//     });
    
//     // Summary
//     const finalY = doc.lastAutoTable.finalY + 10;
//     doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, finalY);
//     doc.text(`Discount: $${discount.toFixed(2)}`, 150, finalY + 10);
//     doc.text(`Tax: $${tax.toFixed(2)}`, 150, finalY + 20);
//     doc.text(`Total: $${totalAmount.toFixed(2)}`, 150, finalY + 30);
//   }

//   // Generate Back Pages
//   for (let i = 0; i < backPages.length; i++) {
//     if (i > 0 || items.length > 0 || frontPages.length > 0) doc.addPage();
    
//     const page = backPages[i];
//     doc.setFontSize(16);
//     doc.text(page.title || 'TERMS & CONDITIONS', 105, 30, { align: 'center' });
//     doc.setFontSize(10);
    
//     const backContentLines = doc.splitTextToSize(
//       page.content || 'Standard terms and conditions apply.',
//       180
//     );
    
//     let yPosition = 50;
//     backContentLines.forEach(line => {
//       doc.text(line, 15, yPosition);
//       yPosition += 7;
//     });
//   }

//   // Attachments Section
//   if (attachments.length > 0) {
//     doc.addPage();
//     doc.setFontSize(16);
//     doc.text('ATTACHMENTS', 105, 20, { align: 'center' });
//     doc.setFontSize(10);
    
//     let yPosition = 40;
//     const pageHeight = 297; // A4 height in mm
//     const margin = 15; // Page margins
    
//     // Introduction text
//     doc.text('The following documents are included with this quotation:', 15, 30);
    
//     attachments.forEach((file, index) => {
//       // Page break check
//       if (yPosition > pageHeight - 30) {
//         doc.addPage();
//         yPosition = 20;
//         doc.setFontSize(10);
//       }
      
//       // File header
//       doc.setFontSize(12);
//       doc.setTextColor(41, 128, 185);
//       doc.text(`${index + 1}. ${file.name} (${file.friendlyType})`, margin, yPosition);
//       doc.setFontSize(10);
//       doc.setTextColor(0, 0, 0);
//       yPosition += 8;
      
//       // File metadata
//       doc.text(`Size: ${file.size || 'N/A'} | Uploaded: ${file.lastModified || 'N/A'}`, margin, yPosition);
//       yPosition += 8;
      
//       // Preview handling
//       if (file.data) {
//         // Image/PDF preview
//         const aspectRatio = file.width / file.height;
//         const maxWidth = 180; // Max width in mm
//         const maxHeight = 150; // Max height in mm
        
//         // Calculate display dimensions
//         let imgWidth = maxWidth;
//         let imgHeight = maxWidth / aspectRatio;
        
//         // Adjust if height exceeds limit
//         if (imgHeight > maxHeight) {
//           imgHeight = maxHeight;
//           imgWidth = maxHeight * aspectRatio;
//         }
        
//         // Check if image fits on page
//         if (yPosition + imgHeight > pageHeight - margin) {
//           doc.addPage();
//           yPosition = 20;
//           doc.setFontSize(10);
//         }
        
//         try {
//           // Add image to PDF
//           doc.addImage(
//             file.data,
//             file.type.startsWith('image/') ? 'JPEG' : 'PNG',
//             margin,
//             yPosition,
//             imgWidth,
//             imgHeight
//           );
          
//           // Update position
//           yPosition += imgHeight + 5;
//         } catch (error) {
//           doc.text(`(Preview rendering failed: ${error.message})`, margin, yPosition);
//           yPosition += 10;
//         }
//       } 
//       else if (file.icon) {
//         // Document icon preview
//         const iconSize = 20; // mm
        
//         // Check if icon fits on page
//         if (yPosition + iconSize > pageHeight - margin) {
//           doc.addPage();
//           yPosition = 20;
//           doc.setFontSize(10);
//         }
        
//         // Add document icon
//         doc.addImage(
//           file.icon,
//           'PNG',
//           margin,
//           yPosition,
//           iconSize,
//           iconSize
//         );
        
//         // Add file info next to icon
//         doc.text(`File type: ${file.friendlyType}`, margin + iconSize + 5, yPosition + 5);
//         doc.text(`Size: ${file.size || 'N/A'}`, margin + iconSize + 5, yPosition + 10);
        
//         // Update position
//         yPosition += iconSize + 5;
//       } 
//       else {
//         // Unsupported type
//         doc.text(`(Preview not available for this file type)`, margin, yPosition);
//         yPosition += 10;
//       }
      
//       // Add separator
//       doc.line(margin, yPosition, 200 - margin, yPosition);
//       yPosition += 15;
//     });
//   }

//   // Convert PDF to Blob
//   const pdfBlob = doc.output('blob');
  
//   // Create FormData to send PDF to server
//   const formData = new FormData();
//   const sanitizedCustomerName = customerName.replace(/[^a-zA-Z0-9]/g, '-');
//   const filename = `quotation-${sanitizedCustomerName}-${Date.now()}.pdf`;
//   formData.append('pdf', pdfBlob, filename);

//   try {
//     // Send PDF to server
//     const response = await axios.post('/api/v1/quotations/save_pdf', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     // Verify response contains file_path
//     if (!response.data.file_path) {
//       throw new Error('Server response missing file_path');
//     }

//     // Return both the file path and the PDF Blob
//     return {
//       filePath: response.data.file_path,
//       pdfBlob,
//     };
//   } catch (error) {
//     console.error('Error saving PDF to server:', error);
//     throw new Error(`Failed to save PDF to server: ${error.message}`);
//   }
// };

// // Enhanced file processor with document icons
// export const processFileAttachments = async (files) => {
//   const processedAttachments = [];

//   for (const file of files) {
//     try {
//       // Handle images
//       if (file.type.startsWith('image/')) {
//         const processed = await getImageData(file);
//         processedAttachments.push(processed);
//       } 
//       // Handle PDFs
//       else if (file.type === 'application/pdf') {
//         const processed = await getPdfPreview(file);
//         processedAttachments.push(processed);
//       }
//       // Handle other file types
//       else {
//         const processed = await createDocumentIconPreview(file);
//         processedAttachments.push(processed);
//       }
//     } catch (error) {
//       console.error(`Error processing ${file.name}:`, error);
//       processedAttachments.push({
//         name: file.name,
//         type: file.type,
//         friendlyType: getFriendlyFileType(file),
//         data: null,
//         icon: null,
//         width: 0,
//         height: 0,
//         size: formatFileSize(file.size),
//         lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A',
//         error: error.message
//       });
//     }
//   }

//   return processedAttachments;
// };

// // Create enhanced document icon preview
// const createDocumentIconPreview = async (file) => {
//   const icon = await getDocumentIcon(file);
  
//   return {
//     name: file.name,
//     type: file.type,
//     friendlyType: getFriendlyFileType(file),
//     icon: icon,
//     width: 100,
//     height: 100,
//     size: formatFileSize(file.size),
//     lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
//   };
// };

// // Get user-friendly file type names
// const getFriendlyFileType = (file) => {
//   const typeMap = {
//     // Word Documents
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Microsoft Word',
//     'application/msword': 'Microsoft Word (Legacy)',
//     'application/rtf': 'Rich Text Document',
    
//     // Excel Spreadsheets
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Microsoft Excel',
//     'application/vnd.ms-excel': 'Microsoft Excel (Legacy)',
//     'application/vnd.ms-excel.sheet.macroEnabled.12': 'Excel Macro-Enabled Workbook',
//     'text/csv': 'CSV Spreadsheet',
    
//     // PowerPoint Presentations
//     'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'Microsoft PowerPoint',
//     'application/vnd.ms-powerpoint': 'Microsoft PowerPoint (Legacy)',
    
//     // PDF
//     'application/pdf': 'PDF Document',
    
//     // Images
//     'image/jpeg': 'JPEG Image',
//     'image/png': 'PNG Image',
//     'image/gif': 'GIF Image',
//     'image/svg+xml': 'SVG Image',
//     'image/webp': 'WebP Image',
    
//     // Archives
//     'application/zip': 'ZIP Archive',
//     'application/x-zip-compressed': 'Compressed Folder',
//     'application/x-rar-compressed': 'RAR Archive',
//     'application/x-7z-compressed': '7-Zip Archive',
    
//     // Other common types
//     'text/plain': 'Text File',
//     'application/json': 'JSON File',
//     'application/javascript': 'JavaScript File',
//     'text/html': 'HTML Document'
//   };

//   // Get specific type from map
//   if (typeMap[file.type]) {
//     return typeMap[file.type];
//   }
  
//   // Fallback to general category
//   const category = file.type.split('/')[0];
//   const extension = file.name.split('.').pop().toUpperCase();
  
//   const categoryNames = {
//     'application': 'Application',
//     'text': 'Text Document',
//     'audio': 'Audio File',
//     'video': 'Video File',
//     'font': 'Font File'
//   };
  
//   return `${categoryNames[category] || 'File'} (.${extension})`;
// };

// // Format file size for display
// const formatFileSize = (bytes) => {
//   if (typeof bytes !== 'number' || bytes === 0) return '0 Bytes';
  
//   const k = 1024;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
  
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// };

// // Generate document icons with file type indicators
// const getDocumentIcon = (file) => {
//   return new Promise((resolve) => {
//     const canvas = document.createElement('canvas');
//     canvas.width = 200;
//     canvas.height = 200;
//     const ctx = canvas.getContext('2d');
    
//     // Background
//     ctx.fillStyle = '#f5f5f5';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
    
//     // File shape
//     ctx.fillStyle = '#ffffff';
//     ctx.beginPath();
//     ctx.moveTo(40, 50);
//     ctx.lineTo(160, 50);
//     ctx.lineTo(160, 150);
//     ctx.lineTo(40, 150);
//     ctx.closePath();
//     ctx.fill();
//     ctx.strokeStyle = '#e0e0e0';
//     ctx.lineWidth = 2;
//     ctx.stroke();
    
//     // File corner fold
//     ctx.fillStyle = '#f5f5f5';
//     ctx.beginPath();
//     ctx.moveTo(140, 50);
//     ctx.lineTo(160, 50);
//     ctx.lineTo(160, 70);
//     ctx.closePath();
//     ctx.fill();
    
//     // Determine icon color and letter based on file type
//     let iconLetter = 'D';
//     let iconColor = '#757575';
    
//     // Detect file type
//     const fileType = file.type.toLowerCase();
//     const fileName = file.name.toLowerCase();
    
//     // Word documents
//     if (fileType.includes('word') || fileType.includes('document') || 
//         fileName.endsWith('.doc') || fileName.endsWith('.docx') || 
//         fileName.endsWith('.rtf')) {
//       iconLetter = 'W';
//       iconColor = '#2b579a'; // Word blue
//     }
//     // Excel spreadsheets
//     else if (fileType.includes('excel') || fileType.includes('spreadsheet') || 
//              fileName.endsWith('.xls') || fileName.endsWith('.xlsx') || 
//              fileName.endsWith('.csv')) {
//       iconLetter = 'X';
//       iconColor = '#217346'; // Excel green
//     }
//     // PowerPoint presentations
//     else if (fileType.includes('powerpoint') || fileType.includes('presentation') || 
//              fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) {
//       iconLetter = 'P';
//       iconColor = '#d24726'; // PowerPoint orange
//     }
//     // PDF documents
//     else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
//       iconLetter = 'PDF';
//       iconColor = '#f40f02'; // PDF red
//     }
//     // Images
//     else if (fileType.startsWith('image/')) {
//       iconLetter = 'IMG';
//       iconColor = '#9c27b0'; // Purple
//     }
//     // Archives
//     else if (fileType.includes('zip') || fileType.includes('compress') || 
//              fileName.endsWith('.zip') || fileName.endsWith('.rar') || 
//              fileName.endsWith('.7z')) {
//       iconLetter = 'ZIP';
//       iconColor = '#ff9800'; // Orange
//     }
    
//     // Draw icon
//     ctx.fillStyle = iconColor;
//     ctx.font = 'bold 24px Arial';
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     ctx.fillText(iconLetter, 100, 100);
    
//     // Add file extension below icon
//     const extension = file.name.split('.').pop().toUpperCase();
//     ctx.fillStyle = '#616161';
//     ctx.font = 'bold 12px Arial';
//     ctx.fillText(`.${extension}`, 100, 130);
    
//     resolve(canvas.toDataURL('image/png'));
//   });
// };

// // Image processor
// const getImageData = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
    
//     reader.onload = (e) => {
//       const img = new Image();
//       img.crossOrigin = 'Anonymous';
//       img.src = e.target.result;
      
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
//         canvas.width = img.width;
//         canvas.height = img.height;
        
//         // Fill background for transparent images
//         ctx.fillStyle = '#FFFFFF';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//         ctx.drawImage(img, 0, 0);
        
//         // Convert to PNG
//         const dataURL = canvas.toDataURL('image/png');
        
//         resolve({
//           name: file.name,
//           type: file.type,
//           friendlyType: getFriendlyFileType(file),
//           data: dataURL,
//           width: img.width,
//           height: img.height,
//           size: formatFileSize(file.size),
//           lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
//         });
//       };
      
//       img.onerror = (err) => {
//         reject(new Error('Image loading failed: ' + err.message));
//       };
//     };
    
//     reader.onerror = () => {
//       reject(new Error('File reading failed'));
//     };
    
//     reader.readAsDataURL(file);
//   });
// };

// // PDF to Image Converter
// const getPdfPreview = (file) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // Dynamically import PDF.js
//       const pdfjsLib = await import('pdfjs-dist/build/pdf');
//       const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
//       pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

//       const arrayBuffer = await file.arrayBuffer();
//       const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
//       const page = await pdf.getPage(1);
      
//       // Set scale for resolution
//       const viewport = page.getViewport({ scale: 1.5 });
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       canvas.width = viewport.width;
//       canvas.height = viewport.height;

//       // Render PDF page to canvas
//       await page.render({
//         canvasContext: ctx,
//         viewport: viewport
//       }).promise;

//       // Convert to PNG
//       const dataURL = canvas.toDataURL('image/png');
      
//       resolve({
//         name: file.name,
//         type: file.type,
//         friendlyType: getFriendlyFileType(file),
//         data: dataURL,
//         width: viewport.width,
//         height: viewport.height,
//         size: formatFileSize(file.size),
//         lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
//       });
//     } catch (error) {
//       reject(new Error(`PDF processing failed: ${error.message}`));
//     }
//   });
// };

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

// Updated to handle multiple pages and their attachments
export const generateQuotationPdf = async (quotationData) => {
  const doc = new jsPDF();
  const { 
    frontPages = [], 
    backPages = [], 
    customerName,
    projectName,
    date,
    items,
    subtotal,
    discount,
    tax,
    totalAmount
  } = quotationData;

  // Process attachments for all pages
  const processPageAttachments = async (pages) => {
    for (let page of pages) {
      if (page.attachments && page.attachments.length > 0) {
        page.attachments = await processFileAttachments(page.attachments);
      }
    }
    return pages;
  };

  // Process front and back page attachments
  const processedFrontPages = await processPageAttachments(frontPages);
  const processedBackPages = await processPageAttachments(backPages);

  // Generate Front Pages
  for (let i = 0; i < processedFrontPages.length; i++) {
    if (i > 0) doc.addPage();
    
    const page = processedFrontPages[i];
    doc.setFontSize(22);
    doc.text(page.title || 'QUOTATION', 105, 40, { align: 'center' });
    doc.setFontSize(12);
    
    const frontContentLines = doc.splitTextToSize(
      page.content || `Prepared for: ${customerName}`,
      180
    );
    
    let yPosition = 60;
    frontContentLines.forEach(line => {
      doc.text(line, 105, yPosition, { align: 'center' });
      yPosition += 7;
    });

    // Add attachments for this page
    if (page.attachments && page.attachments.length > 0) {
      yPosition += 10;
      doc.setFontSize(14);
      doc.text('Attachments', 15, yPosition);
      yPosition += 10;

      const pageHeight = 297; // A4 height in mm
      const margin = 15;

      for (const file of page.attachments) {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
          doc.setFontSize(10);
        }

        // File header
        doc.setFontSize(12);
        doc.setTextColor(41, 128, 185);
        doc.text(`${file.name} (${file.friendlyType})`, margin, yPosition);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;

        // File metadata
        doc.text(`Size: ${file.size || 'N/A'} | Uploaded: ${file.lastModified || 'N/A'}`, margin, yPosition);
        yPosition += 8;

        // Preview handling
        if (file.data) {
          // Image/PDF preview
          const aspectRatio = file.width / file.height;
          const maxWidth = 180;
          const maxHeight = 150;

          let imgWidth = maxWidth;
          let imgHeight = maxWidth / aspectRatio;

          if (imgHeight > maxHeight) {
            imgHeight = maxHeight;
            imgWidth = maxHeight * aspectRatio;
          }

          if (yPosition + imgHeight > pageHeight - margin) {
            doc.addPage();
            yPosition = 20;
            doc.setFontSize(10);
          }

          try {
            doc.addImage(
              file.data,
              file.type.startsWith('image/') ? 'JPEG' : 'PNG',
              margin,
              yPosition,
              imgWidth,
              imgHeight
            );
            yPosition += imgHeight + 5;
          } catch (error) {
            doc.text(`(Preview rendering failed: ${error.message})`, margin, yPosition);
            yPosition += 10;
          }
        } else if (file.icon) {
          const iconSize = 20;
          if (yPosition + iconSize > pageHeight - margin) {
            doc.addPage();
            yPosition = 20;
            doc.setFontSize(10);
          }

          doc.addImage(
            file.icon,
            'PNG',
            margin,
            yPosition,
            iconSize,
            iconSize
          );

          doc.text(`File type: ${file.friendlyType}`, margin + iconSize + 5, yPosition + 5);
          doc.text(`Size: ${file.size || 'N/A'}`, margin + iconSize + 5, yPosition + 10);
          yPosition += iconSize + 5;
        } else {
          doc.text(`(Preview not available for this file type)`, margin, yPosition);
          yPosition += 10;
        }

        doc.line(margin, yPosition, 200 - margin, yPosition);
        yPosition += 15;
      }
    }
  }

  // Add page only if we have items to show
  if (items.length > 0) {
    if (processedFrontPages.length > 0) doc.addPage();
    
    // Main Content
    doc.setFontSize(18);
    doc.text('QUOTATION DETAILS', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Customer: ${customerName}`, 15, 30);
    doc.text(`Project: ${projectName}`, 15, 40);
    doc.text(`Date: ${date}`, 15, 50);
    
    // Items Table
    autoTable(doc, {
      startY: 60,
      head: [['Item', 'Qty', 'Unit Price', 'Total']],
      body: items.map(item => [
        item.name,
        item.qty,
        `$${item.price.toFixed(2)}`,
        `$${(item.qty * item.price).toFixed(2)}`
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    // Summary
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, finalY);
    doc.text(`Discount: $${discount.toFixed(2)}`, 150, finalY + 10);
    doc.text(`Tax: $${tax.toFixed(2)}`, 150, finalY + 20);
    doc.text(`Total: $${totalAmount.toFixed(2)}`, 150, finalY + 30);
  }

  // Generate Back Pages
  for (let i = 0; i < processedBackPages.length; i++) {
    if (i > 0 || items.length > 0 || processedFrontPages.length > 0) doc.addPage();
    
    const page = processedBackPages[i];
    doc.setFontSize(16);
    doc.text(page.title || 'TERMS & CONDITIONS', 105, 30, { align: 'center' });
    doc.setFontSize(10);
    
    const backContentLines = doc.splitTextToSize(
      page.content || 'Standard terms and conditions apply.',
      180
    );
    
    let yPosition = 50;
    backContentLines.forEach(line => {
      doc.text(line, 15, yPosition);
      yPosition += 7;
    });

    // Add attachments for this page
    if (page.attachments && page.attachments.length > 0) {
      yPosition += 10;
      doc.setFontSize(14);
      doc.text('Attachments', 15, yPosition);
      yPosition += 10;

      const pageHeight = 297;
      const margin = 15;

      for (const file of page.attachments) {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
          doc.setFontSize(10);
        }

        doc.setFontSize(12);
        doc.setTextColor(41, 128, 185);
        doc.text(`${file.name} (${file.friendlyType})`, margin, yPosition);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;

        doc.text(`Size: ${file.size || 'N/A'} | Uploaded: ${file.lastModified || 'N/A'}`, margin, yPosition);
        yPosition += 8;

        if (file.data) {
          const aspectRatio = file.width / file.height;
          const maxWidth = 180;
          const maxHeight = 150;

          let imgWidth = maxWidth;
          let imgHeight = maxWidth / aspectRatio;

          if (imgHeight > maxHeight) {
            imgHeight = maxHeight;
            imgWidth = maxHeight * aspectRatio;
          }

          if (yPosition + imgHeight > pageHeight - margin) {
            doc.addPage();
            yPosition = 20;
            doc.setFontSize(10);
          }

          try {
            doc.addImage(
              file.data,
              file.type.startsWith('image/') ? 'JPEG' : 'PNG',
              margin,
              yPosition,
              imgWidth,
              imgHeight
            );
            yPosition += imgHeight + 5;
          } catch (error) {
            doc.text(`(Preview rendering failed: ${error.message})`, margin, yPosition);
            yPosition += 10;
          }
        } else if (file.icon) {
          const iconSize = 20;
          if (yPosition + iconSize > pageHeight - margin) {
            doc.addPage();
            yPosition = 20;
            doc.setFontSize(10);
          }

          doc.addImage(
            file.icon,
            'PNG',
            margin,
            yPosition,
            iconSize,
            iconSize
          );

          doc.text(`File type: ${file.friendlyType}`, margin + iconSize + 5, yPosition + 5);
          doc.text(`Size: ${file.size || 'N/A'}`, margin + iconSize + 5, yPosition + 10);
          yPosition += iconSize + 5;
        } else {
          doc.text(`(Preview not available for this file type)`, margin, yPosition);
          yPosition += 10;
        }

        doc.line(margin, yPosition, 200 - margin, yPosition);
        yPosition += 15;
      }
    }
  }

  // Convert PDF to Blob
  const pdfBlob = doc.output('blob');
  
  // Create FormData to send PDF to server
  const formData = new FormData();
  const sanitizedCustomerName = customerName.replace(/[^a-zA-Z0-9]/g, '-');
  const filename = `quotation-${sanitizedCustomerName}-${Date.now()}.pdf`;
  formData.append('pdf', pdfBlob, filename);

  try {
    // Send PDF to server
    const response = await axios.post('http://localhost:8000/api/v1/quotations/save_pdf',formData, {
    // const response = await axios.post('/api/v1/quotations/save_pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Verify response contains file_path
    if (!response.data.file_path) {
      throw new Error('Server response missing file_path');
    }

    // Return both the file path and the PDF Blob
    return {
      filePath: response.data.file_path,
      pdfBlob,
    };
  } catch (error) {
    console.error('Error saving PDF to server:', error);
    throw new Error(`Failed to save PDF to server: ${error.message}`);
  }
};

// Enhanced file processor with document icons
export const processFileAttachments = async (files) => {
  const processedAttachments = [];

  for (const item of files) {
    try {
      // Check if this is already a processed attachment with data
      if (item.data && item.data.startsWith('data:')) {
        // Already processed, just use it directly
        processedAttachments.push(item);
        continue;
      }

      // Handle images
      if (item.type.startsWith('image/')) {
        const processed = await getImageData(item);
        processedAttachments.push(processed);
      } 
      // Handle PDFs
      else if (item.type === 'application/pdf') {
        const processed = await getPdfPreview(item);
        processedAttachments.push(processed);
      }
      // Handle other file types
      else {
        const processed = await createDocumentIconPreview(item);
        processedAttachments.push(processed);
      }
    } catch (error) {
      console.error(`Error processing ${item.name}:`, error);
      processedAttachments.push({
        name: item.name,
        type: item.type,
        friendlyType: getFriendlyFileType(item),
        data: null,
        icon: null,
        width: 0,
        height: 0,
        size: formatFileSize(item.size),
        lastModified: item.lastModified ? new Date(item.lastModified).toLocaleDateString() : 'N/A',
        error: error.message
      });
    }
  }

  return processedAttachments;
};

// Create enhanced document icon preview
const createDocumentIconPreview = async (file) => {
  const icon = await getDocumentIcon(file);
  
  return {
    name: file.name,
    type: file.type,
    friendlyType: getFriendlyFileType(file),
    icon: icon,
    width: 100,
    height: 100,
    size: formatFileSize(file.size),
    lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
  };
};

// Get user-friendly file type names
const getFriendlyFileType = (file) => {
  const typeMap = {
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Microsoft Word',
    'application/msword': 'Microsoft Word (Legacy)',
    'application/rtf': 'Rich Text Document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Microsoft Excel',
    'application/vnd.ms-excel': 'Microsoft Excel (Legacy)',
    'application/vnd.ms-excel.sheet.macroEnabled.12': 'Excel Macro-Enabled Workbook',
    'text/csv': 'CSV Spreadsheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'Microsoft PowerPoint',
    'application/vnd.ms-powerpoint': 'Microsoft PowerPoint (Legacy)',
    'application/pdf': 'PDF Document',
    'image/jpeg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/gif': 'GIF Image',
    'image/svg+xml': 'SVG Image',
    'image/webp': 'WebP Image',
    'application/zip': 'ZIP Archive',
    'application/x-zip-compressed': 'Compressed Folder',
    'application/x-rar-compressed': 'RAR Archive',
    'application/x-7z-compressed': '7-Zip Archive',
    'text/plain': 'Text File',
    'application/json': 'JSON File',
    'application/javascript': 'JavaScript File',
    'text/html': 'HTML Document'
  };

  if (typeMap[file.type]) {
    return typeMap[file.type];
  }

  const category = file.type.split('/')[0];
  const extension = file.name.split('.').pop().toUpperCase();

  const categoryNames = {
    'application': 'Application',
    'text': 'Text Document',
    'audio': 'Audio File',
    'video': 'Video File',
    'font': 'Font File'
  };

  return `${categoryNames[category] || 'File'} (.${extension})`;
};

// Format file size for display
const formatFileSize = (bytes) => {
  if (typeof bytes !== 'number' || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate document icons with file type indicators
const getDocumentIcon = (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(40, 50);
    ctx.lineTo(160, 50);
    ctx.lineTo(160, 150);
    ctx.lineTo(40, 150);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#f5f5f5';
    ctx.beginPath();
    ctx.moveTo(140, 50);
    ctx.lineTo(160, 50);
    ctx.lineTo(160, 70);
    ctx.closePath();
    ctx.fill();
    
    let iconLetter = 'D';
    let iconColor = '#757575';
    
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    
    if (fileType.includes('word') || fileName.endsWith('.doc') || fileName.endsWith('.docx') || fileName.endsWith('.rtf')) {
      iconLetter = 'W';
      iconColor = '#2b579a';
    } else if (fileType.includes('excel') || fileName.endsWith('.xls') || fileName.endsWith('.xlsx') || fileName.endsWith('.csv')) {
      iconLetter = 'X';
      iconColor = '#217346';
    } else if (fileType.includes('powerpoint') || fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) {
      iconLetter = 'P';
      iconColor = '#d24726';
    } else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
      iconLetter = 'PDF';
      iconColor = '#f40f02';
    } else if (fileType.startsWith('image/')) {
      iconLetter = 'IMG';
      iconColor = '#9c27b0';
    } else if (fileType.includes('zip') || fileName.endsWith('.zip') || fileName.endsWith('.rar') || fileName.endsWith('.7z')) {
      iconLetter = 'ZIP';
      iconColor = '#ff9800';
    }
    
    ctx.fillStyle = iconColor;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(iconLetter, 100, 100);
    
    const extension = file.name.split('.').pop().toUpperCase();
    ctx.fillStyle = '#616161';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(`.${extension}`, 100, 130);
    
    resolve(canvas.toDataURL('image/png'));
  });
};

// Image processor
const getImageData = async (fileOrData) => {
  // If we already have a data URL, just get dimensions
  if (typeof fileOrData === 'string' && fileOrData.startsWith('data:')) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({
        width: img.width,
        height: img.height,
        data: fileOrData
      });
      img.onerror = () => resolve({
        width: 0,
        height: 0,
        data: fileOrData
      });
      img.src = fileOrData;
    });
  }

  // Otherwise, process as a File/Blob
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async () => {
      try {
        const img = new Image();
        img.src = reader.result;
        
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });

        resolve({
          name: fileOrData.name,
          type: fileOrData.type,
          data: reader.result,
          width: img.width || 0,
          height: img.height || 0,
          size: fileOrData.size,
          lastModified: fileOrData.lastModified
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(fileOrData);
  });
};

// PDF to Image Converter
// const getPdfPreview = (file) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const pdfjsLib = await import('pdfjs-dist/build/pdf');
//       const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
//       pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

//       const arrayBuffer = await file.arrayBuffer();
//       const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
//       const page = await pdf.getPage(1);
      
//       const viewport = page.getViewport({ scale: 1.5 });
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       canvas.width = viewport.width;
//       canvas.height = viewport.height;

//       await page.render({
//         canvasContext: ctx,
//         viewport: viewport
//       }).promise;

//       const dataURL = canvas.toDataURL('image/png');
      
//       resolve({
//         name: file.name,
//         type: file.type,
//         friendlyType: getFriendlyFileType(file),
//         data: dataURL,
//         width: viewport.width,
//         height: viewport.height,
//         size: formatFileSize(file.size),
//         lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
//       });
//     } catch (error) {
//       reject(new Error(`PDF processing failed: ${error.message}`));
//     }
//   });
// };
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

const getPdfPreview = (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Set the worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js';

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const page = await pdf.getPage(1);
      
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: ctx,
        viewport: viewport
      }).promise;

      const dataURL = canvas.toDataURL('image/png');
      
      resolve({
        name: file.name,
        type: file.type,
        friendlyType: getFriendlyFileType(file),
        data: dataURL,
        width: viewport.width,
        height: viewport.height,
        size: formatFileSize(file.size),
        lastModified: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'N/A'
      });
    } catch (error) {
      reject(new Error(`PDF processing failed: ${error.message}`));
    }
  });
};