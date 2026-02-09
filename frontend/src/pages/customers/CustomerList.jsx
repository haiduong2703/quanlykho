import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Plus, Search, Edit, Trash2, Users, Phone, Mail, MapPin, ToggleLeft, ToggleRight } from 'lucide-react';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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
    fetchCustomers();
  }, [pagination.page]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(search && { search })
      });
      const res = await api.get(`/customers?${params}`);
      setCustomers(res.data || []);
      setPagination(prev => ({ ...prev, total: res.pagination?.total || 0 }));
    } catch (error) {
      toast.error('Khong the tai danh sach khach hang');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCustomers();
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

  const openEditModal = (customer) => {
    setIsEdit(true);
    setSelectedCustomer(customer);
    setFormData({
      code: customer.code,
      name: customer.name,
      contact_person: customer.contact_person || '',
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || '',
      tax_code: customer.tax_code || '',
      note: customer.note || ''
    });
    setShowModal(true);
  };

  const openDeleteDialog = (customer) => {
    setSelectedCustomer(customer);
    setShowDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (isEdit) {
        await api.put(`/customers/${selectedCustomer.id}`, formData);
        toast.success('Cap nhat khach hang thanh cong');
      } else {
        await api.post('/customers', formData);
        toast.success('Them khach hang thanh cong');
      }
      setShowModal(false);
      fetchCustomers();
    } catch (error) {
      toast.error(error.message || 'Co loi xay ra');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await api.delete(`/customers/${selectedCustomer.id}`);
      toast.success('Xoa khach hang thanh cong');
      setShowDeleteDialog(false);
      fetchCustomers();
    } catch (error) {
      toast.error(error.message || 'Co loi xay ra');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (customer) => {
    try {
      await api.patch(`/customers/${customer.id}/toggle-status`);
      toast.success(customer.is_active ? 'Da vo hieu hoa khach hang' : 'Da kich hoat khach hang');
      fetchCustomers();
    } catch (error) {
      toast.error('Co loi xay ra');
    }
  };

  return (
    <Layout title="Quan ly khach hang">
      <div className="page-header">
        <div>
          <h1 className="page-title">Khach hang</h1>
          <p className="page-subtitle">Quan ly danh sach khach hang mua hang</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Them khach hang
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
                <th>Ma KH</th>
                <th>Ten khach hang</th>
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
              ) : customers.length === 0 ? (
                <tr><td colSpan="7" className="text-center">Khong co du lieu</td></tr>
              ) : (
                customers.map(customer => (
                  <tr key={customer.id}>
                    <td>
                      <code style={{
                        background: 'var(--info-color)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 600
                      }}>
                        {customer.code}
                      </code>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{customer.name}</div>
                      {customer.address && (
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} />
                          {customer.address.substring(0, 50)}{customer.address.length > 50 ? '...' : ''}
                        </div>
                      )}
                    </td>
                    <td>{customer.contact_person || '-'}</td>
                    <td>
                      {customer.phone ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={14} />
                          {customer.phone}
                        </div>
                      ) : '-'}
                    </td>
                    <td>
                      {customer.email ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={14} />
                          {customer.email}
                        </div>
                      ) : '-'}
                    </td>
                    <td>
                      <span className={`badge ${customer.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {customer.is_active ? 'Hoat dong' : 'Ngung'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-icon btn-secondary sm"
                          onClick={() => handleToggleStatus(customer)}
                          title={customer.is_active ? 'Vo hieu hoa' : 'Kich hoat'}
                        >
                          {customer.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                        <button
                          className="btn btn-icon btn-primary sm"
                          onClick={() => openEditModal(customer)}
                          title="Sua"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-icon btn-danger sm"
                          onClick={() => openDeleteDialog(customer)}
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
        title={isEdit ? 'Sua khach hang' : 'Them khach hang moi'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ma KH</label>
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
              <label className="form-label">Ten khach hang *</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhap ten khach hang"
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
        title="Xoa khach hang"
        message={`Ban co chac chan muon xoa khach hang "${selectedCustomer?.name}"?`}
        type="danger"
        loading={formLoading}
      />
    </Layout>
  );
};

export default CustomerList;
