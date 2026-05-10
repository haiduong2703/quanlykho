import React, { useEffect, useRef, useState } from 'react';

/**
 * Component quét mã vạch/QR qua camera.
 * Yêu cầu: đã cài `html5-qrcode` (npm i html5-qrcode).
 * Sử dụng:
 *   <BarcodeScanner onDetected={(code) => ...} onError={(err) => ...} />
 *
 * Prop:
 *   - onDetected(code)  — gọi khi quét thành công (mặc định pause scanner)
 *   - onError(err)      — gọi khi có lỗi (khởi động camera, …)
 *   - fps, qrbox        — tuỳ chọn cấu hình quét
 *   - autoStart         — true: tự start khi mount
 */
const BarcodeScanner = ({ onDetected, onError, fps = 10, qrbox = 250, autoStart = true }) => {
  const containerId = useRef(`barcode-scanner-${Math.random().toString(36).slice(2, 10)}`);
  const scannerRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | starting | running | stopped | error
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (!mounted) return;
        const devices = await Html5Qrcode.getCameras();
        if (!mounted) return;
        setCameras(devices);
        // Ưu tiên camera sau trên mobile
        const back = devices.find(d => /back|rear|environment/i.test(d.label));
        setSelectedCamera((back || devices[0])?.id || '');
        if (autoStart && devices.length > 0) {
          await startScanning((back || devices[0])?.id);
        }
      } catch (e) {
        setStatus('error');
        onError && onError(e);
      }
    })();
    return () => {
      mounted = false;
      stopScanning();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScanning = async (cameraId) => {
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      if (!scannerRef.current) scannerRef.current = new Html5Qrcode(containerId.current);
      setStatus('starting');
      await scannerRef.current.start(
        cameraId,
        { fps, qrbox: { width: qrbox, height: qrbox } },
        (decodedText) => {
          onDetected && onDetected(decodedText);
        },
        () => { /* ignore per-frame decode errors */ }
      );
      setStatus('running');
    } catch (e) {
      setStatus('error');
      onError && onError(e);
    }
  };

  const stopScanning = async () => {
    try {
      if (scannerRef.current && scannerRef.current.isScanning) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }
      setStatus('stopped');
    } catch {}
  };

  const handleCameraChange = async (e) => {
    const id = e.target.value;
    setSelectedCamera(id);
    await stopScanning();
    if (id) await startScanning(id);
  };

  return (
    <div>
      {cameras.length > 1 && (
        <div style={{ marginBottom: 8 }}>
          <label className="form-label">Chọn camera</label>
          <select className="form-control" value={selectedCamera} onChange={handleCameraChange}>
            {cameras.map(c => <option key={c.id} value={c.id}>{c.label || c.id}</option>)}
          </select>
        </div>
      )}
      <div id={containerId.current} style={{ width: '100%', maxWidth: 480, margin: '0 auto' }} />
      <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'center' }}>
        {status !== 'running' ? (
          <button className="btn btn-primary" onClick={() => startScanning(selectedCamera)} disabled={!selectedCamera}>
            Bắt đầu quét
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={stopScanning}>Dừng quét</button>
        )}
      </div>
      {status === 'error' && (
        <div style={{ marginTop: 8, color: 'var(--danger-color)', textAlign: 'center' }}>
          Không khởi động được camera. Hãy kiểm tra quyền truy cập hoặc chạy trên HTTPS/localhost.
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
