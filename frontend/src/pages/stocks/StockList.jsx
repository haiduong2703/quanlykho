import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Search, AlertTriangle, Package, Warehouse } from 'lucide-react';

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

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

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchStocks();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
  };

  const getStockStatus = (quantity, minStock) => {
    if (quantity <= 0) return { text: 'Hết hàng', class: 'badge-danger' };
    if (quantity <= minStock) return { text: 'Sắp hết', class: 'badge-warning' };
    return { text: 'Đủ hàng', class: 'badge-success' };
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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center">Đang tải...</td></tr>
              ) : stocks.length === 0 ? (
                <tr><td colSpan="8" className="text-center">Không có dữ liệu</td></tr>
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
    </Layout>
  );
};

export default StockList;
