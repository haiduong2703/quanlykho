import React, { useEffect, useRef, useState } from 'react';

/**
 * Tem barcode/QR cho 1 sản phẩm.
 * Yêu cầu: đã cài `jsbarcode` và `qrcode` (npm i jsbarcode qrcode).
 * Sử dụng:
 *   <BarcodePrint value="SP001" type="CODE128" label="SP001 — Nước ngọt Cola" />
 *   <BarcodePrint value="SP001" type="QR" label="SP001" />
 */
const BarcodePrint = ({ value, type = 'CODE128', label, width = 2, height = 60 }) => {
  const svgRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!value) return;
    let cancelled = false;
    (async () => {
      if (type === 'QR') {
        const QRCode = (await import('qrcode')).default || (await import('qrcode'));
        if (cancelled || !canvasRef.current) return;
        try { await QRCode.toCanvas(canvasRef.current, value, { width: 180, margin: 1 }); }
        catch (e) { console.error('QR render error', e); }
      } else {
        const JsBarcode = (await import('jsbarcode')).default || (await import('jsbarcode'));
        if (cancelled || !svgRef.current) return;
        try {
          JsBarcode(svgRef.current, value, {
            format: type, width, height, displayValue: true, margin: 0, fontSize: 14
          });
        } catch (e) { console.error('Barcode render error', e); }
      }
    })();
    return () => { cancelled = true; };
  }, [value, type, width, height]);

  return (
    <div className="barcode-tag" style={{
      border: '1px solid #ccc', borderRadius: 4, padding: 8, background: 'white',
      display: 'inline-block', textAlign: 'center', pageBreakInside: 'avoid'
    }}>
      {type === 'QR'
        ? <canvas ref={canvasRef} />
        : <svg ref={svgRef} />}
      {label && <div style={{ marginTop: 4, fontSize: 12, fontWeight: 500 }}>{label}</div>}
    </div>
  );
};

// Bao ngoài 1 tem + 3 nút: In, Tải PDF, Copy số lượng (in nhiều bản trên 1 trang)
export const BarcodePrintBox = ({ value, type = 'CODE128', label, filename, copies = 1 }) => {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [n, setN] = useState(copies);

  const handlePrint = () => {
    if (!ref.current) return;
    const html = ref.current.innerHTML;
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>In tem ${value}</title>
      <style>
        body{margin:0;padding:8px;font-family:sans-serif;}
        .barcode-tag{margin:4px;display:inline-block;}
        @media print { @page { margin: 8mm; } }
      </style>
    </head><body>${html}<script>window.onload=()=>{window.print();}</script></body></html>`);
    w.document.close();
  };

  const handleDownloadPdf = async () => {
    if (!ref.current) return;
    setBusy(true);
    try {
      const { exportElementToPdf } = await import('../../utils/pdfExport');
      const safeName = String(value).replace(/[^a-zA-Z0-9_-]/g, '_');
      await exportElementToPdf(ref.current, filename || `tem-${safeName}.pdf`, {
        format: 'a4', orientation: 'portrait', margin: 15
      });
    } catch (e) {
      console.error('PDF export error:', e);
      alert('Không tạo được PDF: ' + (e.message || e));
    } finally { setBusy(false); }
  };

  const tags = [];
  for (let i = 0; i < n; i++) tags.push(<BarcodePrint key={i} value={value} type={type} label={label} />);

  return (
    <div>
      <div style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontSize: 13 }}>Số bản:</label>
        <input type="number" min="1" max="100" value={n}
          onChange={(e) => setN(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
          style={{ width: 70, padding: '4px 8px', border: '1px solid var(--border-color)', borderRadius: 4 }} />
        <button type="button" className="btn btn-primary" onClick={handlePrint}>🖨 In</button>
        <button type="button" className="btn btn-secondary" onClick={handleDownloadPdf} disabled={busy}>
          {busy ? '⏳ Đang tạo PDF...' : '📄 Tải PDF'}
        </button>
      </div>
      <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 8, background: 'white', borderRadius: 4 }}>
        {tags}
      </div>
    </div>
  );
};

// Bao ngoài nhiều tem (sheet) + nút in + nút PDF
export const BarcodePrintSheet = ({ items = [], type = 'CODE128', filename = 'tems.pdf' }) => {
  const sheetRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handlePrint = () => {
    if (!sheetRef.current) return;
    const html = sheetRef.current.innerHTML;
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>In tem</title>
      <style>body{margin:0;padding:8px;font-family:sans-serif;} .barcode-tag{margin:4px;display:inline-block;}</style>
    </head><body>${html}<script>window.onload=()=>window.print()</script></body></html>`);
    w.document.close();
  };

  const handleDownloadPdf = async () => {
    if (!sheetRef.current) return;
    setBusy(true);
    try {
      const { exportElementToPdf } = await import('../../utils/pdfExport');
      await exportElementToPdf(sheetRef.current, filename, { format: 'a4' });
    } catch (e) {
      console.error('PDF export error:', e);
      alert('Không tạo được PDF: ' + (e.message || e));
    } finally { setBusy(false); }
  };

  return (
    <div>
      <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
        <button type="button" className="btn btn-primary" onClick={handlePrint}>🖨 In tất cả</button>
        <button type="button" className="btn btn-secondary" onClick={handleDownloadPdf} disabled={busy}>
          {busy ? '⏳ Đang tạo PDF...' : '📄 Tải PDF'}
        </button>
      </div>
      <div ref={sheetRef} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 8, background: 'white' }}>
        {items.map((it, i) => (
          <BarcodePrint key={i} value={it.value} type={type} label={it.label} />
        ))}
      </div>
    </div>
  );
};

export default BarcodePrint;
