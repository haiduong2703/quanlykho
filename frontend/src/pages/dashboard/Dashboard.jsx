import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import api from '../../config/api';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  BarChart3,
  PieChart
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, alertsRes, activitiesRes, monthlyRes, categoryRes, topProductsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/low-stock-alerts'),
        api.get('/dashboard/recent-activities'),
        api.get('/dashboard/monthly-stats'),
        api.get('/dashboard/category-stats'),
        api.get('/dashboard/top-export-products')
      ]);
      setStats(statsRes.data);
      setLowStockAlerts(alertsRes.data || []);
      setRecentActivities(activitiesRes.data || []);
      setMonthlyStats(monthlyRes.data || []);
      setCategoryStats(categoryRes.data || []);
      setTopProducts(topProductsRes.data || []);
    } catch (error) {
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value || 0);
  };

  const formatShortCurrency = (value) => {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + ' tỷ';
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + ' tr';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'k';
    }
    return value;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  // Chart data configurations
  const monthlyChartData = {
    labels: monthlyStats.map(item => `${item.month}/${item.year}`),
    datasets: [
      {
        label: 'Nhập kho',
        data: monthlyStats.map(item => item.import_total),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: 'Xuất kho',
        data: monthlyStats.map(item => item.export_total),
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 2,
        borderRadius: 4,
      }
    ]
  };

  const monthlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + formatCurrency(context.raw);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatShortCurrency(value);
          }
        }
      }
    }
  };

  // Category chart (Doughnut)
  const categoryColors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(34, 197, 94, 0.8)',
    'rgba(249, 115, 22, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(20, 184, 166, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(107, 114, 128, 0.8)',
    'rgba(6, 182, 212, 0.8)',
  ];

  const categoryChartData = {
    labels: categoryStats.map(item => item.category_name),
    datasets: [
      {
        data: categoryStats.map(item => item.total_value),
        backgroundColor: categoryColors.slice(0, categoryStats.length),
        borderColor: categoryColors.slice(0, categoryStats.length).map(c => c.replace('0.8', '1')),
        borderWidth: 2,
      }
    ]
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return context.label + ': ' + formatCurrency(context.raw) + ' (' + percentage + '%)';
          }
        }
      }
    }
  };

  // Top products chart (Horizontal Bar)
  const topProductsChartData = {
    labels: topProducts.map(item => item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name),
    datasets: [
      {
        label: 'Số lượng xuất',
        data: topProducts.map(item => item.total_exported),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 4,
      }
    ]
  };

  const topProductsChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      }
    },
    scales: {
      x: {
        beginAtZero: true,
      }
    }
  };

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.total_products || 0}</div>
            <div className="stat-label">Tổng sản phẩm</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <ArrowDownToLine size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.total_import_receipts || 0}</div>
            <div className="stat-label">Phiếu nhập kho</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <ArrowUpFromLine size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.total_export_receipts || 0}</div>
            <div className="stat-label">Phiếu xuất kho</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon danger">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.low_stock_count || 0}</div>
            <div className="stat-label">Sản phẩm sắp hết</div>
          </div>
        </div>
      </div>

      {/* Stock Value Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="stat-icon info">
              <DollarSign size={24} />
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {formatCurrency(stats?.total_stock_value)}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Tổng giá trị tồn kho</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Monthly Import/Export Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <BarChart3 size={20} style={{ marginRight: '8px' }} />
              Thống kê nhập xuất 6 tháng gần đây
            </h3>
          </div>
          <div className="card-body">
            <div style={{ height: '300px' }}>
              {monthlyStats.length > 0 ? (
                <Bar data={monthlyChartData} options={monthlyChartOptions} />
              ) : (
                <div className="empty-state" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="text-center">
                    <BarChart3 size={48} style={{ color: 'var(--text-secondary)' }} />
                    <p style={{ marginTop: '16px' }}>Chưa có dữ liệu thống kê</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <PieChart size={20} style={{ marginRight: '8px' }} />
              Phân bố giá trị theo danh mục
            </h3>
          </div>
          <div className="card-body">
            <div style={{ height: '300px' }}>
              {categoryStats.length > 0 ? (
                <Doughnut data={categoryChartData} options={categoryChartOptions} />
              ) : (
                <div className="empty-state" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="text-center">
                    <PieChart size={48} style={{ color: 'var(--text-secondary)' }} />
                    <p style={{ marginTop: '16px' }}>Chưa có dữ liệu danh mục</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Chart */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">
            <TrendingUp size={20} style={{ marginRight: '8px' }} />
            Top 5 sản phẩm xuất nhiều nhất (30 ngày)
          </h3>
        </div>
        <div className="card-body">
          <div style={{ height: '250px' }}>
            {topProducts.length > 0 ? (
              <Bar data={topProductsChartData} options={topProductsChartOptions} />
            ) : (
              <div className="empty-state" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                  <TrendingUp size={48} style={{ color: 'var(--text-secondary)' }} />
                  <p style={{ marginTop: '16px' }}>Chưa có dữ liệu xuất kho</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Columns Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Low Stock Alerts */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Cảnh báo tồn kho thấp</h3>
            <Link to="/stocks" className="btn btn-sm btn-secondary">
              Xem tất cả
            </Link>
          </div>
          <div className="card-body">
            {lowStockAlerts.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <AlertTriangle size={48} style={{ color: 'var(--success-color)' }} />
                <h3 style={{ marginTop: '16px' }}>Tất cả đều ổn!</h3>
                <p>Không có sản phẩm nào sắp hết hàng</p>
              </div>
            ) : (
              lowStockAlerts.slice(0, 5).map((item) => (
                <div key={item.product_id} className="stock-alert-item">
                  <div className="stock-product-info">
                    <div className="stock-product-name">{item.name}</div>
                    <div className="stock-product-sku">{item.sku}</div>
                  </div>
                  <div className="stock-quantity">
                    <div className="stock-quantity-value">{item.quantity}</div>
                    <div className="stock-quantity-min">Tối thiểu: {item.min_stock}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Hoạt động gần đây</h3>
            <Clock size={18} style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div className="card-body">
            {recentActivities.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <Clock size={48} />
                <h3 style={{ marginTop: '16px' }}>Chưa có hoạt động</h3>
                <p>Các hoạt động nhập/xuất kho sẽ hiển thị ở đây</p>
              </div>
            ) : (
              recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>
                    {activity.type === 'import' ? (
                      <TrendingDown size={18} />
                    ) : (
                      <TrendingUp size={18} />
                    )}
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">
                      {activity.type === 'import' ? 'Nhập kho' : 'Xuất kho'} - {activity.receipt_code}
                    </div>
                    <div className="activity-desc">
                      {activity.party_name || 'N/A'} - {formatCurrency(activity.total_amount)}
                    </div>
                  </div>
                  <div className="activity-time">{formatDate(activity.date)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Thao tác nhanh</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/imports" className="btn btn-success">
              <ArrowDownToLine size={18} />
              Tạo phiếu nhập
            </Link>
            <Link to="/exports" className="btn btn-warning">
              <ArrowUpFromLine size={18} />
              Tạo phiếu xuất
            </Link>
            <Link to="/products" className="btn btn-primary">
              <Package size={18} />
              Quản lý sản phẩm
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
