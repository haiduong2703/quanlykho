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
  FileSpreadsheet,
  Users,
  Truck,
  RotateCcw
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import XLSX from 'xlsx-js-style';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [importExportData, setImportExportData] = useState(null);
  const [supplierStatsData, setSupplierStatsData] = useState([]);
  const [customerStatsData, setCustomerStatsData] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    to: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  const [supplierDateRange, setSupplierDateRange] = useState({
    from: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    to: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  const [customerDateRange, setCustomerDateRange] = useState({
    from: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    to: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  const [activeQuickFilter, setActiveQuickFilter] = useState({ importExport: null, supplier: null, customer: null });

  useEffect(() => {
    if (activeTab === 'inventory') {
      fetchInventoryReport();
    } else if (activeTab === 'import-export') {
      fetchImportExportReport();
    } else if (activeTab === 'supplier-stats') {
      fetchSupplierStats();
    } else if (activeTab === 'customer-stats') {
      fetchCustomerStats();
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

  const fetchImportExportReport = async (range) => {
    try {
      setLoading(true);
      const r = range || dateRange;
      const params = new URLSearchParams({ from: r.from, to: r.to });
      const res = await api.get(`/reports/import-export?${params}`);
      setImportExportData(res.data);
    } catch (error) {
      toast.error('Không thể tải báo cáo nhập xuất');
    } finally {
      setLoading(false);
    }
  };

  const fetchSupplierStats = async (range) => {
    try {
      setLoading(true);
      const r = range || supplierDateRange;
      const params = new URLSearchParams({ from_date: r.from, to_date: r.to });
      const res = await api.get(`/reports/supplier-stats?${params}`);
      setSupplierStatsData(res.data || []);
    } catch (error) {
      toast.error('Không thể tải thống kê nhà cung cấp');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerStats = async (range) => {
    try {
      setLoading(true);
      const r = range || customerDateRange;
      const params = new URLSearchParams({ from_date: r.from, to_date: r.to });
      const res = await api.get(`/reports/customer-stats?${params}`);
      setCustomerStatsData(res.data || []);
    } catch (error) {
      toast.error('Không thể tải thống kê khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    setActiveQuickFilter(prev => ({ ...prev, importExport: null }));
    fetchImportExportReport();
  };

  const handleSupplierDateFilter = () => {
    setActiveQuickFilter(prev => ({ ...prev, supplier: null }));
    fetchSupplierStats();
  };

  const handleCustomerDateFilter = () => {
    setActiveQuickFilter(prev => ({ ...prev, customer: null }));
    fetchCustomerStats();
  };

  // --- Style helpers for Excel ---
  const borderAll = {
    top: { style: 'thin', color: { rgb: 'CCCCCC' } },
    bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
    left: { style: 'thin', color: { rgb: 'CCCCCC' } },
    right: { style: 'thin', color: { rgb: 'CCCCCC' } }
  };

  const styles = {
    title: {
      font: { bold: true, sz: 18, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '1B5E20' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: borderAll
    },
    subtitle: {
      font: { sz: 12, italic: true, color: { rgb: '555555' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { fgColor: { rgb: 'E8F5E9' } },
      border: borderAll
    },
    summaryValue: {
      font: { bold: true, sz: 13, color: { rgb: '1B5E20' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { fgColor: { rgb: 'C8E6C9' } },
      border: borderAll
    },
    header: {
      font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '2E7D32' } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: borderAll
    },
    headerWarning: {
      font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: 'F57F17' } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: borderAll
    },
    cell: {
      font: { sz: 11 },
      alignment: { vertical: 'center' },
      border: borderAll
    },
    cellCenter: {
      font: { sz: 11 },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: borderAll
    },
    cellRight: {
      font: { sz: 11 },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: borderAll,
      numFmt: '#,##0'
    },
    cellCurrency: {
      font: { sz: 11 },
      alignment: { horizontal: 'right', vertical: 'center' },
      border: borderAll,
      numFmt: '#,##0 "đ"'
    },
    totalLabel: {
      font: { bold: true, sz: 12, color: { rgb: '1B5E20' } },
      alignment: { horizontal: 'right', vertical: 'center' },
      fill: { fgColor: { rgb: 'E8F5E9' } },
      border: { top: { style: 'double', color: { rgb: '2E7D32' } }, bottom: { style: 'double', color: { rgb: '2E7D32' } }, left: { style: 'thin', color: { rgb: 'CCCCCC' } }, right: { style: 'thin', color: { rgb: 'CCCCCC' } } }
    },
    totalValue: {
      font: { bold: true, sz: 13, color: { rgb: '1B5E20' } },
      alignment: { horizontal: 'right', vertical: 'center' },
      fill: { fgColor: { rgb: 'C8E6C9' } },
      border: { top: { style: 'double', color: { rgb: '2E7D32' } }, bottom: { style: 'double', color: { rgb: '2E7D32' } }, left: { style: 'thin', color: { rgb: 'CCCCCC' } }, right: { style: 'thin', color: { rgb: 'CCCCCC' } } },
      numFmt: '#,##0 "đ"'
    },
    totalValueNumber: {
      font: { bold: true, sz: 13, color: { rgb: '1B5E20' } },
      alignment: { horizontal: 'right', vertical: 'center' },
      fill: { fgColor: { rgb: 'C8E6C9' } },
      border: { top: { style: 'double', color: { rgb: '2E7D32' } }, bottom: { style: 'double', color: { rgb: '2E7D32' } }, left: { style: 'thin', color: { rgb: 'CCCCCC' } }, right: { style: 'thin', color: { rgb: 'CCCCCC' } } },
      numFmt: '#,##0'
    },
    totalEmpty: {
      fill: { fgColor: { rgb: 'E8F5E9' } },
      border: { top: { style: 'double', color: { rgb: '2E7D32' } }, bottom: { style: 'double', color: { rgb: '2E7D32' } }, left: { style: 'thin', color: { rgb: 'CCCCCC' } }, right: { style: 'thin', color: { rgb: 'CCCCCC' } } }
    },
    badgeSuccess: {
      font: { bold: true, sz: 10, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '2E7D32' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: borderAll
    },
    badgeWarning: {
      font: { bold: true, sz: 10, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: 'F57F17' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: borderAll
    },
    badgeDanger: {
      font: { bold: true, sz: 10, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: 'C62828' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: borderAll
    },
    rowEven: { fill: { fgColor: { rgb: 'F5F5F5' } } },
    summaryLabel: {
      font: { bold: true, sz: 12 },
      alignment: { vertical: 'center' },
      fill: { fgColor: { rgb: 'FAFAFA' } },
      border: borderAll
    },
    summaryData: {
      font: { bold: true, sz: 12, color: { rgb: '1B5E20' } },
      alignment: { horizontal: 'right', vertical: 'center' },
      fill: { fgColor: { rgb: 'FAFAFA' } },
      border: borderAll,
      numFmt: '#,##0'
    },
    summaryDataCurrency: {
      font: { bold: true, sz: 12, color: { rgb: '1B5E20' } },
      alignment: { horizontal: 'right', vertical: 'center' },
      fill: { fgColor: { rgb: 'FAFAFA' } },
      border: borderAll,
      numFmt: '#,##0 "đ"'
    }
  };

  const applyRowBg = (ws, row, colCount, isEven) => {
    if (!isEven) return;
    for (let c = 0; c < colCount; c++) {
      const addr = XLSX.utils.encode_cell({ r: row, c });
      if (ws[addr]) {
        ws[addr].s = { ...ws[addr].s, fill: { fgColor: { rgb: 'F5F5F5' } } };
      }
    }
  };

  const setRowHeight = (ws, row, height) => {
    if (!ws['!rows']) ws['!rows'] = [];
    ws['!rows'][row] = { hpt: height };
  };

  const exportToExcel = (type) => {
    try {
      const wb = XLSX.utils.book_new();
      const today = format(new Date(), 'dd/MM/yyyy');
      let fileName;

      if (type === 'inventory') {
        fileName = `bao-cao-ton-kho-${format(new Date(), 'yyyyMMdd')}.xlsx`;
      } else if (type === 'import-export') {
        fileName = `bao-cao-nhap-xuat-${format(new Date(), 'yyyyMMdd')}.xlsx`;
      } else if (type === 'supplier-stats') {
        fileName = `thong-ke-nha-cung-cap-${format(new Date(), 'yyyyMMdd')}.xlsx`;
      } else if (type === 'customer-stats') {
        fileName = `thong-ke-khach-hang-${format(new Date(), 'yyyyMMdd')}.xlsx`;
      }

      if (type === 'inventory') {
        const colCount = 10;

        // Build data array
        const wsData = [
          ['HỆ THỐNG QUẢN LÝ KHO - BÁO CÁO TỒN KHO'],
          [`Ngày xuất báo cáo: ${today}`],
          [`Tổng giá trị tồn kho: ${formatCurrency(totalInventoryValue)}`],
          [], // empty row spacer
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

        // Total row
        const totalRowIdx = wsData.length;
        wsData.push([
          '', '', '', '', 'TỔNG CỘNG:',
          inventoryData.reduce((sum, i) => sum + i.quantity, 0),
          '', '',
          totalInventoryValue,
          ''
        ]);

        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Merge title rows
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } },
          { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } },
          { s: { r: 2, c: 0 }, e: { r: 2, c: 9 } }
        ];

        // Column widths
        ws['!cols'] = [
          { wch: 6 }, { wch: 14 }, { wch: 32 }, { wch: 16 }, { wch: 10 },
          { wch: 12 }, { wch: 14 }, { wch: 16 }, { wch: 20 }, { wch: 13 }
        ];

        // Row heights
        setRowHeight(ws, 0, 36);
        setRowHeight(ws, 1, 22);
        setRowHeight(ws, 2, 22);
        setRowHeight(ws, 4, 28);

        // Style title rows
        for (let c = 0; c < colCount; c++) {
          const a0 = XLSX.utils.encode_cell({ r: 0, c });
          const a1 = XLSX.utils.encode_cell({ r: 1, c });
          const a2 = XLSX.utils.encode_cell({ r: 2, c });
          if (ws[a0]) ws[a0].s = styles.title;
          if (ws[a1]) ws[a1].s = styles.subtitle;
          if (ws[a2]) ws[a2].s = styles.summaryValue;
        }

        // Style header row (row 4)
        for (let c = 0; c < colCount; c++) {
          const addr = XLSX.utils.encode_cell({ r: 4, c });
          if (ws[addr]) ws[addr].s = styles.header;
        }

        // Style data rows
        const dataStartRow = 5;
        inventoryData.forEach((item, index) => {
          const row = dataStartRow + index;
          const isLowStock = item.quantity <= item.min_stock;
          const isOutOfStock = item.quantity === 0;
          const isEven = index % 2 === 0;

          for (let c = 0; c < colCount; c++) {
            const addr = XLSX.utils.encode_cell({ r: row, c });
            if (!ws[addr]) continue;

            // Base styles per column type
            if (c === 0) ws[addr].s = { ...styles.cellCenter, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
            else if (c === 5 || c === 6) ws[addr].s = { ...styles.cellRight, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
            else if (c === 7 || c === 8) ws[addr].s = { ...styles.cellCurrency, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
            else if (c === 4) ws[addr].s = { ...styles.cellCenter, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
            else if (c === 9) {
              // Status badge
              ws[addr].s = isOutOfStock ? styles.badgeDanger : isLowStock ? styles.badgeWarning : styles.badgeSuccess;
            }
            else ws[addr].s = { ...styles.cell, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
          }

          // Highlight low stock quantity in red/orange
          const qtyAddr = XLSX.utils.encode_cell({ r: row, c: 5 });
          if (ws[qtyAddr] && (isOutOfStock || isLowStock)) {
            ws[qtyAddr].s = {
              ...ws[qtyAddr].s,
              font: { ...ws[qtyAddr].s.font, bold: true, color: { rgb: isOutOfStock ? 'C62828' : 'F57F17' } }
            };
          }
        });

        // Style total row
        for (let c = 0; c < colCount; c++) {
          const addr = XLSX.utils.encode_cell({ r: totalRowIdx, c });
          if (!ws[addr]) {
            ws[addr] = { v: '', t: 's' };
          }
          if (c === 4) ws[addr].s = styles.totalLabel;
          else if (c === 5) ws[addr].s = styles.totalValueNumber;
          else if (c === 8) ws[addr].s = styles.totalValue;
          else ws[addr].s = styles.totalEmpty;
        }
        setRowHeight(ws, totalRowIdx, 30);

        XLSX.utils.book_append_sheet(wb, ws, 'Tồn kho');

      } else if (type === 'import-export') {
        // ========== SUMMARY SHEET ==========
        const summaryData = [
          ['HỆ THỐNG QUẢN LÝ KHO - BÁO CÁO NHẬP XUẤT'],
          [`Từ ngày: ${formatDate(dateRange.from)} - Đến ngày: ${formatDate(dateRange.to)}`],
          [`Ngày xuất báo cáo: ${today}`],
          [],
          ['CHỈ TIÊU', 'GIÁ TRỊ'],
          ['Số phiếu nhập', importExportData?.summary?.total_imports || 0],
          ['Tổng tiền nhập', importExportData?.summary?.total_import_amount || 0],
          ['Số phiếu xuất', importExportData?.summary?.total_exports || 0],
          ['Tổng tiền xuất', importExportData?.summary?.total_export_amount || 0],
          [],
          ['Chênh lệch (Nhập - Xuất)', (importExportData?.summary?.total_import_amount || 0) - (importExportData?.summary?.total_export_amount || 0)]
        ];

        const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
        summaryWs['!cols'] = [{ wch: 28 }, { wch: 25 }];
        summaryWs['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
          { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
          { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } }
        ];

        // Style summary sheet
        setRowHeight(summaryWs, 0, 36);
        setRowHeight(summaryWs, 1, 22);
        setRowHeight(summaryWs, 2, 22);
        setRowHeight(summaryWs, 4, 28);

        for (let c = 0; c < 2; c++) {
          const a0 = XLSX.utils.encode_cell({ r: 0, c });
          const a1 = XLSX.utils.encode_cell({ r: 1, c });
          const a2 = XLSX.utils.encode_cell({ r: 2, c });
          if (summaryWs[a0]) summaryWs[a0].s = styles.title;
          if (summaryWs[a1]) summaryWs[a1].s = styles.subtitle;
          if (summaryWs[a2]) summaryWs[a2].s = styles.subtitle;
        }

        // Header row 4
        for (let c = 0; c < 2; c++) {
          const addr = XLSX.utils.encode_cell({ r: 4, c });
          if (summaryWs[addr]) summaryWs[addr].s = styles.header;
        }

        // Data rows 5-8
        [5, 6, 7, 8].forEach(r => {
          const a0 = XLSX.utils.encode_cell({ r, c: 0 });
          const a1 = XLSX.utils.encode_cell({ r, c: 1 });
          if (summaryWs[a0]) summaryWs[a0].s = styles.summaryLabel;
          if (summaryWs[a1]) summaryWs[a1].s = (r === 6 || r === 8) ? styles.summaryDataCurrency : styles.summaryData;
        });

        // Difference row (10)
        const diffA0 = XLSX.utils.encode_cell({ r: 10, c: 0 });
        const diffA1 = XLSX.utils.encode_cell({ r: 10, c: 1 });
        if (summaryWs[diffA0]) summaryWs[diffA0].s = styles.totalLabel;
        if (summaryWs[diffA1]) summaryWs[diffA1].s = styles.totalValue;
        setRowHeight(summaryWs, 10, 30);

        XLSX.utils.book_append_sheet(wb, summaryWs, 'Tổng hợp');

        // ========== IMPORT SHEET ==========
        const importColCount = 6;
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

        const importTotalRow = importData.length;
        importData.push(['', '', '', 'TỔNG CỘNG:', importExportData?.summary?.total_import_amount || 0, '']);

        const importWs = XLSX.utils.aoa_to_sheet(importData);
        importWs['!cols'] = [
          { wch: 6 }, { wch: 16 }, { wch: 28 }, { wch: 14 }, { wch: 20 }, { wch: 28 }
        ];
        importWs['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
          { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }
        ];

        setRowHeight(importWs, 0, 36);
        setRowHeight(importWs, 1, 22);
        setRowHeight(importWs, 3, 28);

        // Style title
        for (let c = 0; c < importColCount; c++) {
          const a0 = XLSX.utils.encode_cell({ r: 0, c });
          const a1 = XLSX.utils.encode_cell({ r: 1, c });
          if (importWs[a0]) importWs[a0].s = styles.title;
          if (importWs[a1]) importWs[a1].s = styles.subtitle;
        }

        // Style header
        for (let c = 0; c < importColCount; c++) {
          const addr = XLSX.utils.encode_cell({ r: 3, c });
          if (importWs[addr]) importWs[addr].s = styles.header;
        }

        // Style data rows
        (importExportData?.imports || []).forEach((_, index) => {
          const row = 4 + index;
          const isEven = index % 2 === 0;
          for (let c = 0; c < importColCount; c++) {
            const addr = XLSX.utils.encode_cell({ r: row, c });
            if (!importWs[addr]) continue;
            if (c === 0) importWs[addr].s = { ...styles.cellCenter, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
            else if (c === 4) importWs[addr].s = { ...styles.cellCurrency, ...(isEven ? { fill: styles.rowEven.fill } : {}), font: { ...styles.cellCurrency.font, bold: true, color: { rgb: '2E7D32' } } };
            else if (c === 3) importWs[addr].s = { ...styles.cellCenter, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
            else importWs[addr].s = { ...styles.cell, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
          }
        });

        // Style total row
        for (let c = 0; c < importColCount; c++) {
          const addr = XLSX.utils.encode_cell({ r: importTotalRow, c });
          if (!importWs[addr]) importWs[addr] = { v: '', t: 's' };
          if (c === 3) importWs[addr].s = styles.totalLabel;
          else if (c === 4) importWs[addr].s = styles.totalValue;
          else importWs[addr].s = styles.totalEmpty;
        }
        setRowHeight(importWs, importTotalRow, 30);

        XLSX.utils.book_append_sheet(wb, importWs, 'Phiếu nhập');

        // ========== EXPORT SHEET ==========
        const exportColCount = 6;
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

        const exportTotalRow = exportData.length;
        exportData.push(['', '', '', 'TỔNG CỘNG:', importExportData?.summary?.total_export_amount || 0, '']);

        const exportWs = XLSX.utils.aoa_to_sheet(exportData);
        exportWs['!cols'] = [
          { wch: 6 }, { wch: 16 }, { wch: 28 }, { wch: 14 }, { wch: 20 }, { wch: 28 }
        ];
        exportWs['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
          { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }
        ];

        setRowHeight(exportWs, 0, 36);
        setRowHeight(exportWs, 1, 22);
        setRowHeight(exportWs, 3, 28);

        // Style title - use warning (orange) theme for exports
        const exportTitle = {
          font: { bold: true, sz: 18, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: 'E65100' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: borderAll
        };
        const exportSubtitle = {
          font: { sz: 12, italic: true, color: { rgb: '555555' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          fill: { fgColor: { rgb: 'FFF3E0' } },
          border: borderAll
        };

        for (let c = 0; c < exportColCount; c++) {
          const a0 = XLSX.utils.encode_cell({ r: 0, c });
          const a1 = XLSX.utils.encode_cell({ r: 1, c });
          if (exportWs[a0]) exportWs[a0].s = exportTitle;
          if (exportWs[a1]) exportWs[a1].s = exportSubtitle;
        }

        // Header with warning color
        for (let c = 0; c < exportColCount; c++) {
          const addr = XLSX.utils.encode_cell({ r: 3, c });
          if (exportWs[addr]) exportWs[addr].s = styles.headerWarning;
        }

        // Style data rows
        (importExportData?.exports || []).forEach((_, index) => {
          const row = 4 + index;
          const isEven = index % 2 === 0;
          for (let c = 0; c < exportColCount; c++) {
            const addr = XLSX.utils.encode_cell({ r: row, c });
            if (!exportWs[addr]) continue;
            if (c === 0) exportWs[addr].s = { ...styles.cellCenter, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
            else if (c === 4) exportWs[addr].s = { ...styles.cellCurrency, ...(isEven ? { fill: styles.rowEven.fill } : {}), font: { ...styles.cellCurrency.font, bold: true, color: { rgb: 'E65100' } } };
            else if (c === 3) exportWs[addr].s = { ...styles.cellCenter, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
            else exportWs[addr].s = { ...styles.cell, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
          }
        });

        // Style total row (orange theme)
        const exportTotalLabel = { ...styles.totalLabel, font: { ...styles.totalLabel.font, color: { rgb: 'E65100' } }, fill: { fgColor: { rgb: 'FFF3E0' } }, border: { top: { style: 'double', color: { rgb: 'E65100' } }, bottom: { style: 'double', color: { rgb: 'E65100' } }, left: { style: 'thin', color: { rgb: 'CCCCCC' } }, right: { style: 'thin', color: { rgb: 'CCCCCC' } } } };
        const exportTotalValue = { ...styles.totalValue, font: { ...styles.totalValue.font, color: { rgb: 'E65100' } }, fill: { fgColor: { rgb: 'FFE0B2' } }, border: { top: { style: 'double', color: { rgb: 'E65100' } }, bottom: { style: 'double', color: { rgb: 'E65100' } }, left: { style: 'thin', color: { rgb: 'CCCCCC' } }, right: { style: 'thin', color: { rgb: 'CCCCCC' } } } };
        const exportTotalEmpty = { fill: { fgColor: { rgb: 'FFF3E0' } }, border: { top: { style: 'double', color: { rgb: 'E65100' } }, bottom: { style: 'double', color: { rgb: 'E65100' } }, left: { style: 'thin', color: { rgb: 'CCCCCC' } }, right: { style: 'thin', color: { rgb: 'CCCCCC' } } } };

        for (let c = 0; c < exportColCount; c++) {
          const addr = XLSX.utils.encode_cell({ r: exportTotalRow, c });
          if (!exportWs[addr]) exportWs[addr] = { v: '', t: 's' };
          if (c === 3) exportWs[addr].s = exportTotalLabel;
          else if (c === 4) exportWs[addr].s = exportTotalValue;
          else exportWs[addr].s = exportTotalEmpty;
        }
        setRowHeight(exportWs, exportTotalRow, 30);

        XLSX.utils.book_append_sheet(wb, exportWs, 'Phiếu xuất');

      } else if (type === 'supplier-stats') {
        const colCount = 7;
        const wsData = [
          ['THỐNG KÊ NHÀ CUNG CẤP'],
          [`Từ ngày: ${formatDate(supplierDateRange.from)} - Đến ngày: ${formatDate(supplierDateRange.to)}`],
          [`Ngày xuất báo cáo: ${today}`],
          [],
          ['Mã NCC', 'Tên NCC', 'SĐT', 'Email', 'Số phiếu nhập', 'Tổng tiền nhập', 'Lần nhập gần nhất']
        ];

        supplierStatsData.forEach((item) => {
          wsData.push([
            item.code,
            item.name,
            item.phone || '',
            item.email || '',
            item.total_receipts,
            item.total_amount,
            item.last_import_date ? formatDate(item.last_import_date) : ''
          ]);
        });

        const totalRowIdx = wsData.length;
        wsData.push([
          '', 'TỔNG CỘNG:', '', '',
          supplierStatsData.reduce((sum, i) => sum + (i.total_receipts || 0), 0),
          supplierStatsData.reduce((sum, i) => sum + (i.total_amount || 0), 0),
          ''
        ]);

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
          { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
          { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } }
        ];
        ws['!cols'] = [
          { wch: 12 }, { wch: 28 }, { wch: 14 }, { wch: 24 }, { wch: 14 }, { wch: 20 }, { wch: 18 }
        ];

        setRowHeight(ws, 0, 36);
        setRowHeight(ws, 1, 22);
        setRowHeight(ws, 2, 22);
        setRowHeight(ws, 4, 28);

        for (let c = 0; c < colCount; c++) {
          const a0 = XLSX.utils.encode_cell({ r: 0, c });
          const a1 = XLSX.utils.encode_cell({ r: 1, c });
          const a2 = XLSX.utils.encode_cell({ r: 2, c });
          if (ws[a0]) ws[a0].s = styles.title;
          if (ws[a1]) ws[a1].s = styles.subtitle;
          if (ws[a2]) ws[a2].s = styles.subtitle;
        }

        for (let c = 0; c < colCount; c++) {
          const addr = XLSX.utils.encode_cell({ r: 4, c });
          if (ws[addr]) ws[addr].s = styles.header;
        }

        const dataStartRow = 5;
        supplierStatsData.forEach((_, index) => {
          const row = dataStartRow + index;
          const isEven = index % 2 === 0;
          for (let c = 0; c < colCount; c++) {
            const addr = XLSX.utils.encode_cell({ r: row, c });
            if (!ws[addr]) continue;
            if (c === 4) ws[addr].s = { ...styles.cellRight, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
            else if (c === 5) ws[addr].s = { ...styles.cellCurrency, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
            else if (c === 6) ws[addr].s = { ...styles.cellCenter, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
            else ws[addr].s = { ...styles.cell, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
          }
        });

        for (let c = 0; c < colCount; c++) {
          const addr = XLSX.utils.encode_cell({ r: totalRowIdx, c });
          if (!ws[addr]) ws[addr] = { v: '', t: 's' };
          if (c === 1) ws[addr].s = styles.totalLabel;
          else if (c === 4) ws[addr].s = styles.totalValueNumber;
          else if (c === 5) ws[addr].s = styles.totalValue;
          else ws[addr].s = styles.totalEmpty;
        }
        setRowHeight(ws, totalRowIdx, 30);

        XLSX.utils.book_append_sheet(wb, ws, 'Thống kê NCC');

      } else if (type === 'customer-stats') {
        const colCount = 7;
        const wsData = [
          ['THỐNG KÊ KHÁCH HÀNG'],
          [`Từ ngày: ${formatDate(customerDateRange.from)} - Đến ngày: ${formatDate(customerDateRange.to)}`],
          [`Ngày xuất báo cáo: ${today}`],
          [],
          ['Mã KH', 'Tên KH', 'SĐT', 'Email', 'Số phiếu xuất', 'Tổng tiền xuất', 'Lần xuất gần nhất']
        ];

        customerStatsData.forEach((item) => {
          wsData.push([
            item.code,
            item.name,
            item.phone || '',
            item.email || '',
            item.total_receipts,
            item.total_amount,
            item.last_export_date ? formatDate(item.last_export_date) : ''
          ]);
        });

        const totalRowIdx = wsData.length;
        wsData.push([
          '', 'TỔNG CỘNG:', '', '',
          customerStatsData.reduce((sum, i) => sum + (i.total_receipts || 0), 0),
          customerStatsData.reduce((sum, i) => sum + (i.total_amount || 0), 0),
          ''
        ]);

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
          { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
          { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } }
        ];
        ws['!cols'] = [
          { wch: 12 }, { wch: 28 }, { wch: 14 }, { wch: 24 }, { wch: 14 }, { wch: 20 }, { wch: 18 }
        ];

        setRowHeight(ws, 0, 36);
        setRowHeight(ws, 1, 22);
        setRowHeight(ws, 2, 22);
        setRowHeight(ws, 4, 28);

        // Use orange theme for customer stats
        const customerTitle = {
          font: { bold: true, sz: 18, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '1565C0' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: borderAll
        };
        const customerSubtitle = {
          font: { sz: 12, italic: true, color: { rgb: '555555' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          fill: { fgColor: { rgb: 'E3F2FD' } },
          border: borderAll
        };
        const customerHeader = {
          font: { bold: true, sz: 11, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '1976D2' } },
          alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
          border: borderAll
        };

        for (let c = 0; c < colCount; c++) {
          const a0 = XLSX.utils.encode_cell({ r: 0, c });
          const a1 = XLSX.utils.encode_cell({ r: 1, c });
          const a2 = XLSX.utils.encode_cell({ r: 2, c });
          if (ws[a0]) ws[a0].s = customerTitle;
          if (ws[a1]) ws[a1].s = customerSubtitle;
          if (ws[a2]) ws[a2].s = customerSubtitle;
        }

        for (let c = 0; c < colCount; c++) {
          const addr = XLSX.utils.encode_cell({ r: 4, c });
          if (ws[addr]) ws[addr].s = customerHeader;
        }

        const dataStartRow = 5;
        customerStatsData.forEach((_, index) => {
          const row = dataStartRow + index;
          const isEven = index % 2 === 0;
          for (let c = 0; c < colCount; c++) {
            const addr = XLSX.utils.encode_cell({ r: row, c });
            if (!ws[addr]) continue;
            if (c === 4) ws[addr].s = { ...styles.cellRight, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
            else if (c === 5) ws[addr].s = { ...styles.cellCurrency, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
            else if (c === 6) ws[addr].s = { ...styles.cellCenter, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
            else ws[addr].s = { ...styles.cell, ...(isEven ? { fill: styles.rowEven.fill } : {}) };
          }
        });

        const customerTotalLabel = { ...styles.totalLabel, font: { ...styles.totalLabel.font, color: { rgb: '1565C0' } }, fill: { fgColor: { rgb: 'E3F2FD' } }, border: { top: { style: 'double', color: { rgb: '1565C0' } }, bottom: { style: 'double', color: { rgb: '1565C0' } }, left: { style: 'thin', color: { rgb: 'CCCCCC' } }, right: { style: 'thin', color: { rgb: 'CCCCCC' } } } };
        const customerTotalValue = { ...styles.totalValue, font: { ...styles.totalValue.font, color: { rgb: '1565C0' } }, fill: { fgColor: { rgb: 'BBDEFB' } }, border: { top: { style: 'double', color: { rgb: '1565C0' } }, bottom: { style: 'double', color: { rgb: '1565C0' } }, left: { style: 'thin', color: { rgb: 'CCCCCC' } }, right: { style: 'thin', color: { rgb: 'CCCCCC' } } } };
        const customerTotalValueNumber = { ...styles.totalValueNumber, font: { ...styles.totalValueNumber.font, color: { rgb: '1565C0' } }, fill: { fgColor: { rgb: 'BBDEFB' } }, border: { top: { style: 'double', color: { rgb: '1565C0' } }, bottom: { style: 'double', color: { rgb: '1565C0' } }, left: { style: 'thin', color: { rgb: 'CCCCCC' } }, right: { style: 'thin', color: { rgb: 'CCCCCC' } } } };
        const customerTotalEmpty = { fill: { fgColor: { rgb: 'E3F2FD' } }, border: { top: { style: 'double', color: { rgb: '1565C0' } }, bottom: { style: 'double', color: { rgb: '1565C0' } }, left: { style: 'thin', color: { rgb: 'CCCCCC' } }, right: { style: 'thin', color: { rgb: 'CCCCCC' } } } };

        for (let c = 0; c < colCount; c++) {
          const addr = XLSX.utils.encode_cell({ r: totalRowIdx, c });
          if (!ws[addr]) ws[addr] = { v: '', t: 's' };
          if (c === 1) ws[addr].s = customerTotalLabel;
          else if (c === 4) ws[addr].s = customerTotalValueNumber;
          else if (c === 5) ws[addr].s = customerTotalValue;
          else ws[addr].s = customerTotalEmpty;
        }
        setRowHeight(ws, totalRowIdx, 30);

        XLSX.utils.book_append_sheet(wb, ws, 'Thống kê KH');
      }

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
    const newRange = { from: format(from, 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') };
    setDateRange(newRange);
    setActiveQuickFilter(prev => ({ ...prev, importExport: days }));
    // Auto-fetch with new range
    setTimeout(() => fetchImportExportReport(newRange), 0);
  };

  const clearDateRange = () => {
    const newRange = { from: format(startOfMonth(new Date()), 'yyyy-MM-dd'), to: format(endOfMonth(new Date()), 'yyyy-MM-dd') };
    setDateRange(newRange);
    setActiveQuickFilter(prev => ({ ...prev, importExport: null }));
    setTimeout(() => fetchImportExportReport(newRange), 0);
  };

  const setQuickSupplierDateRange = (days) => {
    const to = new Date();
    const from = subDays(to, days);
    const newRange = { from: format(from, 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') };
    setSupplierDateRange(newRange);
    setActiveQuickFilter(prev => ({ ...prev, supplier: days }));
    setTimeout(() => fetchSupplierStats(newRange), 0);
  };

  const clearSupplierDateRange = () => {
    const newRange = { from: format(startOfMonth(new Date()), 'yyyy-MM-dd'), to: format(endOfMonth(new Date()), 'yyyy-MM-dd') };
    setSupplierDateRange(newRange);
    setActiveQuickFilter(prev => ({ ...prev, supplier: null }));
    setTimeout(() => fetchSupplierStats(newRange), 0);
  };

  const setQuickCustomerDateRange = (days) => {
    const to = new Date();
    const from = subDays(to, days);
    const newRange = { from: format(from, 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') };
    setCustomerDateRange(newRange);
    setActiveQuickFilter(prev => ({ ...prev, customer: days }));
    setTimeout(() => fetchCustomerStats(newRange), 0);
  };

  const clearCustomerDateRange = () => {
    const newRange = { from: format(startOfMonth(new Date()), 'yyyy-MM-dd'), to: format(endOfMonth(new Date()), 'yyyy-MM-dd') };
    setCustomerDateRange(newRange);
    setActiveQuickFilter(prev => ({ ...prev, customer: null }));
    setTimeout(() => fetchCustomerStats(newRange), 0);
  };

  const totalInventoryValue = inventoryData.reduce((sum, item) =>
    sum + (item.quantity * item.price), 0
  );

  const supplierSummary = {
    totalSuppliers: supplierStatsData.length,
    totalReceipts: supplierStatsData.reduce((sum, i) => sum + (i.total_receipts || 0), 0),
    totalAmount: supplierStatsData.reduce((sum, i) => sum + (i.total_amount || 0), 0)
  };

  const customerSummary = {
    totalCustomers: customerStatsData.length,
    totalReceipts: customerStatsData.reduce((sum, i) => sum + (i.total_receipts || 0), 0),
    totalAmount: customerStatsData.reduce((sum, i) => sum + (i.total_amount || 0), 0)
  };

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
        paddingBottom: '8px',
        flexWrap: 'wrap'
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
        <button
          className={`btn ${activeTab === 'supplier-stats' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('supplier-stats')}
        >
          <Truck size={18} />
          Thống kê NCC
        </button>
        <button
          className={`btn ${activeTab === 'customer-stats' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('customer-stats')}
        >
          <Users size={18} />
          Thống kê khách hàng
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
                <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px', display: 'flex', gap: '8px' }}>
                  {[7, 30, 90].map(days => (
                    <button
                      key={days}
                      className={`btn btn-sm ${activeQuickFilter.importExport === days ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setQuickDateRange(days)}
                    >
                      {days} ngày
                    </button>
                  ))}
                </div>
                <button className="btn btn-secondary btn-sm" onClick={clearDateRange} title="Xóa bộ lọc">
                  <RotateCcw size={14} />
                  Xóa lọc
                </button>
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
                  <div className="stat-value">{importExportData.summary?.total_imports || 0}</div>
                  <div className="stat-label">Phiếu nhập</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon success">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value" style={{ fontSize: '18px' }}>
                    {formatCurrency(importExportData.summary?.total_import_amount || 0)}
                  </div>
                  <div className="stat-label">Tổng nhập</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon warning">
                  <ArrowUpFromLine size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{importExportData.summary?.total_exports || 0}</div>
                  <div className="stat-label">Phiếu xuất</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon warning">
                  <TrendingDown size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value" style={{ fontSize: '18px' }}>
                    {formatCurrency(importExportData.summary?.total_export_amount || 0)}
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

      {/* Supplier Stats */}
      {activeTab === 'supplier-stats' && (
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
                  value={supplierDateRange.from}
                  onChange={(e) => setSupplierDateRange({ ...supplierDateRange, from: e.target.value })}
                  style={{ width: 'auto' }}
                />
                <span>đến</span>
                <input
                  type="date"
                  className="form-control"
                  value={supplierDateRange.to}
                  onChange={(e) => setSupplierDateRange({ ...supplierDateRange, to: e.target.value })}
                  style={{ width: 'auto' }}
                />
                <button className="btn btn-primary" onClick={handleSupplierDateFilter}>
                  <Filter size={16} />
                  Lọc
                </button>
                <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px', display: 'flex', gap: '8px' }}>
                  {[7, 30, 90].map(days => (
                    <button
                      key={days}
                      className={`btn btn-sm ${activeQuickFilter.supplier === days ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setQuickSupplierDateRange(days)}
                    >
                      {days} ngày
                    </button>
                  ))}
                </div>
                <button className="btn btn-secondary btn-sm" onClick={clearSupplierDateRange} title="Xóa bộ lọc">
                  <RotateCcw size={14} />
                  Xóa lọc
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="stats-grid" style={{ marginBottom: '24px' }}>
            <div className="stat-card">
              <div className="stat-icon primary">
                <Truck size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{supplierSummary.totalSuppliers}</div>
                <div className="stat-label">Tổng nhà cung cấp</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon success">
                <FileText size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{supplierSummary.totalReceipts}</div>
                <div className="stat-label">Tổng phiếu nhập</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon warning">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value" style={{ fontSize: '18px' }}>
                  {formatCurrency(supplierSummary.totalAmount)}
                </div>
                <div className="stat-label">Tổng tiền nhập</div>
              </div>
            </div>
          </div>

          {/* Supplier Stats Table */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={18} style={{ color: 'var(--primary-color)' }} />
                Thống kê nhà cung cấp
              </h3>
              <button
                className="btn btn-success btn-sm"
                onClick={() => exportToExcel('supplier-stats')}
              >
                <FileSpreadsheet size={16} />
                Xuất Excel
              </button>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mã NCC</th>
                    <th>Tên NCC</th>
                    <th>SĐT</th>
                    <th>Email</th>
                    <th>Số phiếu nhập</th>
                    <th>Tổng tiền nhập</th>
                    <th>Lần nhập gần nhất</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="text-center">Đang tải...</td></tr>
                  ) : supplierStatsData.length === 0 ? (
                    <tr><td colSpan="7" className="text-center">Không có dữ liệu</td></tr>
                  ) : (
                    supplierStatsData.map((item, index) => (
                      <tr key={item.id || index}>
                        <td><code>{item.code}</code></td>
                        <td style={{ fontWeight: 500 }}>{item.name}</td>
                        <td>{item.phone || '-'}</td>
                        <td>{item.email || '-'}</td>
                        <td style={{ fontWeight: 600, textAlign: 'center' }}>{item.total_receipts}</td>
                        <td style={{ fontWeight: 600, color: 'var(--success-color)' }}>
                          {formatCurrency(item.total_amount)}
                        </td>
                        <td>{item.last_import_date ? formatDate(item.last_import_date) : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Customer Stats */}
      {activeTab === 'customer-stats' && (
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
                  value={customerDateRange.from}
                  onChange={(e) => setCustomerDateRange({ ...customerDateRange, from: e.target.value })}
                  style={{ width: 'auto' }}
                />
                <span>đến</span>
                <input
                  type="date"
                  className="form-control"
                  value={customerDateRange.to}
                  onChange={(e) => setCustomerDateRange({ ...customerDateRange, to: e.target.value })}
                  style={{ width: 'auto' }}
                />
                <button className="btn btn-primary" onClick={handleCustomerDateFilter}>
                  <Filter size={16} />
                  Lọc
                </button>
                <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '16px', display: 'flex', gap: '8px' }}>
                  {[7, 30, 90].map(days => (
                    <button
                      key={days}
                      className={`btn btn-sm ${activeQuickFilter.customer === days ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setQuickCustomerDateRange(days)}
                    >
                      {days} ngày
                    </button>
                  ))}
                </div>
                <button className="btn btn-secondary btn-sm" onClick={clearCustomerDateRange} title="Xóa bộ lọc">
                  <RotateCcw size={14} />
                  Xóa lọc
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="stats-grid" style={{ marginBottom: '24px' }}>
            <div className="stat-card">
              <div className="stat-icon primary">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{customerSummary.totalCustomers}</div>
                <div className="stat-label">Tổng khách hàng</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon success">
                <FileText size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{customerSummary.totalReceipts}</div>
                <div className="stat-label">Tổng phiếu xuất</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon warning">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value" style={{ fontSize: '18px' }}>
                  {formatCurrency(customerSummary.totalAmount)}
                </div>
                <div className="stat-label">Tổng tiền xuất</div>
              </div>
            </div>
          </div>

          {/* Customer Stats Table */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} style={{ color: 'var(--primary-color)' }} />
                Thống kê khách hàng
              </h3>
              <button
                className="btn btn-success btn-sm"
                onClick={() => exportToExcel('customer-stats')}
              >
                <FileSpreadsheet size={16} />
                Xuất Excel
              </button>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mã KH</th>
                    <th>Tên KH</th>
                    <th>SĐT</th>
                    <th>Email</th>
                    <th>Số phiếu xuất</th>
                    <th>Tổng tiền xuất</th>
                    <th>Lần xuất gần nhất</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="text-center">Đang tải...</td></tr>
                  ) : customerStatsData.length === 0 ? (
                    <tr><td colSpan="7" className="text-center">Không có dữ liệu</td></tr>
                  ) : (
                    customerStatsData.map((item, index) => (
                      <tr key={item.id || index}>
                        <td><code>{item.code}</code></td>
                        <td style={{ fontWeight: 500 }}>{item.name}</td>
                        <td>{item.phone || '-'}</td>
                        <td>{item.email || '-'}</td>
                        <td style={{ fontWeight: 600, textAlign: 'center' }}>{item.total_receipts}</td>
                        <td style={{ fontWeight: 600, color: 'var(--warning-color)' }}>
                          {formatCurrency(item.total_amount)}
                        </td>
                        <td>{item.last_export_date ? formatDate(item.last_export_date) : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Reports;
