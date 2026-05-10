import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight, Star, Warehouse as WhIcon } from 'lucide-react';

const WarehouseList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    code: '', name: '', address: '', phone: '', is_default: false, is_active: true, note: ''
  });

  useEffect(() => { fetchItems(); }, [pagination.page]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page, limit: pagination.limit, ...(search && { search })
      });
      const res = await api.get(`/warehouses?${params}`);
      setItems(res.data || []);
      setPagination(p => ({ ...p, total: res.pagination?.total || 0 }));
    } catch (e) { toast.error('Không thể tải danh sách kho'); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); setPagination(p => ({ ...p, page: 1 })); fetchItems(); };

  const openAdd = () => {
    setIsEdit(false);
    setFormData({ code: '', name: '', address: '', phone: '', is_default: false, is_active: true, note: '' });
    setShowModal(true);
  };

  const openEdit = (wh) => {
    setIsEdit(true); setSelected(wh);
    setFormData({
      code: wh.code, name: wh.name, address: wh.address || '',
      phone: wh.phone || '', is_default: !!wh.is_default, is_active: !!wh.is_active, note: wh.note || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormLoading(true);
    try {
      if (isEdit) await api.put(`/warehouses/${selected.id}`, formData);
      else await api.post('/warehouses', formData);
      toast.success(isEdit ? 'Cập nhật kho thành công' : 'Thêm kho thành công');
      setShowModal(false); fetchItems();
    } catch (e) { toast.error(e.message || 'Có lỗi xảy ra'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await api.delete(`/warehouses/${selected.id}`);
      toast.success('Xoá kho thành công');
      setShowDeleteDialog(false); fetchItems();
    } catch (e) { toast.error(e.message || 'Không thể xoá kho'); }
    finally { setFormLoading(false); }
  };

  const toggleStatus = async (wh) => {
    try {
      await api.patch(`/warehouses/${wh.id}/toggle-status`);
      toast.success(wh.is_active ? 'Đã vô hiệu hoá' : 'Đã kích hoạt');
      fetchItems();
    } catch { toast.error('Có lỗi xảy ra'); }
  };

  return (
    <Layout title="Quản lý kho">
      <div className="page-header">
        <div>
          <h1 className="page-title">Danh sách kho</h1>
          <p className="page-subtitle">Quản lý các kho vật lý</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={18} /> Thêm kho</button>
      </div>

      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-box">
          <Search />
          <input type="text" className="form-control" placeholder="Tìm theo mã, tên, địa chỉ..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </form>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã kho</th><th>Tên</th><th>Quản lý</th><th>Địa chỉ</th>
                <th>SĐT</th><th>Mặc định</th><th>Trạng thái</th><th style={{ width: 120 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={8} className="text-center">Đang tải...</td></tr>
                : items.length === 0 ? <tr><td colSpan={8} className="text-center">Không có kho</td></tr>
                : items.map((wh) => (
                  <tr key={wh.id}>
                    <td><code style={{ background: 'var(--primary-color)', color: 'white', padding: '4px 8px', borderRadius: 4, fontWeight: 600 }}>{wh.code}</code></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <WhIcon size={16} />{wh.name}
                      </div>
                    </td>
                    <td>{wh.manager_name || '-'}</td>
                    <td>{wh.address || '-'}</td>
                    <td>{wh.phone || '-'}</td>
                    <td>{wh.is_default ? <Star size={16} color="gold" fill="gold" /> : '-'}</td>
                    <td>
                      <span className={`badge ${wh.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {wh.is_active ? 'Hoạt động' : 'Ngừng'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-icon btn-secondary sm" title={wh.is_active ? 'Vô hiệu hoá' : 'Kích hoạt'} onClick={() => toggleStatus(wh)}>
                          {wh.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                        <button className="btn btn-icon btn-primary sm" title="Sửa" onClick={() => openEdit(wh)}><Edit size={16} /></button>
                        <button className="btn btn-icon btn-danger sm" title="Xoá" onClick={() => { setSelected(wh); setShowDeleteDialog(true); }}><Trash2 size={16} /></button>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEdit ? 'Sửa kho' : 'Thêm kho mới'} size="md">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mã kho</label>
              <input type="text" className="form-control" value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="Tự sinh WHxx nếu để trống" disabled={isEdit} />
            </div>
            <div className="form-group">
              <label className="form-label">Tên kho *</label>
              <input type="text" className="form-control" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Địa chỉ</label>
            <input type="text" className="form-control" value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">SĐT</label>
              <input type="text" className="form-control" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">
                <input type="checkbox" checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })} /> Đặt làm kho mặc định
              </label>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <textarea className="form-control" rows="2" value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Huỷ</button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete} title="Xoá kho"
        message={`Bạn có chắc xoá kho "${selected?.name}"? Không thể xoá nếu kho còn tồn kho.`}
        type="danger" loading={formLoading} />
    </Layout>
  );
};

export default WarehouseList;
