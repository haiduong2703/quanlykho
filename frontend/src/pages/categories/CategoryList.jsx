import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Plus, Search, Edit, Trash2, FolderTree } from 'lucide-react';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [pagination.page]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(search && { search })
      });
      const res = await api.get(`/categories?${params}`);
      setCategories(res.data || []);
      setPagination(prev => ({ ...prev, total: res.pagination?.total || 0 }));
    } catch (error) {
      toast.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCategories();
  };

  const openAddModal = () => {
    setSelectedCategory(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setShowModal(true);
  };

  const openDeleteDialog = (category) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (selectedCategory) {
        await api.put(`/categories/${selectedCategory.id}`, formData);
        toast.success('Cập nhật danh mục thành công');
      } else {
        await api.post('/categories', formData);
        toast.success('Thêm danh mục thành công');
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await api.delete(`/categories/${selectedCategory.id}`);
      toast.success('Xóa danh mục thành công');
      setShowDeleteDialog(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Layout title="Quản lý danh mục">
      <div className="page-header">
        <div>
          <h1 className="page-title">Danh mục</h1>
          <p className="page-subtitle">Quản lý danh mục sản phẩm</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Thêm danh mục
        </button>
      </div>

      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-box">
          <Search />
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm danh mục..."
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
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Ngày tạo</th>
                <th style={{ width: '100px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center">Đang tải...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan="5" className="text-center">Không có dữ liệu</td></tr>
              ) : (
                categories.map(category => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FolderTree size={18} style={{ color: 'var(--primary-color)' }} />
                        <span style={{ fontWeight: 500 }}>{category.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {category.description || '-'}
                    </td>
                    <td>{new Date(category.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-icon btn-secondary sm" onClick={() => openEditModal(category)}>
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-icon btn-danger sm" onClick={() => openDeleteDialog(category)}>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label required">Tên danh mục</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? 'Đang xử lý...' : (selectedCategory ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Xóa danh mục"
        message={`Bạn có chắc chắn muốn xóa danh mục "${selectedCategory?.name}"? Danh mục có sản phẩm sẽ không thể xóa.`}
        type="danger"
        loading={formLoading}
      />
    </Layout>
  );
};

export default CategoryList;
