import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Search, AlertTriangle, Package, History } from 'lucide-react';

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // History modal state
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyProduct, setHistoryProduct] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPagination, setHistoryPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [historyTypeFilter, setHistoryTypeFilter] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchStocks();
  }, [pagination.page, categoryFilter, lowStockOnly]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories/all');
      setCategories(res.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(search && { search }),
        ...(categoryFilter && { category_id: categoryFilter }),
        ...(lowStockOnly && { low_stock: 'true' })
      });
      const res = await api.get(`/stocks?${params}`);
      setStocks(res.data || []);
      setPagination(prev => ({ ...prev, total: res.pagination?.total || 0 }));
    } catch (error) {
      toast.error('Không thể tải danh sách tồn kho');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = useCallback(async (productId, page = 1, type = '') => {
    try {
      setHistoryLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(type && { type })
      });
      const res = await api.get(`/stocks/product/${productId}/history?${params}`);
      setHistoryData(res.data || []);
      setHistoryPagination(prev => ({
        ...prev,
        page,
        total: res.pagination?.total || 0
      }));
    } catch (error) {
      toast.error('Không thể tải lịch sử biến động kho');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const openHistoryModal = (stock) => {
    setHistoryProduct(stock);
    setHistoryData([]);
    setHistoryTypeFilter('');
    setHistoryPagination({ page: 1, limit: 20, total: 0 });
    setHistoryModalOpen(true);
    fetchHistory(stock.product_id || stock.id, 1, '');
  };

  const closeHistoryModal = () => {
    setHistoryModalOpen(false);
    setHistoryProduct(null);
    setHistoryData([]);
    setHistoryTypeFilter('');
  };

  const handleHistoryPageChange = (page) => {
    setHistoryPagination(prev => ({ ...prev, page }));
    fetchHistory(historyProduct.product_id || historyProduct.id, page, historyTypeFilter);
  };

  const handleHistoryTypeFilterChange = (type) => {
    setHistoryTypeFilter(type);
    setHistoryPagination(prev => ({ ...prev, page: 1 }));
    fetchHistory(historyProduct.product_id || historyProduct.id, 1, type);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchStocks();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStockStatus = (quantity, minStock) => {
    if (quantity <= 0) return { text: 'Hết hàng', class: 'badge-danger' };
    if (quantity <= minStock) return { text: 'Sắp hết', class: 'badge-warning' };
    return { text: 'Đủ hàng', class: 'badge-success' };
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'IMPORT':
        return { text: 'Nhập kho', class: 'badge-success' };
      case 'EXPORT':
        return { text: 'Xuất kho', class: 'badge-warning' };
      case 'ADJUST':
        return { text: 'Điều chỉnh', class: 'badge-primary' };
      default:
        return { text: type, class: 'badge-secondary' };
    }
  };

  return (
    <Layout title="Quản lý tồn kho">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tồn kho</h1>
          <p className="page-subtitle">Theo dõi số lượng tồn kho của các sản phẩm</p>
        </div>
      </div>

      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-box">
          <Search />
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm sản phẩm..."
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
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => { setLowStockOnly(e.target.checked); setPagination(p => ({ ...p, page: 1 })); }}
          />
          <span>Chỉ hiển thị sắp hết hàng</span>
        </label>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Sản phẩm</th>
                <th>Danh mục</th>
                <th>Đơn vị</th>
                <th>Số lượng tồn</th>
                <th>Tồn tối thiểu</th>
                <th>Giá trị tồn</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="text-center">Đang tải...</td></tr>
              ) : stocks.length === 0 ? (
                <tr><td colSpan="9" className="text-center">Không có dữ liệu</td></tr>
              ) : (
                stocks.map(stock => {
                  const status = getStockStatus(stock.quantity, stock.min_stock);
                  return (
                    <tr key={stock.id}>
                      <td><code>{stock.sku}</code></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Package size={18} style={{ color: 'var(--primary-color)' }} />
                          <span style={{ fontWeight: 500 }}>{stock.name}</span>
                        </div>
                      </td>
                      <td>{stock.category_name}</td>
                      <td>{stock.unit}</td>
                      <td>
                        <span style={{
                          fontWeight: 600,
                          color: stock.quantity <= stock.min_stock ? 'var(--danger-color)' : 'var(--text-primary)'
                        }}>
                          {stock.quantity}
                        </span>
                      </td>
                      <td>{stock.min_stock}</td>
                      <td>{formatCurrency(stock.quantity * stock.price)}</td>
                      <td>
                        <span className={`badge ${status.class}`}>
                          {stock.quantity <= stock.min_stock && <AlertTriangle size={12} style={{ marginRight: 4 }} />}
                          {status.text}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline"
                          title="Lịch sử biến động"
                          onClick={() => openHistoryModal(stock)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <History size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
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

      {/* History Modal */}
      <Modal
        isOpen={historyModalOpen}
        onClose={closeHistoryModal}
        title={`Lịch sử biến động - ${historyProduct?.name || ''}`}
        size="lg"
      >
        <div style={{ marginBottom: '16px' }}>
          <select
            className="form-control"
            value={historyTypeFilter}
            onChange={(e) => handleHistoryTypeFilterChange(e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            <option value="">Tất cả loại</option>
            <option value="IMPORT">Nhập kho</option>
            <option value="EXPORT">Xuất kho</option>
            <option value="ADJUST">Điều chỉnh</option>
          </select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Loại</th>
                <th>Số lượng</th>
                <th>Trước</th>
                <th>Sau</th>
                <th>Chứng từ</th>
                <th>Người thực hiện</th>
              </tr>
            </thead>
            <tbody>
              {historyLoading ? (
                <tr><td colSpan="7" className="text-center">Đang tải...</td></tr>
              ) : historyData.length === 0 ? (
                <tr><td colSpan="7" className="text-center">Không có dữ liệu</td></tr>
              ) : (
                historyData.map(item => {
                  const typeBadge = getTypeBadge(item.type);
                  return (
                    <tr key={item.id}>
                      <td>{formatDate(item.created_at)}</td>
                      <td>
                        <span className={`badge ${typeBadge.class}`}>
                          {typeBadge.text}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{item.quantity}</td>
                      <td>{item.before_quantity}</td>
                      <td>{item.after_quantity}</td>
                      <td>
                        {item.reference_code ? (
                          <code>{item.reference_code}</code>
                        ) : (
                          <span style={{ color: 'var(--text-secondary)' }}>-</span>
                        )}
                      </td>
                      <td>{item.created_by_name || '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={historyPagination.page}
          totalPages={Math.ceil(historyPagination.total / historyPagination.limit)}
          totalItems={historyPagination.total}
          itemsPerPage={historyPagination.limit}
          onPageChange={handleHistoryPageChange}
        />
      </Modal>
    </Layout>
  );
};

export default StockList;
