import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Pagination from '../../components/common/Pagination';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { History, Filter, User, Calendar, Activity } from 'lucide-react';
import { format } from 'date-fns';

const AuditLogList = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });

  const [filters, setFilters] = useState({
    action: '',
    entity_type: '',
    from_date: '',
    to_date: ''
  });

  useEffect(() => {
    fetchLogs();
  }, [pagination.page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.action && { action: filters.action }),
        ...(filters.entity_type && { entity_type: filters.entity_type }),
        ...(filters.from_date && { from_date: filters.from_date }),
        ...(filters.to_date && { to_date: filters.to_date })
      });
      const res = await api.get(`/audit-logs?${params}`);
      setLogs(res.data || []);
      setPagination(prev => ({ ...prev, total: res.pagination?.total || 0 }));
    } catch (error) {
      toast.error('Không thể tải lịch sử hoạt động');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchLogs();
  };

  const resetFilters = () => {
    setFilters({ action: '', entity_type: '', from_date: '', to_date: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(fetchLogs, 0);
  };

  const formatDateTime = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
  };

  const getActionBadge = (action) => {
    const colors = {
      CREATE: 'badge-success',
      UPDATE: 'badge-primary',
      DELETE: 'badge-danger',
      LOGIN: 'badge-info',
      LOGOUT: 'badge-secondary',
      IMPORT: 'badge-success',
      EXPORT: 'badge-warning',
      TOGGLE_STATUS: 'badge-secondary'
    };
    return colors[action] || 'badge-secondary';
  };

  const getActionLabel = (action) => {
    const labels = {
      CREATE: 'Tạo mới',
      UPDATE: 'Cập nhật',
      DELETE: 'Xóa',
      LOGIN: 'Đăng nhập',
      LOGOUT: 'Đăng xuất',
      IMPORT: 'Nhập kho',
      EXPORT: 'Xuất kho',
      TOGGLE_STATUS: 'Đổi trạng thái'
    };
    return labels[action] || action;
  };

  const getEntityLabel = (entity) => {
    const labels = {
      USER: 'Người dùng',
      PRODUCT: 'Sản phẩm',
      CATEGORY: 'Danh mục',
      SUPPLIER: 'Nhà cung cấp',
      CUSTOMER: 'Khách hàng',
      IMPORT_RECEIPT: 'Phiếu nhập',
      EXPORT_RECEIPT: 'Phiếu xuất',
      STOCK: 'Tồn kho'
    };
    return labels[entity] || entity;
  };

  return (
    <Layout title="Lịch sử hoạt động">
      <div className="page-header">
        <div>
          <h1 className="page-title">Lịch sử hoạt động</h1>
          <p className="page-subtitle">Theo dõi tất cả các thao tác trong hệ thống</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ fontWeight: 500 }}>Bộ lọc:</span>
            </div>

            <select
              className="form-control"
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              style={{ width: '150px' }}
            >
              <option value="">Tất cả hành động</option>
              <option value="CREATE">Tạo mới</option>
              <option value="UPDATE">Cập nhật</option>
              <option value="DELETE">Xóa</option>
              <option value="LOGIN">Đăng nhập</option>
              <option value="IMPORT">Nhập kho</option>
              <option value="EXPORT">Xuất kho</option>
            </select>

            <select
              className="form-control"
              value={filters.entity_type}
              onChange={(e) => setFilters({ ...filters, entity_type: e.target.value })}
              style={{ width: '150px' }}
            >
              <option value="">Tất cả đối tượng</option>
              <option value="USER">Người dùng</option>
              <option value="PRODUCT">Sản phẩm</option>
              <option value="CATEGORY">Danh mục</option>
              <option value="SUPPLIER">NCC</option>
              <option value="CUSTOMER">Khách hàng</option>
              <option value="IMPORT_RECEIPT">Phiếu nhập</option>
              <option value="EXPORT_RECEIPT">Phiếu xuất</option>
            </select>

            <input
              type="date"
              className="form-control"
              value={filters.from_date}
              onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
              style={{ width: '150px' }}
            />
            <span>-</span>
            <input
              type="date"
              className="form-control"
              value={filters.to_date}
              onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
              style={{ width: '150px' }}
            />

            <button className="btn btn-primary btn-sm" onClick={handleFilter}>
              <Filter size={16} />
              Lọc
            </button>
            <button className="btn btn-secondary btn-sm" onClick={resetFilters}>
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '160px' }}>Thời gian</th>
                <th style={{ width: '150px' }}>Người thực hiện</th>
                <th style={{ width: '120px' }}>Hành động</th>
                <th style={{ width: '120px' }}>Đối tượng</th>
                <th>Mô tả</th>
                <th style={{ width: '120px' }}>IP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center">Đang tải...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="6" className="text-center">Không có dữ liệu</td></tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} style={{ color: 'var(--text-secondary)' }} />
                        <span style={{ fontSize: '13px' }}>{formatDateTime(log.created_at)}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={14} style={{ color: 'var(--text-secondary)' }} />
                        <span style={{ fontWeight: 500 }}>{log.user_name || log.username || 'System'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getActionBadge(log.action)}`}>
                        {getActionLabel(log.action)}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '12px',
                        padding: '2px 8px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '4px'
                      }}>
                        {getEntityLabel(log.entity_type)}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{log.entity_name || '-'}</div>
                      {log.details && (
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                        </div>
                      )}
                    </td>
                    <td>
                      <code style={{ fontSize: '12px' }}>{log.ip_address || '-'}</code>
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
    </Layout>
  );
};

export default AuditLogList;
