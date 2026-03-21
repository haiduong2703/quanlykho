import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Plus, Search, Eye, Trash2, Edit, ArrowUpFromLine, X, Package, AlertTriangle, Printer, Check, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  PENDING: { label: 'Chờ duyệt', color: '#3b82f6', bg: '#eff6ff' },
  APPROVED: { label: 'Đã duyệt', color: '#22c55e', bg: '#f0fdf4' },
  REJECTED: { label: 'Từ chối', color: '#ef4444', bg: '#fef2f2' }
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 600,
      color: config.color,
      background: config.bg,
      border: `1px solid ${config.color}`,
      whiteSpace: 'nowrap'
    }}>
      {config.label}
    </span>
  );
};

const ExportList = () => {
  const { isAdmin } = useContext(AuthContext);
  const [exports, setExports] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stocks, setStocks] = useState({});
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedExport, setSelectedExport] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Approval workflow state
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approvalLoading, setApprovalLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer_id: '',
    customer_name: '',
    customer_phone: '',
    note: '',
    items: [{ product_id: '', quantity: '', unit_price: '', note: '' }]
  });

  useEffect(() => {
    fetchProducts();
    fetchStocks();
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers/active');
      setCustomers(res.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchExports();
  }, [pagination.page, statusFilter]);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/all');
      setProducts(res.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchStocks = async () => {
    try {
      const res = await api.get('/stocks?limit=1000');
      const stockMap = {};
      (res.data || []).forEach(s => {
        stockMap[s.product_id] = s.quantity;
      });
      setStocks(stockMap);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const fetchExports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter })
      });
      const res = await api.get(`/exports?${params}`);
      setExports(res.data || []);
      setPagination(prev => ({ ...prev, total: res.pagination?.total || 0 }));
    } catch (error) {
      toast.error('Không thể tải danh sách phiếu xuất');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchExports();
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const openAddModal = () => {
    fetchStocks(); // Refresh stock data
    setEditingId(null);
    setFormData({
      customer_id: '',
      customer_name: '',
      customer_phone: '',
      note: '',
      items: [{ product_id: '', quantity: '', unit_price: '', note: '' }]
    });
    setShowModal(true);
  };

  const openEditModal = async (exportReceipt) => {
    try {
      fetchStocks(); // Refresh stock data
      const res = await api.get(`/exports/${exportReceipt.id}`);
      const data = res.data;
      setEditingId(data.id);
      setFormData({
        customer_id: data.customer_id || '',
        customer_name: data.customer_name || '',
        customer_phone: data.customer_phone || '',
        note: data.note || '',
        items: data.items && data.items.length > 0
          ? data.items.map(item => ({
              product_id: item.product_id?.toString() || '',
              quantity: item.quantity?.toString() || '',
              unit_price: item.unit_price?.toString() || '',
              note: item.note || ''
            }))
          : [{ product_id: '', quantity: '', unit_price: '', note: '' }]
      });
      setShowModal(true);
    } catch (error) {
      toast.error('Không thể tải dữ liệu phiếu xuất');
    }
  };

  const handleCustomerChange = (customerId) => {
    if (customerId) {
      const customer = customers.find(c => c.id === parseInt(customerId));
      if (customer) {
        setFormData({
          ...formData,
          customer_id: customerId,
          customer_name: customer.name,
          customer_phone: customer.phone || ''
        });
        return;
      }
    }
    setFormData({ ...formData, customer_id: '', customer_name: '', customer_phone: '' });
  };

  const openDetailModal = async (exportReceipt) => {
    try {
      const res = await api.get(`/exports/${exportReceipt.id}`);
      setSelectedExport(res.data);
      setShowDetailModal(true);
      setShowRejectInput(false);
      setRejectReason('');
    } catch (error) {
      toast.error('Không thể tải chi tiết phiếu xuất');
    }
  };

  const openDeleteDialog = (exportReceipt) => {
    setSelectedExport(exportReceipt);
    setShowDeleteDialog(true);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: '', quantity: '', unit_price: '', note: '' }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    // Auto-fill price when product is selected
    if (field === 'product_id' && value) {
      const product = products.find(p => p.id === parseInt(value));
      if (product) {
        newItems[index].unit_price = product.price;
      }
    }

    setFormData({ ...formData, items: newItems });
  };

  const getAvailableStock = (productId) => {
    return stocks[parseInt(productId)] || 0;
  };

  const isQuantityExceeded = (item) => {
    if (!item.product_id || !item.quantity) return false;
    return parseInt(item.quantity) > getAvailableStock(item.product_id);
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0));
    }, 0);
  };

  const hasStockError = () => {
    return formData.items.some(item => isQuantityExceeded(item));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate items
    const validItems = formData.items.filter(item =>
      item.product_id && item.quantity > 0 && item.unit_price > 0
    );

    if (validItems.length === 0) {
      toast.error('Vui lòng thêm ít nhất một sản phẩm hợp lệ');
      return;
    }

    // Check stock availability
    for (const item of validItems) {
      if (isQuantityExceeded(item)) {
        const product = products.find(p => p.id === parseInt(item.product_id));
        toast.error(`Sản phẩm "${product?.name}" không đủ tồn kho`);
        return;
      }
    }

    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        items: validItems.map(item => ({
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price),
          note: item.note
        }))
      };

      if (editingId) {
        await api.put(`/exports/${editingId}`, payload);
        toast.success('Cập nhật phiếu xuất kho thành công');
      } else {
        await api.post('/exports', payload);
        toast.success('Tạo phiếu xuất kho thành công');
      }
      setShowModal(false);
      setEditingId(null);
      fetchExports();
      fetchStocks(); // Refresh stock after export
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await api.delete(`/exports/${selectedExport.id}`);
      toast.success('Xóa phiếu xuất thành công');
      setShowDeleteDialog(false);
      fetchExports();
      fetchStocks(); // Refresh stock after delete
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setFormLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedExport) return;
    setApprovalLoading(true);
    try {
      await api.patch(`/exports/${selectedExport.id}/approve`);
      toast.success('Duyệt phiếu xuất thành công');
      // Refresh detail modal data
      const res = await api.get(`/exports/${selectedExport.id}`);
      setSelectedExport(res.data);
      fetchExports();
      fetchStocks();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi duyệt');
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedExport) return;
    if (!rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }
    setApprovalLoading(true);
    try {
      await api.patch(`/exports/${selectedExport.id}/reject`, { reason: rejectReason.trim() });
      toast.success('Đã từ chối phiếu xuất');
      // Refresh detail modal data
      const res = await api.get(`/exports/${selectedExport.id}`);
      setSelectedExport(res.data);
      setShowRejectInput(false);
      setRejectReason('');
      fetchExports();
      fetchStocks();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi từ chối');
    } finally {
      setApprovalLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handlePrint = () => {
    if (!selectedExport) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Phiếu xuất kho - ${selectedExport.receipt_code}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Times New Roman', serif; padding: 20px; font-size: 14px; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { font-size: 20px; text-transform: uppercase; margin-bottom: 5px; }
          .header h2 { font-size: 18px; color: #f59e0b; margin-bottom: 10px; }
          .header p { font-size: 12px; color: #666; }
          .info { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 10px; background: #f9f9f9; border-radius: 5px; }
          .info-group { flex: 1; }
          .info-group label { font-weight: bold; color: #333; display: block; margin-bottom: 3px; font-size: 12px; }
          .info-group span { color: #555; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background: #f59e0b; color: white; font-weight: bold; }
          tr:nth-child(even) { background: #f9f9f9; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .total-row { font-weight: bold; background: #fef3c7 !important; }
          .total-row td { font-size: 16px; }
          .footer { margin-top: 40px; display: flex; justify-content: space-between; }
          .signature { text-align: center; width: 200px; }
          .signature p { margin-bottom: 60px; font-weight: bold; }
          .signature span { display: block; font-style: italic; font-size: 12px; }
          .note { margin-top: 20px; padding: 10px; background: #fff3cd; border-radius: 5px; }
          .note label { font-weight: bold; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Hệ Thống Quản Lý Kho</h1>
          <h2>PHIẾU XUẤT KHO</h2>
          <p>Mã phiếu: <strong>${selectedExport.receipt_code}</strong></p>
        </div>

        <div class="info">
          <div class="info-group">
            <label>Khách hàng:</label>
            <span>${selectedExport.customer_name || 'N/A'}</span>
          </div>
          <div class="info-group">
            <label>Số điện thoại:</label>
            <span>${selectedExport.customer_phone || 'N/A'}</span>
          </div>
          <div class="info-group">
            <label>Ngày xuất:</label>
            <span>${formatDate(selectedExport.export_date)}</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="text-center" style="width: 50px;">STT</th>
              <th style="width: 100px;">Mã SKU</th>
              <th>Tên sản phẩm</th>
              <th class="text-center" style="width: 80px;">Số lượng</th>
              <th class="text-right" style="width: 120px;">Đơn giá</th>
              <th class="text-right" style="width: 130px;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${selectedExport.items?.map((item, index) => `
              <tr>
                <td class="text-center">${index + 1}</td>
                <td>${item.sku}</td>
                <td>${item.product_name}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">${formatCurrency(item.unit_price)}</td>
                <td class="text-right">${formatCurrency(item.subtotal)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="5" class="text-right">TỔNG CỘNG:</td>
              <td class="text-right">${formatCurrency(selectedExport.total_amount)}</td>
            </tr>
          </tbody>
        </table>

        ${selectedExport.note ? `
          <div class="note">
            <label>Ghi chú:</label> ${selectedExport.note}
          </div>
        ` : ''}

        <div class="footer">
          <div class="signature">
            <p>Người lập phiếu</p>
            <span>(Ký, ghi rõ họ tên)</span>
          </div>
          <div class="signature">
            <p>Thủ kho</p>
            <span>(Ký, ghi rõ họ tên)</span>
          </div>
          <div class="signature">
            <p>Người nhận hàng</p>
            <span>(Ký, ghi rõ họ tên)</span>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <Layout title="Quản lý xuất kho">
      <div className="page-header">
        <div>
          <h1 className="page-title">Phiếu xuất kho</h1>
          <p className="page-subtitle">Quản lý các phiếu xuất kho cho khách hàng</p>
        </div>
        <button className="btn btn-warning" onClick={openAddModal}>
          <Plus size={18} />
          Tạo phiếu xuất
        </button>
      </div>

      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-box">
          <Search />
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm theo mã phiếu, khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <select
          className="form-control"
          value={statusFilter}
          onChange={(e) => handleStatusFilterChange(e.target.value)}
          style={{ width: '180px', marginLeft: '12px' }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Từ chối</option>
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Khách hàng</th>
                <th>Ngày xuất</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Người tạo</th>
                <th style={{ width: '140px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center">Đang tải...</td></tr>
              ) : exports.length === 0 ? (
                <tr><td colSpan="7" className="text-center">Không có dữ liệu</td></tr>
              ) : (
                exports.map(item => (
                  <tr key={item.id}>
                    <td>
                      <code style={{
                        background: 'var(--warning-color)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 600
                      }}>
                        {item.receipt_code}
                      </code>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{item.customer_name || 'N/A'}</div>
                      {item.customer_phone && (
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {item.customer_phone}
                        </div>
                      )}
                    </td>
                    <td>{formatDate(item.export_date)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--warning-color)' }}>
                      {formatCurrency(item.total_amount)}
                    </td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>{item.created_by_name || 'N/A'}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-icon btn-secondary sm"
                          onClick={() => openDetailModal(item)}
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        {item.status === 'PENDING' && (
                          <button
                            className="btn btn-icon btn-primary sm"
                            onClick={() => openEditModal(item)}
                            title="Sửa"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {(item.status === 'PENDING' || item.status === 'REJECTED') && (
                          <button
                            className="btn btn-icon btn-danger sm"
                            onClick={() => openDeleteDialog(item)}
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
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

      {/* Create/Edit Export Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingId(null); }}
        title={editingId ? 'Sửa phiếu xuất kho' : 'Tạo phiếu xuất kho'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Chọn khách hàng</label>
            <select
              className="form-control"
              value={formData.customer_id}
              onChange={(e) => handleCustomerChange(e.target.value)}
            >
              <option value="">-- Chọn khách hàng hoặc nhập tay bên dưới --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tên khách hàng</label>
              <input
                type="text"
                className="form-control"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="Nhập tên khách hàng..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input
                type="text"
                className="form-control"
                value={formData.customer_phone}
                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                placeholder="Nhập SĐT..."
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <textarea
              className="form-control"
              rows="2"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Ghi chú cho phiếu xuất..."
            />
          </div>

          <div style={{
            background: 'var(--bg-secondary)',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={18} />
                Danh sách sản phẩm xuất
              </h4>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>
                <Plus size={16} /> Thêm sản phẩm
              </button>
            </div>

            {formData.items.map((item, index) => {
              const exceeded = isQuantityExceeded(item);
              const availableStock = item.product_id ? getAvailableStock(item.product_id) : 0;

              return (
                <div key={index} style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                  gap: '12px',
                  marginBottom: '12px',
                  padding: '12px',
                  background: exceeded ? 'var(--danger-bg)' : 'white',
                  borderRadius: '6px',
                  border: `1px solid ${exceeded ? 'var(--danger-color)' : 'var(--border-color)'}`
                }}>
                  <div>
                    <select
                      className="form-control"
                      value={item.product_id}
                      onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                      required
                      style={{ marginBottom: '4px' }}
                    >
                      <option value="">-- Chọn sản phẩm --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                      ))}
                    </select>
                    {item.product_id && (
                      <div style={{
                        fontSize: '12px',
                        color: exceeded ? 'var(--danger-color)' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {exceeded && <AlertTriangle size={12} />}
                        Tồn kho: <strong>{availableStock}</strong>
                      </div>
                    )}
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Số lượng"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    min="1"
                    max={availableStock}
                    required
                    style={exceeded ? { borderColor: 'var(--danger-color)' } : {}}
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Đơn giá"
                    value={item.unit_price}
                    onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                    min="0"
                    required
                  />
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 600,
                    color: 'var(--warning-color)'
                  }}>
                    {formatCurrency(item.quantity * item.unit_price)}
                  </div>
                  <button
                    type="button"
                    className="btn btn-icon btn-danger sm"
                    onClick={() => removeItem(index)}
                    disabled={formData.items.length === 1}
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}

            {hasStockError() && (
              <div style={{
                background: 'var(--danger-bg)',
                border: '1px solid var(--danger-color)',
                borderRadius: '6px',
                padding: '12px',
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--danger-color)'
              }}>
                <AlertTriangle size={18} />
                <span>Số lượng xuất vượt quá tồn kho. Vui lòng điều chỉnh.</span>
              </div>
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              paddingTop: '12px',
              borderTop: '2px solid var(--border-color)',
              marginTop: '8px'
            }}>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>
                Tổng cộng: <span style={{ color: 'var(--warning-color)' }}>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditingId(null); }}>
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-warning"
              disabled={formLoading || hasStockError()}
            >
              {formLoading ? 'Đang xử lý...' : (editingId ? 'Cập nhật phiếu xuất' : 'Tạo phiếu xuất')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setShowRejectInput(false); setRejectReason(''); }}
        title={`Chi tiết phiếu xuất - ${selectedExport?.receipt_code || ''}`}
        size="lg"
      >
        {selectedExport && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Mã phiếu</label>
                <div style={{ fontWeight: 600 }}>{selectedExport.receipt_code}</div>
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Ngày xuất</label>
                <div style={{ fontWeight: 500 }}>{formatDate(selectedExport.export_date)}</div>
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Khách hàng</label>
                <div style={{ fontWeight: 500 }}>{selectedExport.customer_name || 'N/A'}</div>
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Số điện thoại</label>
                <div style={{ fontWeight: 500 }}>{selectedExport.customer_phone || 'N/A'}</div>
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Trạng thái</label>
                <div style={{ marginTop: '4px' }}>
                  <StatusBadge status={selectedExport.status} />
                </div>
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Người tạo</label>
                <div style={{ fontWeight: 500 }}>{selectedExport.created_by_name || 'N/A'}</div>
              </div>
              {selectedExport.status === 'APPROVED' && (
                <>
                  <div>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Người duyệt</label>
                    <div style={{ fontWeight: 500, color: '#22c55e' }}>{selectedExport.approved_by_name || 'N/A'}</div>
                  </div>
                  <div>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Ngày duyệt</label>
                    <div style={{ fontWeight: 500 }}>{formatDate(selectedExport.approved_at)}</div>
                  </div>
                </>
              )}
              {selectedExport.status === 'REJECTED' && (
                <>
                  <div>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Người từ chối</label>
                    <div style={{ fontWeight: 500, color: '#ef4444' }}>{selectedExport.approved_by_name || 'N/A'}</div>
                  </div>
                  <div>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Ngày từ chối</label>
                    <div style={{ fontWeight: 500 }}>{formatDate(selectedExport.approved_at)}</div>
                  </div>
                  {selectedExport.rejected_reason && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Lý do từ chối</label>
                      <div style={{
                        fontWeight: 500,
                        color: '#ef4444',
                        background: '#fef2f2',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        marginTop: '4px'
                      }}>
                        {selectedExport.rejected_reason}
                      </div>
                    </div>
                  )}
                </>
              )}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Ghi chú</label>
                <div style={{ fontWeight: 500 }}>{selectedExport.note || 'Không có ghi chú'}</div>
              </div>
            </div>

            <h4 style={{ marginBottom: '12px' }}>Danh sách sản phẩm</h4>
            <table className="table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedExport.items?.map((item, index) => (
                  <tr key={index}>
                    <td><code>{item.sku}</code></td>
                    <td>{item.product_name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unit_price)}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" style={{ textAlign: 'right', fontWeight: 600 }}>Tổng cộng:</td>
                  <td style={{ fontWeight: 700, color: 'var(--warning-color)', fontSize: '16px' }}>
                    {formatCurrency(selectedExport.total_amount)}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Reject reason input */}
            {showRejectInput && selectedExport.status === 'PENDING' && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '16px'
              }}>
                <label style={{ fontWeight: 600, color: '#ef4444', display: 'block', marginBottom: '8px' }}>
                  Lý do từ chối
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Nhập lý do từ chối phiếu xuất..."
                  style={{ marginBottom: '12px' }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => { setShowRejectInput(false); setRejectReason(''); }}
                    disabled={approvalLoading}
                  >
                    Hủy
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleReject}
                    disabled={approvalLoading || !rejectReason.trim()}
                  >
                    {approvalLoading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
                  </button>
                </div>
              </div>
            )}

            <div className="form-actions" style={{ marginTop: '24px' }}>
              <button className="btn btn-secondary" onClick={() => { setShowDetailModal(false); setShowRejectInput(false); setRejectReason(''); }}>
                Đóng
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                {isAdmin() && selectedExport.status === 'PENDING' && !showRejectInput && (
                  <>
                    <button
                      className="btn btn-danger"
                      onClick={() => setShowRejectInput(true)}
                      disabled={approvalLoading}
                    >
                      <XCircle size={16} />
                      Từ chối
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={handleApprove}
                      disabled={approvalLoading}
                    >
                      <Check size={16} />
                      {approvalLoading ? 'Đang xử lý...' : 'Duyệt'}
                    </button>
                  </>
                )}
                <button className="btn btn-primary" onClick={handlePrint}>
                  <Printer size={16} />
                  In phiếu
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Xóa phiếu xuất"
        message={`Bạn có chắc chắn muốn xóa phiếu xuất "${selectedExport?.receipt_code}"? Tồn kho sẽ được hoàn trả.`}
        type="danger"
        loading={formLoading}
      />
    </Layout>
  );
};

export default ExportList;
