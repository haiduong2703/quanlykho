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
    code: '',
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    tax_code: '',
    note: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, [pagination.page]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(search && { search })
      });
      const res = await api.get(`/suppliers?${params}`);
      setSuppliers(res.data || []);
      setPagination(prev => ({ ...prev, total: res.pagination?.total || 0 }));
    } catch (error) {
      toast.error('Khong the tai danh sach nha cung cap');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchSuppliers();
  };

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      code: '',
      name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      tax_code: '',
      note: ''
    });
    setShowModal(true);
  };

  const openEditModal = (supplier) => {
    setIsEdit(true);
    setSelectedSupplier(supplier);
    setFormData({
      code: supplier.code,
      name: supplier.name,
      contact_person: supplier.contact_person || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      tax_code: supplier.tax_code || '',
      note: supplier.note || ''
    });
    setShowModal(true);
  };

  const openDeleteDialog = (supplier) => {
    setSelectedSupplier(supplier);
    setShowDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (isEdit) {
        await api.put(`/suppliers/${selectedSupplier.id}`, formData);
        toast.success('Cap nhat nha cung cap thanh cong');
      } else {
        await api.post('/suppliers', formData);
        toast.success('Them nha cung cap thanh cong');
      }
      setShowModal(false);
      fetchSuppliers();
    } catch (error) {
      toast.error(error.message || 'Co loi xay ra');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await api.delete(`/suppliers/${selectedSupplier.id}`);
      toast.success('Xoa nha cung cap thanh cong');
      setShowDeleteDialog(false);
      fetchSuppliers();
    } catch (error) {
      toast.error(error.message || 'Co loi xay ra');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (supplier) => {
    try {
      await api.patch(`/suppliers/${supplier.id}/toggle-status`);
      toast.success(supplier.is_active ? 'Da vo hieu hoa nha cung cap' : 'Da kich hoat nha cung cap');
      fetchSuppliers();
    } catch (error) {
      toast.error('Co loi xay ra');
    }
  };

  return (
    <Layout title="Quan ly nha cung cap">
      <div className="page-header">
        <div>
          <h1 className="page-title">Nha cung cap</h1>
          <p className="page-subtitle">Quan ly danh sach nha cung cap hang hoa</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Them nha cung cap
        </button>
      </div>

      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-box">
          <Search />
          <input
            type="text"
            className="form-control"
            placeholder="Tim kiem theo ma, ten, SDT, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Ma NCC</th>
                <th>Ten nha cung cap</th>
                <th>Lien he</th>
                <th>Dien thoai</th>
                <th>Email</th>
                <th>Trang thai</th>
                <th style={{ width: '120px' }}>Thao tac</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center">Dang tai...</td></tr>
              ) : suppliers.length === 0 ? (
                <tr><td colSpan="7" className="text-center">Khong co du lieu</td></tr>
              ) : (
                suppliers.map(supplier => (
                  <tr key={supplier.id}>
                    <td>
                      <code style={{
                        background: 'var(--primary-color)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 600
                      }}>
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
                    <td>
                      {supplier.phone ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={14} />
                          {supplier.phone}
                        </div>
                      ) : '-'}
                    </td>
                    <td>
                      {supplier.email ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={14} />
                          {supplier.email}
                        </div>
                      ) : '-'}
                    </td>
                    <td>
                      <span className={`badge ${supplier.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {supplier.is_active ? 'Hoat dong' : 'Ngung'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-icon btn-secondary sm"
                          onClick={() => handleToggleStatus(supplier)}
                          title={supplier.is_active ? 'Vo hieu hoa' : 'Kich hoat'}
                        >
                          {supplier.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                        <button
                          className="btn btn-icon btn-primary sm"
                          onClick={() => openEditModal(supplier)}
                          title="Sua"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-icon btn-danger sm"
                          onClick={() => openDeleteDialog(supplier)}
                          title="Xoa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={pagination.page}
          totalPages={Math.ceil(pagination.total / pagination.limit)}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEdit ? 'Sua nha cung cap' : 'Them nha cung cap moi'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ma NCC</label>
              <input
                type="text"
                className="form-control"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="Tu dong neu de trong"
                disabled={isEdit}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ten nha cung cap *</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhap ten nha cung cap"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nguoi lien he</label>
              <input
                type="text"
                className="form-control"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                placeholder="Nhap ten nguoi lien he"
              />
            </div>
            <div className="form-group">
              <label className="form-label">So dien thoai</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Nhap so dien thoai"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Nhap email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ma so thue</label>
              <input
                type="text"
                className="form-control"
                value={formData.tax_code}
                onChange={(e) => setFormData({ ...formData, tax_code: e.target.value })}
                placeholder="Nhap ma so thue"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Dia chi</label>
            <input
              type="text"
              className="form-control"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Nhap dia chi"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ghi chu</label>
            <textarea
              className="form-control"
              rows="2"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Nhap ghi chu"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Huy
            </button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? 'Dang xu ly...' : (isEdit ? 'Cap nhat' : 'Them moi')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Xoa nha cung cap"
        message={`Ban co chac chan muon xoa nha cung cap "${selectedSupplier?.name}"?`}
        type="danger"
        loading={formLoading}
      />
    </Layout>
  );
};

export default SupplierList;
