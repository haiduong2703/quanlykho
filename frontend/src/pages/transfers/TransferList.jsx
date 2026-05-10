import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Plus, ArrowRightLeft, Check, X, Truck, Eye, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const STATUS_BADGES = {
  PENDING: { cls: 'badge-warning', label: 'Chờ duyệt' },
  IN_TRANSIT: { cls: 'badge-info', label: 'Đang vận chuyển' },
  COMPLETED: { cls: 'badge-success', label: 'Hoàn tất' },
  REJECTED: { cls: 'badge-danger', label: 'Từ chối' },
  CANCELLED: { cls: 'badge-secondary', label: 'Đã huỷ' }
};

const TransferList = () => {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [stockMap, setStockMap] = useState({});  // {productId: qty} ở kho nguồn
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({ from_warehouse_id: '', to_warehouse_id: '', note: '', items: [] });
  const [newItem, setNewItem] = useState({ product_id: '', quantity: 1 });

  useEffect(() => {
    api.get('/warehouses/active').then(r => setWarehouses(r.data || [])).catch(() => {});
    api.get('/products/all').then(r => setProducts(r.data || [])).catch(() => {});
  }, []);

  // Fetch tồn kho ở kho nguồn khi user đổi from_warehouse_id
  useEffect(() => {
    if (!form.from_warehouse_id) { setStockMap({}); return; }
    api.get(`/stock-by-location?warehouse_id=${form.from_warehouse_id}&limit=10000&only_positive=true`)
      .then(r => {
        const m = {};
        (r.data || []).forEach(row => {
          m[row.product_id] = (m[row.product_id] || 0) + Number(row.quantity);
        });
        setStockMap(m);
      })
      .catch(() => setStockMap({}));
  }, [form.from_warehouse_id]);

  useEffect(() => { fetchItems(); }, [pagination.page]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/transfers?page=${pagination.page}&limit=${pagination.limit}`);
      setItems(res.data || []);
      setPagination(p => ({ ...p, total: res.pagination?.total || 0 }));
    } catch { toast.error('Không tải được phiếu chuyển kho'); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setForm({ from_warehouse_id: '', to_warehouse_id: '', note: '', items: [] });
    setNewItem({ product_id: '', quantity: 1 });
    setShowModal(true);
  };

  const addItem = () => {
    if (!newItem.product_id || newItem.quantity <= 0) return toast.warn('Chọn sản phẩm và số lượng > 0');
    if (!form.from_warehouse_id) return toast.warn('Hãy chọn kho nguồn trước');
    const prod = products.find(p => String(p.id) === String(newItem.product_id));
    const available = stockMap[prod.id] || 0;
    const qty = Number(newItem.quantity);
    if (qty > available) {
      return toast.error(`Tồn kho nguồn không đủ. Khả dụng: ${available}, yêu cầu: ${qty}`);
    }
    setForm({
      ...form,
      items: [...form.items, { product_id: prod.id, product_name: prod.name, product_sku: prod.sku, quantity: qty, available }]
    });
    setNewItem({ product_id: '', quantity: 1 });
  };

  const removeItem = (idx) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.from_warehouse_id || !form.to_warehouse_id) return toast.warn('Chọn kho nguồn và kho đích');
    if (form.from_warehouse_id === form.to_warehouse_id) return toast.warn('Kho nguồn và đích phải khác nhau');
    if (form.items.length === 0) return toast.warn('Thêm ít nhất 1 sản phẩm');
    setFormLoading(true);
    try {
      await api.post('/transfers', form);
      toast.success('Tạo phiếu chuyển kho thành công');
      setShowModal(false); fetchItems();
    } catch (e) { toast.error(e.message || 'Có lỗi xảy ra'); }
    finally { setFormLoading(false); }
  };

  const openDetail = async (id) => {
    try { const res = await api.get(`/transfers/${id}`); setDetail(res.data); setShowDetailModal(true); }
    catch { toast.error('Không tải được chi tiết'); }
  };

  const act = async (id, action, extra) => {
    try {
      await api.patch(`/transfers/${id}/${action}`, extra || {});
      toast.success('Đã cập nhật');
      fetchItems();
      if (showDetailModal && detail?.id === id) {
        const res = await api.get(`/transfers/${id}`); setDetail(res.data);
      }
    } catch (e) { toast.error(e.message || 'Có lỗi xảy ra'); }
  };

  return (
    <Layout title="Chuyển kho nội bộ">
      <div className="page-header">
        <div>
          <h1 className="page-title">Chuyển kho nội bộ</h1>
          <p className="page-subtitle">Tạo phiếu chuyển — duyệt xuất kho nguồn — nhận tại kho đích</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Tạo phiếu chuyển</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã phiếu</th><th>Từ kho → Đến kho</th><th>Tổng SL</th><th>Ngày tạo</th><th>Trạng thái</th><th style={{ width: 180 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="text-center">Đang tải...</td></tr>
                : items.length === 0 ? <tr><td colSpan={6} className="text-center">Chưa có phiếu chuyển</td></tr>
                : items.map((t) => (
                  <tr key={t.id}>
                    <td><code>{t.receipt_code}</code></td>
                    <td style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <strong>{t.from_code}</strong>
                      <ArrowRightLeft size={14} />
                      <strong>{t.to_code}</strong>
                    </td>
                    <td>{t.total_quantity}</td>
                    <td>{t.transfer_date ? format(parseISO(t.transfer_date), 'dd/MM/yyyy HH:mm') : '-'}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGES[t.status]?.cls || 'badge-secondary'}`}>
                        {STATUS_BADGES[t.status]?.label || t.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-icon btn-secondary sm" onClick={() => openDetail(t.id)} title="Xem"><Eye size={16} /></button>
                        {t.status === 'PENDING' && (
                          <>
                            <button className="btn btn-icon btn-success sm" onClick={() => act(t.id, 'approve')} title="Duyệt"><Check size={16} /></button>
                            <button className="btn btn-icon btn-danger sm" onClick={() => act(t.id, 'reject', { reason: 'Từ chối' })} title="Từ chối"><X size={16} /></button>
                          </>
                        )}
                        {t.status === 'IN_TRANSIT' && (
                          <button className="btn btn-icon sm" style={{ background: '#10b981', color: 'white' }} onClick={() => act(t.id, 'receive')} title="Xác nhận nhận">
                            <Truck size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={pagination.page} totalPages={Math.ceil(pagination.total / pagination.limit)}
          totalItems={pagination.total} itemsPerPage={pagination.limit}
          onPageChange={(page) => setPagination(p => ({ ...p, page }))} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tạo phiếu chuyển kho" size="lg">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Kho nguồn *</label>
              <select className="form-control" value={form.from_warehouse_id} required
                onChange={(e) => setForm({ ...form, from_warehouse_id: e.target.value })}>
                <option value="">-- Chọn kho --</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.code} — {w.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Kho đích *</label>
              <select className="form-control" value={form.to_warehouse_id} required
                onChange={(e) => setForm({ ...form, to_warehouse_id: e.target.value })}>
                <option value="">-- Chọn kho --</option>
                {warehouses.filter(w => String(w.id) !== String(form.from_warehouse_id))
                  .map(w => <option key={w.id} value={w.id}>{w.code} — {w.name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Thêm sản phẩm
              {form.from_warehouse_id && (
                <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  (đã hiển thị tồn kho ở kho nguồn)
                </span>
              )}
            </label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <select className="form-control" value={newItem.product_id}
                  onChange={(e) => setNewItem({ ...newItem, product_id: e.target.value })}
                  disabled={!form.from_warehouse_id}>
                  <option value="">{form.from_warehouse_id ? '-- Chọn sản phẩm --' : '-- Hãy chọn kho nguồn trước --'}</option>
                  {products.map(p => {
                    const stock = stockMap[p.id] || 0;
                    return (
                      <option key={p.id} value={p.id} disabled={form.from_warehouse_id && stock <= 0}>
                        {p.sku} — {p.name} {form.from_warehouse_id ? `(Tồn: ${stock})` : ''}
                      </option>
                    );
                  })}
                </select>
                {newItem.product_id && form.from_warehouse_id && (
                  <div style={{ fontSize: 12, marginTop: 4, color: 'var(--text-secondary)' }}>
                    Tồn ở kho nguồn: <strong style={{ color: 'var(--primary-color)' }}>
                      {stockMap[newItem.product_id] || 0}
                    </strong>
                    {Number(newItem.quantity) > (stockMap[newItem.product_id] || 0) && (
                      <span style={{ color: 'var(--danger-color)', marginLeft: 8 }}>
                        ⚠ Vượt tồn kho!
                      </span>
                    )}
                  </div>
                )}
              </div>
              <input type="number" className="form-control" style={{ maxWidth: 120 }} min="1"
                max={stockMap[newItem.product_id] || undefined}
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} />
              <button type="button" className="btn btn-secondary" onClick={addItem}>Thêm</button>
            </div>
          </div>

          {form.items.length > 0 && (
            <table className="table" style={{ marginBottom: 12 }}>
              <thead><tr><th>SKU</th><th>Tên SP</th><th>SL chuyển</th><th>Tồn kho nguồn</th><th style={{ width: 60 }}></th></tr></thead>
              <tbody>
                {form.items.map((it, i) => (
                  <tr key={i}>
                    <td>{it.product_sku}</td>
                    <td>{it.product_name}</td>
                    <td><strong>{it.quantity}</strong></td>
                    <td>{it.available || stockMap[it.product_id] || 0}</td>
                    <td><button type="button" className="btn btn-icon btn-danger sm" onClick={() => removeItem(i)}><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <textarea className="form-control" rows="2" value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Huỷ</button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? 'Đang xử lý...' : 'Tạo phiếu'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={`Phiếu ${detail?.receipt_code || ''}`} size="lg">
        {detail && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <strong>{detail.from_name}</strong> → <strong>{detail.to_name}</strong>
              {' | '}Trạng thái: <span className={`badge ${STATUS_BADGES[detail.status]?.cls}`}>{STATUS_BADGES[detail.status]?.label || detail.status}</span>
            </div>
            <table className="table">
              <thead><tr><th>SKU</th><th>Sản phẩm</th><th>Lô</th><th>SL</th></tr></thead>
              <tbody>
                {(detail.items || []).map(it => (
                  <tr key={it.id}>
                    <td>{it.sku}</td><td>{it.product_name}</td>
                    <td>{it.batch_code || '-'}</td><td>{it.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {detail.note && <div style={{ marginTop: 8 }}><strong>Ghi chú:</strong> {detail.note}</div>}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default TransferList;
