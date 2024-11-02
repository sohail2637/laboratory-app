import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadPdf = async (elementId) => {
  const pages = document.getElementsByClassName(elementId);
  if (pages.length === 0) {
    console.warn('No pages found to generate PDF.');
    return;
  }

  const pdf = new jsPDF('p', 'mm', 'a4');
  const promises = Array.from(pages).map((page, index) =>
    html2canvas(page, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      if (index > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    })
  );

  Promise.all(promises)
    .then(() => pdf.save(`${elementId}-report.pdf`))
    .catch((error) => console.error('Error generating PDF:', error));
};
