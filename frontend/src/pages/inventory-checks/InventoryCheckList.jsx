import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Plus, Search, Eye, Trash2, ClipboardCheck, X, Package, Check, XCircle, Printer, Filter } from 'lucide-react';

const InventoryCheckList = () => {
  const [checks, setChecks] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({ note: '', items: [] });
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchChecks(); }, [pagination.page, statusFilter]);

  const fetchCategories = async () => {
    try { const res = await api.get('/categories/all'); setCategories(res.data || []); }
    catch (error) { console.error('Error fetching categories:', error); }
  };

  const fetchProductsForCheck = async (categoryId = '') => {
    try {
      const params = new URLSearchParams();
      if (categoryId) params.append('category_id', categoryId);
      const res = await api.get(`/inventory-checks/products?${params}`);
      return res.data || [];
    } catch (error) { console.error('Error fetching products:', error); return []; }
  };

  const fetchChecks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page, limit: pagination.limit,
        ...(search && { search }), ...(statusFilter && { status: statusFilter })
      });
      const res = await api.get(`/inventory-checks?${params}`);
      setChecks(res.data || []);
      setPagination(prev => ({ ...prev, total: res.pagination?.total || 0 }));
    } catch (error) { toast.error('Không thể tải danh sách phiếu kiểm kê'); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); setPagination(prev => ({ ...prev, page: 1 })); fetchChecks(); };

  const openAddModal = async () => {
    const allProducts = await fetchProductsForCheck();
    setProducts(allProducts);
    setFormData({
      note: '',
      items: allProducts.map(p => ({
        product_id: p.id, product_name: p.name, sku: p.sku, unit: p.unit,
        category_name: p.category_name, system_quantity: p.system_quantity,
        actual_quantity: p.system_quantity, note: ''
      }))
    });
    setSelectedCategory(''); setShowModal(true);
  };

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    const filteredProducts = await fetchProductsForCheck(categoryId);
    setProducts(filteredProducts);
    setFormData({
      ...formData,
      items: filteredProducts.map(p => ({
        product_id: p.id, product_name: p.name, sku: p.sku, unit: p.unit,
        category_name: p.category_name, system_quantity: p.system_quantity,
        actual_quantity: p.system_quantity, note: ''
      }))
    });
  };

  const openDetailModal = async (check) => {
    try { const res = await api.get(`/inventory-checks/${check.id}`); setSelectedCheck(res.data); setShowDetailModal(true); }
    catch (error) { toast.error('Không thể tải chi tiết phiếu kiểm kê'); }
  };

  const openDeleteDialog = (check) => { setSelectedCheck(check); setShowDeleteDialog(true); };
  const openCompleteDialog = (check) => { setSelectedCheck(check); setShowCompleteDialog(true); };
  const openCancelDialog = (check) => { setSelectedCheck(check); setShowCancelDialog(true); };

  const updateItemQuantity = (index, value) => {
    const newItems = [...formData.items]; newItems[index].actual_quantity = parseInt(value) || 0;
    setFormData({ ...formData, items: newItems });
  };

  const updateItemNote = (index, value) => {
    const newItems = [...formData.items]; newItems[index].note = value;
    setFormData({ ...formData, items: newItems });
  };

  const calculateDifference = (item) => item.actual_quantity - item.system_quantity;
  const calculateTotalDifference = () => formData.items.reduce((sum, item) => sum + Math.abs(calculateDifference(item)), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) { toast.error('Không có sản phẩm nào để kiểm kê'); return; }
    setFormLoading(true);
    try {
      await api.post('/inventory-checks', {
        note: formData.note,
        items: formData.items.map(item => ({
          product_id: item.product_id, system_quantity: item.system_quantity,
          actual_quantity: item.actual_quantity, note: item.note
        }))
      });
      toast.success('Tạo phiếu kiểm kê thành công'); setShowModal(false); fetchChecks();
    } catch (error) { toast.error(error.message || 'Có lỗi xảy ra'); }
    finally { setFormLoading(false); }
  };

  const handleComplete = async () => {
    setFormLoading(true);
    try {
      await api.patch(`/inventory-checks/${selectedCheck.id}/complete`);
      toast.success('Hoàn thành kiểm kê và đã cập nhật tồn kho');
      setShowCompleteDialog(false); setShowDetailModal(false); fetchChecks();
    } catch (error) { toast.error(error.message || 'Có lỗi xảy ra'); }
    finally { setFormLoading(false); }
  };

  const handleCancel = async () => {
    setFormLoading(true);
    try {
      await api.patch(`/inventory-checks/${selectedCheck.id}/cancel`);
      toast.success('Đã hủy phiếu kiểm kê');
      setShowCancelDialog(false); setShowDetailModal(false); fetchChecks();
    } catch (error) { toast.error(error.message || 'Có lỗi xảy ra'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await api.delete(`/inventory-checks/${selectedCheck.id}`);
      toast.success('Xóa phiếu kiểm kê thành công'); setShowDeleteDialog(false); fetchChecks();
    } catch (error) { toast.error(error.message || 'Có lỗi xảy ra'); }
    finally { setFormLoading(false); }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      DRAFT: { class: 'badge-warning', text: 'Nháp' },
      COMPLETED: { class: 'badge-success', text: 'Hoàn thành' },
      CANCELLED: { class: 'badge-danger', text: 'Đã hủy' }
    };
    const config = statusConfig[status] || { class: 'badge-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getDifferenceStyle = (difference) => {
    if (difference > 0) return { color: 'var(--success-color)', fontWeight: 600 };
    if (difference < 0) return { color: 'var(--danger-color)', fontWeight: 600 };
    return { color: 'var(--text-secondary)' };
  };

  const handlePrint = () => {
    if (!selectedCheck) return;
    const printContent = `
      <!DOCTYPE html><html><head><title>Phiếu kiểm kê - ${selectedCheck.check_code}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', serif; padding: 20px; font-size: 14px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { font-size: 20px; text-transform: uppercase; margin-bottom: 5px; }
        .header h2 { font-size: 18px; color: #17a2b8; margin-bottom: 10px; }
        .header p { font-size: 12px; color: #666; }
        .info { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 10px; background: #f9f9f9; border-radius: 5px; }
        .info-group { flex: 1; } .info-group label { font-weight: bold; color: #333; display: block; margin-bottom: 3px; font-size: 12px; }
        .info-group span { color: #555; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
        th { background: #17a2b8; color: white; font-weight: bold; }
        tr:nth-child(even) { background: #f9f9f9; }
        .text-right { text-align: right; } .text-center { text-align: center; }
        .positive { color: #28a745; } .negative { color: #dc3545; }
        .summary { margin-top: 20px; padding: 10px; background: #e8f4f8; border-radius: 5px; }
        .footer { margin-top: 40px; display: flex; justify-content: space-between; }
        .signature { text-align: center; width: 200px; } .signature p { margin-bottom: 60px; font-weight: bold; }
        .signature span { display: block; font-style: italic; font-size: 12px; }
        @media print { body { padding: 0; } }
      </style></head><body>
        <div class="header">
          <h1>Hệ Thống Quản Lý Kho</h1>
          <h2>PHIẾU KIỂM KÊ KHO</h2>
          <p>Mã phiếu: <strong>${selectedCheck.check_code}</strong></p>
        </div>
        <div class="info">
          <div class="info-group"><label>Ngày kiểm kê:</label><span>${formatDate(selectedCheck.check_date)}</span></div>
          <div class="info-group"><label>Trạng thái:</label><span>${selectedCheck.status === 'COMPLETED' ? 'Hoàn thành' : selectedCheck.status === 'CANCELLED' ? 'Đã hủy' : 'Nháp'}</span></div>
          <div class="info-group"><label>Người kiểm kê:</label><span>${selectedCheck.user_full_name || 'N/A'}</span></div>
        </div>
        <table><thead><tr>
          <th class="text-center" style="width: 40px;">STT</th><th style="width: 80px;">Mã SKU</th>
          <th>Tên sản phẩm</th><th class="text-center" style="width: 80px;">Tồn hệ thống</th>
          <th class="text-center" style="width: 80px;">Tồn thực tế</th><th class="text-center" style="width: 80px;">Chênh lệch</th>
          <th>Ghi chú</th>
        </tr></thead><tbody>
          ${selectedCheck.details?.map((item, index) => `
            <tr><td class="text-center">${index + 1}</td><td>${item.sku}</td><td>${item.product_name}</td>
            <td class="text-center">${item.system_quantity}</td><td class="text-center">${item.actual_quantity}</td>
            <td class="text-center ${item.difference > 0 ? 'positive' : item.difference < 0 ? 'negative' : ''}">${item.difference > 0 ? '+' : ''}${item.difference}</td>
            <td>${item.note || ''}</td></tr>
          `).join('')}
        </tbody></table>
        <div class="summary"><strong>Tổng hợp:</strong> ${selectedCheck.total_products} sản phẩm | Tổng chênh lệch: ${selectedCheck.total_difference} đơn vị</div>
        ${selectedCheck.note ? `<div style="margin-top: 10px;"><strong>Ghi chú:</strong> ${selectedCheck.note}</div>` : ''}
        <div class="footer">
          <div class="signature"><p>Người kiểm kê</p><span>(Ký, ghi rõ họ tên)</span></div>
          <div class="signature"><p>Thủ kho</p><span>(Ký, ghi rõ họ tên)</span></div>
          <div class="signature"><p>Kế toán</p><span>(Ký, ghi rõ họ tên)</span></div>
        </div>
      </body></html>`;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent); printWindow.document.close(); printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 250);
  };

  return (
    <Layout title="Kiểm kê kho">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kiểm kê kho</h1>
          <p className="page-subtitle">Quản lý kiểm kê tồn kho thực tế</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Tạo phiếu kiểm kê
        </button>
      </div>

      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-box">
          <Search />
          <input type="text" className="form-control" placeholder="Tìm kiếm theo mã phiếu..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </form>
        <select className="form-control" style={{ width: '150px' }} value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}>
          <option value="">Tất cả trạng thái</option>
          <option value="DRAFT">Nháp</option>
          <option value="COMPLETED">Hoàn thành</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã phiếu</th><th>Ngày kiểm kê</th><th>Số sản phẩm</th>
                <th>Tổng chênh lệch</th><th>Trạng thái</th><th>Người tạo</th>
                <th style={{ width: '120px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center">Đang tải...</td></tr>
              ) : checks.length === 0 ? (
                <tr><td colSpan="7" className="text-center">Không có dữ liệu</td></tr>
              ) : (
                checks.map(item => (
                  <tr key={item.id}>
                    <td>
                      <code style={{ background: 'var(--info-color)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {item.check_code}
                      </code>
                    </td>
                    <td>{formatDate(item.check_date)}</td>
                    <td>{item.total_products} sản phẩm</td>
                    <td style={{ fontWeight: 600, color: item.total_difference > 0 ? 'var(--danger-color)' : 'var(--text-secondary)' }}>
                      {item.total_difference} đơn vị
                    </td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>{item.user_full_name || 'N/A'}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-icon btn-secondary sm" onClick={() => openDetailModal(item)} title="Xem chi tiết"><Eye size={16} /></button>
                        {item.status === 'DRAFT' && (
                          <button className="btn btn-icon btn-danger sm" onClick={() => openDeleteDialog(item)} title="Xóa"><Trash2 size={16} /></button>
                        )}
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

      {/* Create Check Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tạo phiếu kiểm kê kho" size="xl">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Lọc theo danh mục</label>
              <select className="form-control" value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
                <option value="">Tất cả danh mục</option>
                {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ghi chú</label>
              <input type="text" className="form-control" value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })} placeholder="Nhập ghi chú..." />
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClipboardCheck size={18} /> Danh sách sản phẩm kiểm kê ({formData.items.length} sản phẩm)
              </h4>
              <div style={{ fontWeight: 600 }}>
                Tổng chênh lệch: <span style={{ color: calculateTotalDifference() > 0 ? 'var(--danger-color)' : 'var(--success-color)' }}>
                  {calculateTotalDifference()} đơn vị
                </span>
              </div>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="table" style={{ fontSize: '13px' }}>
                <thead style={{ position: 'sticky', top: 0, background: 'white' }}>
                  <tr>
                    <th style={{ width: '80px' }}>SKU</th><th>Tên sản phẩm</th>
                    <th style={{ width: '100px' }}>Danh mục</th>
                    <th style={{ width: '80px' }} className="text-center">Tồn HT</th>
                    <th style={{ width: '100px' }} className="text-center">Tồn thực tế</th>
                    <th style={{ width: '80px' }} className="text-center">Chênh lệch</th>
                    <th style={{ width: '150px' }}>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => {
                    const diff = calculateDifference(item);
                    return (
                      <tr key={item.product_id}>
                        <td><code style={{ fontSize: '11px' }}>{item.sku}</code></td>
                        <td>{item.product_name}</td>
                        <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.category_name}</td>
                        <td className="text-center">{item.system_quantity}</td>
                        <td>
                          <input type="number" className="form-control" style={{ width: '80px', textAlign: 'center' }}
                            value={item.actual_quantity} onChange={(e) => updateItemQuantity(index, e.target.value)} min="0" />
                        </td>
                        <td className="text-center" style={getDifferenceStyle(diff)}>{diff > 0 ? '+' : ''}{diff}</td>
                        <td>
                          <input type="text" className="form-control" style={{ fontSize: '12px' }}
                            value={item.note} onChange={(e) => updateItemNote(index, e.target.value)} placeholder="Ghi chú..." />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
            <button type="submit" className="btn btn-primary" disabled={formLoading || formData.items.length === 0}>
              {formLoading ? 'Đang xử lý...' : 'Tạo phiếu kiểm kê'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)}
        title={`Chi tiết phiếu kiểm kê - ${selectedCheck?.check_code || ''}`} size="xl">
        {selectedCheck && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div><label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Mã phiếu</label><div style={{ fontWeight: 600 }}>{selectedCheck.check_code}</div></div>
              <div><label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Ngày kiểm kê</label><div style={{ fontWeight: 500 }}>{formatDate(selectedCheck.check_date)}</div></div>
              <div><label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Trạng thái</label><div>{getStatusBadge(selectedCheck.status)}</div></div>
              <div><label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Số sản phẩm</label><div style={{ fontWeight: 500 }}>{selectedCheck.total_products} sản phẩm</div></div>
              <div><label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Tổng chênh lệch</label>
                <div style={{ fontWeight: 600, color: selectedCheck.total_difference > 0 ? 'var(--danger-color)' : 'var(--success-color)' }}>{selectedCheck.total_difference} đơn vị</div>
              </div>
              <div><label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Người kiểm kê</label><div style={{ fontWeight: 500 }}>{selectedCheck.user_full_name || 'N/A'}</div></div>
              {selectedCheck.note && (<div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Ghi chú</label><div style={{ fontWeight: 500 }}>{selectedCheck.note}</div></div>)}
            </div>

            <h4 style={{ marginBottom: '12px' }}>Chi tiết kiểm kê</h4>
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <table className="table" style={{ fontSize: '13px' }}>
                <thead style={{ position: 'sticky', top: 0, background: 'white' }}>
                  <tr>
                    <th>SKU</th><th>Tên sản phẩm</th><th>Danh mục</th>
                    <th className="text-center">Tồn hệ thống</th><th className="text-center">Tồn thực tế</th>
                    <th className="text-center">Chênh lệch</th><th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCheck.details?.map((item, index) => (
                    <tr key={index}>
                      <td><code>{item.sku}</code></td><td>{item.product_name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{item.category_name}</td>
                      <td className="text-center">{item.system_quantity}</td>
                      <td className="text-center">{item.actual_quantity}</td>
                      <td className="text-center" style={getDifferenceStyle(item.difference)}>{item.difference > 0 ? '+' : ''}{item.difference}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{item.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="form-actions" style={{ marginTop: '24px' }}>
              <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Đóng</button>
              <button className="btn btn-info" onClick={handlePrint}><Printer size={16} /> In phiếu</button>
              {selectedCheck.status === 'DRAFT' && (
                <>
                  <button className="btn btn-danger" onClick={() => openCancelDialog(selectedCheck)}><XCircle size={16} /> Hủy phiếu</button>
                  <button className="btn btn-success" onClick={() => openCompleteDialog(selectedCheck)}><Check size={16} /> Hoàn thành và cập nhật tồn kho</button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onConfirm={handleDelete}
        title="Xóa phiếu kiểm kê" message={`Bạn có chắc chắn muốn xóa phiếu kiểm kê "${selectedCheck?.check_code}"?`}
        type="danger" loading={formLoading} />

      <ConfirmDialog isOpen={showCompleteDialog} onClose={() => setShowCompleteDialog(false)} onConfirm={handleComplete}
        title="Hoàn thành kiểm kê" message={`Bạn có chắc chắn muốn hoàn thành phiếu kiểm kê "${selectedCheck?.check_code}"? Tồn kho sẽ được cập nhật theo số liệu thực tế.`}
        type="success" loading={formLoading} />

      <ConfirmDialog isOpen={showCancelDialog} onClose={() => setShowCancelDialog(false)} onConfirm={handleCancel}
        title="Hủy phiếu kiểm kê" message={`Bạn có chắc chắn muốn hủy phiếu kiểm kê "${selectedCheck?.check_code}"?`}
        type="warning" loading={formLoading} />
    </Layout>
  );
};

export default InventoryCheckList;
