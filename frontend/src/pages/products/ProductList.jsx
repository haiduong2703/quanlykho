import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Plus, Search, Edit, Trash2, Package, Upload, X, Image } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const UPLOADS_URL = `${API_URL}/uploads/products`;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    sku: '', name: '', description: '', category_id: '', unit: '', price: '', min_stock: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, categoryFilter]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/all');
      setCategories(res.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(search && { search }),
        ...(categoryFilter && { category_id: categoryFilter })
      });
      const res = await api.get(`/products?${params}`);
      setProducts(res.data || []);
      setPagination(prev => ({ ...prev, total: res.pagination?.total || 0 }));
    } catch (error) {
      toast.error('Khong the tai danh sach san pham');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProducts();
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setFormData({ sku: '', name: '', description: '', category_id: '', unit: '', price: '', min_stock: '0' });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      description: product.description || '',
      category_id: product.category_id,
      unit: product.unit,
      price: product.price,
      min_stock: product.min_stock
    });
    setImageFile(null);
    setImagePreview(product.image_url || (product.image ? `${UPLOADS_URL}/${product.image}` : null));
    setShowModal(true);
  };

  const openDeleteDialog = (product) => {
    setSelectedProduct(product);
    setShowDeleteDialog(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kich thuoc file khong duoc vuot qua 5MB');
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        toast.error('Chi chap nhan file anh (jpg, png, gif, webp)');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      // Use FormData for file upload
      const submitData = new FormData();
      submitData.append('sku', formData.sku);
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('category_id', formData.category_id);
      submitData.append('unit', formData.unit);
      submitData.append('price', formData.price);
      submitData.append('min_stock', formData.min_stock);

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      if (selectedProduct) {
        await api.put(`/products/${selectedProduct.id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Cap nhat san pham thanh cong');
      } else {
        await api.post('/products', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Them san pham thanh cong');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Co loi xay ra');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await api.delete(`/products/${selectedProduct.id}`);
      toast.success('Xoa san pham thanh cong');
      setShowDeleteDialog(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Co loi xay ra');
    } finally {
      setFormLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
  };

  const getImageUrl = (product) => {
    // Prefer image_url from API, fallback to manual construction
    if (product.image_url) return product.image_url;
    if (product.image) return `${UPLOADS_URL}/${product.image}`;
    return null;
  };

  return (
    <Layout title="Quan ly san pham">
      <div className="page-header">
        <div>
          <h1 className="page-title">San pham</h1>
          <p className="page-subtitle">Quan ly danh sach san pham trong kho</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Them san pham
        </button>
      </div>

      {/* Search & Filters */}
      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-box">
          <Search />
          <input
            type="text"
            className="form-control"
            placeholder="Tim kiem theo ten, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <select
          className="form-control filter-select"
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
        >
          <option value="">Tat ca danh muc</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Hinh anh</th>
                <th>SKU</th>
                <th>Ten san pham</th>
                <th>Danh muc</th>
                <th>Don vi</th>
                <th>Gia</th>
                <th>Ton toi thieu</th>
                <th>Trang thai</th>
                <th style={{ width: '100px' }}>Thao tac</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="text-center">Dang tai...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="9" className="text-center">Khong co du lieu</td></tr>
              ) : (
                products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: 'var(--bg-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-color)'
                      }}>
                        {getImageUrl(product) ? (
                          <img
                            src={getImageUrl(product)}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Package size={24} style={{ color: 'var(--text-secondary)' }} />
                        )}
                      </div>
                    </td>
                    <td><code>{product.sku}</code></td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{product.name}</div>
                      {product.description && (
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {product.description.substring(0, 50)}...
                        </div>
                      )}
                    </td>
                    <td>{product.category_name}</td>
                    <td>{product.unit}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.min_stock}</td>
                    <td>
                      <span className={`badge ${product.is_active ? 'badge-success' : 'badge-secondary'}`}>
                        {product.is_active ? 'Hoat dong' : 'Ngung'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-icon btn-secondary sm" onClick={() => openEditModal(product)}>
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-icon btn-danger sm" onClick={() => openDeleteDialog(product)}>
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
        title={selectedProduct ? 'Sua san pham' : 'Them san pham moi'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">Hinh anh san pham</label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed var(--border-color)',
                position: 'relative'
              }}>
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'var(--danger-color)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <Image size={32} style={{ color: 'var(--text-secondary)' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} />
                  Chon hinh anh
                </button>
                <p className="form-hint" style={{ marginTop: '8px' }}>
                  Chap nhan: JPG, PNG, GIF, WebP. Toi da 5MB.
                </p>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">SKU</label>
              <input
                type="text"
                className="form-control"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
                disabled={!!selectedProduct}
              />
            </div>
            <div className="form-group">
              <label className="form-label required">Danh muc</label>
              <select
                className="form-control"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                required
              >
                <option value="">-- Chon danh muc --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label required">Ten san pham</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mo ta</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Don vi tinh</label>
              <input
                type="text"
                className="form-control"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
                placeholder="VD: Cai, Kg, Hop..."
              />
            </div>
            <div className="form-group">
              <label className="form-label required">Gia</label>
              <input
                type="number"
                className="form-control"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label required">So luong ton toi thieu</label>
            <input
              type="number"
              className="form-control"
              value={formData.min_stock}
              onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
              required
              min="0"
            />
            <p className="form-hint">He thong se canh bao khi ton kho thap hon muc nay</p>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Huy
            </button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? 'Dang xu ly...' : (selectedProduct ? 'Cap nhat' : 'Them moi')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Xoa san pham"
        message={`Ban co chac chan muon xoa san pham "${selectedProduct?.name}"?`}
        type="danger"
        loading={formLoading}
      />
    </Layout>
  );
};

export default ProductList;
