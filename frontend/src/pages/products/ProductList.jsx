import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Plus, Search, Edit, Trash2, Package, Upload, X, Image, ToggleLeft, ToggleRight, FileSpreadsheet, Download, AlertCircle, CheckCircle2 } from 'lucide-react';

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
  const [showToggleDialog, setShowToggleDialog] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    sku: '', name: '', description: '', category_id: '', unit: '', price: '', min_stock: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Import Excel state
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const importFileInputRef = useRef(null);

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
      toast.error('Không thể tải danh sách sản phẩm');
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
    setImagePreview(product.image_url || getImageUrl(product));
    setShowModal(true);
  };

  const openDeleteDialog = (product) => {
    setSelectedProduct(product);
    setShowDeleteDialog(true);
  };

  const openToggleDialog = (product) => {
    setSelectedProduct(product);
    setShowToggleDialog(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB');
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        toast.error('Chỉ chấp nhận file ảnh (jpg, png, gif, webp)');
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
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        await api.post('/products', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Thêm sản phẩm thành công');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await api.delete(`/products/${selectedProduct.id}`);
      toast.success('Xóa sản phẩm thành công');
      setShowDeleteDialog(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    setFormLoading(true);
    try {
      await api.patch(`/products/${selectedProduct.id}/toggle-status`);
      toast.success(
        selectedProduct.is_active
          ? 'Đã ngừng hoạt động sản phẩm'
          : 'Đã kích hoạt sản phẩm'
      );
      setShowToggleDialog(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setFormLoading(false);
    }
  };

  // Import Excel handlers
  const openImportModal = () => {
    setImportFile(null);
    setImportResult(null);
    setShowImportModal(true);
  };

  const handleImportFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
        toast.error('Chỉ chấp nhận file Excel (.xlsx, .xls)');
        return;
      }
      setImportFile(file);
      setImportResult(null);
    }
  };

  const handleDownloadSample = async () => {
    try {
      const response = await api.get('/products/sample-excel', {
        responseType: 'blob'
      });
      // api interceptor returns response.data, so response here is already the data
      const blob = response instanceof Blob ? response : new Blob([response]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mau-import-san-pham.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error.message || 'Không thể tải file mẫu');
    }
  };

  const handleImportSubmit = async () => {
    if (!importFile) {
      toast.error('Vui lòng chọn file Excel');
      return;
    }

    setImportLoading(true);
    setImportResult(null);

    try {
      const submitData = new FormData();
      submitData.append('file', importFile);

      const res = await api.post('/products/import-excel', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setImportResult(res.data);

      if (res.data?.success > 0) {
        toast.success(`Import thành công ${res.data.success} sản phẩm`);
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi import');
    } finally {
      setImportLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
  };

  const getImageUrl = (product) => {
    if (product.image_url) return product.image_url;
    if (!product.image) return null;
    // External URL (e.g. crawled from svietdecor.com) — use directly
    if (product.image.startsWith('http://') || product.image.startsWith('https://')) return product.image;
    // Local upload — construct path
    return `${UPLOADS_URL}/${product.image}`;
  };

  return (
    <Layout title="Quản lý sản phẩm">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sản phẩm</h1>
          <p className="page-subtitle">Quản lý danh sách sản phẩm trong kho</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={openImportModal}>
            <FileSpreadsheet size={18} />
            Import Excel
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-box">
          <Search />
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm theo tên, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <select
          className="form-control filter-select"
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
        >
          <option value="">Tất cả danh mục</option>
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
                <th style={{ width: '80px' }}>Hình ảnh</th>
                <th>SKU</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Đơn vị</th>
                <th>Giá</th>
                <th>Tồn tối thiểu</th>
                <th>Trạng thái</th>
                <th style={{ width: '140px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="text-center">Đang tải...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="9" className="text-center">Không có dữ liệu</td></tr>
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
                        {product.is_active ? 'Hoạt động' : 'Ngừng'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-icon btn-secondary sm" onClick={() => openEditModal(product)} title="Sửa">
                          <Edit size={16} />
                        </button>
                        <button
                          className={`btn btn-icon sm ${product.is_active ? 'btn-warning' : 'btn-success'}`}
                          onClick={() => openToggleDialog(product)}
                          title={product.is_active ? 'Ngừng hoạt động' : 'Kích hoạt'}
                          style={{ minWidth: '32px' }}
                        >
                          {product.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                        <button className="btn btn-icon btn-danger sm" onClick={() => openDeleteDialog(product)} title="Xóa">
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
        title={selectedProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">Hình ảnh sản phẩm</label>
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
                  Chọn hình ảnh
                </button>
                <p className="form-hint" style={{ marginTop: '8px' }}>
                  Chấp nhận: JPG, PNG, GIF, WebP. Tối đa 5MB.
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
              <label className="form-label required">Danh mục</label>
              <select
                className="form-control"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label required">Tên sản phẩm</label>
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

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Đơn vị tính</label>
              <input
                type="text"
                className="form-control"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
                placeholder="VD: Cái, Kg, Hộp..."
              />
            </div>
            <div className="form-group">
              <label className="form-label required">Giá</label>
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
            <label className="form-label required">Số lượng tồn tối thiểu</label>
            <input
              type="number"
              className="form-control"
              value={formData.min_stock}
              onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
              required
              min="0"
            />
            <p className="form-hint">Hệ thống sẽ cảnh báo khi tồn kho thấp hơn mức này</p>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? 'Đang xử lý...' : (selectedProduct ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Import Excel Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import sản phẩm từ Excel"
        size="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Download sample */}
          <div style={{
            padding: '16px',
            background: 'var(--bg-secondary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <p style={{ marginBottom: '12px', fontWeight: 500 }}>
              Bước 1: Tải file mẫu
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Tải file Excel mẫu để biết định dạng dữ liệu cần import.
            </p>
            <button className="btn btn-secondary" onClick={handleDownloadSample}>
              <Download size={16} />
              Tải file mẫu Excel
            </button>
          </div>

          {/* File upload */}
          <div style={{
            padding: '16px',
            background: 'var(--bg-secondary)',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <p style={{ marginBottom: '12px', fontWeight: 500 }}>
              Bước 2: Chọn file Excel để import
            </p>
            <input
              type="file"
              ref={importFileInputRef}
              onChange={handleImportFileChange}
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => importFileInputRef.current?.click()}
                disabled={importLoading}
              >
                <Upload size={16} />
                Chọn file
              </button>
              {importFile && (
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <FileSpreadsheet size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {importFile.name}
                </span>
              )}
            </div>
            <p className="form-hint" style={{ marginTop: '8px' }}>
              Chấp nhận: .xlsx, .xls
            </p>
          </div>

          {/* Import results */}
          {importResult && (
            <div style={{
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: importResult.errors?.length > 0 ? '#fff8f0' : '#f0fff4'
            }}>
              <p style={{ fontWeight: 500, marginBottom: '12px' }}>Kết quả import</p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: importResult.errors?.length > 0 ? '12px' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 500 }}>Tổng:</span>
                  <span>{importResult.total || 0}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success-color)' }}>
                  <CheckCircle2 size={16} />
                  <span style={{ fontWeight: 500 }}>Thành công:</span>
                  <span>{importResult.success || 0}</span>
                </div>
                {importResult.skipped > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                    <span style={{ fontWeight: 500 }}>Bỏ qua:</span>
                    <span>{importResult.skipped}</span>
                  </div>
                )}
                {importResult.errors?.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger-color, #e74c3c)' }}>
                    <AlertCircle size={16} />
                    <span style={{ fontWeight: 500 }}>Lỗi:</span>
                    <span>{importResult.errors.length}</span>
                  </div>
                )}
              </div>
              {importResult.errors?.length > 0 && (
                <div style={{
                  maxHeight: '150px',
                  overflowY: 'auto',
                  background: 'var(--bg-primary, #fff)',
                  borderRadius: '6px',
                  padding: '10px',
                  border: '1px solid var(--border-color)'
                }}>
                  {importResult.errors.map((err, index) => (
                    <div key={index} style={{
                      fontSize: '13px',
                      color: 'var(--danger-color, #e74c3c)',
                      padding: '4px 0',
                      borderBottom: index < importResult.errors.length - 1 ? '1px solid var(--border-color)' : 'none'
                    }}>
                      {err}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowImportModal(false)}
            >
              Đóng
            </button>
            <button
              className="btn btn-primary"
              onClick={handleImportSubmit}
              disabled={!importFile || importLoading}
            >
              {importLoading ? 'Đang import...' : 'Import'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Xóa sản phẩm"
        message={`Bạn có chắc chắn muốn xóa sản phẩm "${selectedProduct?.name}"?`}
        type="danger"
        loading={formLoading}
      />

      {/* Toggle Status Confirmation */}
      <ConfirmDialog
        isOpen={showToggleDialog}
        onClose={() => setShowToggleDialog(false)}
        onConfirm={handleToggleStatus}
        title={selectedProduct?.is_active ? 'Ngừng hoạt động sản phẩm' : 'Kích hoạt sản phẩm'}
        message={
          selectedProduct?.is_active
            ? `Bạn có chắc chắn muốn ngừng hoạt động sản phẩm "${selectedProduct?.name}"?`
            : `Bạn có chắc chắn muốn kích hoạt lại sản phẩm "${selectedProduct?.name}"?`
        }
        type="warning"
        loading={formLoading}
      />
    </Layout>
  );
};

export default ProductList;
