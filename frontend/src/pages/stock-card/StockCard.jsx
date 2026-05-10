import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Search, Package, ArrowDownRight, ArrowUpRight, Edit, ClipboardCheck } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const TYPE_LABELS = {
  IMPORT: { label: 'Nhập', cls: 'badge-success', icon: ArrowDownRight },
  EXPORT: { label: 'Xuất', cls: 'badge-info', icon: ArrowUpRight },
  ADJUST: { label: 'Điều chỉnh', cls: 'badge-warning', icon: Edit },
  INVENTORY_CHECK: { label: 'Kiểm kê', cls: 'badge-secondary', icon: ClipboardCheck },
  TRANSFER_IN: { label: 'Chuyển đến', cls: 'badge-success', icon: ArrowDownRight },
  TRANSFER_OUT: { label: 'Chuyển đi', cls: 'badge-info', icon: ArrowUpRight },
  RETURN_IN: { label: 'Trả hàng', cls: 'badge-success', icon: ArrowDownRight },
  DISPOSAL: { label: 'Xuất hủy', cls: 'badge-danger', icon: ArrowUpRight },
  QC_REJECT: { label: 'QC loại', cls: 'badge-danger', icon: Edit }
};

const StockCard = () => {
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0 });
  const [typeFilter, setTypeFilter] = useState('');
  const [dateRange, setDateRange] = useState({ from_date: '', to_date: '' });

  useEffect(() => {
    if (productSearch.length < 2) { setProducts([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await api.get(`/products/search?keyword=${encodeURIComponent(productSearch)}&limit=10`);
        setProducts(res.data || []);
      } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [productSearch]);

  useEffect(() => {
    if (selectedProduct) fetchCard();
  }, [selectedProduct, pagination.page, typeFilter, dateRange.from_date, dateRange.to_date]);

  const fetchCard = async () => {
    try {
      setLoading(true); setError('');
      const params = new URLSearchParams({
        page: pagination.page, limit: pagination.limit,
        ...(typeFilter && { type: typeFilter }),
        ...(dateRange.from_date && { from_date: dateRange.from_date }),
        ...(dateRange.to_date && { to_date: dateRange.to_date })
      });
      const res = await api.get(`/reports/stock-card/${selectedProduct.id}?${params}`);
      if (!res || !res.data) throw new Error('API trả về dữ liệu rỗng');
      setData(res.data);
      setPagination(p => ({ ...p, total: res.data?.pagination?.total || 0 }));
    } catch (e) {
      console.error('StockCard fetch error:', e);
      setError(e.message || 'Không tải được thẻ kho');
      toast.error(e.message || 'Không tải được thẻ kho');
    } finally { setLoading(false); }
  };

  return (
    <Layout title="Thẻ kho">
      <div className="page-header">
        <div>
          <h1 className="page-title">Thẻ kho (Stock Card)</h1>
          <p className="page-subtitle">Lịch sử biến động chi tiết theo SKU</p>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 16, position: 'relative', overflow: 'visible', zIndex: 5 }}>
        <label className="form-label">Tìm sản phẩm</label>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Search size={18} />
            <input className="form-control" placeholder="Nhập SKU hoặc tên sản phẩm..." value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)} />
          </div>
          {products.length > 0 && productSearch.length >= 2 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              background: 'white', border: '1px solid var(--border-color)',
              borderRadius: 6, marginTop: 4, maxHeight: 280, overflowY: 'auto',
              zIndex: 9999, boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
            }}>
              {products.map(p => (
                <div key={p.id} style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)' }}
                  onClick={() => { setSelectedProduct(p); setProductSearch(''); setProducts([]); setPagination(pp => ({ ...pp, page: 1 })); }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}>
                  <strong>{p.sku}</strong> — {p.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedProduct && loading && !data && (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)' }}>
          Đang tải thẻ kho cho <strong>{selectedProduct.sku}</strong>...
        </div>
      )}

      {selectedProduct && error && (
        <div className="card" style={{ padding: 16, background: '#fef2f2', color: '#ef4444', marginBottom: 16 }}>
          <strong>Lỗi tải thẻ kho:</strong> {error}
          <div style={{ marginTop: 8, fontSize: 12 }}>
            Mở DevTools (F12) → Console + Network để xem chi tiết. Sản phẩm ID: {selectedProduct.id}
          </div>
        </div>
      )}

      {selectedProduct && data && (
        <>
          <div className="card" style={{ padding: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <Package size={48} color="var(--primary-color)" />
            <div>
              <div style={{ fontSize: 20, fontWeight: 600 }}>{data.product.name}</div>
              <div style={{ color: 'var(--text-secondary)' }}>SKU: {data.product.sku} | Danh mục: {data.product.category_name}</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Tồn hiện tại</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary-color)' }}>{data.current_stock} {data.product.unit}</div>
            </div>
          </div>

          <div className="search-filters" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <select className="form-control" style={{ maxWidth: 200 }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">Tất cả loại</option>
              {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <input type="date" className="form-control" style={{ maxWidth: 180 }} value={dateRange.from_date}
              onChange={(e) => setDateRange({ ...dateRange, from_date: e.target.value })} />
            <span>đến</span>
            <input type="date" className="form-control" style={{ maxWidth: 180 }} value={dateRange.to_date}
              onChange={(e) => setDateRange({ ...dateRange, to_date: e.target.value })} />
          </div>

          <div className="card">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Thời gian</th><th>Loại</th><th>SL</th><th>Tồn trước</th><th>Tồn sau</th>
                    <th>Phiếu</th><th>Người</th><th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? <tr><td colSpan={8} className="text-center">Đang tải...</td></tr>
                    : data.movements.length === 0 ? <tr><td colSpan={8} className="text-center">Không có biến động</td></tr>
                    : data.movements.map(m => {
                      const def = TYPE_LABELS[m.type] || { label: m.type, cls: 'badge-secondary', icon: Edit };
                      const Icon = def.icon;
                      return (
                        <tr key={m.id}>
                          <td>{format(parseISO(m.created_at), 'dd/MM/yyyy HH:mm:ss')}</td>
                          <td>
                            <span className={`badge ${def.cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <Icon size={12} />{def.label}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600, color: m.quantity > 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                            {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                          </td>
                          <td>{m.before_quantity}</td>
                          <td>{m.after_quantity}</td>
                          <td>{m.reference_code || '-'}</td>
                          <td>{m.created_by_name || '-'}</td>
                          <td>{m.note || '-'}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={pagination.page} totalPages={Math.ceil(pagination.total / pagination.limit)}
              totalItems={pagination.total} itemsPerPage={pagination.limit}
              onPageChange={(page) => setPagination(p => ({ ...p, page }))} />
          </div>
        </>
      )}

      {!selectedProduct && (
        <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Package size={48} style={{ opacity: 0.3 }} />
          <p>Tìm và chọn một sản phẩm để xem thẻ kho</p>
        </div>
      )}
    </Layout>
  );
};

export default StockCard;
