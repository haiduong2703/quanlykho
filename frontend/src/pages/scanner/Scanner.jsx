import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import BarcodeScanner from '../../components/barcode/BarcodeScanner';
import BarcodePrint, { BarcodePrintBox } from '../../components/barcode/BarcodePrint';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Camera, QrCode, CheckCircle, XCircle, Wand2 } from 'lucide-react';

const Scanner = () => {
  const [lastCode, setLastCode] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [printType, setPrintType] = useState('CODE128');
  // Tạo QR test — đổi placeholder để user gõ SKU thật của họ
  const [testText, setTestText] = useState('NNT-001');
  const [testType, setTestType] = useState('QR');

  const lookup = async (code) => {
    if (!code) return;
    setLastCode(code); setLoading(true); setProduct(null);
    try {
      const res = await api.get(`/products/barcode/${encodeURIComponent(code)}`);
      setProduct(res.data);
      toast.success('Tìm thấy sản phẩm');
    } catch (e) {
      toast.error(e.message || 'Không tìm thấy barcode');
    } finally { setLoading(false); }
  };

  return (
    <Layout title="Quét mã vạch / QR">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quét & In Barcode/QR</h1>
          <p className="page-subtitle">Quét bằng camera hoặc máy quét USB; in tem barcode/QR</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 480px) 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Camera size={20} /> Camera</h3>
          <BarcodeScanner onDetected={lookup} onError={(e) => toast.error(e.message || 'Lỗi camera')} />
          <div style={{ marginTop: 12 }}>
            <label className="form-label">Hoặc nhập mã thủ công (hỗ trợ máy quét USB)</label>
            <form onSubmit={(e) => { e.preventDefault(); lookup(manualCode.trim()); }} style={{ display: 'flex', gap: 8 }}>
              <input className="form-control" placeholder="Nhập hoặc quét bằng máy quét USB..." value={manualCode}
                onChange={(e) => setManualCode(e.target.value)} autoFocus />
              <button type="submit" className="btn btn-primary">Tra cứu</button>
            </form>
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><QrCode size={20} /> Kết quả</h3>
          {lastCode && (
            <div style={{ marginBottom: 12, color: 'var(--text-secondary)' }}>
              Mã đã quét: <code>{lastCode}</code>
            </div>
          )}
          {loading && <div>Đang tra cứu...</div>}
          {product && (
            <div style={{ padding: 12, background: 'var(--bg-secondary)', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--success-color)' }}>
                <CheckCircle size={18} /><strong>Tìm thấy sản phẩm</strong>
                <span className="badge badge-info" style={{ marginLeft: 'auto', fontSize: 11 }}>
                  Khớp theo: {product.matched_field === 'barcode' ? 'Barcode SKU'
                    : product.matched_field === 'unit_barcode' ? 'Barcode đơn vị'
                    : product.matched_field === 'sku' ? 'SKU' : '?'}
                </span>
              </div>
              <div style={{ marginTop: 8 }}>
                <div><strong>SKU:</strong> {product.sku}</div>
                <div><strong>Tên:</strong> {product.name}</div>
                <div><strong>Đơn vị:</strong> {product.unit}</div>
                <div><strong>Giá:</strong> {Number(product.price).toLocaleString('vi-VN')} đ</div>
                {product.matched_unit_name && (
                  <div><strong>Đơn vị đã quét:</strong> {product.matched_unit_name} (hệ số {product.matched_conversion_rate})</div>
                )}
              </div>
            </div>
          )}
          {!loading && lastCode && !product && (
            <div style={{ padding: 12, color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <XCircle size={18} />Không có sản phẩm với barcode này
            </div>
          )}
        </div>
      </div>

      {product && (
        <div className="card" style={{ padding: 16, marginTop: 16 }}>
          <h3>In tem cho sản phẩm</h3>
          <div style={{ marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
            <label>Loại tem:</label>
            <select className="form-control" style={{ maxWidth: 200 }} value={printType} onChange={(e) => setPrintType(e.target.value)}>
              <option value="CODE128">Barcode CODE128</option>
              <option value="EAN13">Barcode EAN13</option>
              <option value="QR">Mã QR</option>
            </select>
          </div>
          <BarcodePrintBox
            value={product.barcode || product.sku}
            type={printType}
            label={`${product.sku} — ${product.name}`}
            filename={`tem-${product.sku}.pdf`}
          />
        </div>
      )}

      {/* Tạo QR/Barcode test — không cần lưu DB, chỉ để có ảnh để quét thử */}
      {/* <div className="card" style={{ padding: 16, marginTop: 16, background: 'linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 4px' }}>
          <Wand2 size={20} /> Tạo QR / Barcode test (không lưu DB)
        </h3>
        <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--text-secondary)' }}>
          Nhập <strong>SKU sản phẩm</strong> (vd: <code>NNT-001</code>) hoặc <strong>barcode đã gán</strong> →
          render mã → dùng <strong>điện thoại</strong> chụp/cầm gần camera laptop để test scan.
          Hệ thống tra cứu theo thứ tự: <code>products.barcode</code> → <code>product_units.barcode</code> → <code>products.sku</code>.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
          <input className="form-control" style={{ flex: 1, minWidth: 200 }}
            placeholder="Nhập SKU thật (vd: NNT-001) hoặc barcode đã gán..."
            value={testText} onChange={(e) => setTestText(e.target.value)} />
          <select className="form-control" style={{ maxWidth: 200 }} value={testType}
            onChange={(e) => setTestType(e.target.value)}>
            <option value="QR">QR Code</option>
            <option value="CODE128">Barcode CODE128 (text bất kỳ)</option>
            <option value="EAN13">Barcode EAN13 (12 số)</option>
          </select>
        </div>
        {testText && (
          <div style={{ background: 'white', padding: 16, borderRadius: 8, display: 'inline-block' }}>
            <BarcodePrint value={testText} type={testType} label={testText} />
          </div>
        )}
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
          💡 <strong>Mẹo test 1 mình</strong>: dùng 2 thiết bị —
          (1) Hiện QR trên màn hình laptop, dùng camera điện thoại (Camera app mặc định trên iOS/Android nhận QR luôn).
          (2) Hoặc dùng generator online: <code>qr-code-generator.com</code>, <code>barcode.tec-it.com</code> tạo QR rồi hiện trên 1 thiết bị, quét bằng laptop trang `/scanner`.
        </div>
      </div> */}
    </Layout>
  );
};

export default Scanner;
