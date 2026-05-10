import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Plus, Search, Edit, Trash2, MapPin } from 'lucide-react';

const emptyForm = {
  warehouse_id: '', code: '', zone: '', aisle: '', rack: '', shelf: '', bin: '',
  description: '', capacity: '', is_active: true
};

const LocationList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [search, setSearch] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { fetchWarehouses(); }, []);
  useEffect(() => { fetchItems(); }, [pagination.page, filterWarehouse]);

  const fetchWarehouses = async () => {
    try {
      const res = await api.get('/warehouses/active');
      setWarehouses(res.data || []);
    } catch { toast.error('Không tải được danh sách kho'); }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page, limit: pagination.limit,
        ...(search && { search }), ...(filterWarehouse && { warehouse_id: filterWarehouse })
      });
      const res = await api.get(`/locations?${params}`);
      setItems(res.data || []);
      setPagination(p => ({ ...p, total: res.pagination?.total || 0 }));
    } catch { toast.error('Không tải được vị trí'); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setIsEdit(false);
    setFormData({ ...emptyForm, warehouse_id: filterWarehouse || (warehouses[0]?.id || '') });
    setShowModal(true);
  };

  const openEdit = (loc) => {
    setIsEdit(true); setSelected(loc);
    setFormData({
      warehouse_id: loc.warehouse_id, code: loc.code, zone: loc.zone,
      aisle: loc.aisle || '', rack: loc.rack || '', shelf: loc.shelf || '', bin: loc.bin || '',
      description: loc.description || '', capacity: loc.capacity || '', is_active: !!loc.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormLoading(true);
    try {
      const payload = { ...formData, capacity: formData.capacity ? Number(formData.capacity) : null };
      if (isEdit) await api.put(`/locations/${selected.id}`, payload);
      else await api.post('/locations', payload);
      toast.success(isEdit ? 'Cập nhật vị trí thành công' : 'Thêm vị trí thành công');
      setShowModal(false); fetchItems();
    } catch (e) { toast.error(e.message || 'Có lỗi xảy ra'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await api.delete(`/locations/${selected.id}`);
      toast.success('Xoá vị trí thành công');
      setShowDeleteDialog(false); fetchItems();
    } catch (e) { toast.error(e.message || 'Không thể xoá vị trí'); }
    finally { setFormLoading(false); }
  };

  return (
    <Layout title="Vị trí trong kho">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sơ đồ vị trí</h1>
          <p className="page-subtitle">Khu vực → Dãy → Kệ → Tầng → Ô</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Thêm vị trí</button>
      </div>

      <div className="search-filters" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select className="form-control" style={{ maxWidth: 220 }}
          value={filterWarehouse} onChange={(e) => { setFilterWarehouse(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}>
          <option value="">-- Tất cả kho --</option>
          {warehouses.map(w => <option key={w.id} value={w.id}>{w.code} — {w.name}</option>)}
        </select>
        <form onSubmit={(e) => { e.preventDefault(); setPagination(p => ({ ...p, page: 1 })); fetchItems(); }} className="search-box" style={{ flex: 1 }}>
          <Search />
          <input className="form-control" placeholder="Tìm theo mã vị trí, mô tả..." value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </form>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Kho</th><th>Mã vị trí</th><th>Khu vực</th><th>Dãy</th><th>Kệ</th>
                <th>Tầng</th><th>Ô</th><th>Sức chứa</th><th>Trạng thái</th><th style={{ width: 110 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={10} className="text-center">Đang tải...</td></tr>
                : items.length === 0 ? <tr><td colSpan={10} className="text-center">Chưa có vị trí</td></tr>
                : items.map((loc) => (
                  <tr key={loc.id}>
                    <td>{loc.warehouse_code}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={14} /><code>{loc.code}</code>
                      </div>
                    </td>
                    <td>{loc.zone}</td>
                    <td>{loc.aisle || '-'}</td>
                    <td>{loc.rack || '-'}</td>
                    <td>{loc.shelf || '-'}</td>
                    <td>{loc.bin || '-'}</td>
                    <td>{loc.capacity || '-'}</td>
                    <td>
                      <span className={`badge ${loc.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {loc.is_active ? 'Hoạt động' : 'Ngừng'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-icon btn-primary sm" onClick={() => openEdit(loc)}><Edit size={16} /></button>
                        <button className="btn btn-icon btn-danger sm" onClick={() => { setSelected(loc); setShowDeleteDialog(true); }}><Trash2 size={16} /></button>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEdit ? 'Sửa vị trí' : 'Thêm vị trí'} size="md">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Kho *</label>
              <select className="form-control" value={formData.warehouse_id} required
                onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })} disabled={isEdit}>
                <option value="">-- Chọn kho --</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.code} — {w.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Mã vị trí</label>
              <input type="text" className="form-control" value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="Tự sinh từ khu vực-dãy-kệ-tầng-ô" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Khu vực *</label>
              <input type="text" className="form-control" value={formData.zone} required
                onChange={(e) => setFormData({ ...formData, zone: e.target.value.toUpperCase() })} placeholder="VD: A" />
            </div>
            <div className="form-group">
              <label className="form-label">Dãy</label>
              <input type="text" className="form-control" value={formData.aisle}
                onChange={(e) => setFormData({ ...formData, aisle: e.target.value })} placeholder="VD: 01" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Kệ</label>
              <input type="text" className="form-control" value={formData.rack}
                onChange={(e) => setFormData({ ...formData, rack: e.target.value })} placeholder="VD: 03" />
            </div>
            <div className="form-group">
              <label className="form-label">Tầng</label>
              <input type="text" className="form-control" value={formData.shelf}
                onChange={(e) => setFormData({ ...formData, shelf: e.target.value })} placeholder="VD: 02" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ô</label>
              <input type="text" className="form-control" value={formData.bin}
                onChange={(e) => setFormData({ ...formData, bin: e.target.value })} placeholder="VD: 05" />
            </div>
            <div className="form-group">
              <label className="form-label">Sức chứa (tuỳ chọn)</label>
              <input type="number" className="form-control" value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <input type="text" className="form-control" value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Huỷ</button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Thêm')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete} title="Xoá vị trí"
        message={`Xoá vị trí ${selected?.code}?`}
        type="danger" loading={formLoading} />
    </Layout>
  );
};

export default LocationList;
