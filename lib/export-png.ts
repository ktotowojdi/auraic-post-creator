import { toPng } from 'html-to-image';
import JSZip from 'jszip';

export async function exportSlideToPng(element: HTMLElement): Promise<string> {
  return toPng(element, {
    width: 1080,
    height: 1350,
    pixelRatio: 1,
    style: {
      transform: 'none',
      transformOrigin: 'top left',
    },
  });
}

export async function exportAllSlidesToZip(
  elements: HTMLElement[],
  title: string
): Promise<Blob> {
  const zip = new JSZip();

  for (let i = 0; i < elements.length; i++) {
    const dataUrl = await exportSlideToPng(elements[i]);
    const base64 = dataUrl.split(',')[1];
    zip.file(`${title}_slide_${i + 1}.png`, base64, { base64: true });
  }

  return zip.generateAsync({ type: 'blob' });
}
