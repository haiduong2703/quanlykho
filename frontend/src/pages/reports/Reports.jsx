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
import XLSX from 'xlsx-js-style';

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
      const fileName = `bao-cao-${type === 'inventory' ? 'ton-kho' : 'nhap-xuat'}-${format(new Date(), 'yyyyMMdd')}.xlsx`;

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
          ['Số phiếu nhập', importExportData?.summary?.import_count || 0],
          ['Tổng tiền nhập', importExportData?.summary?.import_total || 0],
          ['Số phiếu xuất', importExportData?.summary?.export_count || 0],
          ['Tổng tiền xuất', importExportData?.summary?.export_total || 0],
          [],
          ['Chênh lệch (Nhập - Xuất)', (importExportData?.summary?.import_total || 0) - (importExportData?.summary?.export_total || 0)]
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
        importData.push(['', '', '', 'TỔNG CỘNG:', importExportData?.summary?.import_total || 0, '']);

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
        exportData.push(['', '', '', 'TỔNG CỘNG:', importExportData?.summary?.export_total || 0, '']);

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
