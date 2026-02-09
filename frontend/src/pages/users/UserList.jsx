import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Plus, Search, Edit, Trash2, UserCheck, UserX, Users, Shield, ShieldCheck } from 'lucide-react';

const UserList = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    role: 'STAFF'
  });

  // Redirect if not admin
  if (currentUser?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchUsers();
  }, [pagination.page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(search && { search })
      });
      const res = await api.get(`/users?${params}`);
      setUsers(res.data || []);
      setPagination(prev => ({ ...prev, total: res.pagination?.total || 0 }));
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      full_name: '',
      role: 'STAFF'
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      full_name: user.full_name,
      role: user.role
    });
    setShowModal(true);
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = { ...formData };
      if (selectedUser && !payload.password) {
        delete payload.password;
      }

      if (selectedUser) {
        await api.put(`/users/${selectedUser.id}`, payload);
        toast.success('Cập nhật người dùng thành công');
      } else {
        await api.post('/users', payload);
        toast.success('Thêm người dùng thành công');
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await api.delete(`/users/${selectedUser.id}`);
      toast.success('Xóa người dùng thành công');
      setShowDeleteDialog(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setFormLoading(false);
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      await api.patch(`/users/${user.id}/toggle-status`);
      toast.success(`${user.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'} người dùng thành công`);
      fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
  };

  return (
    <Layout title="Quản lý người dùng">
      <div className="page-header">
        <div>
          <h1 className="page-title">Người dùng</h1>
          <p className="page-subtitle">Quản lý tài khoản và phân quyền người dùng</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Thêm người dùng
        </button>
      </div>

      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-box">
          <Search />
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm theo tên, email..."
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
                <th>ID</th>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th style={{ width: '130px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center">Đang tải...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="7" className="text-center">Không có dữ liệu</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: user.role === 'ADMIN' ? 'var(--primary-color)' : 'var(--info-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '14px'
                        }}>
                          {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500 }}>{user.full_name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: user.role === 'ADMIN' ? 'var(--primary-bg)' : 'var(--info-bg)',
                        color: user.role === 'ADMIN' ? 'var(--primary-color)' : 'var(--info-color)'
                      }}>
                        {user.role === 'ADMIN' ? <ShieldCheck size={14} /> : <Shield size={14} />}
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.is_active ? 'badge-success' : 'badge-secondary'}`}>
                        {user.is_active ? 'Hoạt động' : 'Vô hiệu'}
                      </span>
                    </td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-icon btn-secondary sm"
                          onClick={() => openEditModal(user)}
                          title="Sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className={`btn btn-icon sm ${user.is_active ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => toggleUserStatus(user)}
                          title={user.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                          disabled={user.id === currentUser?.id}
                        >
                          {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button
                          className="btn btn-icon btn-danger sm"
                          onClick={() => openDeleteDialog(user)}
                          title="Xóa"
                          disabled={user.id === currentUser?.id}
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
        title={selectedUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label required">Tên đăng nhập</label>
            <input
              type="text"
              className="form-control"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={!!selectedUser}
              placeholder="Nhập tên đăng nhập..."
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Họ và tên</label>
            <input
              type="text"
              className="form-control"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              placeholder="Nhập họ và tên..."
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Nhập email..."
            />
          </div>

          <div className="form-group">
            <label className={`form-label ${!selectedUser ? 'required' : ''}`}>
              Mật khẩu {selectedUser && '(để trống nếu không đổi)'}
            </label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!selectedUser}
              placeholder={selectedUser ? 'Nhập mật khẩu mới...' : 'Nhập mật khẩu...'}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Vai trò</label>
            <select
              className="form-control"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              <option value="STAFF">Staff - Nhân viên</option>
              <option value="ADMIN">Admin - Quản trị viên</option>
            </select>
            <p className="form-hint">
              Admin có toàn quyền quản lý. Staff chỉ có quyền thao tác nhập/xuất kho.
            </p>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? 'Đang xử lý...' : (selectedUser ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa người dùng "${selectedUser?.full_name}"? Hành động này không thể hoàn tác.`}
        type="danger"
        loading={formLoading}
      />
    </Layout>
  );
};

export default UserList;
