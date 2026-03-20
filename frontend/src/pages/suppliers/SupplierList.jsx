import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Plus, Search, Edit, Trash2, Truck, Phone, Mail, MapPin, ToggleLeft, ToggleRight } from 'lucide-react';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    code: '', name: '', contact_person: '', phone: '', email: '', address: '', tax_code: '', note: ''
  });

  useEffect(() => { fetchSuppliers(); }, [pagination.page]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page, limit: pagination.limit, ...(search && { search })
      });
      const res = await api.get(`/suppliers?${params}`);
      setSuppliers(res.data || []);
      setPagination(prev => ({ ...prev, total: res.pagination?.total || 0 }));
    } catch (error) {
      toast.error('Không thể tải danh sách nhà cung cấp');
    } finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); setPagination(prev => ({ ...prev, page: 1 })); fetchSuppliers(); };

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({ code: '', name: '', contact_person: '', phone: '', email: '', address: '', tax_code: '', note: '' });
    setShowModal(true);
  };

  const openEditModal = (supplier) => {
    setIsEdit(true); setSelectedSupplier(supplier);
    setFormData({
      code: supplier.code, name: supplier.name, contact_person: supplier.contact_person || '',
      phone: supplier.phone || '', email: supplier.email || '', address: supplier.address || '',
      tax_code: supplier.tax_code || '', note: supplier.note || ''
    });
    setShowModal(true);
  };

  const openDeleteDialog = (supplier) => { setSelectedSupplier(supplier); setShowDeleteDialog(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormLoading(true);
    try {
      if (isEdit) {
        await api.put(`/suppliers/${selectedSupplier.id}`, formData);
        toast.success('Cập nhật nhà cung cấp thành công');
      } else {
        await api.post('/suppliers', formData);
        toast.success('Thêm nhà cung cấp thành công');
      }
      setShowModal(false); fetchSuppliers();
    } catch (error) { toast.error(error.message || 'Có lỗi xảy ra'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await api.delete(`/suppliers/${selectedSupplier.id}`);
      toast.success('Xóa nhà cung cấp thành công');
      setShowDeleteDialog(false); fetchSuppliers();
    } catch (error) { toast.error(error.message || 'Có lỗi xảy ra'); }
    finally { setFormLoading(false); }
  };

  const handleToggleStatus = async (supplier) => {
    try {
      await api.patch(`/suppliers/${supplier.id}/toggle-status`);
      toast.success(supplier.is_active ? 'Đã vô hiệu hóa nhà cung cấp' : 'Đã kích hoạt nhà cung cấp');
      fetchSuppliers();
    } catch (error) { toast.error('Có lỗi xảy ra'); }
  };

  return (
    <Layout title="Quản lý nhà cung cấp">
      <div className="page-header">
        <div>
          <h1 className="page-title">Nhà cung cấp</h1>
          <p className="page-subtitle">Quản lý danh sách nhà cung cấp hàng hóa</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Thêm nhà cung cấp
        </button>
      </div>

      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-box">
          <Search />
          <input type="text" className="form-control" placeholder="Tìm kiếm theo mã, tên, SĐT, email..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </form>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã NCC</th><th>Tên nhà cung cấp</th><th>Liên hệ</th>
                <th>Điện thoại</th><th>Email</th><th>Trạng thái</th>
                <th style={{ width: '120px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center">Đang tải...</td></tr>
              ) : suppliers.length === 0 ? (
                <tr><td colSpan="7" className="text-center">Không có dữ liệu</td></tr>
              ) : (
                suppliers.map(supplier => (
                  <tr key={supplier.id}>
                    <td>
                      <code style={{ background: 'var(--primary-color)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {supplier.code}
                      </code>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{supplier.name}</div>
                      {supplier.address && (
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} />
                          {supplier.address.substring(0, 50)}{supplier.address.length > 50 ? '...' : ''}
                        </div>
                      )}
                    </td>
                    <td>{supplier.contact_person || '-'}</td>
                    <td>{supplier.phone ? (<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14} />{supplier.phone}</div>) : '-'}</td>
                    <td>{supplier.email ? (<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14} />{supplier.email}</div>) : '-'}</td>
                    <td>
                      <span className={`badge ${supplier.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {supplier.is_active ? 'Hoạt động' : 'Ngừng'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-icon btn-secondary sm" onClick={() => handleToggleStatus(supplier)} title={supplier.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'}>
                          {supplier.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                        <button className="btn btn-icon btn-primary sm" onClick={() => openEditModal(supplier)} title="Sửa"><Edit size={16} /></button>
                        <button className="btn btn-icon btn-danger sm" onClick={() => openDeleteDialog(supplier)} title="Xóa"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={pagination.page} totalPages={Math.ceil(pagination.total / pagination.limit)}
          totalItems={pagination.total} itemsPerPage={pagination.limit}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={isEdit ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mã NCC</label>
              <input type="text" className="form-control" value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="Tự động nếu để trống" disabled={isEdit} />
            </div>
            <div className="form-group">
              <label className="form-label">Tên nhà cung cấp *</label>
              <input type="text" className="form-control" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên nhà cung cấp" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Người liên hệ</label>
              <input type="text" className="form-control" value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                placeholder="Nhập tên người liên hệ" />
            </div>
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input type="text" className="form-control" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Nhập số điện thoại" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Nhập email" />
            </div>
            <div className="form-group">
              <label className="form-label">Mã số thuế</label>
              <input type="text" className="form-control" value={formData.tax_code}
                onChange={(e) => setFormData({ ...formData, tax_code: e.target.value })} placeholder="Nhập mã số thuế" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Địa chỉ</label>
            <input type="text" className="form-control" value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Nhập địa chỉ" />
          </div>
          <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <textarea className="form-control" rows="2" value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })} placeholder="Nhập ghi chú" />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? 'Đang xử lý...' : (isEdit ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onConfirm={handleDelete}
        title="Xóa nhà cung cấp" message={`Bạn có chắc chắn muốn xóa nhà cung cấp "${selectedSupplier?.name}"?`}
        type="danger" loading={formLoading} />
    </Layout>
  );
};

export default SupplierList;
