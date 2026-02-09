import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../config/api';
import { toast } from 'react-toastify';
import {
  FileText,
  Download,
  Calendar,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
  FileSpreadsheet
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import * as XLSX from 'xlsx';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [importExportData, setImportExportData] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    to: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  useEffect(() => {
    if (activeTab === 'inventory') {
      fetchInventoryReport();
    } else {
      fetchImportExportReport();
    }
  }, [activeTab]);

  const fetchInventoryReport = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/inventory');
      setInventoryData(res.data || []);
    } catch (error) {
      toast.error('Không thể tải báo cáo tồn kho');
    } finally {
      setLoading(false);
    }
  };

  const fetchImportExportReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        from: dateRange.from,
        to: dateRange.to
      });
      const res = await api.get(`/reports/import-export?${params}`);
      setImportExportData(res.data);
    } catch (error) {
      toast.error('Không thể tải báo cáo nhập xuất');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    fetchImportExportReport();
  };

  const exportToExcel = (type) => {
    try {
      const wb = XLSX.utils.book_new();
      const today = format(new Date(), 'dd/MM/yyyy');
      const fileName = `bao-cao-${type === 'inventory' ? 'ton-kho' : 'nhap-xuat'}-${format(new Date(), 'yyyyMMdd')}.xlsx`;

      if (type === 'inventory') {
        // Create inventory report data
        const wsData = [
          ['BÁO CÁO TỒN KHO'],
          [`Ngày xuất báo cáo: ${today}`],
          [`Tổng giá trị tồn kho: ${formatCurrency(totalInventoryValue)}`],
          [],
          ['STT', 'Mã SKU', 'Tên sản phẩm', 'Danh mục', 'Đơn vị', 'Số lượng', 'Tồn tối thiểu', 'Đơn giá', 'Giá trị tồn', 'Trạng thái']
        ];

        inventoryData.forEach((item, index) => {
          const isLowStock = item.quantity <= item.min_stock;
          const isOutOfStock = item.quantity === 0;
          const status = isOutOfStock ? 'Hết hàng' : isLowStock ? 'Sắp hết' : 'Đủ hàng';

          wsData.push([
            index + 1,
            item.sku,
            item.name,
            item.category_name || '',
            item.unit,
            item.quantity,
            item.min_stock,
            item.price,
            item.quantity * item.price,
            status
          ]);
        });

        // Add summary row
        wsData.push([]);
        wsData.push(['', '', '', '', 'TỔNG CỘNG:', inventoryData.reduce((sum, i) => sum + i.quantity, 0), '', '', totalInventoryValue, '']);

        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Set column widths
        ws['!cols'] = [
          { wch: 5 },   // STT
          { wch: 12 },  // SKU
          { wch: 30 },  // Tên SP
          { wch: 15 },  // Danh mục
          { wch: 8 },   // Đơn vị
          { wch: 10 },  // Số lượng
          { wch: 12 },  // Tồn tối thiểu
          { wch: 15 },  // Đơn giá
          { wch: 18 },  // Giá trị tồn
          { wch: 12 }   // Trạng thái
        ];

        // Merge cells for title
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } },
          { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } },
          { s: { r: 2, c: 0 }, e: { r: 2, c: 9 } }
        ];

        XLSX.utils.book_append_sheet(wb, ws, 'Tồn kho');

      } else if (type === 'import-export') {
        // Create import/export report
        const summaryData = [
          ['BÁO CÁO NHẬP XUẤT KHO'],
          [`Từ ngày: ${formatDate(dateRange.from)} - Đến ngày: ${formatDate(dateRange.to)}`],
          [`Ngày xuất báo cáo: ${today}`],
          [],
          ['TỔNG HỢP'],
          ['Số phiếu nhập:', importExportData?.summary?.import_count || 0],
          ['Tổng tiền nhập:', importExportData?.summary?.import_total || 0],
          ['Số phiếu xuất:', importExportData?.summary?.export_count || 0],
          ['Tổng tiền xuất:', importExportData?.summary?.export_total || 0],
        ];

        const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
        summaryWs['!cols'] = [{ wch: 20 }, { wch: 20 }];
        summaryWs['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
          { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
          { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } }
        ];
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Tổng hợp');

        // Import sheet
        const importData = [
          ['DANH SÁCH PHIẾU NHẬP KHO'],
          [`Từ ngày: ${formatDate(dateRange.from)} - Đến ngày: ${formatDate(dateRange.to)}`],
          [],
          ['STT', 'Mã phiếu', 'Nhà cung cấp', 'Ngày nhập', 'Tổng tiền', 'Ghi chú']
        ];

        (importExportData?.imports || []).forEach((item, index) => {
          importData.push([
            index + 1,
            item.receipt_code,
            item.supplier_name || 'N/A',
            formatDate(item.import_date),
            item.total_amount,
            item.notes || ''
          ]);
        });

        importData.push([]);
        importData.push(['', '', '', 'TỔNG CỘNG:', importExportData?.summary?.import_total || 0, '']);

        const importWs = XLSX.utils.aoa_to_sheet(importData);
        importWs['!cols'] = [
          { wch: 5 },
          { wch: 15 },
          { wch: 25 },
          { wch: 12 },
          { wch: 18 },
          { wch: 25 }
        ];
        importWs['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
          { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }
        ];
        XLSX.utils.book_append_sheet(wb, importWs, 'Phiếu nhập');

        // Export sheet
        const exportData = [
          ['DANH SÁCH PHIẾU XUẤT KHO'],
          [`Từ ngày: ${formatDate(dateRange.from)} - Đến ngày: ${formatDate(dateRange.to)}`],
          [],
          ['STT', 'Mã phiếu', 'Khách hàng', 'Ngày xuất', 'Tổng tiền', 'Ghi chú']
        ];

        (importExportData?.exports || []).forEach((item, index) => {
          exportData.push([
            index + 1,
            item.receipt_code,
            item.customer_name || 'N/A',
            formatDate(item.export_date),
            item.total_amount,
            item.notes || ''
          ]);
        });

        exportData.push([]);
        exportData.push(['', '', '', 'TỔNG CỘNG:', importExportData?.summary?.export_total || 0, '']);

        const exportWs = XLSX.utils.aoa_to_sheet(exportData);
        exportWs['!cols'] = [
          { wch: 5 },
          { wch: 15 },
          { wch: 25 },
          { wch: 12 },
          { wch: 18 },
          { wch: 25 }
        ];
        exportWs['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
          { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }
        ];
        XLSX.utils.book_append_sheet(wb, exportWs, 'Phiếu xuất');
      }

      // Save file
      XLSX.writeFile(wb, fileName);
      toast.success('Xuất báo cáo Excel thành công!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Không thể xuất báo cáo Excel');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const setQuickDateRange = (days) => {
    const to = new Date();
    const from = subDays(to, days);
    setDateRange({
      from: format(from, 'yyyy-MM-dd'),
      to: format(to, 'yyyy-MM-dd')
    });
  };

  const totalInventoryValue = inventoryData.reduce((sum, item) =>
    sum + (item.quantity * item.price), 0
  );

  return (
    <Layout title="Báo cáo">
      <div className="page-header">
        <div>
          <h1 className="page-title">Báo cáo & Thống kê</h1>
          <p className="page-subtitle">Xem báo cáo tồn kho và hoạt động nhập xuất</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '2px solid var(--border-color)',
        paddingBottom: '8px'
      }}>
        <button
          className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Package size={18} />
          Báo cáo tồn kho
        </button>
        <button
          className={`btn ${activeTab === 'import-export' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('import-export')}
        >
          <FileText size={18} />
          Báo cáo nhập xuất
        </button>
      </div>

      {/* Inventory Report */}
      {activeTab === 'inventory' && (
        <>
          {/* Summary Cards */}
          <div className="stats-grid" style={{ marginBottom: '24px' }}>
            <div className="stat-card">
              <div className="stat-icon primary">
                <Package size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{inventoryData.length}</div>
                <div className="stat-label">Tổng sản phẩm</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon success">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value" style={{ fontSize: '20px' }}>
                  {formatCurrency(totalInventoryValue)}
                </div>
                <div className="stat-label">Tổng giá trị tồn kho</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon warning">
                <TrendingDown size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {inventoryData.filter(i => i.quantity <= i.min_stock).length}
                </div>
                <div className="stat-label">Sản phẩm sắp hết</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon danger">
                <Package size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {inventoryData.filter(i => i.quantity === 0).length}
                </div>
                <div className="stat-label">Sản phẩm hết hàng</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Chi tiết tồn kho</h3>
              <button
                className="btn btn-success btn-sm"
                onClick={() => exportToExcel('inventory')}
              >
                <FileSpreadsheet size={16} />
                Xuất Excel
              </button>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Tên sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Đơn vị</th>
                    <th>Số lượng</th>
                    <th>Tồn tối thiểu</th>
                    <th>Đơn giá</th>
                    <th>Giá trị tồn</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="9" className="text-center">Đang tải...</td></tr>
                  ) : inventoryData.length === 0 ? (
                    <tr><td colSpan="9" className="text-center">Không có dữ liệu</td></tr>
                  ) : (
                    inventoryData.map((item, index) => {
                      const isLowStock = item.quantity <= item.min_stock;
                      const isOutOfStock = item.quantity === 0;
                      return (
                        <tr key={index}>
                          <td><code>{item.sku}</code></td>
                          <td style={{ fontWeight: 500 }}>{item.name}</td>
                          <td>{item.category_name}</td>
                          <td>{item.unit}</td>
                          <td style={{
                            fontWeight: 600,
                            color: isOutOfStock ? 'var(--danger-color)' :
                                   isLowStock ? 'var(--warning-color)' : 'var(--text-primary)'
                          }}>
                            {item.quantity}
                          </td>
                          <td>{item.min_stock}</td>
                          <td>{formatCurrency(item.price)}</td>
                          <td style={{ fontWeight: 600 }}>
                            {formatCurrency(item.quantity * item.price)}
                          </td>
                          <td>
                            <span className={`badge ${
                              isOutOfStock ? 'badge-danger' :
                              isLowStock ? 'badge-warning' : 'badge-success'
                            }`}>
                              {isOutOfStock ? 'Hết hàng' : isLowStock ? 'Sắp hết' : 'Đủ hàng'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Import/Export Report */}
      {activeTab === 'import-export' && (
        <>
          {/* Date Filter */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-body">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ fontWeight: 500 }}>Khoảng thời gian:</span>
                </div>
                <input
                  type="date"
                  className="form-control"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  style={{ width: 'auto' }}
                />
                <span>đến</span>
                <input
                  type="date"
                  className="form-control"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  style={{ width: 'auto' }}
                />
                <button className="btn btn-primary" onClick={handleDateFilter}>
                  <Filter size={16} />
                  Lọc
                </button>
                <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setQuickDateRange(7)}
                    style={{ marginRight: '8px' }}
                  >
                    7 ngày
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setQuickDateRange(30)}
                    style={{ marginRight: '8px' }}
                  >
                    30 ngày
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setQuickDateRange(90)}
                  >
                    90 ngày
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          {importExportData && (
            <div className="stats-grid" style={{ marginBottom: '24px' }}>
              <div className="stat-card">
                <div className="stat-icon success">
                  <ArrowDownToLine size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{importExportData.summary?.import_count || 0}</div>
                  <div className="stat-label">Phiếu nhập</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon success">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value" style={{ fontSize: '18px' }}>
                    {formatCurrency(importExportData.summary?.import_total || 0)}
                  </div>
                  <div className="stat-label">Tổng nhập</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon warning">
                  <ArrowUpFromLine size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{importExportData.summary?.export_count || 0}</div>
                  <div className="stat-label">Phiếu xuất</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon warning">
                  <TrendingDown size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value" style={{ fontSize: '18px' }}>
                    {formatCurrency(importExportData.summary?.export_total || 0)}
                  </div>
                  <div className="stat-label">Tổng xuất</div>
                </div>
              </div>
            </div>
          )}

          {/* Import/Export Tables */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
            {/* Imports Table */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ArrowDownToLine size={18} style={{ color: 'var(--success-color)' }} />
                  Phiếu nhập kho
                </h3>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => exportToExcel('import-export')}
                >
                  <FileSpreadsheet size={16} />
                  Excel
                </button>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Mã phiếu</th>
                      <th>NCC</th>
                      <th>Ngày</th>
                      <th>Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="4" className="text-center">Đang tải...</td></tr>
                    ) : !importExportData?.imports?.length ? (
                      <tr><td colSpan="4" className="text-center">Không có dữ liệu</td></tr>
                    ) : (
                      importExportData.imports.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <code style={{
                              background: 'var(--success-color)',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '11px'
                            }}>
                              {item.receipt_code}
                            </code>
                          </td>
                          <td>{item.supplier_name || 'N/A'}</td>
                          <td>{formatDate(item.import_date)}</td>
                          <td style={{ fontWeight: 600, color: 'var(--success-color)' }}>
                            {formatCurrency(item.total_amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exports Table */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ArrowUpFromLine size={18} style={{ color: 'var(--warning-color)' }} />
                  Phiếu xuất kho
                </h3>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Mã phiếu</th>
                      <th>Khách hàng</th>
                      <th>Ngày</th>
                      <th>Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="4" className="text-center">Đang tải...</td></tr>
                    ) : !importExportData?.exports?.length ? (
                      <tr><td colSpan="4" className="text-center">Không có dữ liệu</td></tr>
                    ) : (
                      importExportData.exports.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <code style={{
                              background: 'var(--warning-color)',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '11px'
                            }}>
                              {item.receipt_code}
                            </code>
                          </td>
                          <td>{item.customer_name || 'N/A'}</td>
                          <td>{formatDate(item.export_date)}</td>
                          <td style={{ fontWeight: 600, color: 'var(--warning-color)' }}>
                            {formatCurrency(item.total_amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Reports;
