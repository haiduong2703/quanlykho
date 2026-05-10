/**
 * Export 1 DOM element ra file PDF.
 * Dùng html2canvas để chụp element thành ảnh, sau đó nhúng vào jsPDF.
 *
 * Yêu cầu: npm i jspdf html2canvas
 *
 * @param {HTMLElement} element  - DOM element cần export
 * @param {string} filename      - tên file (vd: 'tem-SP001.pdf')
 * @param {object} options
 *   - format: 'a4' | 'a5' | 'letter' | [width, height] (mm)  default 'a4'
 *   - orientation: 'portrait' | 'landscape'  default 'portrait'
 *   - margin: số mm lề (mặc định 10)
 *   - scale: độ phân giải canvas (mặc định 2 — đẹp + dung lượng vừa)
 *   - autoFit: true → tự co ảnh vừa trang; false → giữ kích thước thật
 */
export async function exportElementToPdf(element, filename = 'export.pdf', options = {}) {
  if (!element) throw new Error('Element không hợp lệ');

  const html2canvas = (await import('html2canvas')).default;
  const jsPDFModule = await import('jspdf');
  const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;

  const {
    format = 'a4',
    orientation = 'portrait',
    margin = 10,
    scale = 2
  } = options;

  // Render element thành canvas
  const canvas = await html2canvas(element, {
    scale,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false
  });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({ orientation, unit: 'mm', format });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Tính kích thước ảnh trên PDF — co vừa vào trang
  const maxW = pageWidth - margin * 2;
  const maxH = pageHeight - margin * 2;
  const ratio = canvas.width / canvas.height;

  let imgWidth = maxW;
  let imgHeight = imgWidth / ratio;
  if (imgHeight > maxH) {
    imgHeight = maxH;
    imgWidth = imgHeight * ratio;
  }

  const x = (pageWidth - imgWidth) / 2;  // căn giữa
  const y = margin;

  pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
  pdf.save(filename);
}

/**
 * Export NHIỀU tem lên 1 file PDF (dạng lưới — kiểu in tem hàng loạt).
 * Mỗi tem 1 ô trên grid 2 cột.
 */
export async function exportElementsToPdfGrid(elements, filename = 'tems.pdf', options = {}) {
  if (!elements || elements.length === 0) throw new Error('Không có tem để export');
  const html2canvas = (await import('html2canvas')).default;
  const jsPDFModule = await import('jspdf');
  const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;

  const { format = 'a4', orientation = 'portrait', margin = 10, scale = 2, columns = 2 } = options;
  const pdf = new jsPDF({ orientation, unit: 'mm', format });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const cellGap = 5;
  const cellWidth = (pageWidth - margin * 2 - cellGap * (columns - 1)) / columns;

  let x = margin;
  let y = margin;
  let rowMaxHeight = 0;
  let colIndex = 0;

  for (const el of elements) {
    const canvas = await html2canvas(el, { scale, backgroundColor: '#fff', useCORS: true, logging: false });
    const imgData = canvas.toDataURL('image/png');
    const ratio = canvas.width / canvas.height;
    const imgHeight = cellWidth / ratio;

    // Sang trang mới nếu hết chỗ dọc
    if (y + imgHeight > pageHeight - margin) {
      pdf.addPage();
      x = margin; y = margin; rowMaxHeight = 0; colIndex = 0;
    }

    pdf.addImage(imgData, 'PNG', x, y, cellWidth, imgHeight);
    rowMaxHeight = Math.max(rowMaxHeight, imgHeight);
    colIndex++;

    if (colIndex >= columns) {
      x = margin;
      y += rowMaxHeight + cellGap;
      rowMaxHeight = 0;
      colIndex = 0;
    } else {
      x += cellWidth + cellGap;
    }
  }

  pdf.save(filename);
}
