import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Search, Calendar, AlertTriangle } from 'lucide-react';
import { format, isAfter, isBefore, parseISO, differenceInDays } from 'date-fns';

const BatchList = () => {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [filters, setFilters] = useState({
    search: '', warehouse_id: '', status: '', only_available: true
  });

  useEffect(() => {
    api.get('/warehouses/active').then(r => setWarehouses(r.data || [])).catch(() => {});
  }, []);

  useEffect(() => { fetchItems(); }, [pagination.page, filters.warehouse_id, filters.status, filters.only_available]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page, limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.warehouse_id && { warehouse_id: filters.warehouse_id }),
        ...(filters.status && { status: filters.status }),
        only_available: filters.only_available
      });
      const res = await api.get(`/batches?${params}`);
      setItems(res.data || []);
      setPagination(p => ({ ...p, total: res.pagination?.total || 0 }));
    } catch { toast.error('Không tải được danh sách lô'); }
    finally { setLoading(false); }
  };

  const getExpiryBadge = (expiry) => {
    if (!expiry) return <span className="badge badge-secondary">Không HSD</span>;
    const d = typeof expiry === 'string' ? parseISO(expiry) : new Date(expiry);
    const today = new Date();
    const days = differenceInDays(d, today);
    if (isBefore(d, today)) return <span className="badge badge-danger"><AlertTriangle size={12} /> Đã hết hạn</span>;
    if (days <= 30) return <span className="badge" style={{ background: '#f59e0b', color: 'white' }}>Còn {days} ngày</span>;
    return <span className="badge badge-success">Còn {days} ngày</span>;
  };

  return (
    <Layout title="Lô hàng">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý Lô hàng</h1>
          <p className="page-subtitle">Theo dõi lô nhập + hạn sử dụng (nền tảng FIFO/LIFO)</p>
        </div>
      </div>

      <div className="search-filters" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <form onSubmit={(e) => { e.preventDefault(); setPagination(p => ({ ...p, page: 1 })); fetchItems(); }} className="search-box" style={{ flex: 1, minWidth: 240 }}>
          <Search />
          <input className="form-control" placeholder="Tìm theo mã lô, SKU, tên sản phẩm..."
            value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        </form>
        <select className="form-control" style={{ maxWidth: 200 }} value={filters.warehouse_id}
          onChange={(e) => { setFilters({ ...filters, warehouse_id: e.target.value }); setPagination(p => ({ ...p, page: 1 })); }}>
          <option value="">Tất cả kho</option>
          {warehouses.map(w => <option key={w.id} value={w.id}>{w.code} — {w.name}</option>)}
        </select>
        <select className="form-control" style={{ maxWidth: 160 }} value={filters.status}
          onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPagination(p => ({ ...p, page: 1 })); }}>
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang dùng</option>
          <option value="EXPIRED">Hết hạn</option>
          <option value="DAMAGED">Hư hỏng</option>
          <option value="DEPLETED">Đã xuất hết</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input type="checkbox" checked={filters.only_available}
            onChange={(e) => { setFilters({ ...filters, only_available: e.target.checked }); setPagination(p => ({ ...p, page: 1 })); }} />
          Chỉ còn hàng
        </label>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã lô</th><th>Sản phẩm</th><th>Kho</th><th>NSX</th><th>HSD</th>
                <th>Còn lại / Ban đầu</th><th>Đơn giá</th><th>Trạng thái</th><th>Tình trạng HSD</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={9} className="text-center">Đang tải...</td></tr>
                : items.length === 0 ? <tr><td colSpan={9} className="text-center">Chưa có lô</td></tr>
                : items.map((b) => (
                  <tr key={b.id}>
                    <td><code>{b.batch_code}</code></td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{b.product_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{b.product_sku}</div>
                    </td>
                    <td>{b.warehouse_name || '-'}</td>
                    <td>{b.manufacture_date ? format(parseISO(b.manufacture_date), 'dd/MM/yyyy') : '-'}</td>
                    <td>
                      {b.expiry_date ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={12} />{format(parseISO(b.expiry_date), 'dd/MM/yyyy')}
                        </span>
                      ) : '-'}
                    </td>
                    <td><strong>{b.remaining_quantity}</strong> / {b.initial_quantity}</td>
                    <td>{Number(b.unit_price).toLocaleString('vi-VN')} đ</td>
                    <td>
                      <span className={`badge ${b.status === 'ACTIVE' ? 'badge-success' : b.status === 'DEPLETED' ? 'badge-secondary' : 'badge-danger'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>{getExpiryBadge(b.expiry_date)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={pagination.page} totalPages={Math.ceil(pagination.total / pagination.limit)}
          totalItems={pagination.total} itemsPerPage={pagination.limit}
          onPageChange={(page) => setPagination(p => ({ ...p, page }))} />
      </div>
    </Layout>
  );
};

export default BatchList;
