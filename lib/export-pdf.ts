import jsPDF from 'jspdf';
import { exportSlideToPng } from './export-png';

export async function exportSlidesToPdf(
  elements: HTMLElement[],
  title: string
): Promise<Blob> {
  // 1080x1350 in mm at 72dpi equivalent — use actual pixel ratio
  const widthMm = 1080 * 0.264583;
  const heightMm = 1350 * 0.264583;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [widthMm, heightMm],
  });

  for (let i = 0; i < elements.length; i++) {
    if (i > 0) pdf.addPage([widthMm, heightMm], 'portrait');
    const dataUrl = await exportSlideToPng(elements[i]);
    pdf.addImage(dataUrl, 'PNG', 0, 0, widthMm, heightMm);
  }

  return pdf.output('blob');
}
